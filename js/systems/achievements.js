/**
 * ACHIEVEMENT SYSTEM
 * Tracks and awards achievements based on game events.
 */

class AchievementManager {
    constructor(game) {
        this.game = game;

        if (!this.game.state.achievements) this.game.state.achievements = [];
        if (!this.game.state.achievementCounters) this.game.state.achievementCounters = {};
    }

    has(id) {
        return this.game.state.achievements.includes(id);
    }

    unlock(id) {
        if (this.has(id) || !ACHIEVEMENTS[id]) return;

        this.game.state.achievements.push(id);
        const ach = ACHIEVEMENTS[id];

        this.game.log(`Achievement unlocked: ${ach.icon} ${ach.name}`);
        this._showToast(ach);
        this._updateCounter();
        this.game.saveSystem.save();
    }

    incrementCounter(key, amount = 1) {
        const counters = this.game.state.achievementCounters;
        counters[key] = (counters[key] || 0) + amount;
        return counters[key];
    }

    getCounter(key) {
        return this.game.state.achievementCounters[key] || 0;
    }

    _updateCounter() {
        const el = document.getElementById('achievement-count');
        if (!el) return;
        el.textContent = `${this.game.state.achievements.length}/${Object.keys(ACHIEVEMENTS).length}`;
    }

    _showToast(ach) {
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `
            <div class="achievement-toast-icon">${ach.icon}</div>
            <div class="achievement-toast-body">
                <div class="achievement-toast-title">Achievement Unlocked</div>
                <div class="achievement-toast-name">${ach.name}</div>
                <div class="achievement-toast-desc">${ach.desc}</div>
            </div>
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }

    /* ---------- EVENT HOOKS ---------- */
    onCatch(fish) {
        const s = this.game.state;

        if (!this.has('humble_beginnings') && s.rod === 'bamboo') {
            this.unlock('humble_beginnings');
        }

        if (!this.has('heavy_lifter') && fish.weight > 500) {
            this.unlock('heavy_lifter');
        }

        if (!this.has('storm_chaser')) {
            const w = this.game.weather.current;
            if (w === 'storm' || w === 'gale') {
                this.unlock('storm_chaser');
            }
        }

        if (!this.has('night_owl') && s.location === 'midnight') {
            const hour = new Date().getHours();
            if (hour >= 0 && hour < 4) {
                this.unlock('night_owl');
            }
        }

        if (!this.has('frozen_assets') && fish.buff === 'Cryo-Preserved') {
            this.unlock('frozen_assets');
        }

        const fishChecks = [
            'glitch_matrix',
            'sugar_rush',
            'paper_cut',
            'time_traveler',
            'void_stare',
            'fish_404'
        ];

        for (const achId of fishChecks) {
            if (!this.has(achId) && ACHIEVEMENTS[achId].fish) {
                if (ACHIEVEMENTS[achId].fish.includes(fish.name)) {
                    this.unlock(achId);
                }
            }
        }
    }

    onWeightFail(fish) {
        if (!this.has('one_that_got_away')) {
            if (fish.rarity === 'mythic' || fish.rarity === 'legendary') {
                this.unlock('one_that_got_away');
            }
        }
    }

    onComboChange(combo, isAuto) {
        if (!this.has('flow_state') && !isAuto && combo >= 20) {
            this.unlock('flow_state');
        }

        if (!this.has('bot_buddy') && isAuto && combo >= 10) {
            this.unlock('bot_buddy');
        }
    }

    onPurchase(type, id) {
        if (type === 'rod') {
            if (!this.has('gearhead') && id === 'alloy') {
                this.unlock('gearhead');
            }
            if (!this.has('omni_presence') && id === 'omniverse') {
                this.unlock('omni_presence');
            }
        }

        if (type === 'bait') {
            if (!this.has('singularity_seeker') && id === 'singularity') {
                this.unlock('singularity_seeker');
            }
        }
    }

    onCoinsChange() {
        if (!this.has('pastel_tycoon') && this.game.state.coins >= 1000000) {
            this.unlock('pastel_tycoon');
        }
    }

    onWeatherPurchase() {
        if (!this.has('weather_god') && this.game.state.activeWeathers.length >= 5) {
            this.unlock('weather_god');
        }
    }

    onAmuletUsed() {
        const count = this.incrementCounter('amuletsUsed');
        if (!this.has('local_legend') && count >= 50) {
            this.unlock('local_legend');
        }
    }

    onOfflineReturn(elapsedMs) {
        if (!this.has('welcome_back') && elapsedMs > 86400000) {
            this.unlock('welcome_back');
        }
    }

    renderModal() {
        const container = document.getElementById('achievements-list');
        if (!container) return;

        const categories = [
            { key: 'progression', label: 'Progression and Economy' },
            { key: 'skill', label: 'Skill and Mechanics' },
            { key: 'biome', label: 'Biome and Lore' },
            { key: 'secret', label: 'Secret and Fun' }
        ];

        let html = '';

        for (const cat of categories) {
            const entries = Object.entries(ACHIEVEMENTS).filter(([, a]) => a.category === cat.key);
            html += `<div class="achievement-category"><h3>${cat.label}</h3>`;

            for (const [id, ach] of entries) {
                const unlocked = this.has(id);
                const hidden = ach.secret && !unlocked;

                html += `
                    <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                        <div class="achievement-icon">${hidden ? '?' : ach.icon}</div>
                        <div class="achievement-info">
                            <div class="achievement-name">${hidden ? 'Hidden Achievement' : ach.name}</div>
                            <div class="achievement-desc">${hidden ? 'This achievement is hidden until unlocked.' : ach.desc}</div>
                        </div>
                        ${unlocked ? '<div class="achievement-check">Unlocked</div>' : ''}
                    </div>
                `;
            }

            html += '</div>';
        }

        container.innerHTML = html;
    }

    init() {
        this._updateCounter();
        this.onCoinsChange();

        if (this.game.state.rodsOwned.includes('alloy')) this.onPurchase('rod', 'alloy');
        if (this.game.state.rodsOwned.includes('omniverse')) this.onPurchase('rod', 'omniverse');
        if (this.game.state.baitsOwned.includes('singularity')) this.onPurchase('bait', 'singularity');
        if (this.game.state.activeWeathers.length >= 5) this.onWeatherPurchase();
    }
}
