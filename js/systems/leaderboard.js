/**
 * CLOUD EXTENSIONS
 * Adds username enforcement + public leaderboard rendering on top of CloudSystem.
 */

(function () {
    if (typeof CloudSystem === 'undefined') return;

    const FALLBACK_URL = 'https://wlyrmqfaiixoohdyizam.supabase.co';
    const FALLBACK_KEY = 'sb_publishable_h3m3EuajBFphREc0LpVN3g_PWcWv9gM';
    const PROJECT_URL = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : FALLBACK_URL;
    const PROJECT_KEY = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : FALLBACK_KEY;
    const USERNAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]{2,19}$/;
    const USERNAME_RESERVED = new Set([
        'admin', 'administrator', 'system', 'support', 'staff',
        'moderator', 'mod', 'owner', 'developer', 'team',
        'supabase', 'postgres', 'root', 'null', 'undefined',
        'fishit', 'virtualfisher'
    ]);
    const LEADERBOARD_REFRESH_MS = 10 * 60 * 1000;
    const LEADERBOARD_ENTRY_LIMIT = 10;

    const extensionSupabaseClient = (typeof cloudSupabaseClient !== 'undefined' && cloudSupabaseClient)
        ? cloudSupabaseClient
        : (window.supabase && typeof window.supabase.createClient === 'function'
            ? window.supabase.createClient(PROJECT_URL, PROJECT_KEY)
            : null);

    CloudSystem.profile = null;
    CloudSystem.usernamePromptRequired = false;
    CloudSystem.usernamePromptSkippedThisSession = false;
    CloudSystem.usernameInputsBound = false;
    CloudSystem.usernameWatcherBound = false;
    CloudSystem.usernameDebounceTimers = {};
    CloudSystem.usernameRequestTokens = {};
    CloudSystem.leaderboardTimer = null;
    CloudSystem.lastLeaderboardRefreshedAt = 0;
    CloudSystem.leaderboardRefreshInFlight = false;
    CloudSystem.leaderboardRefreshCooldownUntil = 0;
    CloudSystem.leaderboardRefreshRpcUnavailable = false;

    CloudSystem._escapeHtml = function (value) {
        const str = String(value == null ? '' : value);
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    CloudSystem._normalizeUsername = function (value) {
        return String(value || '').trim().toLowerCase();
    };

    CloudSystem._validateUsernameLocally = function (value) {
        const normalized = this._normalizeUsername(value);

        if (!normalized) {
            return { ok: false, normalized, reason: 'Username is required.' };
        }
        if (normalized.length < 3 || normalized.length > 20) {
            return { ok: false, normalized, reason: 'Username must be 3-20 characters.' };
        }
        if (!USERNAME_PATTERN.test(normalized)) {
            return { ok: false, normalized, reason: 'Use letters, numbers, underscores, and start with a letter.' };
        }
        if (normalized.includes('__')) {
            return { ok: false, normalized, reason: 'Username cannot contain consecutive underscores.' };
        }
        if (USERNAME_RESERVED.has(normalized)) {
            return { ok: false, normalized, reason: 'That username is reserved.' };
        }

        return { ok: true, normalized, reason: 'Username format looks good.' };
    };

    CloudSystem._setInlineUsernameFeedback = function (elementId, message, tone = 'neutral') {
        const el = document.getElementById(elementId);
        if (!el) return;

        el.textContent = message || '';
        el.classList.remove('is-ok', 'is-error');

        if (!message) return;
        if (tone === 'ok') {
            el.classList.add('is-ok');
        } else if (tone === 'error') {
            el.classList.add('is-error');
        }
    };
    CloudSystem._looksLikeRpcSignatureCacheError = function (error, fnName) {
        const message = String(error?.message || '');
        return /schema cache/i.test(message) && message.includes(fnName);
    };

    CloudSystem._formatUsernameRpcError = function (fnName, error) {
        const fallbackMessage = 'Could not verify username availability.';
        if (!error) return fallbackMessage;

        if (this._looksLikeRpcSignatureCacheError(error, fnName)) {
            return 'Username service is not installed on the database yet. Apply migration 20260309_usernames_and_leaderboards.sql.';
        }

        return error.message || fallbackMessage;
    };

    CloudSystem._callUsernameRpc = async function (fnName, candidate) {
        const payloads = [
            { candidate },
            { p_candidate: candidate }
        ];

        let firstError = null;
        for (const payload of payloads) {
            try {
                const { data, error } = await extensionSupabaseClient.rpc(fnName, payload);
                if (!error) return { data, error: null };
                if (!firstError) firstError = error;

                if (!this._looksLikeRpcSignatureCacheError(error, fnName)) {
                    return { data: null, error };
                }
            } catch (err) {
                if (!firstError) firstError = err;
                return { data: null, error: err };
            }
        }

        return { data: null, error: firstError };
    };

    CloudSystem._toBooleanLike = function (value) {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'number') {
            if (value === 1) return true;
            if (value === 0) return false;
            return null;
        }
        if (typeof value === 'string') {
            const normalized = value.trim().toLowerCase();
            if (['true', 't', '1', 'yes', 'y'].includes(normalized)) return true;
            if (['false', 'f', '0', 'no', 'n'].includes(normalized)) return false;
        }
        return null;
    };

    CloudSystem._normalizeUsernameAvailabilityPayload = function (data, fallbackNormalized = '') {
        let payload = data;

        if (typeof payload === 'string') {
            try {
                payload = JSON.parse(payload);
            } catch (_err) {
                payload = { reason: payload };
            }
        }

        if (Array.isArray(payload)) {
            payload = payload.length > 0 ? payload[0] : {};
        }

        if (!payload || typeof payload !== 'object') {
            payload = {};
        }

        const rawAvailable = payload.available ?? payload.is_available ?? payload.isAvailable;
        let available = this._toBooleanLike(rawAvailable);

        const reasonText = String(payload.reason || '').trim();
        if (reasonText) {
            const reasonLower = reasonText.toLowerCase();
            const reasonSaysUnavailable = reasonLower.includes('already in use')
                || reasonLower.includes('already exists')
                || reasonLower.includes('unavailable')
                || reasonLower.includes('not available')
                || reasonLower.includes('reserved')
                || reasonLower.includes('taken');
            const reasonSaysAvailable = reasonLower.includes('is available')
                || reasonLower === 'available'
                || reasonLower.includes('username available');

            if (reasonSaysUnavailable) {
                available = false;
            } else if (available === null && reasonSaysAvailable) {
                available = true;
            }
        }

        if (available === null) {
            // Fail closed so uncertain payloads never show false positives.
            available = false;
        }

        return {
            available,
            normalized: String(payload.normalized || payload.username || fallbackNormalized || '').trim().toLowerCase(),
            reason: reasonText
        };
    };

    CloudSystem.checkUsernameAvailability = async function (value) {
        const local = this._validateUsernameLocally(value);
        if (!local.ok) {
            return { ok: false, available: false, normalized: local.normalized, reason: local.reason };
        }

        if (!extensionSupabaseClient) {
            return { ok: false, available: false, normalized: local.normalized, reason: 'Supabase is not available.' };
        }

        try {
            const { data, error } = await this._callUsernameRpc('check_username_availability', local.normalized);

            if (error) {
                return {
                    ok: false,
                    available: false,
                    normalized: local.normalized,
                    reason: this._formatUsernameRpcError('check_username_availability', error)
                };
            }

            const parsed = this._normalizeUsernameAvailabilityPayload(data, local.normalized);
            const available = parsed.available === true;
            return {
                ok: true,
                available,
                normalized: parsed.normalized || local.normalized,
                reason: parsed.reason || (available ? 'Username is available.' : 'That username is already in use.')
            };
        } catch (err) {
            return {
                ok: false,
                available: false,
                normalized: local.normalized,
                reason: `Could not verify username availability: ${err?.message || 'Network error.'}`
            };
        }
    };

    CloudSystem._scheduleUsernameAvailabilityCheck = function (inputId, feedbackId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        const rawValue = input.value;
        const local = this._validateUsernameLocally(rawValue);

        if (!rawValue.trim()) {
            this._setInlineUsernameFeedback(feedbackId, '');
            return;
        }

        if (!local.ok) {
            this._setInlineUsernameFeedback(feedbackId, local.reason, 'error');
            return;
        }

        this._setInlineUsernameFeedback(feedbackId, 'Checking availability...', 'neutral');

        if (this.usernameDebounceTimers[inputId]) {
            clearTimeout(this.usernameDebounceTimers[inputId]);
        }

        const token = Date.now() + Math.random();
        this.usernameRequestTokens[inputId] = token;

        this.usernameDebounceTimers[inputId] = setTimeout(async () => {
            const activeInput = document.getElementById(inputId);
            if (!activeInput) return;
            const latest = activeInput.value;

            try {
                const check = await this.checkUsernameAvailability(latest);
                if (this.usernameRequestTokens[inputId] !== token) return;

                if (check.ok && check.available) {
                    this._setInlineUsernameFeedback(feedbackId, check.reason, 'ok');
                } else {
                    this._setInlineUsernameFeedback(feedbackId, check.reason, 'error');
                }
            } catch (err) {
                if (this.usernameRequestTokens[inputId] !== token) return;
                this._setInlineUsernameFeedback(
                    feedbackId,
                    `Could not verify availability: ${err?.message || 'Network error.'}`,
                    'error'
                );
            }
        }, 240);
    };

    CloudSystem._bindUsernameInputs = function () {
        if (this.usernameInputsBound) return;
        this.usernameInputsBound = true;

        const signupInput = document.getElementById('auth-username');
        if (signupInput) {
            signupInput.addEventListener('input', () => {
                this._scheduleUsernameAvailabilityCheck('auth-username', 'auth-username-feedback');
            });
        }

        const requiredInput = document.getElementById('username-required-input');
        if (requiredInput) {
            requiredInput.addEventListener('input', () => {
                this._scheduleUsernameAvailabilityCheck('username-required-input', 'username-required-availability');
            });
        }
    };

    CloudSystem._setUsernameModalFeedback = function (message, tone = 'normal') {
        const el = document.getElementById('username-form-feedback');
        if (!el) return;

        el.textContent = message || '';
        if (tone === 'error') {
            el.style.color = '#b91c1c';
        } else if (tone === 'success') {
            el.style.color = '#166534';
        } else {
            el.style.color = '#0f766e';
        }
    };

    CloudSystem._hasUsername = function () {
        return !!(this.profile && typeof this.profile.username_normalized === 'string' && this.profile.username_normalized.length > 0);
    };

    CloudSystem._setLeaderboardMeta = function (message) {
        const el = document.getElementById('leaderboard-meta');
        if (!el) return;
        el.textContent = message;
    };

    CloudSystem._isMissingRelationError = function (error, relationName) {
        const code = String(error?.code || '').toUpperCase();
        const message = String(error?.message || '').toLowerCase();
        const relation = String(relationName || '').toLowerCase();
        return code === '42P01'
            || code === 'PGRST205'
            || (relation && message.includes(relation) && (message.includes('does not exist') || message.includes('could not find')));
    };

    CloudSystem._isPermissionDeniedError = function (error) {
        const code = String(error?.code || '').toUpperCase();
        const message = String(error?.message || '').toLowerCase();
        return code === '42501'
            || code === '401'
            || code === '403'
            || message.includes('permission denied')
            || message.includes('not authorized')
            || message.includes('forbidden');
    };

    CloudSystem._formatLeaderboardLoadError = function (error) {
        if (this._isRetriableCloudError(error)) {
            return 'Leaderboard is temporarily offline. Retrying on the next cycle.';
        }

        if (this._isMissingRelationError(error, 'leaderboard_snapshots')) {
            return 'Leaderboard table missing. Apply migration 20260309_usernames_and_leaderboards.sql.';
        }

        if (this._isPermissionDeniedError(error)) {
            return 'Leaderboard read access denied. Apply the latest leaderboard access migration.';
        }

        const message = String(error?.message || '').trim();
        return message
            ? `Leaderboard update failed: ${message}`
            : 'Leaderboard update failed. Retrying on the next cycle.';
    };

    CloudSystem._fetchLeaderboardRows = async function () {
        return extensionSupabaseClient
            .from('leaderboard_snapshots')
            .select('metric, rank, username, score, refreshed_at')
            .lte('rank', LEADERBOARD_ENTRY_LIMIT)
            .order('metric', { ascending: true })
            .order('rank', { ascending: true });
    };

    CloudSystem._extractLeaderboardRows = function (data) {
        if (!Array.isArray(data)) return [];

        return data
            .map((row) => ({
                metric: row?.metric,
                rank: Number(row?.rank),
                username: String(row?.username || ''),
                score: Number(row?.score),
                refreshed_at: row?.refreshed_at || null
            }))
            .filter((row) => (row.metric === 'money_earned' || row.metric === 'fish_caught')
                && Number.isFinite(row.rank)
                && row.rank >= 1
                && Number.isFinite(row.score)
                && row.score >= 0)
            .sort((a, b) => {
                if (a.metric === b.metric) return a.rank - b.rank;
                return a.metric.localeCompare(b.metric);
            });
    };

    CloudSystem._latestLeaderboardRefreshMs = function (rows) {
        let latest = 0;
        rows.forEach((row) => {
            const ms = Date.parse(row?.refreshed_at || '');
            if (Number.isFinite(ms)) latest = Math.max(latest, ms);
        });
        return latest;
    };

    CloudSystem._looksLikeMissingRpc = function (error, fnName) {
        if (this._looksLikeRpcSignatureCacheError(error, fnName)) return true;
        return this._isMissingRelationError(error, fnName)
            || String(error?.message || '').toLowerCase().includes(fnName.toLowerCase());
    };

    CloudSystem._requestLeaderboardRefresh = async function () {
        if (!this.user || !extensionSupabaseClient) {
            return { attempted: false, refreshed: false };
        }
        if (this.leaderboardRefreshRpcUnavailable) {
            return { attempted: false, refreshed: false };
        }

        const now = Date.now();
        if (this.leaderboardRefreshInFlight || now < this.leaderboardRefreshCooldownUntil) {
            return { attempted: false, refreshed: false };
        }

        this.leaderboardRefreshInFlight = true;
        this.leaderboardRefreshCooldownUntil = now + 60000;

        try {
            const { data, error } = await extensionSupabaseClient.rpc('request_leaderboard_refresh');
            if (error) {
                if (this._looksLikeMissingRpc(error, 'request_leaderboard_refresh')) {
                    this.leaderboardRefreshRpcUnavailable = true;
                }
                return { attempted: true, refreshed: false, error };
            }

            const refreshed = !!data?.refreshed;
            return { attempted: true, refreshed, data };
        } catch (error) {
            return { attempted: true, refreshed: false, error };
        } finally {
            this.leaderboardRefreshInFlight = false;
        }
    };

    CloudSystem._updateLeaderboardUserNote = function () {
        const el = document.getElementById('leaderboard-user-note');
        if (!el) return;

        if (!this.user) {
            el.textContent = 'Sign in and set a username to appear on the leaderboard.';
            return;
        }

        if (this._hasUsername()) {
            el.textContent = `Signed in as @${this.profile.username_normalized}. You are eligible for leaderboard snapshots.`;
            return;
        }

        if (this.usernamePromptSkippedThisSession) {
            el.textContent = 'You skipped username setup. Your account is excluded from the leaderboard until a username is saved.';
        } else {
            el.textContent = 'Username required: set your username to join global leaderboards.';
        }
    };

    CloudSystem._renderLeaderboardRows = function (listId, rows) {
        const list = document.getElementById(listId);
        if (!list) return;

        if (!Array.isArray(rows) || rows.length === 0) {
            list.innerHTML = '<li class="leaderboard-empty">No entries yet.</li>';
            return;
        }

        list.innerHTML = rows.map((row) => {
            const rank = Number(row.rank) || 0;
            const score = Number(row.score) || 0;
            const safeUsername = this._escapeHtml(row.username || 'unknown');
            return `<li class="leaderboard-item"><span class="leaderboard-rank">#${rank}</span><span class="leaderboard-name">@${safeUsername}</span><span class="leaderboard-score">${score.toLocaleString('en-US')}</span></li>`;
        }).join('');
    };

    CloudSystem.refreshLeaderboards = async function () {
        try {
            if (!extensionSupabaseClient) {
                this._setLeaderboardMeta('Leaderboard unavailable: Supabase not detected.');
                this._renderLeaderboardRows('leaderboard-money-list', []);
                this._renderLeaderboardRows('leaderboard-fish-list', []);
                this._updateLeaderboardUserNote();
                return;
            }

            let data = null;
            let error = null;
            try {
                const initialFetch = await this._fetchLeaderboardRows();
                data = initialFetch?.data ?? null;
                error = initialFetch?.error ?? null;
            } catch (fetchError) {
                error = fetchError;
            }

            if (error) {
                this._setLeaderboardMeta(this._formatLeaderboardLoadError(error));
                this._renderLeaderboardRows('leaderboard-money-list', []);
                this._renderLeaderboardRows('leaderboard-fish-list', []);
                this._updateLeaderboardUserNote();
                return;
            }

            let rows = this._extractLeaderboardRows(data);
            let latestRefreshedAtMs = this._latestLeaderboardRefreshMs(rows);
            const staleThresholdMs = LEADERBOARD_REFRESH_MS + (2 * 60 * 1000);
            const shouldRequestManualRefresh = rows.length === 0
                || (latestRefreshedAtMs > 0 && (Date.now() - latestRefreshedAtMs) > staleThresholdMs);

            if (shouldRequestManualRefresh) {
                const refreshAttempt = await this._requestLeaderboardRefresh();
                if (refreshAttempt.refreshed) {
                    try {
                        const retry = await this._fetchLeaderboardRows();
                        if (!retry.error) {
                            rows = this._extractLeaderboardRows(retry.data);
                            latestRefreshedAtMs = this._latestLeaderboardRefreshMs(rows);
                        }
                    } catch (_retryError) {
                        // Keep existing rows and meta message if retry fetch fails.
                    }
                }
            }

            const moneyRows = rows.filter((row) => row.metric === 'money_earned');
            const fishRows = rows.filter((row) => row.metric === 'fish_caught');

            this._renderLeaderboardRows('leaderboard-money-list', moneyRows);
            this._renderLeaderboardRows('leaderboard-fish-list', fishRows);

            if (rows.length === 0) {
                this._setLeaderboardMeta('No leaderboard entries yet. Snapshots update every 10 minutes.');
                this._updateLeaderboardUserNote();
                return;
            }

            const refreshedAt = latestRefreshedAtMs > 0 ? new Date(latestRefreshedAtMs) : new Date();
            this.lastLeaderboardRefreshedAt = refreshedAt.getTime();
            this._setLeaderboardMeta(`Last updated: ${refreshedAt.toLocaleString('en-US')} (refreshes every 10 minutes)`);
            this._updateLeaderboardUserNote();
        } catch (err) {
            this._setLeaderboardMeta(`Leaderboard update failed: ${err?.message || 'Unknown error'}`);
            this._renderLeaderboardRows('leaderboard-money-list', []);
            this._renderLeaderboardRows('leaderboard-fish-list', []);
            this._updateLeaderboardUserNote();
        }
    };

    CloudSystem.initLeaderboards = function () {
        if (this.leaderboardTimer) {
            clearInterval(this.leaderboardTimer);
            this.leaderboardTimer = null;
        }

        this._setLeaderboardMeta('Loading leaderboard...');
        this.refreshLeaderboards().catch((err) => {
            this._setLeaderboardMeta(`Leaderboard update failed: ${err?.message || 'Unknown error'}`);
            this._renderLeaderboardRows('leaderboard-money-list', []);
            this._renderLeaderboardRows('leaderboard-fish-list', []);
            this._updateLeaderboardUserNote();
            console.warn('Initial leaderboard refresh failed:', err?.message || err);
        });

        this.leaderboardTimer = setInterval(() => {
            this.refreshLeaderboards().catch((err) => {
                console.warn('Scheduled leaderboard refresh failed:', err?.message || err);
            });
        }, LEADERBOARD_REFRESH_MS);
    };

    CloudSystem.loadUserProfile = async function () {
        if (!this.user || !extensionSupabaseClient) {
            this.profile = null;
            this._updateLeaderboardUserNote();
            return null;
        }

        const userId = this.user.id;
        const { data, error } = await extensionSupabaseClient
            .from('user_profiles')
            .select('username, username_normalized, username_set_at')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.warn('Profile load failed:', error.message || error);
            this.profile = null;
            this._updateLeaderboardUserNote();
            return null;
        }

        if (error && error.code === 'PGRST116') {
            const { error: insertError } = await extensionSupabaseClient
                .from('user_profiles')
                .insert({ user_id: userId });
            if (insertError) {
                console.warn('Profile bootstrap failed:', insertError.message || insertError);
            }

            this.profile = {
                username: null,
                username_normalized: null,
                username_set_at: null
            };
            this._updateLeaderboardUserNote();
            return this.profile;
        }

        this.profile = {
            username: data?.username || null,
            username_normalized: data?.username_normalized || null,
            username_set_at: data?.username_set_at || null
        };

        this._updateLeaderboardUserNote();
        return this.profile;
    };

    CloudSystem.openUsernameModal = function (options = {}) {
        const required = options.required === true;
        const overlay = document.getElementById('username-overlay');
        const modal = document.getElementById('username-modal');
        const title = document.getElementById('username-modal-title');
        const subtitle = document.getElementById('username-modal-subtitle');
        const input = document.getElementById('username-required-input');
        const skipBtn = document.getElementById('username-skip-btn');

        if (title) {
            title.textContent = required
                ? 'Username Required For Leaderboards'
                : 'Set Username';
        }

        if (subtitle) {
            subtitle.textContent = required
                ? 'This account predates username support. Set a username to be included in leaderboard snapshots.'
                : 'Choose a unique username to appear on global leaderboards.';
        }

        if (skipBtn) {
            skipBtn.style.display = 'inline-flex';
        }

        if (input) {
            const current = this.profile?.username_normalized || '';
            if (current) input.value = current;
            input.focus();
            input.select();
        }

        this._setUsernameModalFeedback('');
        this._setInlineUsernameFeedback('username-required-availability', '');

        if (overlay) overlay.classList.add('active');
        if (modal) modal.classList.add('active');
    };

    CloudSystem.closeUsernameModal = function () {
        if (this.usernamePromptRequired && !this.usernamePromptSkippedThisSession && !this._hasUsername()) {
            this._setUsernameModalFeedback('Set a username or explicitly skip to continue without leaderboard access.', 'error');
            return false;
        }

        const overlay = document.getElementById('username-overlay');
        const modal = document.getElementById('username-modal');
        if (overlay) overlay.classList.remove('active');
        if (modal) modal.classList.remove('active');
        this._setUsernameModalFeedback('');
        return true;
    };

    CloudSystem.skipUsernameSetup = function () {
        this.usernamePromptSkippedThisSession = true;
        this.usernamePromptRequired = false;
        this.closeUsernameModal();
        this._updateLeaderboardUserNote();
        this.updateUI();
    };

    CloudSystem.submitUsername = async function (event) {
        if (event) event.preventDefault();
        if (!this.user) {
            this._setUsernameModalFeedback('You must be logged in first.', 'error');
            return false;
        }
        if (!extensionSupabaseClient) {
            this._setUsernameModalFeedback('Supabase is not available.', 'error');
            return false;
        }

        const input = document.getElementById('username-required-input');
        const submitBtn = document.getElementById('username-submit-btn');
        const value = (input?.value || '').trim();

        const normalizedInput = this._normalizeUsername(value);
        const check = (this._hasUsername() && normalizedInput === this.profile.username_normalized)
            ? { ok: true, available: true, normalized: normalizedInput, reason: 'Username is unchanged.' }
            : await this.checkUsernameAvailability(value);
        if (!check.ok || !check.available) {
            this._setUsernameModalFeedback(check.reason || 'Username is not available.', 'error');
            return false;
        }

        this._setUsernameModalFeedback('Saving username...');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const { data, error } = await this._callUsernameRpc('claim_username', check.normalized);

            if (error) {
                this._setUsernameModalFeedback(this._formatUsernameRpcError('claim_username', error), 'error');
                return false;
            }

            if (!data || data.ok !== true) {
                this._setUsernameModalFeedback(data?.reason || 'Could not save username.', 'error');
                return false;
            }

            this.profile = {
                username: data.username || check.normalized,
                username_normalized: data.normalized || check.normalized,
                username_set_at: new Date().toISOString()
            };

            this.usernamePromptRequired = false;
            this.usernamePromptSkippedThisSession = false;
            this._setUsernameModalFeedback('Username saved successfully.', 'success');
            this.updateUI();
            this._updateLeaderboardUserNote();

            this.closeUsernameModal();
            await this.refreshLeaderboards();
            if (this.game) this.game.log(`Username updated: @${this.profile.username_normalized}`);
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }

        return false;
    };

    CloudSystem._enforceUsernameRequirement = function () {
        if (!this.user) {
            this.usernamePromptRequired = false;
            return;
        }

        if (this._hasUsername()) {
            this.usernamePromptRequired = false;
            this.usernamePromptSkippedThisSession = false;
            return;
        }

        if (this.usernamePromptSkippedThisSession) return;

        this.usernamePromptRequired = true;
        this.openUsernameModal({ required: true });
    };

    const originalSyncAuthModalMode = CloudSystem._syncAuthModalMode.bind(CloudSystem);
    CloudSystem._syncAuthModalMode = function () {
        originalSyncAuthModalMode();

        const isSignup = this.authMode === 'signup';
        const signupBlock = document.getElementById('auth-username-block');
        const usernameInput = document.getElementById('auth-username');

        if (signupBlock) signupBlock.hidden = !isSignup;
        if (usernameInput) {
            usernameInput.disabled = !isSignup;
            usernameInput.required = isSignup;
            usernameInput.autocomplete = 'username';
            if (!isSignup) {
                this._setInlineUsernameFeedback('auth-username-feedback', '');
            }
        }
    };

    const originalSubmitAuth = CloudSystem.submitAuth.bind(CloudSystem);
    CloudSystem.submitAuth = async function (event) {
        if (this.authMode !== 'signup') {
            return originalSubmitAuth(event);
        }

        if (event) event.preventDefault();
        if (!extensionSupabaseClient) {
            this._setAuthFeedback('Supabase is not available.', 'error');
            return false;
        }

        const emailInput = document.getElementById('auth-email');
        const passwordInput = document.getElementById('auth-password');
        const usernameInput = document.getElementById('auth-username');
        const submitBtn = document.getElementById('auth-submit-btn');

        const email = (emailInput?.value || '').trim();
        const password = passwordInput?.value || '';
        const username = (usernameInput?.value || '').trim();

        if (!email || !password || !username) {
            this._setAuthFeedback('Email, password, and username are required.', 'error');
            return false;
        }
        const passwordValidation = this._validateSignupPassword(password);
        if (!passwordValidation.ok) {
            this._setAuthFeedback(passwordValidation.reason, 'error');
            return false;
        }

        const availability = await this.checkUsernameAvailability(username);
        if (!availability.ok || !availability.available) {
            this._setAuthFeedback(availability.reason || 'Username is unavailable.', 'error');
            this._setInlineUsernameFeedback('auth-username-feedback', availability.reason || 'Username is unavailable.', 'error');
            return false;
        }

        this._setAuthFeedback('Creating account...');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const { data, error } = await extensionSupabaseClient.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: this._getAuthCallbackUrl(),
                    data: {
                        username: availability.normalized
                    }
                }
            });

            if (error) {
                this._setAuthFeedback('Signup failed: ' + error.message, 'error');
                return false;
            }

            if (data?.session && data?.user) {
                await this.handleLoginSuccess(data.user);
                await this.loadFromCloud({ force: true });
            }

            this._setAuthFeedback('Signup successful. Verify email if required, then login.', 'success');
            this.authMode = 'login';
            this._syncAuthModalMode();
            if (passwordInput) passwordInput.value = '';
            this._updateAuthPasswordChecklist('');
            if (usernameInput) usernameInput.value = '';
            this._setInlineUsernameFeedback('auth-username-feedback', '');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }

        return false;
    };

    const originalHandleLoginSuccess = CloudSystem.handleLoginSuccess.bind(CloudSystem);
    CloudSystem.handleLoginSuccess = async function (user) {
        originalHandleLoginSuccess(user);

        try {
            await this.loadUserProfile();
            this._enforceUsernameRequirement();
            await this.refreshLeaderboards();
        } catch (err) {
            console.warn('Post-login profile/leaderboard setup failed:', err?.message || err);
        }
    };

    const originalLogout = CloudSystem.logout.bind(CloudSystem);
    CloudSystem.logout = async function () {
        this.profile = null;
        this.usernamePromptRequired = false;
        this.usernamePromptSkippedThisSession = false;
        this.closeUsernameModal();
        this.updateUI();
        this._updateLeaderboardUserNote();
        return originalLogout();
    };

    const originalUpdateUI = CloudSystem.updateUI.bind(CloudSystem);
    CloudSystem.updateUI = function () {
        originalUpdateUI();

        const status = document.getElementById('user-status');
        if (this.user && status && this._isOnline() && this.sessionActive && !this.pendingCloudSync) {
            if (this._hasUsername()) {
                status.innerText = `Cloud: ${this.user.email} (@${this.profile.username_normalized})`;
            } else {
                status.innerText = `Cloud: ${this.user.email} (username required for leaderboard)`;
            }
        }

        this._updateLeaderboardUserNote();
    };

    const originalInit = CloudSystem.init.bind(CloudSystem);
    CloudSystem.init = async function (gameInstance) {
        this._bindUsernameInputs();
        this.initLeaderboards();

        if (!this.usernameWatcherBound && extensionSupabaseClient) {
            this.usernameWatcherBound = true;
            extensionSupabaseClient.auth.onAuthStateChange((event) => {
                if (event === 'SIGNED_OUT') {
                    this.profile = null;
                    this.usernamePromptRequired = false;
                    this.usernamePromptSkippedThisSession = false;
                    this.closeUsernameModal();
                    this._updateLeaderboardUserNote();
                    this.refreshLeaderboards().catch(() => {});
                }
            });
        }

        await originalInit(gameInstance);
        this._bindUsernameInputs();

        if (this.user) {
            await this.loadUserProfile();
            this._enforceUsernameRequirement();
        }

        await this.refreshLeaderboards();
    };

    if (window.AuthAPI) {
        window.AuthAPI.closeUsernameModal = () => CloudSystem.closeUsernameModal();
        window.AuthAPI.submitUsername = (event) => CloudSystem.submitUsername(event);
        window.AuthAPI.skipUsernameSetup = () => CloudSystem.skipUsernameSetup();
    }
})();



