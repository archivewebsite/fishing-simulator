/**
 * UI HANDLER
 * Handles rendering of stats, locations, weather, status text, and floating feedback.
 */

class UI {
    constructor(game) {
        this.game = game;
    }

    renderAll() {
        this.renderStats();
        this.renderFishingResults();
        this.setFishingZoneMode(this.game.activeFishingMode || 'idle');
        this.renderLocations();
        this.game.shop.render();
        this.game.inventory.render();
    }

    renderStats() {
        const s = this.game.state;
        const rod = RODS.find(r => r.id === s.rod) || RODS[0];

        const coinsEl = document.getElementById('coins-display');
        const levelEl = document.getElementById('level-display');
        const xpCurrentEl = document.getElementById('xp-current');
        const xpNextEl = document.getElementById('xp-next');
        const capacityEl = document.getElementById('capacity-display');
        const comboEl = document.getElementById('combo-display');
        const xpBarEl = document.getElementById('xp-bar');

        if (!coinsEl || !levelEl || !xpCurrentEl || !xpNextEl || !capacityEl || !comboEl || !xpBarEl) return;

        coinsEl.textContent = s.coins.toLocaleString('en-US');
        levelEl.textContent = s.level;
        xpCurrentEl.textContent = Math.floor(s.xp).toLocaleString('en-US');
        xpNextEl.textContent = this.game.getXpNext().toLocaleString('en-US');
        capacityEl.textContent = `${rod.capacity} kg`;
        comboEl.textContent = `${s.combo}x`;

        const pct = Math.max(0, Math.min((s.xp / this.game.getXpNext()) * 100, 100));
        xpBarEl.style.width = `${pct}%`;

        const autoStatePill = document.getElementById('auto-status-pill');
        if (autoStatePill) {
            const isAutoActive = this.game.autoFish.enabled || this.game.state.autoFishEnabled;
            autoStatePill.textContent = isAutoActive ? 'Automatic Fishing' : 'Inactive';
            autoStatePill.classList.toggle('active', isAutoActive);
        }
    }

    renderFishingResults() {
        const autoResults = this.game.fishingResults?.auto;
        const manualResults = this.game.fishingResults?.manual;

        if (autoResults) {
            const autoCatchesEl = document.getElementById('auto-result-catches');
            const autoStoredEl = document.getElementById('auto-result-stored');
            const autoXpEl = document.getElementById('auto-result-xp');
            const autoComboEl = document.getElementById('auto-result-combo');

            if (autoCatchesEl) autoCatchesEl.textContent = autoResults.totalCatches.toLocaleString('en-US');
            if (autoStoredEl) autoStoredEl.textContent = autoResults.fishStored.toLocaleString('en-US');
            if (autoXpEl) autoXpEl.textContent = Math.floor(autoResults.xpBanked).toLocaleString('en-US');
            if (autoComboEl) autoComboEl.textContent = `${Math.max(0, autoResults.comboBonus)}%`;
        }

        if (manualResults) {
            const manualCatchesEl = document.getElementById('manual-result-catches');
            const manualStoredEl = document.getElementById('manual-result-stored');
            const manualXpEl = document.getElementById('manual-result-xp');
            const manualComboEl = document.getElementById('manual-result-combo');

            if (manualCatchesEl) manualCatchesEl.textContent = manualResults.totalCatches.toLocaleString('en-US');
            if (manualStoredEl) manualStoredEl.textContent = manualResults.fishStored.toLocaleString('en-US');
            if (manualXpEl) manualXpEl.textContent = Math.floor(manualResults.xpBanked).toLocaleString('en-US');
            if (manualComboEl) manualComboEl.textContent = `${Math.max(0, manualResults.comboBonus)}%`;
        }
    }

    setFishingZoneMode(mode = 'idle') {
        const zone = document.querySelector('.fishing-zone');
        if (!zone) return;

        zone.classList.remove('fishing-zone--idle', 'fishing-zone--manual', 'fishing-zone--auto');

        if (mode === 'auto') {
            zone.classList.add('fishing-zone--auto');
        } else if (mode === 'manual') {
            zone.classList.add('fishing-zone--manual');
        } else {
            zone.classList.add('fishing-zone--idle');
        }
    }

    renderLocations() {
        const grid = document.getElementById('location-grid');
        if (!grid) return;

        grid.innerHTML = '';

        Object.entries(LOCATIONS).forEach(([key, data]) => {
            const div = document.createElement('div');
            div.className = `location-card ${this.game.state.location === key ? 'active' : ''}`;
            div.style.setProperty('--loc-a', data.colors?.[0] || '#cbd5e1');
            div.style.setProperty('--loc-b', data.colors?.[1] || '#94a3b8');
            div.innerHTML = `<div class="loc-name">${data.name}</div><div class="loc-desc">${data.desc}</div>`;

            div.onclick = () => {
                this.game.state.location = key;
                this.game.breakCombo();

                if (this.game.state.activeAmulet && this.game.state.activeAmulet !== key) {
                    this.game.log(`Your ${AMULETS[this.game.state.activeAmulet].name} faded after leaving its biome.`);
                    this.game.state.activeAmulet = null;
                }

                this.game.log(`Traveled to ${data.name}.`);
                this.renderLocations();
                this.updateTheme();
                this.game.saveSystem.save();
                if (typeof this.game.closeExpeditions === 'function') {
                    this.game.closeExpeditions();
                }
            };

            grid.appendChild(div);
        });

        this.renderBiomeAtlas();
        this.updateTheme();
    }

    renderBiomeAtlas() {
        const container = document.getElementById('biome-atlas-sections');
        if (!container) return;

        const atlasGroups = (typeof NEW_BIOME_ATLAS !== 'undefined' && Array.isArray(NEW_BIOME_ATLAS))
            ? NEW_BIOME_ATLAS
            : [];

        const playableKeys = new Set(Object.keys(LOCATIONS));
        const visibleGroups = atlasGroups
            .map((group) => ({
                ...group,
                biomes: (group.biomes || []).filter((biome) => !playableKeys.has(biome.id))
            }))
            .filter((group) => (group.biomes || []).length > 0);

        container.innerHTML = '';
        if (visibleGroups.length === 0) {
            container.innerHTML = '<p class="panel-note">All atlas biomes are now playable.</p>';
            return;
        }

        visibleGroups.forEach((group) => {
            const section = document.createElement('section');
            section.className = 'biome-atlas-category';

            const header = document.createElement('div');
            header.className = 'biome-atlas-category-head';

            const title = document.createElement('h4');
            title.textContent = group.category || 'Concept Biomes';

            const subtitle = document.createElement('p');
            subtitle.textContent = group.blurb || 'Creative biome concepts';

            const count = document.createElement('span');
            count.className = 'biome-atlas-count';
            count.textContent = `${Array.isArray(group.biomes) ? group.biomes.length : 0} display-only`;

            header.appendChild(title);
            header.appendChild(subtitle);
            header.appendChild(count);

            const grid = document.createElement('div');
            grid.className = 'biome-atlas-grid';

            (group.biomes || []).forEach((biome) => {
                const card = document.createElement('article');
                card.className = 'biome-atlas-card';
                card.style.setProperty('--atlas-a', biome.colors?.[0] || '#cbd5e1');
                card.style.setProperty('--atlas-b', biome.colors?.[1] || '#94a3b8');

                const chip = document.createElement('span');
                chip.className = 'biome-atlas-chip';
                chip.textContent = 'Display Only';

                const name = document.createElement('h5');
                name.textContent = biome.name || 'Unnamed Biome';

                const theme = document.createElement('p');
                theme.className = 'biome-atlas-theme';
                theme.textContent = biome.theme || '';

                const identity = document.createElement('p');
                identity.className = 'biome-atlas-identity';
                identity.textContent = biome.identity || '';

                const swatchRow = document.createElement('div');
                swatchRow.className = 'biome-atlas-swatches';

                (biome.colors || []).slice(0, 2).forEach((color) => {
                    const swatch = document.createElement('span');
                    swatch.className = 'biome-atlas-swatch';
                    swatch.style.background = color;
                    swatch.title = color;
                    swatchRow.appendChild(swatch);
                });

                card.appendChild(chip);
                card.appendChild(name);
                card.appendChild(theme);
                card.appendChild(identity);
                card.appendChild(swatchRow);
                grid.appendChild(card);
            });

            section.appendChild(header);
            section.appendChild(grid);
            container.appendChild(section);
        });
    }

    _hexToRgb(hex) {
        const value = String(hex || '').trim();
        const normalized = value.startsWith('#') ? value.slice(1) : value;
        if (!/^[a-fA-F0-9]{6}$/.test(normalized)) {
            return { r: 148, g: 163, b: 184 };
        }

        return {
            r: parseInt(normalized.slice(0, 2), 16),
            g: parseInt(normalized.slice(2, 4), 16),
            b: parseInt(normalized.slice(4, 6), 16)
        };
    }

    _mixRgb(rgbA, rgbB, ratio = 0.5) {
        const clamped = Math.max(0, Math.min(ratio, 1));
        const inv = 1 - clamped;
        return {
            r: Math.round((rgbA.r * inv) + (rgbB.r * clamped)),
            g: Math.round((rgbA.g * inv) + (rgbB.g * clamped)),
            b: Math.round((rgbA.b * inv) + (rgbB.b * clamped))
        };
    }

    _rgba(rgb, alpha = 1) {
        const a = Math.max(0, Math.min(alpha, 1));
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
    }

    updateTheme() {
        const loc = LOCATIONS[this.game.state.location] || LOCATIONS.mistvale;
        const colorA = this._hexToRgb(loc.colors?.[0] || '#d6f7ff');
        const colorB = this._hexToRgb(loc.colors?.[1] || '#ffe9ca');
        const colorC = this._mixRgb(colorA, colorB, 0.35);
        const colorD = this._mixRgb(colorA, colorB, 0.7);
        const colorE = this._mixRgb(colorA, colorB, 0.5);

        document.body.style.setProperty(
            '--bg-gradient',
            `radial-gradient(120% 90% at 8% 12%, ${this._rgba(colorA, 0.42)} 0%, rgba(255, 255, 255, 0) 54%),
            radial-gradient(95% 85% at 92% 6%, ${this._rgba(colorB, 0.38)} 0%, rgba(255, 255, 255, 0) 52%),
            radial-gradient(80% 70% at 50% 100%, ${this._rgba(colorC, 0.3)} 0%, rgba(255, 255, 255, 0) 58%),
            conic-gradient(from 210deg at 50% 50%, ${this._rgba(colorD, 0.24)}, ${this._rgba(colorA, 0.16)}, ${this._rgba(colorB, 0.24)}, ${this._rgba(colorD, 0.24)}),
            linear-gradient(135deg, ${this._rgba(colorA, 0.24)}, ${this._rgba(colorB, 0.24)})`
        );
        document.body.style.setProperty('--bg-shape-a-color', this._rgba(colorA, 0.7));
        document.body.style.setProperty('--bg-shape-b-color', this._rgba(colorB, 0.68));
        document.body.style.setProperty('--bg-mesh-color', this._rgba(colorC, 0.34));
        document.body.style.setProperty('--bg-vein-color', this._rgba(colorE, 0.12));
    }

    updateStatus(msg, type = 'normal') {
        const el = document.getElementById('status-message');
        if (!el) return;

        el.textContent = msg;
        el.style.color = type === 'danger'
            ? 'var(--danger)'
            : type === 'success'
                ? 'var(--success)'
                : type === 'warning'
                    ? 'var(--warning)'
                    : 'var(--text)';
    }

    updateLastCatch(fish) {
        const el = document.getElementById('last-catch');
        if (!el) return;

        let label = `Last Catch: <span style="color:${RARITY[fish.rarity].color}">${fish.name}</span> (${fish.weight}kg)`;

        if (fish.variant) {
            const varColor = fish.variant.label === 'Prismatic'
                ? '#e879f9'
                : fish.variant.label === 'Shadow'
                    ? '#6366f1'
                    : '#facc15';
            label = `Last Catch: <span style="color:${varColor}">${fish.variant.icon} ${fish.variant.label}</span> <span style="color:${RARITY[fish.rarity].color}">${fish.name}</span> (${fish.weight}kg)`;
        }

        el.innerHTML = label;
    }

    showMinigame(show) {
        const el = document.getElementById('minigame-ui');
        if (!el) return;
        el.classList.toggle('active', show);
    }

    updateWeather() {
        const badge = document.getElementById('weather-badge');
        const text = document.getElementById('weather-text');
        const icon = document.querySelector('.weather-icon');
        if (!badge || !text || !icon) return;

        const baseKey = WEATHER_DATA[this.game.weather.current] ? this.game.weather.current : 'clear';
        const baseWeather = WEATHER_DATA[baseKey];
        const activeWeathers = this.game.state.activeWeathers || [];

        const uniqueWeatherKeys = [baseKey];
        activeWeathers.forEach(key => {
            if (!WEATHER_DATA[key]) return;
            if (uniqueWeatherKeys.includes(key)) return;
            uniqueWeatherKeys.push(key);
        });

        const maxIcons = 4;
        let icons = uniqueWeatherKeys
            .slice(0, maxIcons)
            .map(key => WEATHER_DATA[key].icon)
            .join('');

        if (uniqueWeatherKeys.length > maxIcons) {
            icons += `+${uniqueWeatherKeys.length - maxIcons}`;
        }

        icon.textContent = icons || 'Sun';

        const totalLuck = this.game.getWeatherMultiplier();
        const luckPct = Math.round((totalLuck - 1) * 100);
        const luckMod = `${luckPct >= 0 ? '+' : ''}${luckPct}%`;

        if (uniqueWeatherKeys.length > 1) {
            text.textContent = `${uniqueWeatherKeys.length} active weather effects (${luckMod} Luck)`;
        } else {
            text.textContent = baseWeather.luck !== 1 ? `${baseWeather.name} (${luckMod} Luck)` : baseWeather.name;
        }

        if (totalLuck > 1.2) badge.style.borderColor = '#22c55e';
        else if (totalLuck < 1) badge.style.borderColor = 'var(--danger)';
        else if (totalLuck > 1) badge.style.borderColor = 'var(--accent)';
        else badge.style.borderColor = 'var(--border)';
    }

    floatText(msg) {
        this.floatTextStyled(msg, '#f59e0b');
    }

    clearFloatingText() {
        document.querySelectorAll('.floating-text-notification').forEach((el) => {
            el.remove();
        });
    }

    floatTextStyled(msg, color = '#f59e0b') {
        if (this.game.state?.settings?.floatingText === false) {
            return;
        }

        const container = document.querySelector('.action-area') || document.body;
        const el = document.createElement('div');
        el.className = 'floating-text-notification';
        el.textContent = msg;

        Object.assign(el.style, {
            position: 'absolute',
            left: '50%',
            top: '40%',
            transform: 'translateX(-50%)',
            fontSize: '1.2rem',
            fontWeight: '800',
            color,
            textShadow: '0 2px 8px rgba(0,0,0,0.24)',
            pointerEvents: 'none',
            zIndex: '100',
            transition: 'all 1.4s ease-out',
            opacity: '1'
        });

        if (!container.style.position) {
            container.style.position = 'relative';
        }

        container.appendChild(el);

        requestAnimationFrame(() => {
            el.style.top = '12%';
            el.style.opacity = '0';
        });

        setTimeout(() => el.remove(), 1500);
    }
}





