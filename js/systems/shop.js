/**
 * SHOP SYSTEM
 * Handles modal UI and purchase/equip logic for weather, amulets, rods, and baits.
 */

class Shop {
    constructor(game) {
        this.game = game;
        this.activeTab = 'weather';
    }

    /* ---------- MODAL CONTROL ---------- */
    open() {
        const overlay = document.getElementById('shop-modal-overlay');
        const modal = document.getElementById('shop-modal');
        if (!overlay || !modal) return;

        overlay.classList.add('active');
        modal.classList.add('active');
        this.switchTab(this.activeTab);
    }

    close() {
        const overlay = document.getElementById('shop-modal-overlay');
        const modal = document.getElementById('shop-modal');
        if (!overlay || !modal) return;

        overlay.classList.remove('active');
        modal.classList.remove('active');
    }

    switchTab(tabId) {
        const validTabs = new Set(['weather', 'amulets', 'rods', 'baits']);
        this.activeTab = validTabs.has(tabId) ? tabId : 'weather';

        document.querySelectorAll('.shop-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === this.activeTab);
        });

        this.render();
    }

    /* ---------- MAIN RENDER ---------- */
    render() {
        const container = document.getElementById('shop-tab-content');
        if (!container) return;

        switch (this.activeTab) {
            case 'weather':
                this.renderWeather(container);
                break;
            case 'amulets':
                this.renderAmulets(container);
                break;
            case 'rods':
                this.renderRods(container);
                break;
            case 'baits':
                this.renderBaits(container);
                break;
            default:
                this.renderWeather(container);
                break;
        }
    }

    /* ---------- WEATHER TAB ---------- */
    renderWeather(container) {
        if (typeof this.game._removeExpiredPurchasedWeathers === 'function') {
            this.game._removeExpiredPurchasedWeathers({ logExpired: false, persist: false });
        }

        const active = this.game.state.activeWeathers || [];
        const slotsLeft = WEATHER_BUY_LIMIT - active.length;
        const totalLuck = this.game.getWeatherMultiplier();
        const luckPct = Math.round((totalLuck - 1) * 100);

        container.innerHTML = `<h3 class="shop-tab-title">Weather Control</h3>
            <p class="shop-tab-desc">Activate multiple weather effects at once. Active slots: <strong>${active.length}</strong> / ${WEATHER_BUY_LIMIT}. Combined luck: <strong>${luckPct >= 0 ? '+' : ''}${luckPct}%</strong>. Purchased weather lasts <strong>15 minutes</strong>; natural random weather lasts <strong>20 minutes</strong>.</p>`;

        const grid = document.createElement('div');
        grid.className = 'shop-grid';

        WEATHER_SHOP.forEach(item => {
            const weather = WEATHER_DATA[item.weatherKey];
            if (!weather) return;

            const isActive = active.includes(item.weatherKey);
            const full = slotsLeft <= 0;
            const canBuy = !full && this.game.state.coins >= item.cost;

            const div = document.createElement('div');
            div.className = `shop-item ${isActive ? 'shop-item-highlight' : ''}`;
            div.innerHTML = `
                <div class="item-info">
                    <h3>${weather.icon} ${weather.name}${isActive ? ' <span style="font-size:0.75rem;color:#166534;">Active</span>' : ''}</h3>
                    <p class="shop-item-desc">${weather.desc}</p>
                    <p class="shop-item-meta">Luck: x${weather.luck} | Difficulty: x${weather.difficulty_mod}</p>
                </div>
                <div class="item-actions">
                    ${isActive
                    ? `<button class="btn-secondary btn-sm" onclick="GameAPI.shopRemoveWeather('${item.weatherKey}')">Remove</button>`
                    : `<button class="btn-primary btn-sm"
                            ${canBuy ? '' : 'disabled'}
                            onclick="GameAPI.shopBuyWeather('${item.weatherKey}')">
                            ${full ? 'Slots Full' : `Buy ${item.cost.toLocaleString()} Coins`}
                        </button>`
                }
                </div>
            `;
            grid.appendChild(div);
        });

        container.appendChild(grid);
    }

    buyWeather(key) {
        if (typeof this.game._removeExpiredPurchasedWeathers === 'function') {
            this.game._removeExpiredPurchasedWeathers({ logExpired: false, persist: false });
        }

        const item = WEATHER_SHOP.find(w => w.weatherKey === key);
        if (!item) return;

        const active = this.game.state.activeWeathers || [];
        if (active.length >= WEATHER_BUY_LIMIT) {
            this.game.log('All weather slots are full.');
            return;
        }
        if (active.includes(key)) {
            this.game.log('This weather is already active.');
            return;
        }
        if (this.game.state.coins < item.cost) {
            this.game.log('Not enough coins.');
            return;
        }

        this.game.spendCoins(item.cost);
        this.game.addPurchasedWeather(key);

        const remaining = WEATHER_BUY_LIMIT - this.game.state.activeWeathers.length;
        this.game.log(`Activated ${WEATHER_DATA[key].name} for 15 minutes. ${remaining} weather slots remaining.`);
        this.game.achievementManager.onWeatherPurchase();
        this.game.ui.renderStats();
        this.game.saveSystem.save();
        this.render();
    }

    removeWeather(key) {
        this.game.removePurchasedWeather(key);
        this.game.log(`Removed ${WEATHER_DATA[key].name} from active weather effects.`);
        this.game.saveSystem.save();
        this.render();
    }

    /* ---------- AMULETS TAB ---------- */
    renderAmulets(container) {
        const currentBiome = this.game.state.location;
        const activeAmulet = this.game.state.activeAmulet;

        container.innerHTML = `<h3 class="shop-tab-title">Biome Amulets</h3>
            <p class="shop-tab-desc">Amulets boost luck in their matching biome. Wearing one consumes one stock each catch.</p>
            ${activeAmulet
                ? `<div class="amulet-active-badge">Active amulet: ${AMULETS[activeAmulet].icon} ${AMULETS[activeAmulet].name} (+${AMULETS[activeAmulet].luckBonus} Luck in ${LOCATIONS[activeAmulet].name})</div>`
                : '<div class="amulet-active-badge inactive">No amulet is currently worn.</div>'}`;

        const grid = document.createElement('div');
        grid.className = 'shop-grid';

        Object.entries(AMULETS).forEach(([biomeKey, amulet]) => {
            const stock = this.game.state.amuletStock[biomeKey] || 0;
            const isCurrentBiome = biomeKey === currentBiome;
            const isWorn = activeAmulet === biomeKey;

            const div = document.createElement('div');
            div.className = `shop-item ${isCurrentBiome ? 'shop-item-highlight' : ''}`;
            div.innerHTML = `
                <div class="item-info">
                    <h3>${amulet.icon} ${amulet.name}</h3>
                    <p class="shop-item-desc">${amulet.desc}</p>
                    <p class="shop-item-meta">
                        Biome: <strong>${LOCATIONS[biomeKey].name}</strong> |
                        Luck: <strong>+${amulet.luckBonus}</strong> |
                        Stock: <strong>${stock}</strong>
                    </p>
                </div>
                <div class="item-actions">
                    <button class="btn-primary btn-sm"
                        ${this.game.state.coins < amulet.cost ? 'disabled' : ''}
                        onclick="GameAPI.shopBuyAmulet('${biomeKey}')">
                        Buy ${amulet.cost.toLocaleString()}
                    </button>
                    <button class="btn-secondary btn-sm"
                        ${stock <= 0 || isWorn || !isCurrentBiome ? 'disabled' : ''}
                        onclick="GameAPI.shopWearAmulet('${biomeKey}')">
                        ${isWorn ? 'Worn' : !isCurrentBiome ? 'Wrong Biome' : 'Wear'}
                    </button>
                </div>
            `;
            grid.appendChild(div);
        });

        container.appendChild(grid);
    }

    buyAmulet(biomeKey) {
        const amulet = AMULETS[biomeKey];
        if (!amulet) return;

        if (this.game.state.coins < amulet.cost) {
            this.game.log('Not enough coins.');
            return;
        }

        this.game.spendCoins(amulet.cost);
        this.game.state.amuletStock[biomeKey] = (this.game.state.amuletStock[biomeKey] || 0) + 1;

        this.game.log(`Purchased ${amulet.name}. Stock: ${this.game.state.amuletStock[biomeKey]}.`);
        this.game.ui.renderStats();
        this.game.saveSystem.save();
        this.render();
    }

    wearAmulet(biomeKey) {
        const amulet = AMULETS[biomeKey];
        if (!amulet) return;

        const stock = this.game.state.amuletStock[biomeKey] || 0;
        if (stock <= 0) {
            this.game.log('No amulets in stock.');
            return;
        }
        if (biomeKey !== this.game.state.location) {
            this.game.log('This amulet does not match your current biome.');
            return;
        }

        this.game.state.activeAmulet = biomeKey;
        this.game.log(`Wearing ${amulet.name}. +${amulet.luckBonus} Luck in ${LOCATIONS[biomeKey].name}.`);
        this.game.ui.renderStats();
        this.game.saveSystem.save();
        this.render();
    }

    /* ---------- RODS TAB ---------- */
    renderRods(container) {
        container.innerHTML = '<h3 class="shop-tab-title">Rod Shop</h3><p class="shop-tab-desc">Upgrade your rod for higher capacity, better luck, and faster reels.</p>';

        const grid = document.createElement('div');
        grid.className = 'shop-grid';

        RODS.forEach(rod => {
            const owned = this.game.state.rodsOwned.includes(rod.id);
            const equipped = this.game.state.rod === rod.id;
            const btnText = equipped ? 'Equipped' : owned ? 'Equip' : `Buy ${rod.cost.toLocaleString()}`;

            const div = document.createElement('div');
            div.className = 'shop-item';
            div.innerHTML = `
                <div class="item-info">
                    <h3>${rod.name}</h3>
                    <p class="shop-item-meta">Capacity: ${rod.capacity}kg | Luck: +${rod.luck} | Speed: ${rod.speed}</p>
                </div>
                <div class="item-actions">
                    <button class="${equipped ? 'btn-secondary' : 'btn-primary'} btn-sm"
                        ${equipped || (!owned && this.game.state.coins < rod.cost) ? 'disabled' : ''}
                        onclick="GameAPI.shopBuyRod('${rod.id}')">
                        ${btnText}
                    </button>
                </div>
            `;
            grid.appendChild(div);
        });

        container.appendChild(grid);
    }

    buyRod(id) {
        const item = RODS.find(r => r.id === id);
        if (!item) return;

        if (this.game.state.rodsOwned.includes(id)) {
            this.game.state.rod = id;
            this.game.log(`Equipped ${item.name}.`);
        } else if (this.game.state.coins >= item.cost) {
            this.game.spendCoins(item.cost);
            this.game.state.rodsOwned.push(id);
            this.game.state.rod = id;
            this.game.log(`Purchased ${item.name}.`);
            this.game.achievementManager.onPurchase('rod', id);
        } else {
            this.game.log('Not enough coins.');
            return;
        }

        this.game.ui.renderAll();
        this.game.saveSystem.save();
        this.render();
    }

    /* ---------- BAITS TAB ---------- */
    renderBaits(container) {
        container.innerHTML = '<h3 class="shop-tab-title">Bait Shop</h3><p class="shop-tab-desc">Stronger bait increases your luck when rolling rarity.</p>';

        const grid = document.createElement('div');
        grid.className = 'shop-grid';

        BAITS.forEach(bait => {
            const owned = this.game.state.baitsOwned.includes(bait.id);
            const equipped = this.game.state.bait === bait.id;
            const btnText = equipped ? 'Active' : owned ? 'Equip' : `Buy ${bait.cost.toLocaleString()}`;

            const div = document.createElement('div');
            div.className = 'shop-item';
            div.innerHTML = `
                <div class="item-info">
                    <h3>${bait.name}</h3>
                    <p class="shop-item-meta">Luck Bonus: +${bait.luck}</p>
                </div>
                <div class="item-actions">
                    <button class="${equipped ? 'btn-secondary' : 'btn-primary'} btn-sm"
                        ${equipped || (!owned && this.game.state.coins < bait.cost) ? 'disabled' : ''}
                        onclick="GameAPI.shopBuyBait('${bait.id}')">
                        ${btnText}
                    </button>
                </div>
            `;
            grid.appendChild(div);
        });

        container.appendChild(grid);
    }

    buyBait(id) {
        const item = BAITS.find(b => b.id === id);
        if (!item) return;

        if (this.game.state.baitsOwned.includes(id)) {
            this.game.state.bait = id;
            this.game.log(`Using ${item.name}.`);
        } else if (this.game.state.coins >= item.cost) {
            this.game.spendCoins(item.cost);
            this.game.state.baitsOwned.push(id);
            this.game.state.bait = id;
            this.game.log(`Purchased ${item.name}.`);
            this.game.achievementManager.onPurchase('bait', id);
        } else {
            this.game.log('Not enough coins.');
            return;
        }

        this.game.ui.renderAll();
        this.game.saveSystem.save();
        this.render();
    }
}

