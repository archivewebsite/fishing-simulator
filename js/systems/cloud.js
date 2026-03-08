/**
 * CLOUD SYSTEM
 * Handles auth/session, cloud save, and security alert reporting.
 */

const SUPABASE_URL = 'https://wlyrmqfaiixoohdyizam.supabase.co';
const SUPABASE_KEY = 'sb_publishable_h3m3EuajBFphREc0LpVN3g_PWcWv9gM';
const ALERT_FUNCTION_NAME = 'send-alert';
const ALERT_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/${ALERT_FUNCTION_NAME}`;

const cloudSupabaseClient = (window.supabase && typeof window.supabase.createClient === 'function')
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

if (!cloudSupabaseClient) {
    console.error('Supabase client library is missing. Check script order in index.html.');
}

function createCloudTabId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
    }
    return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

const CloudSystem = {
    user: null,
    game: null,
    authMode: 'login',
    currentTabId: createCloudTabId(),
    tabStartedAt: Date.now(),
    sessionActive: true,
    realtimeChannel: null,
    realtimeUserId: null,
    singleSessionOverlayId: 'single-session-overlay',
    singleSessionEventName: 'new_tab_opened',
    lifecycleBound: false,
    authHydrated: false,
    loadedCloudUserId: null,
    networkBound: false,
    pendingCloudSync: false,
    cloudSyncRetryTimer: null,
    cloudSyncRetryDelayMs: 5000,
    cloudSyncInFlight: false,
    lastOfflineNoticeAt: 0,
    realtimeSubscribed: false,
    realtimeReconnectTimer: null,
    realtimeReconnectDelayMs: 4000,
    lastRealtimeStatusLogAt: 0,
    lastRealtimeStatusValue: '',
    errorHandlersBound: false,
    previousWindowOnError: null,
    alertCooldownMs: 45000,
    alertMaxPayloadChars: 1800,
    recentAlertSignatures: {},
    passwordUiBound: false,
    passwordRulesMinLength: 8,

    init: async function (gameInstance) {
        this.game = gameInstance;
        this.authHydrated = false;
        this.updateUI();
        this._syncAuthModalMode();
        this._bindAuthPasswordUi();

        if (!this.lifecycleBound) {
            this.lifecycleBound = true;
            window.addEventListener('pagehide', () => {
                this.cleanupSingleSessionEnforcement({ resetSessionState: false });
            });
        }
        this._bindNetworkLifecycle();
        this._bindGlobalErrorHandlers();

        if (!cloudSupabaseClient) {
            this.authHydrated = true;
            this.updateUI();
            return;
        }

        cloudSupabaseClient.auth.onAuthStateChange(async (event, session) => {
            const hasSessionUser = !!(session && session.user);

            if (event === 'SIGNED_OUT') {
                this.cleanupSingleSessionEnforcement();
                this.user = null;
                this.loadedCloudUserId = null;
                this.pendingCloudSync = false;
                this.cloudSyncInFlight = false;
                this._clearCloudSyncRetry();
                this.authHydrated = true;
                this.updateUI();
                if (this.game) this.game.log('Cloud session ended.');
                return;
            }

            if (hasSessionUser) {
                const nextUser = session.user;
                const previousUserId = this.user ? this.user.id : null;
                this.handleLoginSuccess(nextUser);
                this.authHydrated = true;

                if (event === 'SIGNED_IN') {
                    this.closeAuthModal();
                }

                const shouldLoadCloud = this.loadedCloudUserId !== nextUser.id || previousUserId !== nextUser.id;
                if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && shouldLoadCloud) {
                    await this.loadFromCloud({ force: true });
                }
                return;
            }

            if (event === 'INITIAL_SESSION') {
                this.authHydrated = true;
                this.user = null;
                this.loadedCloudUserId = null;
                this.cleanupSingleSessionEnforcement();
                this.updateUI();
            }
        });

        // Fallback for environments where INITIAL_SESSION is delayed.
        const { data, error } = await cloudSupabaseClient.auth.getSession();
        if (error) {
            console.error('Supabase session error:', error.message);
            this.authHydrated = true;
            this.updateUI();
            return;
        }

        if (this.authHydrated) return;

        this.authHydrated = true;
        if (data.session && data.session.user) {
            this.handleLoginSuccess(data.session.user);
            await this.loadFromCloud({ force: true });
        } else {
            this.user = null;
            this.loadedCloudUserId = null;
            this.cleanupSingleSessionEnforcement();
            this.updateUI();
        }
    },

    _isOnline: function () {
        return typeof navigator === 'undefined' ? true : navigator.onLine !== false;
    },

    _isRetriableCloudError: function (error) {
        const message = String(error?.message || '').toLowerCase();
        return message.includes('fetch')
            || message.includes('network')
            || message.includes('offline')
            || message.includes('timeout');
    },

    _clearCloudSyncRetry: function () {
        if (this.cloudSyncRetryTimer) {
            clearTimeout(this.cloudSyncRetryTimer);
            this.cloudSyncRetryTimer = null;
        }
    },

    _scheduleCloudSyncRetry: function (delayMs = this.cloudSyncRetryDelayMs) {
        if (this.cloudSyncRetryTimer || !this.pendingCloudSync) return;

        this.cloudSyncRetryTimer = setTimeout(() => {
            this.cloudSyncRetryTimer = null;
            if (!this.pendingCloudSync || !this.user || !this.sessionActive) return;
            this.saveToCloud().catch((err) => {
                console.warn('Cloud retry failed:', err?.message || err);
            });
        }, Math.max(1000, Number(delayMs) || this.cloudSyncRetryDelayMs));
    },

    _bindNetworkLifecycle: function () {
        if (this.networkBound) return;
        this.networkBound = true;

        window.addEventListener('offline', () => {
            this.updateUI();
            if (this.user && this.game) {
                this.game.log('Offline mode enabled. Progress will sync when internet returns.');
            }
        });

        window.addEventListener('online', () => {
            this.updateUI();
            if (!this.user || !this.sessionActive) return;

            if (this.pendingCloudSync) {
                this.saveToCloud().catch((err) => {
                    console.warn('Cloud sync on reconnect failed:', err?.message || err);
                });
            }

            if (this.loadedCloudUserId !== this.user.id) {
                this.loadFromCloud({ force: true }).catch((err) => {
                    console.warn('Cloud reload on reconnect failed:', err?.message || err);
                });
            }

            if (!this.realtimeChannel || !this.realtimeSubscribed) {
                this.initSingleSessionEnforcement(this.user.id);
            }
        });
    },

    _clearRealtimeReconnect: function () {
        if (this.realtimeReconnectTimer) {
            clearTimeout(this.realtimeReconnectTimer);
            this.realtimeReconnectTimer = null;
        }
    },

    _logSingleSessionStatus: function (status) {
        const now = Date.now();
        if (this.lastRealtimeStatusValue === status && (now - this.lastRealtimeStatusLogAt) < 10000) {
            return;
        }
        this.lastRealtimeStatusValue = status;
        this.lastRealtimeStatusLogAt = now;
        console.warn(`Single-session channel status: ${status}`);
    },

    _scheduleSingleSessionReconnect: function (reason) {
        if (this.realtimeReconnectTimer) return;
        if (!this.user || !this.sessionActive || !this._isOnline()) return;

        const userId = this.user.id;
        this.realtimeReconnectTimer = setTimeout(() => {
            this.realtimeReconnectTimer = null;
            if (!this.user || this.user.id !== userId || !this.sessionActive || !this._isOnline()) return;
            this.initSingleSessionEnforcement(userId);
        }, this.realtimeReconnectDelayMs);

        if (this.game) {
            this.game.log(`Cloud realtime reconnect scheduled (${reason}).`);
        }
    },

    _announceAlertDispatch: function (message, tone = 'warning') {
        if (this.game && typeof this.game.log === 'function') {
            this.game.log(message);
        }
        if (this.game && this.game.ui && typeof this.game.ui.updateStatus === 'function') {
            this.game.ui.updateStatus(message, tone);
        }
    },

    _bindGlobalErrorHandlers: function () {
        if (this.errorHandlersBound) return;
        this.errorHandlersBound = true;

        window.addEventListener('error', (event) => {
            if (!event) return;

            const message = event.message || 'Unhandled JavaScript error';
            const source = event.filename || '';
            const line = Number.isFinite(event.lineno) ? event.lineno : null;
            const column = Number.isFinite(event.colno) ? event.colno : null;
            const stack = event.error && event.error.stack ? String(event.error.stack) : '';
            const target = event.target && event.target !== window ? event.target : null;
            const resourceRef = target ? (target.src || target.href || target.currentSrc || '') : '';
            const details = target
                ? `Resource load error: ${target.tagName || 'unknown'} ${resourceRef}`.trim()
                : '';

            this._announceAlertDispatch('Runtime error detected. Sending alert email now...', 'warning');
            this.reportError({ message, source, line, column, stack, details }).catch((err) => {
                this._announceAlertDispatch(`Runtime error alert failed: ${err?.message || err}`, 'danger');
                console.warn('Error alert dispatch failed:', err?.message || err);
            });
        }, true);

        window.addEventListener('unhandledrejection', (event) => {
            const reason = event?.reason;
            const reasonMessage = reason?.message
                ? String(reason.message)
                : (typeof reason === 'string' ? reason : 'Unhandled promise rejection');
            const stack = reason && reason.stack ? String(reason.stack) : '';

            this.reportError({
                message: 'Unhandled promise rejection',
                details: reasonMessage,
                source: 'promise',
                stack
            }).catch((err) => {
                this._announceAlertDispatch(`Promise rejection alert failed: ${err?.message || err}`, 'danger');
                console.warn('Rejection alert dispatch failed:', err?.message || err);
            });
        });

        this.previousWindowOnError = window.onerror;
        window.onerror = (...args) => {
            const [message, source, lineno, colno, error] = args;
            this._announceAlertDispatch('Global error trap triggered. Sending alert email now...', 'warning');
            this.reportError({
                message: String(message || 'Unhandled JavaScript error'),
                source: String(source || ''),
                line: Number.isFinite(lineno) ? Number(lineno) : null,
                column: Number.isFinite(colno) ? Number(colno) : null,
                stack: error && error.stack ? String(error.stack) : ''
            }).catch((err) => {
                this._announceAlertDispatch(`Global error alert failed: ${err?.message || err}`, 'danger');
                console.warn('window.onerror alert dispatch failed:', err?.message || err);
            });

            if (typeof this.previousWindowOnError === 'function') {
                return this.previousWindowOnError(...args);
            }
            return false;
        };
    },

    _stringifyDetail: function (value) {
        if (value === undefined || value === null) return '';
        if (typeof value === 'string') return value.slice(0, this.alertMaxPayloadChars);
        if (typeof value === 'number' || typeof value === 'boolean') return String(value);
        try {
            return JSON.stringify(value).slice(0, this.alertMaxPayloadChars);
        } catch (_err) {
            return String(value).slice(0, this.alertMaxPayloadChars);
        }
    },

    _compactAlertSignatureCache: function (nowMs = Date.now()) {
        Object.keys(this.recentAlertSignatures).forEach((key) => {
            const seenAt = this.recentAlertSignatures[key];
            if (!Number.isFinite(seenAt) || nowMs - seenAt > this.alertCooldownMs) {
                delete this.recentAlertSignatures[key];
            }
        });
    },

    _acceptAlertSignature: function (signature) {
        const nowMs = Date.now();
        this._compactAlertSignatureCache(nowMs);
        const lastSeen = this.recentAlertSignatures[signature];
        if (Number.isFinite(lastSeen) && nowMs - lastSeen < this.alertCooldownMs) {
            return false;
        }
        this.recentAlertSignatures[signature] = nowMs;
        return true;
    },

    _postAlertToEdge: async function (alertBody) {
        const response = await fetch(ALERT_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify(alertBody)
        });

        if (!response.ok) {
            const text = await response.text();
            if (response.status === 401 || response.status === 403) {
                throw new Error('send-alert unauthorized (401/403). Disable "Enforce JWT" for this function or deploy with --no-verify-jwt.');
            }
            throw new Error(`Alert endpoint failed (${response.status}): ${text}`);
        }

        try {
            return await response.json();
        } catch (_err) {
            return { ok: true };
        }
    },

    reportAlert: async function (payload = {}) {
        const type = typeof payload.type === 'string' && payload.type.trim()
            ? payload.type.trim().toUpperCase()
            : 'UNKNOWN';
        const details = this._stringifyDetail(payload.details || payload.message || '');
        const source = this._stringifyDetail(payload.source || '');
        const line = Number.isFinite(payload.line) ? Math.floor(payload.line) : null;
        const column = Number.isFinite(payload.column) ? Math.floor(payload.column) : null;
        const stack = this._stringifyDetail(payload.stack || '');
        const userId = payload.user
            || payload.userId
            || (this.user ? this.user.id : null);
        const userEmail = payload.userEmail || (this.user ? this.user.email : null);
        const signature = `${type}|${source}|${line || ''}|${column || ''}|${details}`.slice(0, 400);

        if (!this._acceptAlertSignature(signature)) {
            return { skipped: true, reason: 'rate_limited' };
        }

        const alertBody = {
            type,
            user: userId || 'anonymous',
            userEmail: userEmail || null,
            details,
            source: source || null,
            line,
            column,
            stack: stack || null,
            page: window.location.href,
            userAgent: navigator.userAgent,
            sessionActive: this.sessionActive,
            online: this._isOnline(),
            timestamp: payload.timestamp || new Date().toISOString()
        };

        try {
            if (cloudSupabaseClient && cloudSupabaseClient.functions && typeof cloudSupabaseClient.functions.invoke === 'function') {
                const { data, error } = await cloudSupabaseClient.functions.invoke(ALERT_FUNCTION_NAME, {
                    body: alertBody
                });
                if (!error) {
                    this._announceAlertDispatch('Alert email request sent successfully.', 'success');
                    return data;
                }

                const statusCode = Number(error?.status) || 0;
                if (statusCode !== 401 && statusCode !== 403) {
                    const status = statusCode ? ` (${statusCode})` : '';
                    throw new Error(`invoke ${ALERT_FUNCTION_NAME} failed${status}: ${error.message || String(error)}`);
                }

                // Publishable-key clients can hit 401 if the function still enforces JWT.
                console.warn(`invoke ${ALERT_FUNCTION_NAME} unauthorized; trying direct edge fetch fallback.`);
            }

            const data = await this._postAlertToEdge(alertBody);
            this._announceAlertDispatch('Alert email request sent successfully.', 'success');
            return data;
        } catch (err) {
            delete this.recentAlertSignatures[signature];
            throw err;
        }
    },

    reportError: async function (payload = {}) {
        return this.reportAlert({
            type: payload.type || 'JAVASCRIPT_ERROR',
            user: payload.user,
            userEmail: payload.userEmail,
            details: payload.details || payload.message || 'Unhandled JavaScript error.',
            source: payload.source,
            line: payload.line,
            column: payload.column,
            stack: payload.stack,
            timestamp: payload.timestamp
        });
    },

    sendTestErrorAlert: async function () {
        this._announceAlertDispatch('Triggering test error alert email...', 'warning');
        try {
            await this.reportError({
                type: 'JAVASCRIPT_ERROR_TEST',
                details: 'Manual test alert from AuthAPI.testAlert()',
                source: 'manual-test'
            });
            return true;
        } catch (err) {
            this._announceAlertDispatch(`Test error alert failed: ${err?.message || err}`, 'danger');
            return false;
        }
    },

    login: function () {
        this.openAuthModal('login');
    },

    signup: function () {
        this.openAuthModal('signup');
    },

    openAuthModal: function (mode = 'login') {
        this.authMode = mode === 'signup' ? 'signup' : 'login';
        this._syncAuthModalMode();

        const overlay = document.getElementById('auth-overlay');
        const modal = document.getElementById('auth-modal');
        if (overlay) overlay.classList.add('active');
        if (modal) modal.classList.add('active');

        const emailInput = document.getElementById('auth-email');
        if (emailInput) emailInput.focus();
    },

    closeAuthModal: function () {
        const overlay = document.getElementById('auth-overlay');
        const modal = document.getElementById('auth-modal');
        if (overlay) overlay.classList.remove('active');
        if (modal) modal.classList.remove('active');
        this._setAuthFeedback('');
    },

    setAuthMode: function (mode) {
        this.authMode = mode === 'signup' ? 'signup' : 'login';
        this._syncAuthModalMode();
    },

    _syncAuthModalMode: function () {
        this._bindAuthPasswordUi();

        const isSignup = this.authMode === 'signup';
        const title = document.getElementById('auth-modal-title');
        const subtitle = document.getElementById('auth-modal-subtitle');
        const submit = document.getElementById('auth-submit-btn');
        const modeLogin = document.getElementById('auth-mode-login');
        const modeSignup = document.getElementById('auth-mode-signup');
        const passwordInput = document.getElementById('auth-password');
        const passwordChecklist = document.getElementById('auth-password-checklist');
        const passwordToggle = document.getElementById('auth-password-toggle');

        if (title) title.textContent = isSignup ? 'Create Cloud Account' : 'Cloud Login';
        if (subtitle) {
            subtitle.textContent = isSignup
                ? 'Create an account to protect and sync your progress.'
                : 'Sign in to load and sync your cloud save.';
        }
        if (submit) submit.textContent = isSignup ? 'Create Account' : 'Login';
        if (modeLogin) modeLogin.classList.toggle('active', !isSignup);
        if (modeSignup) modeSignup.classList.toggle('active', isSignup);
        if (passwordChecklist) passwordChecklist.hidden = !isSignup;

        if (passwordInput) {
            passwordInput.autocomplete = isSignup ? 'new-password' : 'current-password';
            passwordInput.placeholder = isSignup
                ? 'Use 8+ chars with upper/lower/number/symbol'
                : 'Minimum 6 characters';

            if (!isSignup && passwordInput.type !== 'password') {
                passwordInput.type = 'password';
            }
        }

        if (passwordToggle) {
            const isVisible = !!passwordInput && passwordInput.type === 'text';
            passwordToggle.classList.toggle('is-visible', isVisible);
            passwordToggle.setAttribute('aria-label', isVisible ? 'Hide password' : 'Show password');
            passwordToggle.title = isVisible ? 'Hide password' : 'Show password';
        }

        this._updateAuthPasswordChecklist(passwordInput?.value || '');
    },

    _getPasswordRuleState: function (password) {
        const value = String(password || '');
        return {
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            number: /[0-9]/.test(value),
            special: /[^A-Za-z0-9]/.test(value),
            length: value.length >= this.passwordRulesMinLength
        };
    },

    _updateAuthPasswordRule: function (ruleId, isMet) {
        const ruleEl = document.getElementById(ruleId);
        if (!ruleEl) return;
        ruleEl.classList.toggle('is-met', !!isMet);
    },

    _updateAuthPasswordChecklist: function (password) {
        const state = this._getPasswordRuleState(password);
        this._updateAuthPasswordRule('auth-password-rule-uppercase', state.uppercase);
        this._updateAuthPasswordRule('auth-password-rule-lowercase', state.lowercase);
        this._updateAuthPasswordRule('auth-password-rule-number', state.number);
        this._updateAuthPasswordRule('auth-password-rule-special', state.special);
        this._updateAuthPasswordRule('auth-password-rule-length', state.length);
        return state;
    },

    _bindAuthPasswordUi: function () {
        if (this.passwordUiBound) return;

        const passwordInput = document.getElementById('auth-password');
        const passwordToggle = document.getElementById('auth-password-toggle');

        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this._updateAuthPasswordChecklist(passwordInput.value);
            });
        }

        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => {
                this._toggleAuthPasswordVisibility();
            });
        }

        this.passwordUiBound = true;
        this._updateAuthPasswordChecklist(passwordInput?.value || '');
    },

    _toggleAuthPasswordVisibility: function () {
        const passwordInput = document.getElementById('auth-password');
        const passwordToggle = document.getElementById('auth-password-toggle');
        if (!passwordInput || !passwordToggle) return;

        const showPassword = passwordInput.type === 'password';
        passwordInput.type = showPassword ? 'text' : 'password';
        passwordToggle.classList.toggle('is-visible', showPassword);
        passwordToggle.setAttribute('aria-label', showPassword ? 'Hide password' : 'Show password');
        passwordToggle.title = showPassword ? 'Hide password' : 'Show password';
    },

    _validateSignupPassword: function (password) {
        const state = this._updateAuthPasswordChecklist(password);
        const isStrong = state.uppercase && state.lowercase && state.number && state.special && state.length;
        if (isStrong) {
            return { ok: true, reason: '' };
        }

        return {
            ok: false,
            reason: 'Password must include uppercase, lowercase, number, special character, and be at least 8 characters.'
        };
    },

    _setAuthFeedback: function (message, tone = 'normal') {
        const el = document.getElementById('auth-form-feedback');
        if (!el) return;

        el.textContent = message || '';
        if (tone === 'error') {
            el.style.color = '#b91c1c';
        } else if (tone === 'success') {
            el.style.color = '#166534';
        } else {
            el.style.color = '#0f766e';
        }
    },

    _getBasePath: function () {
        const callbackSuffix = '/auth/callback.html';
        const rawPath = window.location.pathname;

        if (rawPath.endsWith(callbackSuffix)) {
            const trimmed = rawPath.slice(0, -callbackSuffix.length);
            return trimmed || '';
        }

        if (rawPath.endsWith('/')) {
            return rawPath.slice(0, -1);
        }

        const slashIndex = rawPath.lastIndexOf('/');
        return slashIndex > 0 ? rawPath.slice(0, slashIndex) : '';
    },

    _getAuthCallbackUrl: function () {
        return `${window.location.origin}${this._getBasePath()}/auth/callback.html`;
    },

    submitAuth: async function (event) {
        if (event) event.preventDefault();
        if (!cloudSupabaseClient) {
            this._setAuthFeedback('Supabase is not available.', 'error');
            return false;
        }

        const emailInput = document.getElementById('auth-email');
        const passwordInput = document.getElementById('auth-password');
        const submitBtn = document.getElementById('auth-submit-btn');

        const email = (emailInput?.value || '').trim();
        const password = passwordInput?.value || '';

        if (!email || !password) {
            this._setAuthFeedback('Email and password are required.', 'error');
            return false;
        }
        if (this.authMode === 'signup') {
            const passwordValidation = this._validateSignupPassword(password);
            if (!passwordValidation.ok) {
                this._setAuthFeedback(passwordValidation.reason, 'error');
                return false;
            }
        } else if (password.length < 6) {
            this._setAuthFeedback('Password must be at least 6 characters.', 'error');
            return false;
        }

        this._setAuthFeedback(this.authMode === 'signup' ? 'Creating account...' : 'Signing in...');
        if (submitBtn) submitBtn.disabled = true;

        try {
            if (this.authMode === 'signup') {
                const { error } = await cloudSupabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: this._getAuthCallbackUrl()
                    }
                });
                if (error) {
                    this._setAuthFeedback('Signup failed: ' + error.message, 'error');
                    return false;
                }
                this._setAuthFeedback('Signup successful. Please verify your email if required, then login.', 'success');
                this.authMode = 'login';
                this._syncAuthModalMode();
                if (passwordInput) passwordInput.value = '';
                this._updateAuthPasswordChecklist('');
            } else {
                const { data, error } = await cloudSupabaseClient.auth.signInWithPassword({ email, password });
                if (error) {
                    this._setAuthFeedback('Login failed: ' + error.message, 'error');
                    return false;
                }
                if (data && data.user) {
                    this.handleLoginSuccess(data.user);
                    this.closeAuthModal();
                    await this.loadFromCloud({ force: true });
                }
            }
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }

        return false;
    },

    logout: async function () {
        if (!cloudSupabaseClient) return;
        this.pendingCloudSync = false;
        this.cloudSyncInFlight = false;
        this._clearCloudSyncRetry();
        this.cleanupSingleSessionEnforcement();
        await cloudSupabaseClient.auth.signOut();
    },

    handleLoginSuccess: function (user) {
        const previousUserId = this.user ? this.user.id : null;
        this.user = user;
        this.sessionActive = true;

        if (previousUserId !== user.id) {
            this.loadedCloudUserId = null;
        }

        this.updateUI();
        console.log('Cloud user detected:', user.email);
        if (this.game) this.game.log(`Cloud login: ${user.email}`);

        this.initSingleSessionEnforcement(user.id);
        if (this.pendingCloudSync && this._isOnline()) {
            this.saveToCloud().catch((err) => {
                console.warn('Cloud sync after login failed:', err?.message || err);
            });
        }
    },

    initSingleSessionEnforcement: function (userId) {
        if (!cloudSupabaseClient || !userId) return;

        if (this.realtimeChannel && this.realtimeUserId === userId && this.sessionActive) {
            this.broadcastTabClaim();
            return;
        }

        this.cleanupSingleSessionEnforcement();
        this.sessionActive = true;
        this.realtimeUserId = userId;
        this.realtimeSubscribed = false;
        this._clearRealtimeReconnect();

        this.realtimeChannel = cloudSupabaseClient
            .channel(`session:${userId}`)
            .on('broadcast', { event: this.singleSessionEventName }, (message) => {
                this.handleSessionBroadcast(message);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    this.realtimeSubscribed = true;
                    this._clearRealtimeReconnect();
                    this.broadcastTabClaim();
                    return;
                }

                if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR' || status === 'CLOSED') {
                    this.realtimeSubscribed = false;
                    this._logSingleSessionStatus(status);
                    this._scheduleSingleSessionReconnect(status);
                }
            });
    },

    cleanupSingleSessionEnforcement: function (options = {}) {
        const resetSessionState = options.resetSessionState !== false;
        this._clearRealtimeReconnect();

        if (this.realtimeChannel && cloudSupabaseClient && typeof cloudSupabaseClient.removeChannel === 'function') {
            const pending = cloudSupabaseClient.removeChannel(this.realtimeChannel);
            if (pending && typeof pending.catch === 'function') {
                pending.catch((err) => {
                    console.warn('Failed to remove single-session channel:', err?.message || err);
                });
            }
        }

        this.realtimeChannel = null;
        this.realtimeUserId = null;
        this.realtimeSubscribed = false;
        if (resetSessionState) {
            this.sessionActive = true;
        }
    },

    broadcastTabClaim: function () {
        if (!this.realtimeChannel) return;

        const sendResult = this.realtimeChannel.send({
            type: 'broadcast',
            event: this.singleSessionEventName,
            payload: {
                tabId: this.currentTabId,
                startedAt: this.tabStartedAt
            }
        });

        if (sendResult && typeof sendResult.catch === 'function') {
            sendResult.catch((err) => {
                console.warn('Failed to broadcast tab claim:', err?.message || err);
            });
        }
    },

    handleSessionBroadcast: function (message) {
        if (!message || !message.payload || !this.sessionActive) return;

        const incomingTabId = message.payload.tabId;
        if (!incomingTabId || incomingTabId === this.currentTabId) return;

        const incomingStartedAt = Number(message.payload.startedAt);
        if (!Number.isFinite(incomingStartedAt)) return;

        let shouldYield = false;
        if (incomingStartedAt > this.tabStartedAt) {
            shouldYield = true;
        } else if (incomingStartedAt === this.tabStartedAt && incomingTabId > this.currentTabId) {
            shouldYield = true;
        }

        if (shouldYield) {
            this.forceLogoutUI();
        }
    },

    forceLogoutUI: function () {
        if (!this.sessionActive) return;

        this.sessionActive = false;
        this.cleanupSingleSessionEnforcement({ resetSessionState: false });

        if (this.game) {
            if (this.game.autoFish && this.game.autoFish.enabled && typeof this.game.toggleAutoFish === 'function') {
                this.game.toggleAutoFish();
            }

            this.game.state.autoFishEnabled = false;
            if (this.game.autoFish) {
                this.game.autoFish.enabled = false;
                this.game.autoFish.phase = 'idle';

                if (typeof this.game._cancelWorkerTimeout === 'function' && this.game.autoFish.timer != null) {
                    this.game._cancelWorkerTimeout(this.game.autoFish.timer);
                }
                this.game.autoFish.timer = null;
            }

            if (this.game.ui && typeof this.game.ui.showMinigame === 'function') {
                this.game.ui.showMinigame(false);
            }

            if (typeof this.game.setFishingMode === 'function') {
                this.game.setFishingMode('idle');
            }

            if (this.game.ui && typeof this.game.ui.updateStatus === 'function') {
                this.game.ui.updateStatus('This tab was disconnected because another tab became active.', 'danger');
            }

            this.game.log('Session disconnected: a newer tab is active.');
        }

        this.updateUI();

        const buttonsToDisable = ['action-btn', 'auto-fish-btn', 'btn-login', 'btn-signup', 'btn-logout'];
        buttonsToDisable.forEach((id) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.disabled = true;
            btn.style.opacity = '0.55';
            btn.style.pointerEvents = 'none';
        });

        this.closeAuthModal();
        this.showSingleSessionOverlay();
    },

    showSingleSessionOverlay: function () {
        if (document.getElementById(this.singleSessionOverlayId)) return;

        const overlay = document.createElement('div');
        overlay.id = this.singleSessionOverlayId;
        Object.assign(overlay.style, {
            position: 'fixed',
            inset: '0',
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: '99999',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            textAlign: 'center',
            padding: '24px',
            gap: '8px'
        });

        const title = document.createElement('h1');
        title.textContent = 'Disconnected';
        title.style.color = '#ef4444';
        title.style.margin = '0 0 8px';

        const lineOne = document.createElement('p');
        lineOne.textContent = 'You opened the game in another tab.';
        lineOne.style.margin = '0';

        const lineTwo = document.createElement('p');
        lineTwo.textContent = 'This tab is read-only to prevent cloud save conflicts.';
        lineTwo.style.margin = '0';

        const reloadButton = document.createElement('button');
        reloadButton.textContent = 'Reload to Play Here';
        Object.assign(reloadButton.style, {
            marginTop: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: '#0ea5e9',
            color: '#ffffff',
            cursor: 'pointer',
            fontWeight: '700'
        });
        reloadButton.addEventListener('click', () => {
            window.location.reload();
        });

        overlay.appendChild(title);
        overlay.appendChild(lineOne);
        overlay.appendChild(lineTwo);
        overlay.appendChild(reloadButton);

        document.body.appendChild(overlay);
    },

    updateUI: function () {
        const btnLogin = document.getElementById('btn-login');
        const btnSignup = document.getElementById('btn-signup');
        const btnLogout = document.getElementById('btn-logout');
        const status = document.getElementById('user-status');
        const online = this._isOnline();

        if (btnLogin) btnLogin.style.display = 'inline-block';
        if (btnSignup) btnSignup.style.display = 'none';

        if (this.user) {
            if (btnLogout) btnLogout.style.display = 'inline-block';
            if (status) {
                if (!online) {
                    status.innerText = 'Cloud: Offline (local save active)';
                } else if (!this.sessionActive) {
                    status.innerText = 'Cloud: Session closed (newer tab active)';
                } else if (this.pendingCloudSync) {
                    status.innerText = 'Cloud: Sync pending...';
                } else {
                    status.innerText = `Cloud: ${this.user.email}`;
                }
            }
        } else {
            if (btnLogout) btnLogout.style.display = 'none';
            if (status) {
                status.innerText = (!this.authHydrated && cloudSupabaseClient)
                    ? 'Cloud: Checking session...'
                    : 'Cloud: Offline';
            }
        }
    },

    saveToCloud: async function () {
        if (!cloudSupabaseClient || !this.user || !this.sessionActive) return;
        if (!this.game || !this.game.saveSystem || typeof this.game.saveSystem.toSupabaseRow !== 'function') return;
        if (!this._isOnline()) {
            this.pendingCloudSync = true;
            this._scheduleCloudSyncRetry();
            this.updateUI();
            const now = Date.now();
            if (this.game && (now - this.lastOfflineNoticeAt > 15000)) {
                this.lastOfflineNoticeAt = now;
                this.game.log('Offline mode: progress is saved locally and queued for cloud sync.');
            }
            return;
        }
        if (this.cloudSyncInFlight) {
            this.pendingCloudSync = true;
            return;
        }

        this.cloudSyncInFlight = true;
        this.pendingCloudSync = false;
        const saveRow = this.game.saveSystem.toSupabaseRow();
        let writeError = null;

        try {
            const { error } = await cloudSupabaseClient
                .from('game_saves')
                .upsert({
                    user_id: this.user.id,
                    save_data: saveRow.save_data,
                    save_version: saveRow.save_version,
                    checksum: saveRow.checksum
                }, { onConflict: 'user_id' });
            if (error) writeError = error;
        } catch (err) {
            writeError = err;
        } finally {
            this.cloudSyncInFlight = false;
        }

        if (writeError) {
            if (this._isRetriableCloudError(writeError)) {
                this.pendingCloudSync = true;
                this._scheduleCloudSyncRetry();
                this.updateUI();
                console.warn('Cloud sync deferred:', writeError?.message || writeError);
            } else {
                console.error('Cloud save failed:', writeError?.message || writeError);
            }
            return;
        }

        this._clearCloudSyncRetry();
        this.updateUI();
        console.log('Cloud save synced.');

        if (typeof this.refreshLeaderboards === 'function') {
            const now = Date.now();
            const shouldRefreshLeaderboard = !Number.isFinite(this.lastLeaderboardRefreshedAt)
                || this.lastLeaderboardRefreshedAt <= 0
                || (now - this.lastLeaderboardRefreshedAt) >= 60000;

            if (shouldRefreshLeaderboard) {
                this.refreshLeaderboards().catch((err) => {
                    console.warn('Leaderboard refresh after cloud sync failed:', err?.message || err);
                });
            }
        }

        if (this.pendingCloudSync) {
            this.pendingCloudSync = false;
            this.saveToCloud().catch((err) => {
                console.warn('Follow-up cloud sync failed:', err?.message || err);
            });
        }
    },

    loadFromCloud: async function (options = {}) {
        const force = options.force === true;

        if (!this.user || !this.sessionActive) return;
        if (!force && this.loadedCloudUserId === this.user.id) return;
        if (!cloudSupabaseClient || !this.game || !this.game.saveSystem) return;
        const saveSystem = this.game.saveSystem;

        const hasLocalSnapshot = typeof saveSystem.hasPersistedLocalSave === 'function'
            ? saveSystem.hasPersistedLocalSave()
            : false;
        const localTimestamp = hasLocalSnapshot && typeof saveSystem.getPersistedLocalTimestamp === 'function'
            ? saveSystem.getPersistedLocalTimestamp()
            : 0;
        if (!this._isOnline()) {
            if (hasLocalSnapshot) {
                this.pendingCloudSync = true;
                this._scheduleCloudSyncRetry();
            }
            this.updateUI();
            return;
        }

        const { data, error } = await cloudSupabaseClient
            .from('game_saves')
            .select('save_data, save_version, checksum')
            .eq('user_id', this.user.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                if (hasLocalSnapshot) {
                    await this.saveToCloud();
                    this.game.log('Cloud save initialized from local progress.');
                }
                this.loadedCloudUserId = this.user.id;
                return;
            }

            if (this._isRetriableCloudError(error)) {
                if (hasLocalSnapshot) {
                    this.pendingCloudSync = true;
                    this._scheduleCloudSyncRetry();
                }
                this.updateUI();
                return;
            }

            if (error.code !== 'PGRST116') {
                console.error('Cloud load failed:', error.message);
            }
            this.loadedCloudUserId = this.user.id;
            return;
        }

        if (!this.sessionActive) return;

        const parsedCloud = typeof saveSystem.parseSupabaseRow === 'function'
            ? saveSystem.parseSupabaseRow(data)
            : null;
        const cloudRequiresUpgrade = !!(parsedCloud && parsedCloud.ok && parsedCloud.checksumBypassed);

        if (!parsedCloud || !parsedCloud.ok) {
            this.game.log('Cloud save invalid and was skipped.');
            if (hasLocalSnapshot) {
                await this.saveToCloud();
                this.game.log('Invalid cloud row replaced with local progress.');
            }
            this.loadedCloudUserId = this.user.id;
            return;
        }

        const cloudTimestamp = typeof saveSystem.getStateTimestamp === 'function'
            ? saveSystem.getStateTimestamp(parsedCloud.state)
            : 0;

        if (hasLocalSnapshot && localTimestamp > cloudTimestamp) {
            await this.saveToCloud();
            this.game.log('Local save is newer than cloud. Uploaded local progress.');
            this.loadedCloudUserId = this.user.id;
            return;
        }

        const applied = saveSystem.applySupabaseRow(data);
        if (applied) {
            if (typeof this.game._applySettingsDefaults === 'function') this.game._applySettingsDefaults();
            if (typeof this.game._applyThemeMode === 'function') this.game._applyThemeMode();
            if (typeof this.game._renderSettingsPanel === 'function') this.game._renderSettingsPanel();
            this.game.ui.renderAll();

            if (typeof saveSystem.persistCurrentStateToLocal === 'function') {
                saveSystem.persistCurrentStateToLocal();
            }

            if (cloudRequiresUpgrade) {
                await this.saveToCloud();
                this.game.log('Cloud save upgraded to the latest checksum format.');
            }

            this.game.log('Progress loaded from cloud.');
        } else {
            this.game.log('Cloud save invalid and was skipped.');
        }

        this.loadedCloudUserId = this.user.id;
    }
};

CloudSystem._bindGlobalErrorHandlers();

window.AuthAPI = {
    login: () => CloudSystem.login(),
    signup: () => CloudSystem.signup(),
    logout: () => CloudSystem.logout(),
    testAlert: () => CloudSystem.sendTestErrorAlert(),
    closeAuthModal: () => CloudSystem.closeAuthModal(),
    setAuthMode: (mode) => CloudSystem.setAuthMode(mode),
    submitAuth: (event) => CloudSystem.submitAuth(event)
};




