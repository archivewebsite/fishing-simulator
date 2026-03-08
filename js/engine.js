/**
 * MYTHIC WATERS: ENHANCED EDITION � Core Engine
 * Contains the Game class with all core mechanics:
 *   - Weather system
 *   - Fishing logic (cast, rarity roll, minigame)
 *   - Combo system
 *   - XP & Levels
 *   - Auto-fishing
 *
 * All data (RARITY, RODS, BAITS, LOCATIONS, WEATHER_DATA, FISH_DB)
 * and systems (UI, Shop, Inventory, SaveSystem) are loaded via prior script tags.
 *
 * Wrapped in IIFE to prevent global scope access (Vuln #1 hardening).
 */

(function () {
    const PURCHASED_WEATHER_DURATION_MS = 15 * 60 * 1000;
    const NATURAL_WEATHER_DURATION_MS = 20 * 60 * 1000;
    const MAX_INVENTORY_FISH = 5000;
    const AUTO_SELL_RARITIES = new Set(['common', 'uncommon', 'rare', 'epic', 'legendary']);

    class Game {
        constructor() {
            this.state = {
                coins: 0,
                totalCoinsEarned: 0,
                xp: 0,
                level: 1,
                inventory: [],
                location: 'mistvale',
                rod: 'bamboo',
                rodsOwned: ['bamboo'],
                bait: 'worm',
                baitsOwned: ['worm'],
                combo: 0,
                totalCatches: 0,
                // Pity timer: consecutive catches without rare+ fish
                pityCounter: 0,
                // Shop: Purchased weathers running simultaneously (max WEATHER_BUY_LIMIT)
                activeWeathers: [],
                // Purchased weather expiration times: { weatherKey: unixMs }
                purchasedWeatherExpirations: {},
                // Natural weather state persistence
                naturalWeatherKey: 'clear',
                naturalWeatherExpiresAt: 0,
                // Shop: Amulet stock per biome { biomeKey: count }
                amuletStock: {},
                // Currently worn amulet biome key (or null)
                activeAmulet: null,
                // Auto-fish persistence
                autoFishEnabled: false,
                lastSaveTimestamp: Date.now(),
                // Achievements
                achievements: [],
                achievementCounters: {},
                settings: {
                    floatingText: true,
                    themeMode: 'auto',
                    keyMap: {
                        cast: 'KeyC',
                        autoFish: 'KeyA',
                        inventory: 'KeyI',
                        shop: 'KeyO',
                        achievements: 'KeyH',
                        expeditions: 'KeyE',
                        settings: 'KeyP',
                        save: 'KeyS'
                    }
                }
            };

            this.weather = {
                current: 'clear',
                expiresAt: 0,
                timer: null,
                purchasedTimers: {}
            };

            this.minigame = {
                active: false,
                pos: 0,
                direction: 1,
                speed: 1,
                targetStart: 0,
                targetWidth: 20,
                fishOnLine: null
            };

            // Auto-fishing state
            this.autoFish = {
                enabled: false,
                phase: 'idle', // 'idle', 'casting', 'hooking', 'reeling'
                timer: null,
                // Background-tracking fields
                cooldownStart: 0,   // timestamp when cooldown began
                cooldownDuration: 0 // how long the cooldown lasts (ms)
            };

            this.activeFishingMode = 'idle';
            this.fishingResults = {
                auto: {
                    totalCatches: 0,
                    fishStored: 0,
                    xpBanked: 0,
                    comboBonus: 0
                },
                manual: {
                    totalCatches: 0,
                    fishStored: 0,
                    xpBanked: 0,
                    comboBonus: 0
                }
            };
            this._lastEscapeMessageByTier = {};
            this._lastGeneratedMessageByKey = {};
            this._lastCriticalStatus = { text: 'CRITICAL!', color: '#f43f5e' };

            this.loopId = null;

            // Web Worker for un-throttled background timers
            this._timerCallbacks = {};
            this._timerIdCounter = 0;
            this._initTimerWorker();

            // System Modules
            this.ui = new UI(this);
            this.inventory = new Inventory(this);
            this.shop = new Shop(this);
            this.saveSystem = new SaveSystem(this);
            this.achievementManager = new AchievementManager(this);
        }

        addCoins(amount, options = {}) {
            const numericAmount = Number(amount);
            if (!Number.isFinite(numericAmount)) return 0;

            const credit = Math.max(0, Math.floor(numericAmount));
            if (credit <= 0) return 0;

            this.state.coins += credit;

            if (options.trackEarnings !== false) {
                const currentLifetime = Number(this.state.totalCoinsEarned);
                const safeLifetime = Number.isFinite(currentLifetime) ? Math.max(0, Math.floor(currentLifetime)) : 0;
                this.state.totalCoinsEarned = safeLifetime + credit;
            }

            return credit;
        }

        spendCoins(amount) {
            const numericAmount = Number(amount);
            if (!Number.isFinite(numericAmount)) return 0;

            const debit = Math.max(0, Math.floor(numericAmount));
            if (debit <= 0) return 0;

            const spend = Math.min(this.state.coins, debit);
            this.state.coins -= spend;
            return spend;
        }

        init() {
            this.saveSystem.load();
            this._applySettingsDefaults();
            this._initThemeWatcher();
            this._initSettingsControls();
            this._applyThemeMode();

            if (typeof CloudSystem !== 'undefined' && CloudSystem && typeof CloudSystem.init === 'function') {
                CloudSystem.init(this);
            }

            this.achievementManager.init();
            this.processOfflineCatches();
            this.ui.renderAll();
            this._renderSettingsPanel();
            this.startWeatherCycle();
            this.gameLoop();
            this._initVisibilityHandler();
            this._initKeyboardShortcuts();

            // Auto-resume auto-fish if it was enabled before reload
            if (this.state.autoFishEnabled) {
                this.autoFish.enabled = true;
                const btn = document.getElementById('auto-fish-btn');
                const castBtn = document.getElementById('action-btn');
                btn.textContent = 'Disable Auto Fish';
                btn.classList.add('active');
                castBtn.disabled = true;
                castBtn.style.opacity = '0.5';
                this.setFishingMode('auto');
                this.log('Auto-fishing resumed from previous session.');
                this.startAutoFishCycle();
            } else {
                this.setFishingMode('idle');
            }
        }

        /* --- WEB WORKER TIMER (runs in background tabs) --- */
        _initTimerWorker() {
            try {
                // Inline the worker script as a Blob to avoid file:// SecurityError
                const workerCode = `
                const timers = {};
                self.onmessage = function (e) {
                    const { command, id, delay } = e.data;
                    if (command === 'start') {
                        if (timers[id]) clearTimeout(timers[id]);
                        timers[id] = setTimeout(() => {
                            delete timers[id];
                            self.postMessage({ id });
                        }, delay);
                    }
                    if (command === 'cancel') {
                        if (timers[id]) {
                            clearTimeout(timers[id]);
                            delete timers[id];
                        }
                    }
                };
            `;
                const blob = new Blob([workerCode], { type: 'application/javascript' });
                const url = URL.createObjectURL(blob);
                this._timerWorker = new Worker(url);
                URL.revokeObjectURL(url); // Clean up the URL after worker is created
                this._timerWorker.onmessage = (e) => {
                    const { id } = e.data;
                    const cb = this._timerCallbacks[id];
                    if (cb) {
                        delete this._timerCallbacks[id];
                        cb();
                    }
                };
            } catch (err) {
                // Fallback: if Workers aren't available, use regular setTimeout
                console.warn('Web Worker unavailable, falling back to setTimeout:', err);
                this._timerWorker = null;
            }
        }

        /** Schedule a callback after `delay` ms � uses Worker if available */
        _workerTimeout(callback, delay) {
            if (this._timerWorker) {
                const id = 'timer_' + (++this._timerIdCounter);
                this._timerCallbacks[id] = callback;
                this._timerWorker.postMessage({ command: 'start', id, delay });
                return id;
            }
            // Fallback to regular setTimeout
            return setTimeout(callback, delay);
        }

        /** Cancel a pending worker timer */
        _cancelWorkerTimeout(id) {
            if (id == null) return;
            if (this._timerWorker && typeof id === 'string') {
                delete this._timerCallbacks[id];
                this._timerWorker.postMessage({ command: 'cancel', id });
            } else {
                clearTimeout(id);
            }
        }

        /* --- VISIBILITY CHANGE: sync UI when tab regains focus --- */
        _initVisibilityHandler() {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState !== 'visible') return;

                this._removeExpiredPurchasedWeathers({ logExpired: true, persist: true });
                if (!WEATHER_DATA[this.weather.current] || Date.now() >= this.weather.expiresAt) {
                    this._rollNextNaturalWeather();
                } else {
                    this._scheduleNaturalWeatherTimer();
                }

                // Tab is back in focus - refresh all UI
                this.ui.renderStats();
                this.inventory.render();
                this.ui.updateWeather();

                // Sync cooldown progress bar if auto-fishing
                if (this.autoFish.enabled && this.autoFish.phase === 'casting') {
                    this._syncCooldownBar();
                }
            });
        }
        _defaultKeyMap() {
            return {
                cast: 'KeyC',
                autoFish: 'KeyA',
                inventory: 'KeyI',
                shop: 'KeyO',
                achievements: 'KeyH',
                expeditions: 'KeyE',
                settings: 'KeyP',
                save: 'KeyS'
            };
        }

        _defaultSettings() {
            return {
                floatingText: true,
                themeMode: 'auto',
                keyMap: this._defaultKeyMap()
            };
        }

        _normalizeShortcutCode(code) {
            if (typeof code !== 'string') return null;
            const normalized = code.trim();
            const validPattern = /^(Key[A-Z]|Digit[0-9]|Space|Tab|Enter|Backspace|Minus|Equal|BracketLeft|BracketRight|Backslash|Semicolon|Quote|Comma|Period|Slash|Backquote)$/;
            return validPattern.test(normalized) ? normalized : null;
        }

        _formatShortcutCode(code) {
            if (!code) return '';
            if (code.startsWith('Key')) return code.slice(3).toUpperCase();
            if (code.startsWith('Digit')) return code.slice(5);

            const named = {
                Space: 'Space',
                Tab: 'Tab',
                Enter: 'Enter',
                Backspace: 'Backspace',
                Minus: '-',
                Equal: '=',
                BracketLeft: '[',
                BracketRight: ']',
                Backslash: '\\',
                Semicolon: ';',
                Quote: "'",
                Comma: ',',
                Period: '.',
                Slash: '/',
                Backquote: '`'
            };
            return named[code] || code;
        }

        _applySettingsDefaults() {
            const defaults = this._defaultSettings();
            const existing = (this.state && this.state.settings && typeof this.state.settings === 'object')
                ? this.state.settings
                : {};
            const existingMap = (existing.keyMap && typeof existing.keyMap === 'object') ? existing.keyMap : {};

            const cleanKeyMap = {};
            const usedCodes = new Set();
            Object.entries(defaults.keyMap).forEach(([action, fallbackCode]) => {
                let candidate = this._normalizeShortcutCode(existingMap[action]) || fallbackCode;
                if (usedCodes.has(candidate)) {
                    const nextUnusedDefault = Object.values(defaults.keyMap).find(code => !usedCodes.has(code));
                    candidate = nextUnusedDefault || fallbackCode;
                }
                cleanKeyMap[action] = candidate;
                usedCodes.add(candidate);
            });

            this.state.settings = {
                floatingText: existing.floatingText !== false,
                themeMode: ['auto', 'light', 'dark'].includes(existing.themeMode) ? existing.themeMode : 'auto',
                keyMap: cleanKeyMap
            };
        }

        _initThemeWatcher() {
            if (this._themeWatcherInitialized) return;
            this._themeWatcherInitialized = true;
            if (typeof window.matchMedia !== 'function') return;

            this._themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this._themeMediaListener = () => {
                if (this.state.settings?.themeMode === 'auto') {
                    this._applyThemeMode();
                }
            };

            if (typeof this._themeMediaQuery.addEventListener === 'function') {
                this._themeMediaQuery.addEventListener('change', this._themeMediaListener);
            } else if (typeof this._themeMediaQuery.addListener === 'function') {
                this._themeMediaQuery.addListener(this._themeMediaListener);
            }
        }

        _resolveEffectiveTheme(mode) {
            if (mode === 'dark' || mode === 'light') return mode;
            const prefersDark = typeof window.matchMedia === 'function'
                && window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }

        _applyThemeMode() {
            const mode = this.state.settings?.themeMode || 'auto';
            const effective = this._resolveEffectiveTheme(mode);
            document.body.classList.remove('theme-light', 'theme-dark');
            document.body.classList.add(`theme-${effective}`);
            document.body.setAttribute('data-theme-mode', mode);
            document.body.setAttribute('data-theme-effective', effective);
        }

        _setThemeMode(mode) {
            if (!['auto', 'light', 'dark'].includes(mode)) return;
            if (!this.state.settings) this._applySettingsDefaults();
            this.state.settings.themeMode = mode;
            this._applyThemeMode();
            this._renderSettingsPanel();
            this.saveSystem.save();
        }

        _setFloatingTextHidden(hidden) {
            if (!this.state.settings) this._applySettingsDefaults();
            this.state.settings.floatingText = hidden !== true;
            if (hidden === true && this.ui && typeof this.ui.clearFloatingText === 'function') {
                this.ui.clearFloatingText();
            }
            this.saveSystem.save();
        }

        setKeybind(action, code) {
            if (!this.state.settings?.keyMap || !(action in this.state.settings.keyMap)) return false;
            const normalizedCode = this._normalizeShortcutCode(code);
            if (!normalizedCode) return false;

            const keyMap = this.state.settings.keyMap;
            const previousCode = keyMap[action];
            if (previousCode === normalizedCode) return true;

            const conflictingAction = Object.keys(keyMap).find(k => k !== action && keyMap[k] === normalizedCode);
            if (conflictingAction) {
                keyMap[conflictingAction] = previousCode;
            }

            keyMap[action] = normalizedCode;
            this._renderSettingsPanel();
            this.saveSystem.save();
            return true;
        }

        resetKeybindsToDefault() {
            if (!this.state.settings) this._applySettingsDefaults();
            this.state.settings.keyMap = this._defaultKeyMap();
            this._renderSettingsPanel();
            this.saveSystem.save();
        }

        _renderHotkeyLegend() {
            const legendMap = {
                cast: 'hotkey-cast',
                autoFish: 'hotkey-autoFish',
                inventory: 'hotkey-inventory',
                shop: 'hotkey-shop',
                achievements: 'hotkey-achievements',
                expeditions: 'hotkey-expeditions',
                settings: 'hotkey-settings',
                save: 'hotkey-save'
            };

            Object.entries(legendMap).forEach(([action, elementId]) => {
                const el = document.getElementById(elementId);
                if (!el) return;
                el.textContent = this._formatShortcutCode(this.state.settings?.keyMap?.[action]);
            });
        }

        _renderSettingsPanel() {
            const floatingToggle = document.getElementById('settings-floating-text');
            if (floatingToggle) {
                floatingToggle.checked = this.state.settings?.floatingText === false;
            }

            const themeRadios = document.querySelectorAll('input[name="settings-theme-mode"]');
            themeRadios.forEach((radio) => {
                radio.checked = radio.value === (this.state.settings?.themeMode || 'auto');
            });

            const keyInputs = document.querySelectorAll('.settings-key-input[data-keybind]');
            keyInputs.forEach((input) => {
                const action = input.dataset.keybind;
                const keyCode = this.state.settings?.keyMap?.[action];
                input.value = this._formatShortcutCode(keyCode);
                input.classList.remove('is-listening');
            });

            this._renderHotkeyLegend();
        }

        _initSettingsControls() {
            if (this._settingsControlsInitialized) return;
            this._settingsControlsInitialized = true;

            const floatingToggle = document.getElementById('settings-floating-text');
            if (floatingToggle) {
                floatingToggle.addEventListener('change', (event) => {
                    this._setFloatingTextHidden(event.target.checked);
                });
            }

            const themeRadios = document.querySelectorAll('input[name="settings-theme-mode"]');
            themeRadios.forEach((radio) => {
                radio.addEventListener('change', (event) => {
                    if (event.target.checked) {
                        this._setThemeMode(event.target.value);
                    }
                });
            });

            const keyInputs = document.querySelectorAll('.settings-key-input[data-keybind]');
            keyInputs.forEach((input) => {
                input.addEventListener('focus', () => {
                    input.classList.add('is-listening');
                });

                input.addEventListener('blur', () => {
                    input.classList.remove('is-listening');
                });

                input.addEventListener('keydown', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.repeat) return;

                    const action = input.dataset.keybind;
                    const normalizedCode = this._normalizeShortcutCode(event.code);
                    if (!action || !normalizedCode) return;

                    this.setKeybind(action, normalizedCode);
                    input.blur();
                });
            });

            const resetKeybindBtn = document.getElementById('settings-keybind-reset');
            if (resetKeybindBtn) {
                resetKeybindBtn.addEventListener('click', () => {
                    this.resetKeybindsToDefault();
                });
            }

            const settingsSaveBtn = document.getElementById('settings-save-btn');
            if (settingsSaveBtn) {
                settingsSaveBtn.addEventListener('click', () => {
                    this.saveSystem.manualSave();
                });
            }

            const settingsResetBtn = document.getElementById('settings-reset-btn');
            if (settingsResetBtn) {
                settingsResetBtn.addEventListener('click', () => {
                    this.saveSystem.resetData();
                });
            }

            this._renderSettingsPanel();
        }

        _isShopOpen() {
            return document.getElementById('shop-modal')?.classList.contains('active') || false;
        }

        _isAchievementsOpen() {
            return document.getElementById('achievements-modal')?.classList.contains('active') || false;
        }

        _isInventoryOpen() {
            return document.getElementById('inventory-modal')?.classList.contains('active') || false;
        }

        _isExpeditionsOpen() {
            return document.getElementById('expeditions-modal')?.classList.contains('active') || false;
        }

        _isSettingsOpen() {
            return document.getElementById('settings-modal')?.classList.contains('active') || false;
        }

        _toggleShop() {
            if (this._isShopOpen()) {
                this.shop.close();
                return;
            }
            this.closeAchievements();
            this.closeInventory();
            this.closeExpeditions();
            this.closeSettings();
            this.shop.open();
        }

        _toggleAchievements() {
            if (this._isAchievementsOpen()) {
                this.closeAchievements();
                return;
            }
            this.shop.close();
            this.closeInventory();
            this.closeExpeditions();
            this.closeSettings();
            this.openAchievements();
        }

        _toggleInventory() {
            if (this._isInventoryOpen()) {
                this.closeInventory();
                return;
            }
            this.shop.close();
            this.closeAchievements();
            this.closeExpeditions();
            this.closeSettings();
            this.openInventory();
        }

        _toggleExpeditions() {
            if (this._isExpeditionsOpen()) {
                this.closeExpeditions();
                return;
            }
            this.shop.close();
            this.closeAchievements();
            this.closeInventory();
            this.closeSettings();
            this.openExpeditions();
        }

        _toggleSettings() {
            if (this._isSettingsOpen()) {
                this.closeSettings();
                return;
            }
            this.shop.close();
            this.closeAchievements();
            this.closeInventory();
            this.closeExpeditions();
            this.openSettings();
        }

        _clickVisibleButtonByIndex(index) {
            const activeModals = Array.from(document.querySelectorAll('.shop-modal.active'));
            const root = activeModals.length > 0 ? activeModals[activeModals.length - 1] : document;
            const allButtons = Array.from(root.querySelectorAll('button'));

            const visibleButtons = allButtons.filter(btn => {
                if (btn.disabled) return false;

                const style = window.getComputedStyle(btn);
                if (style.display === 'none' || style.visibility === 'hidden') return false;

                const rect = btn.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
            });

            const target = visibleButtons[index];
            if (!target) return false;
            target.click();
            return true;
        }

        _initKeyboardShortcuts() {
            document.addEventListener('keydown', (event) => {
                if (event.repeat) return;
                if (event.ctrlKey || event.metaKey) return;

                const active = document.activeElement;
                const isEditable = active
                    && (active.tagName === 'INPUT'
                        || active.tagName === 'TEXTAREA'
                        || active.isContentEditable);
                if (isEditable) return;

                const key = event.key.toLowerCase();
                const code = event.code;
                const keyMap = this.state.settings?.keyMap || this._defaultKeyMap();
                const isBound = (action) => keyMap[action] === code;

                const anyModalOpen = this._isShopOpen()
                    || this._isAchievementsOpen()
                    || this._isInventoryOpen()
                    || this._isExpeditionsOpen()
                    || this._isSettingsOpen();

                if (key === 'escape') {
                    this.shop.close();
                    this.closeAchievements();
                    this.closeInventory();
                    this.closeExpeditions();
                    this.closeSettings();
                    return;
                }

                if (event.altKey && /^[1-9]$/.test(key)) {
                    event.preventDefault();
                    this._clickVisibleButtonByIndex(Number(key) - 1);
                    return;
                }

                if (this._isShopOpen() && ['1', '2', '3', '4'].includes(key)) {
                    event.preventDefault();
                    const tabs = ['weather', 'amulets', 'rods', 'baits'];
                    this.shop.switchTab(tabs[Number(key) - 1]);
                    return;
                }

                if (isBound('settings')) {
                    event.preventDefault();
                    this._toggleSettings();
                    return;
                }

                if (isBound('shop')) {
                    event.preventDefault();
                    this._toggleShop();
                    return;
                }

                if (isBound('achievements')) {
                    event.preventDefault();
                    this._toggleAchievements();
                    return;
                }

                if (isBound('inventory')) {
                    event.preventDefault();
                    this._toggleInventory();
                    return;
                }

                if (isBound('expeditions')) {
                    event.preventDefault();
                    this._toggleExpeditions();
                    return;
                }

                if (isBound('save')) {
                    event.preventDefault();
                    this.saveSystem.manualSave();
                    return;
                }

                if (isBound('autoFish')) {
                    if (anyModalOpen) return;
                    event.preventDefault();
                    this.toggleAutoFish();
                    return;
                }

                if (isBound('cast')) {
                    if (anyModalOpen) return;
                    event.preventDefault();
                    const actionBtn = document.getElementById('action-btn');
                    if (actionBtn && !actionBtn.disabled) actionBtn.click();
                    return;
                }

                if (key === 'l' && this._isInventoryOpen()) {
                    event.preventDefault();
                    const sellAllBtn = document.querySelector('#inventory-modal .inventory-header .btn-secondary');
                    if (sellAllBtn && !sellAllBtn.disabled) sellAllBtn.click();
                    return;
                }

                if (key === 'x' && event.shiftKey) {
                    event.preventDefault();
                    this.saveSystem.resetData();
                }
            });
        }


        /** Update the cooldown bar to reflect actual elapsed time (after background) */
        _syncCooldownBar() {
            const container = document.getElementById('auto-cooldown-container');
            const fill = document.getElementById('cooldown-bar-fill');
            const elapsed = Date.now() - this.autoFish.cooldownStart;
            const duration = this.autoFish.cooldownDuration;
            const progress = Math.min(elapsed / duration, 1);
            fill.style.width = (progress * 100) + '%';
            if (progress >= 1) {
                container.classList.remove('active');
            } else {
                container.classList.add('active');
            }
        }

        gameLoop() {
            if (this.minigame.active) {
                this.updateMinigame();
            }
            requestAnimationFrame(() => this.gameLoop());
        }

        /* --- MECHANICS: WEATHER --- */
        selectWeatherType() {
            // Dynamic weighted selection based on probability
            let totalWeight = 0;
            const weatherKeys = Object.keys(WEATHER_DATA);
            weatherKeys.forEach(key => {
                totalWeight += (WEATHER_DATA[key].probability || 0.1);
            });

            let random = Math.random() * totalWeight;
            for (const key of weatherKeys) {
                const weight = WEATHER_DATA[key].probability || 0.1;
                if (random < weight) {
                    return key;
                }
                random -= weight;
            }
            return 'clear'; // Fallback
        }

        _applyWeatherClasses() {
            Object.keys(WEATHER_DATA).forEach(k => document.body.classList.remove(`weather-${k}`));

            const baseKey = WEATHER_DATA[this.weather.current] ? this.weather.current : 'clear';
            document.body.classList.add(`weather-${baseKey}`);

            this.state.activeWeathers.forEach(k => {
                if (WEATHER_DATA[k]) document.body.classList.add(`weather-${k}`);
            });
        }

        _scheduleNaturalWeatherTimer() {
            this._cancelWorkerTimeout(this.weather.timer);
            this.weather.timer = null;

            if (!Number.isFinite(this.weather.expiresAt) || this.weather.expiresAt <= 0) return;
            const delay = Math.max(0, this.weather.expiresAt - Date.now());
            this.weather.timer = this._workerTimeout(() => {
                this.weather.timer = null;
                this._rollNextNaturalWeather();
            }, delay);
        }

        _rollNextNaturalWeather() {
            const nextWeather = this.selectWeatherType();
            const expiresAt = Date.now() + NATURAL_WEATHER_DURATION_MS;
            this.setWeather(nextWeather, { expiresAt, logChange: true });
            this.saveSystem.save();
        }

        _cancelPurchasedWeatherTimer(key) {
            const timerId = this.weather.purchasedTimers[key];
            if (timerId == null) return;
            this._cancelWorkerTimeout(timerId);
            delete this.weather.purchasedTimers[key];
        }

        _schedulePurchasedWeatherTimer(key) {
            this._cancelPurchasedWeatherTimer(key);

            const expiresAt = Number(this.state.purchasedWeatherExpirations?.[key]);
            if (!Number.isFinite(expiresAt) || expiresAt <= 0) return;

            const delay = expiresAt - Date.now();
            if (delay <= 0) {
                this.removePurchasedWeather(key, { expired: true, persist: true });
                return;
            }

            this.weather.purchasedTimers[key] = this._workerTimeout(() => {
                delete this.weather.purchasedTimers[key];
                this.removePurchasedWeather(key, { expired: true, persist: true });
            }, delay);
        }

        _syncPurchasedWeatherTimers() {
            let changed = false;
            if (typeof this.state.purchasedWeatherExpirations !== 'object'
                || this.state.purchasedWeatherExpirations === null
                || Array.isArray(this.state.purchasedWeatherExpirations)) {
                this.state.purchasedWeatherExpirations = {};
                changed = true;
            }

            const now = Date.now();
            const validActive = [...new Set(this.state.activeWeathers.filter(k => WEATHER_DATA[k]))]
                .slice(0, WEATHER_BUY_LIMIT);
            if (validActive.length !== this.state.activeWeathers.length) changed = true;
            this.state.activeWeathers = validActive;

            validActive.forEach(key => {
                const existingExpiry = Number(this.state.purchasedWeatherExpirations[key]);
                if (!Number.isFinite(existingExpiry) || existingExpiry <= 0) {
                    // Legacy migration: existing active weather without a timer gets a fresh 15m window.
                    this.state.purchasedWeatherExpirations[key] = now + PURCHASED_WEATHER_DURATION_MS;
                    changed = true;
                }
            });

            Object.keys(this.state.purchasedWeatherExpirations).forEach(key => {
                if (!validActive.includes(key)) {
                    delete this.state.purchasedWeatherExpirations[key];
                    this._cancelPurchasedWeatherTimer(key);
                    changed = true;
                }
            });

            if (this._removeExpiredPurchasedWeathers({ logExpired: false, persist: false })) {
                changed = true;
            }
            this.state.activeWeathers.forEach(key => this._schedulePurchasedWeatherTimer(key));
            return changed;
        }

        _removeExpiredPurchasedWeathers(options = {}) {
            const { logExpired = false, persist = false } = options;
            const now = Date.now();
            let removedAny = false;

            [...this.state.activeWeathers].forEach(key => {
                const expiresAt = Number(this.state.purchasedWeatherExpirations?.[key]);
                if (!Number.isFinite(expiresAt) || expiresAt > now) return;

                const removed = this.removePurchasedWeather(key, {
                    expired: true,
                    silent: !logExpired,
                    persist: false
                });
                removedAny = removedAny || removed;
            });

            if (removedAny && persist) {
                this.saveSystem.save();
            }

            return removedAny;
        }

        startWeatherCycle() {
            const weatherStateChanged = this._syncPurchasedWeatherTimers();

            const now = Date.now();
            const savedKey = WEATHER_DATA[this.state.naturalWeatherKey] ? this.state.naturalWeatherKey : null;
            const savedExpiry = Number(this.state.naturalWeatherExpiresAt);

            if (savedKey && Number.isFinite(savedExpiry) && savedExpiry > now) {
                this.setWeather(savedKey, { expiresAt: savedExpiry, logChange: false });
                if (weatherStateChanged) this.saveSystem.save();
            } else {
                this._rollNextNaturalWeather();
            }
        }

        setWeather(type, options = {}) {
            const safeType = WEATHER_DATA[type] ? type : 'clear';
            const now = Date.now();
            const providedExpiry = Number(options.expiresAt);
            const expiresAt = Number.isFinite(providedExpiry) && providedExpiry > now
                ? providedExpiry
                : now + NATURAL_WEATHER_DURATION_MS;
            const logChange = options.logChange !== false;

            this.weather.current = safeType;
            this.weather.expiresAt = expiresAt;
            this.state.naturalWeatherKey = safeType;
            this.state.naturalWeatherExpiresAt = expiresAt;

            this._applyWeatherClasses();
            this._scheduleNaturalWeatherTimer();
            this.ui.updateWeather();

            if (logChange) {
                this.log(`Weather: ${WEATHER_DATA[safeType].name} - ${WEATHER_DATA[safeType].desc}`);
            }
        }

        /** Add a purchased weather (max WEATHER_BUY_LIMIT simultaneous) */
        addPurchasedWeather(key) {
            this._removeExpiredPurchasedWeathers({ logExpired: false, persist: false });

            if (this.state.activeWeathers.length >= WEATHER_BUY_LIMIT) return false;
            if (this.state.activeWeathers.includes(key)) return false;
            if (!WEATHER_DATA[key]) return false;

            this.state.activeWeathers.push(key);
            this.state.purchasedWeatherExpirations[key] = Date.now() + PURCHASED_WEATHER_DURATION_MS;
            this._schedulePurchasedWeatherTimer(key);

            document.body.classList.add(`weather-${key}`);
            this.ui.updateWeather();
            return true;
        }

        /** Remove a purchased weather */
        removePurchasedWeather(key, options = {}) {
            const { expired = false, silent = false, persist = false } = options;
            const idx = this.state.activeWeathers.indexOf(key);
            if (idx === -1) return false;

            this.state.activeWeathers.splice(idx, 1);
            delete this.state.purchasedWeatherExpirations[key];
            this._cancelPurchasedWeatherTimer(key);

            // Only remove CSS class if it's not also the natural weather.
            if (this.weather.current !== key) {
                document.body.classList.remove(`weather-${key}`);
            }

            if (expired && !silent && WEATHER_DATA[key]) {
                this.log(`${WEATHER_DATA[key].name} weather effect ended.`);
            }

            this.ui.updateWeather();
            if (this._isShopOpen()) this.shop.render();
            if (persist) this.saveSystem.save();
            return true;
        }

        /** Combined luck multiplier: base weather + all purchased weathers (additive bonuses) */
        getWeatherMultiplier() {
            this._removeExpiredPurchasedWeathers({ logExpired: false, persist: false });
            if (this.weather.expiresAt > 0 && Date.now() >= this.weather.expiresAt) {
                this._rollNextNaturalWeather();
            }

            const baseKey = WEATHER_DATA[this.weather.current] ? this.weather.current : 'clear';
            let bonus = WEATHER_DATA[baseKey].luck - 1;
            const seen = new Set([baseKey]);

            this.state.activeWeathers.forEach(key => {
                if (seen.has(key)) return;
                const data = WEATHER_DATA[key];
                if (!data) return;
                seen.add(key);
                bonus += (data.luck - 1);
            });

            // Keep multiplier positive for stability if future data introduces many low-luck weathers.
            return Math.max(0.1, 1 + bonus);
        }

        setFishingMode(mode) {
            const normalizedMode = mode === 'auto' || mode === 'manual' ? mode : 'idle';
            this.activeFishingMode = normalizedMode;
            this.ui.setFishingZoneMode(normalizedMode);
        }

        resetFishingResults(mode) {
            const panel = this.fishingResults[mode];
            if (!panel) return;

            panel.totalCatches = 0;
            panel.fishStored = 0;
            panel.xpBanked = 0;
            panel.comboBonus = 0;
            this.ui.renderFishingResults();
        }

        _recordFishingResults(mode, { stored = false, xpGained = 0 } = {}) {
            const panel = this.fishingResults[mode];
            if (!panel) return;

            panel.totalCatches++;
            if (stored) panel.fishStored++;
            panel.xpBanked += Math.max(0, xpGained);
            panel.comboBonus = Math.max(0, this.state.combo * 10);
            this.ui.renderFishingResults();
        }

        _setFishingComboBonus(mode, comboBonus = 0) {
            const panel = this.fishingResults[mode];
            if (!panel) return;
            panel.comboBonus = Math.max(0, comboBonus);
            this.ui.renderFishingResults();
        }

        _autoSellInventoryIfFull() {
            if (this.state.inventory.length < MAX_INVENTORY_FISH) return false;

            let soldCount = 0;
            let soldValue = 0;
            const keptFish = [];

            for (const fish of this.state.inventory) {
                if (fish && AUTO_SELL_RARITIES.has(fish.rarity)) {
                    soldCount++;
                    soldValue += fish.value;
                } else {
                    keptFish.push(fish);
                }
            }

            if (soldCount === 0) return false;

            this.state.inventory = keptFish;
            this.addCoins(soldValue);
            this.achievementManager.onCoinsChange();
            this.log(`Inventory full (${MAX_INVENTORY_FISH}). Auto-sold ${soldCount.toLocaleString('en-US')} Common-Legendary fish for ${soldValue.toLocaleString('en-US')} coins.`);
            return true;
        }

        _storeCaughtFish(fish, sourceMode = 'manual') {
            this._autoSellInventoryIfFull();

            if (this.state.inventory.length < MAX_INVENTORY_FISH) {
                const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                this.state.inventory.push({ ...fish, id: uniqueId });
                return { stored: true, action: 'stored' };
            }

            if (AUTO_SELL_RARITIES.has(fish.rarity)) {
                this.addCoins(fish.value);
                this.achievementManager.onCoinsChange();
                this.log(`Inventory full (${MAX_INVENTORY_FISH}). Auto-sold ${sourceMode} catch ${fish.name} for ${fish.value.toLocaleString('en-US')} coins.`);
                return { stored: false, action: 'sold' };
            }

            this.log(`Inventory full (${MAX_INVENTORY_FISH}) with Mythic storage. ${sourceMode} catch ${fish.name} could not be stored.`);
            return { stored: false, action: 'rejected' };
        }

        /* --- MECHANICS: FISHING LOGIC --- */
        startCast() {
            if (this.minigame.active) return false; // Prevent double cast
            this.setFishingMode('manual');

            // Rate limiting to prevent rapid cast exploits
            const now = Date.now();
            if (this.lastCastTime && now - this.lastCastTime < 500) {
                this.ui.updateStatus('Slow down. Wait a moment before casting again.', 'warning');
                document.getElementById('action-btn').textContent = 'Cast Line';
                this.setFishingMode('idle');
                return false;
            }
            this.lastCastTime = now;
            document.getElementById('action-btn').textContent = 'Waiting...';

            const rod = RODS.find(r => r.id === this.state.rod);
            const bait = BAITS.find(b => b.id === this.state.bait);

            // 1. Calculate Luck (rod + bait + amulet) * weather
            let baseLuck = rod.luck + bait.luck;
            if (this.state.activeAmulet === this.state.location && AMULETS[this.state.activeAmulet]) {
                baseLuck += AMULETS[this.state.activeAmulet].luckBonus;
            }
            let totalLuck = baseLuck * this.getWeatherMultiplier();

            // 2. Roll Rarity
            const rarityKey = this.rollRarity(totalLuck, this._getPityBonus());

            // 3. Pick Fish
            const fishTemplate = this.pickFish(this.state.location, rarityKey);
            if (!fishTemplate) {
                this.log('Nothing bit...');
                document.getElementById('action-btn').textContent = 'Cast Line';
                this.setFishingMode('idle');
                return false;
            }

            // 4. Generate Weight (Gaussian-ish)
            const mean = (fishTemplate.minWeight + fishTemplate.maxWeight) / 2;
            const weight = this.generateWeight(mean, fishTemplate.maxWeight);

            // 5. Calculate Weather Buffs
            const weatherInfo = WEATHER_DATA[this.weather.current] || WEATHER_DATA.clear;
            let appliedBuff = null;
            let finalValue = Math.floor(weight * RARITY[rarityKey].mult);

            if (weatherInfo.buff && Math.random() < weatherInfo.buffChance) {
                appliedBuff = weatherInfo.buff;
                finalValue = Math.floor(finalValue * (1 + weatherInfo.valBonus));
            }

            // 6. Prepare Minigame
            this.startMinigame({
                name: fishTemplate.name,
                rarity: rarityKey,
                weight: weight,
                value: finalValue,
                location: LOCATIONS[this.state.location].name,
                buff: appliedBuff // Pass buff to minigame data
            });

            return true;
        }

        rollRarity(luck, pityBonus = 0) {
            // Weighted pool roll with tier-specific diminishing returns.
            // Legendary and mythic have hard-capped weight bonuses so they
            // remain genuinely rare even at maximum luck.
            const effectiveLuck = luck + pityBonus;
            const sqrtLuck = Math.sqrt(effectiveLuck);
            let pool = [];

            for (let k of Object.keys(RARITY)) {
                let weight = RARITY[k].weight;

                if (k === 'common') {
                    // Common shrinks linearly with luck (floor of 10)
                    weight = Math.max(10, weight - (effectiveLuck * 0.1));
                } else if (k === 'uncommon') {
                    weight += effectiveLuck * 0.06;
                } else if (k === 'rare') {
                    weight += effectiveLuck * 0.04;
                } else if (k === 'epic') {
                    // Diminishing returns via sqrt, capped at +18
                    weight += Math.min(sqrtLuck * 0.5, 18);
                } else if (k === 'legendary') {
                    // Hard cap: even at max luck, weight only reaches ~12
                    weight += Math.min(sqrtLuck * 0.2, 6);
                } else if (k === 'mythic') {
                    // Strongest cap: mythic should always feel special (~6 max)
                    weight += Math.min(sqrtLuck * 0.1, 3);
                }

                for (let i = 0; i < Math.floor(weight); i++) pool.push(k);
            }

            // Advantage reroll: high luck grants up to 50% chance to roll
            // twice and take the rarer result (lower base weight = rarer).
            const rerollChance = Math.min(0.5, effectiveLuck / 1000);
            if (Math.random() < rerollChance) {
                const a = pool[Math.floor(Math.random() * pool.length)];
                const b = pool[Math.floor(Math.random() * pool.length)];
                return RARITY[a].weight <= RARITY[b].weight ? a : b;
            }

            return pool[Math.floor(Math.random() * pool.length)];
        }

        pickFish(loc, rarity) {
            const table = FISH_DB[loc]?.[rarity];
            if (!table) return null; // Fallback
            const f = table[Math.floor(Math.random() * table.length)];
            return { name: f[0], minWeight: f[1], maxWeight: f[2] };
        }

        generateWeight(mean, max) {
            // Simplified variance
            let w = mean + ((Math.random() - 0.5) * (mean * 0.5));
            return parseFloat(Math.min(max * 1.5, Math.max(0.1, w)).toFixed(2));
        }

        /* --- MECHANICS: MINIGAME --- */
        startMinigame(fishData) {
            this.minigame.fishOnLine = fishData;
            this.minigame.active = true;

            const diff = RARITY[fishData.rarity].difficulty;

            // Setup Logic
            this.minigame.pos = 0;
            this.minigame.direction = 1;
            this.minigame.targetWidth = Math.max(10, 30 * diff);
            this.minigame.targetStart = Math.random() * (90 - this.minigame.targetWidth) + 5;

            // Speed based on rarity + minor random variation
            let baseSpeed = 1.0;
            if (fishData.rarity === 'legendary') baseSpeed = 2.0;
            if (fishData.rarity === 'mythic') baseSpeed = 3.5;

            // Apply weather difficulty modifier
            const weatherMod = WEATHER_DATA[this.weather.current].difficulty_mod || 1.0;
            this.minigame.speed = (baseSpeed + (Math.random() * 0.5)) * weatherMod;

            // Update UI
            this.ui.showMinigame(true);
            this.ui.updateStatus(this._buildReelingStatus(fishData));
            document.getElementById('action-btn').textContent = "REEL NOW!";
            document.getElementById('action-btn').classList.add('reeling');

            // Set CSS for target zone
            const zone = document.getElementById('mg-target');
            zone.style.left = this.minigame.targetStart + '%';
            zone.style.width = this.minigame.targetWidth + '%';
        }

        updateMinigame() {
            // Move indicator
            this.minigame.pos += this.minigame.speed * this.minigame.direction;
            if (this.minigame.pos >= 100 || this.minigame.pos <= 0) {
                this.minigame.direction *= -1;
            }
            // Clamp to [0, 100] to prevent out-of-bounds hit detection on edge frames
            this.minigame.pos = Math.max(0, Math.min(100, this.minigame.pos));
            // Update DOM directly for smoothness
            document.getElementById('mg-indicator').style.left = this.minigame.pos + '%';
        }

        resolveMinigame() {
            if (!this.minigame.active) return;

            const fish = this.minigame.fishOnLine;
            const rod = RODS.find(r => r.id === this.state.rod);

            // Pre-check: Fish too heavy for rod? It ALWAYS escapes - never catchable
            if (fish.weight > rod.capacity) {
                this.minigame.active = false;
                this.ui.showMinigame(false);
                document.getElementById('action-btn').classList.remove('reeling');

                this.log(`Released: ${fish.name} (${fish.weight}kg) was too heavy for your ${rod.name} (${rod.capacity}kg max).`);
                this.ui.updateStatus(`${fish.name} broke free. Too heavy.`, "danger");
                this.ui.floatText("TOO HEAVY!");
                this.achievementManager.onWeightFail(fish);
                this.breakCombo();
                this.setFishingMode('idle');
                return;
            }

            const hit = this.minigame.pos >= this.minigame.targetStart &&
                this.minigame.pos <= (this.minigame.targetStart + this.minigame.targetWidth);

            this.minigame.active = false;
            this.ui.showMinigame(false);
            document.getElementById('action-btn').classList.remove('reeling');

            if (hit) {
                this._catchAuthorized = true; // Vuln #2: authorize catch before calling
                this.catchSuccess(fish);
            } else {
                this.catchFail(fish);
            }
        }

        /* --- MECHANICS: RESOLUTION --- */
        catchSuccess(fish) {
            // Vuln #2: Only accept catches from legitimate game flow
            if (!this._catchAuthorized) return;
            this._catchAuthorized = false;

            // Vuln #4: Rate limit � prevent loop-based speedhacks
            const now = Date.now();
            if (this._lastCatchTime && now - this._lastCatchTime < 400) return;
            this._lastCatchTime = now;

            // 1. Success! Calculate combo bonus BEFORE incrementing so
            //    the current catch reflects the previous streak count.
            const comboBonus = 1 + (this.state.combo * 0.1);
            fish.value = Math.floor(fish.value * comboBonus);
            this.incrementCombo();
            this.setFishingMode('manual');

            // 2. Roll Shiny Variant (surprise multiplier)
            this._rollVariant(fish);

            // 3. Roll Critical Catch (combo-scaled burst)
            const isCrit = this._rollCritical(fish, this.state.combo);

            // 4. Add to Inventory with unique ID
            const storeOutcome = this._storeCaughtFish(fish, 'manual');
            this.state.totalCatches++;
            this.inventory.render();
            this._consumeAmulet();

            // 5. Pity timer update
            this._updatePity(fish.rarity);

            // 6. XP
            const xpGained = RARITY[fish.rarity].xp;
            this.gainXp(xpGained);
            this._recordFishingResults('manual', { stored: storeOutcome.stored, xpGained });

            // 7. Build log message
            let logMsg = `Caught ${fish.name} (${fish.weight}kg)`;
            if (fish.variant) logMsg = `${fish.variant.icon} ${fish.name} [${fish.variant.label}]`;
            if (isCrit) logMsg += ` ${this._lastCriticalStatus?.text || 'CRITICAL!'}`;
            logMsg += ` | +${fish.value} coins value`;
            this.log(logMsg);

            let statusMsg = `Caught ${fish.name}.`;
            if (fish.variant) statusMsg = `${fish.variant.icon} ${fish.variant.label} ${fish.name}.`;
            if (isCrit) statusMsg += ` ${this._lastCriticalStatus?.text || 'CRITICAL!'}`;
            if (storeOutcome.action === 'sold') statusMsg += ' Inventory full: catch auto-sold.';
            if (storeOutcome.action === 'rejected') statusMsg += ` Inventory full (${MAX_INVENTORY_FISH}).`;
            this.ui.updateStatus(statusMsg, 'success');
            this.ui.updateLastCatch(fish);
            this.ui.renderStats();

            // 8. Check milestone rewards
            this._checkMilestone();

            // 9. Achievement check
            this.achievementManager.onCatch(fish);

            this.saveSystem.save();
            this.setFishingMode('idle');
        }

        catchFail(fish) {
            // Near-miss feedback with rotating dynamic messages.
            const rarityName = RARITY[fish.rarity].name;
            const tierIndex = Object.keys(RARITY).indexOf(fish.rarity);
            const msg = this._buildEscapeMessage(fish, rarityName, tierIndex);

            let statusType = 'warning';
            if (tierIndex >= 4) {
                statusType = 'danger';
                this.ui.floatTextStyled(`${rarityName.toUpperCase()} ESCAPED!`, RARITY[fish.rarity].color);
            } else if (tierIndex >= 3) {
                this.ui.floatTextStyled(`${rarityName} escaped!`, RARITY[fish.rarity].color);
            }

            this.log(msg);
            this.ui.updateStatus(msg, statusType);
            this.breakCombo();
            this.setFishingMode('idle');
        }

        _pickEscapeMessage(tierKey, messages) {
            if (!Array.isArray(messages) || messages.length === 0) {
                return 'The fish got away.';
            }

            let index = Math.floor(Math.random() * messages.length);
            const lastIndex = this._lastEscapeMessageByTier[tierKey];

            if (messages.length > 1 && index === lastIndex) {
                index = (index + 1 + Math.floor(Math.random() * (messages.length - 1))) % messages.length;
            }

            this._lastEscapeMessageByTier[tierKey] = index;
            return messages[index];
        }

        _pickGeneratedMessage(key, messages, fallback = '') {
            if (!Array.isArray(messages) || messages.length === 0) {
                return fallback;
            }

            let index = Math.floor(Math.random() * messages.length);
            const lastIndex = this._lastGeneratedMessageByKey[key];

            if (messages.length > 1 && index === lastIndex) {
                index = (index + 1 + Math.floor(Math.random() * (messages.length - 1))) % messages.length;
            }

            this._lastGeneratedMessageByKey[key] = index;
            return messages[index];
        }

        _buildReelingStatus(fish) {
            const rarityUpper = fish.rarity.toUpperCase();
            const messages = [
                `Hooked! Reeling in ${rarityUpper} ${fish.name}...`,
                `Line tension rising. Pulling ${rarityUpper} ${fish.name} to shore...`,
                `${rarityUpper} signal confirmed. Reeling ${fish.name} now...`,
                `Rod loaded. Dragging ${fish.name} (${rarityUpper}) through the current...`,
                `Contact locked. Bringing in ${rarityUpper} ${fish.name}...`,
                `Splash on the surface. Reeling ${fish.name} before it dives again...`,
                `Steady hands. ${rarityUpper} ${fish.name} is fighting back...`,
                `Hook set clean. Hauling ${fish.name} (${rarityUpper}) toward you...`,
                `Pressure spike detected. Reeling ${rarityUpper} ${fish.name} hard...`,
                `Keep the line tight. ${fish.name} is almost in range...`,
                `${rarityUpper} catch on the line. Recovering ${fish.name} now...`,
                `The reel is humming. Pulling ${fish.name} out of deep water...`,
                `Target acquired: ${rarityUpper} ${fish.name}. Final reel phase...`,
                `Fish turning left. Countering and reeling ${fish.name}...`,
                `Turbulence ahead. Holding angle on ${rarityUpper} ${fish.name}...`,
                `Good hook depth. Bringing ${fish.name} in with controlled drag...`,
                `${fish.name} is thrashing. Reeling sequence continues...`,
                `${rarityUpper} strike maintained. Keep pressure on ${fish.name}...`,
                `Almost there. Guiding ${fish.name} into landing position...`,
                `Final pull! Securing ${rarityUpper} ${fish.name}...`
            ];

            return this._pickGeneratedMessage('reeling_status', messages, `Hooked! Reeling in ${rarityUpper} ${fish.name}...`);
        }

        _pickCriticalStatus() {
            const statuses = [
                { text: 'CRITICAL!', color: '#f43f5e' },
                { text: 'DEAD CENTER!', color: '#fb7185' },
                { text: 'PERFECT STRIKE!', color: '#ef4444' },
                { text: 'PRECISION HIT!', color: '#f97316' },
                { text: 'SHARP REEL!', color: '#f59e0b' },
                { text: 'MAX IMPACT!', color: '#eab308' },
                { text: 'FLAWLESS HOOKSET!', color: '#84cc16' },
                { text: 'PURE MOMENTUM!', color: '#22c55e' },
                { text: 'SURGE BONUS!', color: '#10b981' },
                { text: 'RIPTIDE HIT!', color: '#14b8a6' },
                { text: 'LOCKED IN!', color: '#06b6d4' },
                { text: 'BULLSEYE REEL!', color: '#0ea5e9' },
                { text: 'HIGH-TENSION WIN!', color: '#3b82f6' },
                { text: 'CHAIN REACTION!', color: '#6366f1' },
                { text: 'VECTOR SPIKE!', color: '#8b5cf6' },
                { text: 'SPECTRUM BREAK!', color: '#a855f7' },
                { text: 'OVERDRIVE!', color: '#d946ef' },
                { text: 'QUANTUM SNAP!', color: '#ec4899' },
                { text: 'MYTHIC TIMING!', color: '#f43f5e' },
                { text: 'ULTRA REEL!', color: '#ff5a8a' }
            ];

            return this._pickGeneratedMessage(
                'critical_status',
                statuses,
                { text: 'CRITICAL!', color: '#f43f5e' }
            );
        }

        _buildEscapeMessage(fish, rarityName, tierIndex) {
            const legendaryMythicMessages = [
                `A ${rarityName.toUpperCase()} shadow thrashed once and snapped the line: ${fish.name} (${fish.weight}kg).`,
                `${fish.name} (${fish.weight}kg) breached, flashed, and vanished. ${rarityName.toUpperCase()} chance lost.`,
                `The reel screamed, then went silent. ${rarityName.toUpperCase()} ${fish.name} got free at the last second.`,
                `One heartbeat from victory, then nothing. ${rarityName.toUpperCase()} ${fish.name} escaped.`,
                `You had visual contact, then the line cut loose. ${rarityName.toUpperCase()} ${fish.name} is gone.`
            ];

            const epicMessages = [
                `Power surge on the line. ${rarityName} ${fish.name} (${fish.weight}kg) tore away.`,
                `The hook held, then slipped. ${rarityName} ${fish.name} disappeared below.`,
                `${fish.name} twisted free right before landing. ${rarityName} catch missed.`,
                `Surface ripple, empty line. ${rarityName} ${fish.name} escaped cleanly.`,
                `Bad timing on the reel-in. ${rarityName} ${fish.name} (${fish.weight}kg) got away.`
            ];

            const rareMessages = [
                `${rarityName} pull detected, but ${fish.name} dodged the hook set.`,
                `${fish.name} made one sharp turn and slipped free.`,
                `Line tension dropped for a split second. ${rarityName} ${fish.name} escaped.`,
                `${rarityName} ${fish.name} (${fish.weight}kg) shook loose and vanished below.`,
                `You nearly banked a ${rarityName} catch, but ${fish.name} got away.`
            ];

            const commonUncommonMessages = [
                `${fish.name} nibbled, then disappeared into the weeds.`,
                `${fish.name} escaped before the hook could lock.`,
                `Quick splash, empty line. ${fish.name} is gone.`,
                `${fish.name} slipped the hook and darted away.`,
                `No catch this cast. ${fish.name} escaped.`
            ];

            if (tierIndex >= 4) {
                return this._pickEscapeMessage('legendary_mythic', legendaryMythicMessages);
            }
            if (tierIndex >= 3) {
                return this._pickEscapeMessage('epic', epicMessages);
            }
            if (tierIndex >= 2) {
                return this._pickEscapeMessage('rare', rareMessages);
            }
            return this._pickEscapeMessage('common_uncommon', commonUncommonMessages);
        }

        _consumeAmulet() {
            const biome = this.state.location;
            if (this.state.activeAmulet !== biome) return;
            if (!this.state.amuletStock[biome] || this.state.amuletStock[biome] <= 0) {
                this.state.activeAmulet = null;
                return;
            }
            this.state.amuletStock[biome]--;
            this.achievementManager.onAmuletUsed();
            if (this.state.amuletStock[biome] <= 0) {
                this.state.activeAmulet = null;
                this.log(`Amulet for ${LOCATIONS[biome].name} has been used up!`);
            }
        }

        /* --- COMBO SYSTEM --- */
        incrementCombo() {
            // Manual mode capped at 20x combo
            if (this.state.combo < 20) {
                this.state.combo++;
                if (this.state.combo > 1) this.ui.floatText(`Combo x${this.state.combo}!`);
            }
            // Cap reached � UI already shows "20x", no log spam needed
            this.achievementManager.onComboChange(this.state.combo, this.autoFish.enabled);
            if (this.activeFishingMode === 'auto' || this.activeFishingMode === 'manual') {
                this._setFishingComboBonus(this.activeFishingMode, this.state.combo * 10);
            }
            this.ui.renderStats();
        }

        breakCombo() {
            if (this.state.combo > 1) this.log(`Combo of ${this.state.combo} lost.`);
            this.state.combo = 0;
            if (this.activeFishingMode === 'auto' || this.activeFishingMode === 'manual') {
                this._setFishingComboBonus(this.activeFishingMode, 0);
            }
            this.ui.renderStats();
        }

        /* --- XP & LEVELS --- */
        gainXp(amount) {
            this.state.xp += amount;
            while (this.state.xp >= this.getXpNext()) {
                this.state.xp -= this.getXpNext();
                this.state.level++;
                this.log(`LEVEL UP! You are now level ${this.state.level}`);
                this.ui.floatText("LEVEL UP!");
            }
            this.ui.renderStats();
        }

        getXpNext() {
            return this.state.level * 1000 + Math.pow(this.state.level, 2) * 100;
        }

        /* --- AUTO-FISHING SYSTEM (Background-safe via Web Worker) --- */
        toggleAutoFish() {
            this.autoFish.enabled = !this.autoFish.enabled;
            this.state.autoFishEnabled = this.autoFish.enabled;
            const btn = document.getElementById('auto-fish-btn');
            const castBtn = document.getElementById('action-btn');

            if (this.autoFish.enabled) {
                btn.textContent = 'Disable Auto Fish';
                btn.classList.add('active');
                castBtn.disabled = true;
                castBtn.style.opacity = '0.5';
                this.setFishingMode('auto');
                this.log('Auto-fishing ENABLED (runs in background).');
                this.startAutoFishCycle();
            } else {
                btn.textContent = 'Enable Auto Fish';
                btn.classList.remove('active');
                castBtn.disabled = false;
                castBtn.style.opacity = '1';
                castBtn.textContent = 'Cast Line';
                this.autoFish.phase = 'idle';
                this._cancelWorkerTimeout(this.autoFish.timer);
                this.autoFish.timer = null;
                this.ui.showMinigame(false);
                document.getElementById('auto-cooldown-container').classList.remove('active');
                this.ui.updateStatus('Auto-fishing disabled. Ready to cast.');
                this.log('Auto-fishing DISABLED.');
                this.resetFishingResults('auto');
                this.setFishingMode('idle');
            }
            this.ui.renderStats();
            this.saveSystem.save();
        }

        startAutoFishCycle() {
            if (!this.autoFish.enabled) return;
            this.setFishingMode('auto');

            this.autoFish.phase = 'casting';
            document.getElementById('action-btn').textContent = 'Auto Mode';

            // Randomized cooldown between 1-3 seconds for realistic auto-fishing
            const cooldown = 1000 + Math.random() * 2000;

            // Track cooldown timing for background sync
            this.autoFish.cooldownStart = Date.now();
            this.autoFish.cooldownDuration = cooldown;

            // Show and animate cooldown progress bar
            const container = document.getElementById('auto-cooldown-container');
            const fill = document.getElementById('cooldown-bar-fill');
            container.classList.add('active');
            fill.style.width = '0%';

            // Animate cooldown bar (only runs when tab is visible)
            const startTime = performance.now();
            const animateCooldown = (currentTime) => {
                if (!this.autoFish.enabled || this.autoFish.phase !== 'casting') {
                    container.classList.remove('active');
                    return;
                }

                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / cooldown, 1);
                fill.style.width = (progress * 100) + '%';

                if (progress < 1) {
                    requestAnimationFrame(animateCooldown);
                }
            };
            requestAnimationFrame(animateCooldown);

            // Use Worker timer � fires reliably even in background tabs
            this.autoFish.timer = this._workerTimeout(() => {
                if (!this.autoFish.enabled) return;
                container.classList.remove('active');
                this.autoCast();
            }, cooldown);
        }

        autoCast() {
            if (!this.autoFish.enabled) return;

            const rod = RODS.find(r => r.id === this.state.rod);
            const bait = BAITS.find(b => b.id === this.state.bait);

            // Calculate Luck & Roll (rod + bait + amulet) * weather
            let baseLuck = rod.luck + bait.luck;
            if (this.state.activeAmulet === this.state.location && AMULETS[this.state.activeAmulet]) {
                baseLuck += AMULETS[this.state.activeAmulet].luckBonus;
            }
            let totalLuck = baseLuck * this.getWeatherMultiplier();
            const rarityKey = this.rollRarity(totalLuck, this._getPityBonus());
            const fishTemplate = this.pickFish(this.state.location, rarityKey);

            if (!fishTemplate) {
                this.log('Nothing bit. Retrying auto-fish cycle.');
                this.ui.updateStatus('Nothing bit. Casting again.');
                this.startAutoFishCycle();
                return;
            }

            const mean = (fishTemplate.minWeight + fishTemplate.maxWeight) / 2;
            const weight = this.generateWeight(mean, fishTemplate.maxWeight);

            this.minigame.fishOnLine = {
                name: fishTemplate.name,
                rarity: rarityKey,
                weight: weight,
                value: Math.floor(weight * RARITY[rarityKey].mult),
                location: LOCATIONS[this.state.location].name
            };

            // Apply weather buff chance (same as manual cast)
            const weatherInfo = WEATHER_DATA[this.weather.current] || WEATHER_DATA.clear;
            if (weatherInfo.buff && Math.random() < weatherInfo.buffChance) {
                this.minigame.fishOnLine.buff = weatherInfo.buff;
                this.minigame.fishOnLine.value = Math.floor(this.minigame.fishOnLine.value * (1 + weatherInfo.valBonus));
            }

            // Phase 2: Hook Time (based on rod speed, very fast)
            this.autoFish.phase = 'hooking';
            const hookDelay = Math.max(100, 500 - (rod.speed * 8));
            this.ui.updateStatus('Waiting for a bite...');

            this.autoFish.timer = this._workerTimeout(() => {
                if (!this.autoFish.enabled) return;
                this.autoReel();
            }, hookDelay);
        }

        autoReel() {
            if (!this.autoFish.enabled) return;

            const fish = this.minigame.fishOnLine;
            this.autoFish.phase = 'reeling';
            this.ui.updateStatus(this._buildReelingStatus(fish));
            document.getElementById('action-btn').textContent = 'Reeling...';

            // Phase 3: Reel Time (0.5 seconds - faster than manual)
            this.autoFish.timer = this._workerTimeout(() => {
                if (!this.autoFish.enabled) return;
                this.autoResolve();
            }, 500);
        }

        autoResolve() {
            if (!this.autoFish.enabled) return;

            const fish = this.minigame.fishOnLine;
            const rod = RODS.find(r => r.id === this.state.rod);

            // Capacity Check - Fish too heavy ALWAYS escapes (same as manual mode)
            if (fish.weight > rod.capacity) {
                this.log(`Released: ${fish.name} (${fish.weight}kg) was too heavy for ${rod.name} (${rod.capacity}kg max).`);
                this.ui.updateStatus(`${fish.name} broke free. Too heavy.`, 'danger');
                this.achievementManager.onWeightFail(fish);
                this.breakCombo();
            } else {
                // Apply Combo Bonus to Value BEFORE incrementing so
                // the current catch reflects the previous streak count.
                const comboBonus = 1 + (this.state.combo * 0.1);
                fish.value = Math.floor(fish.value * comboBonus);

                // Auto-fishing has a 10x combo limit for balance
                if (this.state.combo < 10) {
                    this.incrementCombo();
                }

                // Roll variant & critical (same as manual)
                this._rollVariant(fish);
                const isCrit = this._rollCritical(fish, this.state.combo);

                // Add to Inventory with unique ID
                const storeOutcome = this._storeCaughtFish(fish, 'auto');
                this.state.totalCatches++;
                this.inventory.render();
                this._consumeAmulet();
                this._updatePity(fish.rarity);
                const xpGained = RARITY[fish.rarity].xp;
                this.gainXp(xpGained);
                this._recordFishingResults('auto', { stored: storeOutcome.stored, xpGained });

                let logMsg = `Auto caught ${fish.name} (${fish.weight}kg)`;
                if (fish.variant) logMsg = `Auto ${fish.variant.icon} ${fish.name} [${fish.variant.label}]`;
                if (isCrit) logMsg += ` ${this._lastCriticalStatus?.text || 'CRITICAL!'}`;
                logMsg += ` | +${fish.value} coins value`;
                this.log(logMsg);

                let statusMsg = `Auto caught ${fish.name}.`;
                if (fish.variant) statusMsg = `Auto ${fish.variant.icon} ${fish.variant.label} ${fish.name}.`;
                if (isCrit) statusMsg += ` ${this._lastCriticalStatus?.text || 'CRITICAL!'}`;
                if (storeOutcome.action === 'sold') statusMsg += ' Inventory full: catch auto-sold.';
                if (storeOutcome.action === 'rejected') statusMsg += ` Inventory full (${MAX_INVENTORY_FISH}).`;
                this.ui.updateStatus(statusMsg, 'success');
                this.ui.updateLastCatch(fish);
                this.ui.renderStats();
                this._checkMilestone();
                this.achievementManager.onCatch(fish);
                this.saveSystem.save();
            }

            this.minigame.fishOnLine = null;

            // Start next cycle
            this.autoFish.phase = 'idle';
            this.startAutoFishCycle();
        }

        /* --- OFFLINE PROGRESSION --- */
        processOfflineCatches() {
            // E2 fix: Prevent repeated calls from console
            if (this._offlineProcessed) return;
            this._offlineProcessed = true;

            if (!this.state.autoFishEnabled) return;
            if (!this.state.lastSaveTimestamp) return;

            const now = Date.now();
            const rawElapsed = now - this.state.lastSaveTimestamp;
            // E1 fix: Cap offline time to 8 hours to prevent time-travel exploits
            const MAX_OFFLINE_MS = 28800000; // 8 hours
            const elapsed = Math.min(Math.max(rawElapsed, 0), MAX_OFFLINE_MS);
            this.achievementManager.onOfflineReturn(rawElapsed);
            if (elapsed < 5000) return; // Less than 5 seconds away � not worth simulating

            const rod = RODS.find(r => r.id === this.state.rod);
            const bait = BAITS.find(b => b.id === this.state.bait);
            if (!rod || !bait) return;

            // Average cycle time: ~2.5s cooldown + ~0.3s hook + 0.5s reel = ~3.3s
            const avgCycleMs = 3300;
            const maxCycles = Math.min(Math.floor(elapsed / avgCycleMs), 500); // Cap at 500 to prevent oversized saves
            if (maxCycles <= 0) return;

            let totalFishCaught = 0;
            let totalCoins = 0;
            let totalXpGained = 0;
            let combo = Math.min(this.state.combo, 10);

            // Calculate luck (same as autoCast)
            let baseLuck = rod.luck + bait.luck;
            if (this.state.activeAmulet === this.state.location && AMULETS[this.state.activeAmulet]) {
                baseLuck += AMULETS[this.state.activeAmulet].luckBonus;
            }
            const weatherMult = this.getWeatherMultiplier();
            let totalLuck = baseLuck * weatherMult;

            let pity = this.state.pityCounter || 0;

            for (let i = 0; i < maxCycles; i++) {
                // Pity bonus applied to rarity roll
                const pityBonus = pity >= 30 ? 100 : pity >= 20 ? 50 : pity >= 10 ? 20 : 0;
                const rarityKey = this.rollRarity(totalLuck, pityBonus);
                const fishTemplate = this.pickFish(this.state.location, rarityKey);

                if (!fishTemplate) {
                    combo = 0;
                    continue;
                }

                const mean = (fishTemplate.minWeight + fishTemplate.maxWeight) / 2;
                const weight = this.generateWeight(mean, fishTemplate.maxWeight);

                // Capacity check � fish too heavy escapes
                if (weight > rod.capacity) {
                    combo = 0;
                    continue;
                }

                // Successful catch
                if (combo < 10) combo++;
                const comboBonus = 1 + (combo * 0.1);
                let value = Math.floor(Math.floor(weight * RARITY[rarityKey].mult) * comboBonus);

                // Apply weather buff chance
                const weatherInfo = WEATHER_DATA[this.weather.current] || WEATHER_DATA.clear;
                if (weatherInfo.buff && Math.random() < weatherInfo.buffChance) {
                    value = Math.floor(value * (1 + weatherInfo.valBonus));
                }

                // Roll variant (offline)
                const variantRoll = Math.random();
                if (variantRoll < 0.01) {
                    value = Math.floor(value * 10); // Prismatic
                } else if (variantRoll < 0.05) {
                    value = Math.floor(value * 5);  // Shadow
                } else if (variantRoll < 0.13) {
                    value = Math.floor(value * 3);  // Golden
                }

                // Roll critical (offline)
                const critChance = 0.08 + (combo * 0.0085);
                if (Math.random() < critChance) value = Math.floor(value * 2);

                // Update pity
                const tierIdx = Object.keys(RARITY).indexOf(rarityKey);
                if (tierIdx >= 2) { pity = 0; } else { pity++; }

                // Offline fish go directly to coins (not inventory) to prevent localStorage bloat
                // B2 note: Achievement hooks intentionally not fired for offline catches (limited simulation)
                totalFishCaught++;
                totalCoins += value;

                // Consume amulet stock
                if (this.state.activeAmulet === this.state.location && this.state.amuletStock[this.state.location] > 0) {
                    this.state.amuletStock[this.state.location]--;
                    if (this.state.amuletStock[this.state.location] <= 0) {
                        this.state.activeAmulet = null;
                        baseLuck = rod.luck + bait.luck;
                        totalLuck = baseLuck * weatherMult;
                    }
                }

                // XP (B3 fix: evaluate getXpNext() fresh each iteration)
                const xpGain = RARITY[rarityKey].xp;
                totalXpGained += xpGain;
                this.state.xp += xpGain;
                while (this.state.xp >= this.getXpNext()) {
                    this.state.xp -= this.getXpNext();
                    this.state.level++;
                }

                this.state.totalCatches++;

                // B1 fix: Check milestones during offline progression
                const c = this.state.totalCatches;
                if (c > 0 && c % 100 === 0) { totalCoins += 15000; }
                else if (c > 0 && c % 50 === 0) { totalCoins += 5000; }
                else if (c > 0 && c % 25 === 0) { totalCoins += 2000; }
                else if (c > 0 && c % 10 === 0) { totalCoins += 500; }
            }

            this.state.pityCounter = pity;

            this.state.combo = combo;
            this.state.lastSaveTimestamp = now;

            if (totalFishCaught > 0) {
                // Add offline earnings directly to coins
                this.addCoins(totalCoins);
                this.achievementManager.onCoinsChange();
                this.showOfflinePopup(elapsed, totalFishCaught, totalCoins, totalXpGained);
            }

            this.saveSystem.save();
        }

        /* --- ACHIEVEMENTS MODAL --- */
        openAchievements() {
            this.closeSettings();
            this.achievementManager.renderModal();
            document.getElementById('achievements-overlay').classList.add('active');
            document.getElementById('achievements-modal').classList.add('active');
        }

        closeAchievements() {
            document.getElementById('achievements-overlay').classList.remove('active');
            document.getElementById('achievements-modal').classList.remove('active');
        }

        /* --- EXPEDITIONS MODAL --- */
        openExpeditions() {
            this.closeSettings();
            this.ui.renderLocations();
            document.getElementById('expeditions-overlay').classList.add('active');
            document.getElementById('expeditions-modal').classList.add('active');
        }

        closeExpeditions() {
            document.getElementById('expeditions-overlay').classList.remove('active');
            document.getElementById('expeditions-modal').classList.remove('active');
        }

        /* --- INVENTORY MODAL --- */
        openInventory() {
            this.closeSettings();
            this.inventory.render();
            document.getElementById('inventory-overlay').classList.add('active');
            document.getElementById('inventory-modal').classList.add('active');
        }

        closeInventory() {
            document.getElementById('inventory-overlay').classList.remove('active');
            document.getElementById('inventory-modal').classList.remove('active');
        }

        /* --- SETTINGS MODAL --- */
        openSettings() {
            this.shop.close();
            this.closeAchievements();
            this.closeInventory();
            this.closeExpeditions();
            this._renderSettingsPanel();
            document.getElementById('settings-overlay').classList.add('active');
            document.getElementById('settings-modal').classList.add('active');
        }

        closeSettings() {
            document.getElementById('settings-overlay').classList.remove('active');
            document.getElementById('settings-modal').classList.remove('active');
        }

        showOfflinePopup(elapsedMs, fishCount, coins, xp) {
            // Format time
            const totalSec = Math.floor(elapsedMs / 1000);
            let timeStr;
            if (totalSec < 60) {
                timeStr = `${totalSec}s`;
            } else if (totalSec < 3600) {
                const m = Math.floor(totalSec / 60);
                const s = totalSec % 60;
                timeStr = `${m}m ${s}s`;
            } else {
                const h = Math.floor(totalSec / 3600);
                const m = Math.floor((totalSec % 3600) / 60);
                timeStr = `${h}h ${m}m`;
            }

            // Create popup element
            const popup = document.createElement('div');
            popup.className = 'offline-popup';
            popup.innerHTML = `
            <div class="offline-popup-header">
                <span>Welcome Back</span>
                <button class="offline-popup-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <p>While you were away <strong>${timeStr}</strong>, you caught <strong>${fishCount}</strong> fish worth <strong>${coins.toLocaleString()}</strong> coins.</p>
            <p style="font-size:0.8rem;color:#6b7280;">+${xp} XP earned</p>
        `;
            document.body.appendChild(popup);

            // Auto-dismiss after 8 seconds
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.classList.add('offline-popup-fade');
                    setTimeout(() => popup.remove(), 500);
                }
            }, 8000);
        }

        log(msg) {
            const ul = document.getElementById('game-log');
            const li = document.createElement('li');
            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
            li.textContent = `[${timestamp}] ${msg}`;
            ul.prepend(li);
            if (ul.children.length > 20) ul.lastChild.remove();
        }

        /* --- REWARD SYSTEMS --- */

        /** Roll a shiny variant on a caught fish. Mutates fish in-place. */
        _rollVariant(fish) {
            const roll = Math.random();
            if (roll < 0.01) {
                fish.variant = { label: 'Prismatic', icon: '??', mult: 10 };
            } else if (roll < 0.05) {
                fish.variant = { label: 'Shadow', icon: '??', mult: 5 };
            } else if (roll < 0.13) {
                fish.variant = { label: 'Golden', icon: '??', mult: 3 };
            }
            if (fish.variant) {
                fish.value = Math.floor(fish.value * fish.variant.mult);
                this.ui.floatTextStyled(
                    `${fish.variant.icon} ${fish.variant.label}!`,
                    fish.variant.label === 'Prismatic' ? '#e879f9' :
                        fish.variant.label === 'Shadow' ? '#6366f1' : '#facc15'
                );
            }
        }

        /** Roll a critical catch. Returns true if critical hit. Mutates fish value. */
        _rollCritical(fish, combo) {
            const critChance = 0.08 + (combo * 0.0085);
            if (Math.random() < critChance) {
                fish.value = Math.floor(fish.value * 2);
                const critStatus = this._pickCriticalStatus();
                this._lastCriticalStatus = critStatus;
                this.ui.floatTextStyled(critStatus.text, critStatus.color);
                return true;
            }
            return false;
        }

        /** Update the pity counter. Resets on rare+ catch, increments on common/uncommon. */
        _updatePity(rarityKey) {
            const tierIndex = Object.keys(RARITY).indexOf(rarityKey);
            if (tierIndex >= 2) {
                // Rare or above � reset pity and announce drought break if it was long
                if (this.state.pityCounter >= 15) {
                    this.ui.floatTextStyled('Drought ended!', '#4ade80');
                }
                this.state.pityCounter = 0;
            } else {
                this.state.pityCounter++;
            }
        }

        /** Get the current pity luck bonus based on drought length. */
        _getPityBonus() {
            const p = this.state.pityCounter || 0;
            if (p >= 30) return 100;
            if (p >= 20) return 50;
            if (p >= 10) return 20;
            return 0;
        }

        /** Check if totalCatches hit a milestone and award bonus coins. */
        _checkMilestone() {
            const c = this.state.totalCatches;
            let bonus = 0;
            let msg = '';

            if (c > 0 && c % 100 === 0) {
                bonus = 15000;
                msg = `Century catch #${c}. +${bonus.toLocaleString()} bonus coins.`;
            } else if (c > 0 && c % 50 === 0) {
                bonus = 5000;
                msg = `${c} catches milestone. +${bonus.toLocaleString()} bonus coins.`;
            } else if (c > 0 && c % 25 === 0) {
                bonus = 2000;
                msg = `${c} catches milestone. +${bonus.toLocaleString()} bonus coins.`;
            } else if (c > 0 && c % 10 === 0) {
                bonus = 500;
                msg = `${c}-catch streak. +${bonus.toLocaleString()} bonus coins.`;
            }

            if (bonus > 0) {
                this.addCoins(bonus);
                this.achievementManager.onCoinsChange();
                this.log(msg);
                this.ui.floatTextStyled(msg, '#facc15');
                this.ui.renderStats();
            }
        }
    }

    /* --- INIT --- */
    const game = new Game();

    // Event Listener for the Main Button
    document.getElementById('action-btn').addEventListener('click', () => {
        if (game.minigame.active) {
            game.resolveMinigame();
            document.getElementById('action-btn').textContent = 'Cast Line';
        } else {
            game.startCast();
        }
    });

    // Auto-Fish Button Event Listener
    document.getElementById('auto-fish-btn').addEventListener('click', () => {
        game.toggleAutoFish();
    });

    // Frozen public API � only these methods are accessible from HTML onclick handlers
    // game itself is NOT global (trapped inside IIFE closure)
    window.GameAPI = Object.freeze({
        shopOpen: () => game.shop.open(),
        shopClose: () => game.shop.close(),
        shopSwitchTab: (t) => game.shop.switchTab(t),
        shopBuyWeather: (k) => game.shop.buyWeather(k),
        shopRemoveWeather: (k) => game.shop.removeWeather(k),
        shopBuyAmulet: (k) => game.shop.buyAmulet(k),
        shopWearAmulet: (k) => game.shop.wearAmulet(k),
        shopBuyRod: (id) => game.shop.buyRod(id),
        shopBuyBait: (id) => game.shop.buyBait(id),
        inventorySellAll: () => game.inventory.sellAll(),
        openExpeditions: () => game.openExpeditions(),
        closeExpeditions: () => game.closeExpeditions(),
        openInventory: () => game.openInventory(),
        closeInventory: () => game.closeInventory(),
        openSettings: () => game.openSettings(),
        closeSettings: () => game.closeSettings(),
        manualSave: () => game.saveSystem.manualSave(),
        resetData: () => game.saveSystem.resetData(),
        openAchievements: () => game.openAchievements(),
        closeAchievements: () => game.closeAchievements(),
    });

    // Init Game
    game.init();

})(); // End IIFE










