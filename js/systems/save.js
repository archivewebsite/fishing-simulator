/**
 * SAVE SYSTEM
 * Handles save/load/validation for localStorage persistence.
 */

class SaveSystem {
    constructor(game) {
        this.game = game;
        this.localStorageKey = 'mythic_waters_enhanced';
        this.saveVersion = 5;
    }

    // Shared 32-bit hash routine.
    _hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return hash;
    }

    // Stable JSON serializer so key ordering does not affect cloud checksum validation.
    _stableNormalize(value) {
        if (Array.isArray(value)) {
            return value.map((entry) => this._stableNormalize(entry));
        }

        if (value && typeof value === 'object') {
            const normalized = {};
            Object.keys(value).sort().forEach((key) => {
                const entry = value[key];
                if (entry === undefined || typeof entry === 'function') return;
                normalized[key] = this._stableNormalize(entry);
            });
            return normalized;
        }

        return value;
    }

    _stableStringify(value) {
        return JSON.stringify(this._stableNormalize(value));
    }

    // Deterministic checksum used by current local/cloud saves.
    computeChecksum(data) {
        const salt = 'MW_v4_' + (data?.totalCatches || 0) + '_' + (data?.level || 1);
        return this._hashString(salt + this._stableStringify(data));
    }

    // Legacy checksum kept for backward compatibility with older local saves.
    computeLegacyChecksum(data) {
        const salt = 'MW_v3_' + (data?.totalCatches || 0) + '_' + (data?.level || 1);
        return this._hashString(salt + JSON.stringify(data));
    }

    isChecksumValid(data, checksum) {
        const provided = Number(checksum);
        if (!Number.isFinite(provided)) return false;
        if (provided === this.computeChecksum(data)) return true;
        if (provided === this.computeLegacyChecksum(data)) return true;
        return false;
    }

    hasPersistedLocalSave() {
        const raw = localStorage.getItem(this.localStorageKey);
        return typeof raw === 'string' && raw.length > 0;
    }

    getStateTimestamp(state) {
        const ts = Number(state?.lastSaveTimestamp);
        return Number.isFinite(ts) && ts > 0 ? ts : 0;
    }

    getPersistedLocalTimestamp() {
        const raw = localStorage.getItem(this.localStorageKey);
        if (!raw) return 0;

        try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.state && typeof parsed.state === 'object') {
                return this.getStateTimestamp(parsed.state);
            }
            return this.getStateTimestamp(parsed);
        } catch (_err) {
            return 0;
        }
    }

    persistCurrentStateToLocal() {
        try {
            const envelope = this.buildSaveEnvelope();
            localStorage.setItem(this.localStorageKey, JSON.stringify(envelope));
            return true;
        } catch (err) {
            console.error('Local snapshot persist error:', err);
            return false;
        }
    }

    parseSupabaseRow(row) {
        if (!row || typeof row !== 'object') {
            return { ok: false, reason: 'invalid_row' };
        }

        const rawState = row.save_data;
        if (!rawState || typeof rawState !== 'object' || Array.isArray(rawState)) {
            return { ok: false, reason: 'invalid_payload' };
        }

        const validatedState = this.validateState(rawState);
        const providedChecksum = Number(row.checksum);
        const hasChecksum = Number.isFinite(providedChecksum);
        const checksumValid = !hasChecksum
            || this.isChecksumValid(rawState, providedChecksum)
            || this.isChecksumValid(validatedState, providedChecksum);
        const saveVersion = Number(row.save_version);

        // Supabase JSONB can reorder object keys from legacy v3 saves.
        const allowLegacyBypass = hasChecksum
            && !checksumValid
            && Number.isFinite(saveVersion)
            && saveVersion <= 3;

        if (hasChecksum && !checksumValid && !allowLegacyBypass) {
            return { ok: false, reason: 'checksum' };
        }

        return {
            ok: true,
            state: validatedState,
            checksumBypassed: allowLegacyBypass
        };
    }

    save() {
        this.game.state.lastSaveTimestamp = Date.now();

        // Cap inventory size and auto-sell oldest fish above limit.
        const MAX_INVENTORY = 5000;
        if (this.game.state.inventory.length > MAX_INVENTORY) {
            const excessCount = this.game.state.inventory.length - MAX_INVENTORY;
            const excess = this.game.state.inventory.splice(0, excessCount);
            let soldValue = 0;
            excess.forEach(item => soldValue += item.value);

            this.game.addCoins(soldValue);
            this.game.log(`Inventory full. Auto-sold ${excess.length} oldest fish for ${soldValue.toLocaleString()} coins.`);
            this.game.achievementManager.onCoinsChange();

            // Keep UI table and stats in sync after automatic truncation.
            this.game.ui.renderStats();
            this.game.inventory.render();
        }

        const saveData = this.buildSaveEnvelope();

        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(saveData));
        } catch (err) {
            if (err.name === 'QuotaExceededError' || err.code === 22) {
                console.warn('localStorage quota exceeded. Running emergency inventory sale.');

                let emergencyCoins = 0;
                this.game.state.inventory.forEach(item => emergencyCoins += item.value);
                this.game.addCoins(emergencyCoins);
                this.game.state.inventory = [];

                this.game.log(`Storage full. Emergency sold all fish for ${emergencyCoins.toLocaleString()} coins.`);
                this.game.achievementManager.onCoinsChange();
                this.game.ui.renderAll();

                try {
                    const retryData = this.buildSaveEnvelope();
                    localStorage.setItem(this.localStorageKey, JSON.stringify(retryData));
                } catch (retryErr) {
                    console.error('Save failed after emergency sale:', retryErr);
                }
            } else {
                console.error('Save error:', err);
            }
        }

        // Cloud sync: keep Supabase save up to date when user is logged in.
        if (typeof CloudSystem !== 'undefined'
            && CloudSystem
            && CloudSystem.user
            && typeof CloudSystem.saveToCloud === 'function') {
            CloudSystem.saveToCloud().catch((cloudErr) => {
                console.error('Cloud save error:', cloudErr);
            });
        }
    }

    load() {
        const data = localStorage.getItem(this.localStorageKey);
        if (!data) return;

        try {
            const parsed = JSON.parse(data);

            if (parsed.version && parsed.checksum !== undefined) {
                if (!this.isChecksumValid(parsed.state, parsed.checksum)) {
                    console.warn('Save integrity check failed. Save appears tampered.');
                    this.game.log('Save data failed integrity checks. Progress was reset.');
                    alert('Save integrity check failed.\nYour save appears to be externally modified.\nProgress has been reset for fairness.');
                    localStorage.removeItem(this.localStorageKey);
                    return;
                }

                const validated = this.validateState(parsed.state);
                this.game.state = { ...this.game.state, ...validated };
            } else {
                const validated = this.validateState(parsed);
                this.game.state = { ...this.game.state, ...validated };
            }

            this.game.log('Welcome back, angler.');
        } catch (err) {
            console.error('Save load error:', err);
        }
    }

    validateState(state) {
        const validated = { ...state };

        if (typeof validated.coins !== 'number' || !Number.isFinite(validated.coins) || validated.coins < 0) {
            validated.coins = 0;
        }
        validated.coins = Math.floor(validated.coins);

        if (typeof validated.totalCoinsEarned !== 'number' || !Number.isFinite(validated.totalCoinsEarned) || validated.totalCoinsEarned < 0) {
            validated.totalCoinsEarned = validated.coins;
        }
        validated.totalCoinsEarned = Math.max(Math.floor(validated.totalCoinsEarned), validated.coins);

        if (typeof validated.level !== 'number' || !Number.isFinite(validated.level) || validated.level < 1) {
            validated.level = 1;
        }
        validated.level = Math.floor(validated.level);

        if (typeof validated.xp !== 'number' || !Number.isFinite(validated.xp) || validated.xp < 0) {
            validated.xp = 0;
        }

        const validRodIds = RODS.map(r => r.id);
        if (!Array.isArray(validated.rodsOwned)) validated.rodsOwned = ['bamboo'];
        validated.rodsOwned = validated.rodsOwned.filter(id => validRodIds.includes(id));
        if (!validated.rodsOwned.includes('bamboo')) validated.rodsOwned.unshift('bamboo');

        if (!validated.rodsOwned.includes(validated.rod)) validated.rod = 'bamboo';

        const validBaitIds = BAITS.map(b => b.id);
        if (!Array.isArray(validated.baitsOwned)) validated.baitsOwned = ['worm'];
        validated.baitsOwned = validated.baitsOwned.filter(id => validBaitIds.includes(id));
        if (!validated.baitsOwned.includes('worm')) validated.baitsOwned.unshift('worm');

        if (!validated.baitsOwned.includes(validated.bait)) validated.bait = 'worm';

        if (!LOCATIONS[validated.location]) validated.location = 'mistvale';

        if (!Array.isArray(validated.inventory)) validated.inventory = [];
        validated.inventory = validated.inventory.filter(item => {
            if (!item || typeof item !== 'object') return false;
            if (!RARITY[item.rarity]) return false;
            if (typeof item.value !== 'number' || !Number.isFinite(item.value) || item.value < 0) return false;
            if (typeof item.weight !== 'number' || !Number.isFinite(item.weight) || item.weight <= 0) return false;
            if (typeof item.name !== 'string' || item.name.length === 0) return false;
            return true;
        });
        if (validated.inventory.length > 5000) {
            // Keep most recent entries; this mirrors normal in-game append behavior.
            validated.inventory = validated.inventory.slice(validated.inventory.length - 5000);
        }

        if (typeof validated.combo !== 'number' || !Number.isFinite(validated.combo) || validated.combo < 0 || validated.combo > 20) {
            validated.combo = 0;
        }

        if (typeof validated.totalCatches !== 'number' || !Number.isFinite(validated.totalCatches) || validated.totalCatches < 0) {
            validated.totalCatches = 0;
        }
        validated.totalCatches = Math.floor(validated.totalCatches);

        if (!Array.isArray(validated.activeWeathers)) {
            validated.activeWeathers = [];
        } else {
            const validWeatherKeys = Object.keys(WEATHER_DATA);
            validated.activeWeathers = [...new Set(validated.activeWeathers)]
                .filter(k => validWeatherKeys.includes(k))
                .slice(0, WEATHER_BUY_LIMIT);
        }

        if (typeof validated.purchasedWeatherExpirations !== 'object'
            || validated.purchasedWeatherExpirations === null
            || Array.isArray(validated.purchasedWeatherExpirations)) {
            validated.purchasedWeatherExpirations = {};
        } else {
            const validWeatherKeys = Object.keys(WEATHER_DATA);
            const cleanExpirations = {};
            for (const [key, val] of Object.entries(validated.purchasedWeatherExpirations)) {
                const expiresAt = Number(val);
                if (validWeatherKeys.includes(key) && Number.isFinite(expiresAt) && expiresAt > 0) {
                    cleanExpirations[key] = expiresAt;
                }
            }
            validated.purchasedWeatherExpirations = cleanExpirations;
        }

        validated.activeWeathers.forEach(key => {
            if (!validated.purchasedWeatherExpirations[key]) {
                // Backward compatibility for legacy saves without weather timers.
                validated.purchasedWeatherExpirations[key] = Date.now() + (15 * 60 * 1000);
            }
        });
        Object.keys(validated.purchasedWeatherExpirations).forEach(key => {
            if (!validated.activeWeathers.includes(key)) {
                delete validated.purchasedWeatherExpirations[key];
            }
        });

        if (!WEATHER_DATA[validated.naturalWeatherKey]) validated.naturalWeatherKey = 'clear';
        if (typeof validated.naturalWeatherExpiresAt !== 'number'
            || !Number.isFinite(validated.naturalWeatherExpiresAt)
            || validated.naturalWeatherExpiresAt < 0) {
            validated.naturalWeatherExpiresAt = 0;
        }

        if (typeof validated.amuletStock !== 'object' || validated.amuletStock === null || Array.isArray(validated.amuletStock)) {
            validated.amuletStock = {};
        } else {
            const validBiomeKeys = Object.keys(LOCATIONS);
            const cleanAmulets = {};

            for (const [key, val] of Object.entries(validated.amuletStock)) {
                if (validBiomeKeys.includes(key) && typeof val === 'number' && Number.isFinite(val) && val >= 0) {
                    cleanAmulets[key] = Math.floor(val);
                }
            }

            validated.amuletStock = cleanAmulets;
        }

        if (validated.activeAmulet === undefined) validated.activeAmulet = null;
        if (validated.activeAmulet !== null) {
            if (!AMULETS[validated.activeAmulet]) {
                validated.activeAmulet = null;
            } else if (!validated.amuletStock[validated.activeAmulet] || validated.amuletStock[validated.activeAmulet] <= 0) {
                validated.activeAmulet = null;
            }
        }

        if (typeof validated.autoFishEnabled !== 'boolean') validated.autoFishEnabled = false;
        if (typeof validated.lastSaveTimestamp !== 'number' || !Number.isFinite(validated.lastSaveTimestamp) || validated.lastSaveTimestamp <= 0) {
            validated.lastSaveTimestamp = Date.now();
        }

        if (typeof validated.pityCounter !== 'number' || !Number.isFinite(validated.pityCounter) || validated.pityCounter < 0) {
            validated.pityCounter = 0;
        }
        validated.pityCounter = Math.min(Math.floor(validated.pityCounter), 100);

        if (!Array.isArray(validated.achievements)) {
            validated.achievements = [];
        } else {
            const validIds = Object.keys(ACHIEVEMENTS);
            validated.achievements = [...new Set(validated.achievements.filter(id => validIds.includes(id)))];
        }

        if (typeof validated.achievementCounters !== 'object' || validated.achievementCounters === null || Array.isArray(validated.achievementCounters)) {
            validated.achievementCounters = {};
        } else {
            for (const [key, val] of Object.entries(validated.achievementCounters)) {
                if (typeof val !== 'number' || !Number.isFinite(val) || val < 0) {
                    validated.achievementCounters[key] = 0;
                }
            }
        }

        const defaultKeyMap = {
            cast: 'KeyC',
            autoFish: 'KeyA',
            inventory: 'KeyI',
            shop: 'KeyO',
            achievements: 'KeyH',
            expeditions: 'KeyE',
            settings: 'KeyP',
            save: 'KeyS'
        };
        const validKeyCodePattern = /^(Key[A-Z]|Digit[0-9]|Space|Tab|Enter|Backspace|Minus|Equal|BracketLeft|BracketRight|Backslash|Semicolon|Quote|Comma|Period|Slash|Backquote)$/;

        if (typeof validated.settings !== 'object' || validated.settings === null || Array.isArray(validated.settings)) {
            validated.settings = {};
        }

        if (typeof validated.settings.floatingText !== 'boolean') {
            validated.settings.floatingText = true;
        }

        if (!['auto', 'light', 'dark'].includes(validated.settings.themeMode)) {
            validated.settings.themeMode = 'auto';
        }

        if (typeof validated.settings.keyMap !== 'object' || validated.settings.keyMap === null || Array.isArray(validated.settings.keyMap)) {
            validated.settings.keyMap = {};
        }

        const cleanKeyMap = {};
        const seenCodes = new Set();
        const fallbackOrder = Object.values(defaultKeyMap);
        for (const [action, fallbackCode] of Object.entries(defaultKeyMap)) {
            const incoming = validated.settings.keyMap[action];
            const candidate = typeof incoming === 'string' && validKeyCodePattern.test(incoming)
                ? incoming
                : fallbackCode;
            let finalCode = candidate;
            if (seenCodes.has(finalCode)) {
                finalCode = !seenCodes.has(fallbackCode)
                    ? fallbackCode
                    : (fallbackOrder.find(code => !seenCodes.has(code)) || fallbackCode);
            }
            cleanKeyMap[action] = finalCode;
            seenCodes.add(finalCode);
        }

        validated.settings = {
            floatingText: validated.settings.floatingText,
            themeMode: validated.settings.themeMode,
            keyMap: cleanKeyMap
        };

        return validated;
    }

    manualSave() {
        this.save();
        alert('Game saved successfully.');
    }

    resetData() {
        if (confirm('Delete all progress and start over?')) {
            localStorage.removeItem(this.localStorageKey);
            location.reload();
        }
    }

    /**
     * Canonical save envelope used for localStorage and remote persistence.
     */
    buildSaveEnvelope() {
        return {
            state: this.game.state,
            checksum: this.computeChecksum(this.game.state),
            version: this.saveVersion
        };
    }

    /**
     * Convert current state into a row shape compatible with Supabase `game_saves`.
     */
    toSupabaseRow() {
        const envelope = this.buildSaveEnvelope();
        return {
            save_data: envelope.state,
            save_version: envelope.version,
            checksum: envelope.checksum
        };
    }

    /**
     * Apply a Supabase `game_saves` row into runtime state.
     * Returns true when a valid row is applied.
     */
    applySupabaseRow(row) {
        const parsed = this.parseSupabaseRow(row);
        if (!parsed.ok) {
            if (parsed.reason === 'checksum') {
                this.game.log('Cloud save failed checksum validation and was ignored.');
            }
            return false;
        }
        if (parsed.checksumBypassed) {
            console.warn('Applied legacy cloud save with checksum bypass (v3 compatibility mode).');
            this.game.log('Applied legacy cloud save using compatibility mode.');
        }

        this.game.state = { ...this.game.state, ...parsed.state };
        return true;
    }
}


