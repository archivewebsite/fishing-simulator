/**
 * INVENTORY SYSTEM
 * Manages the catch log table rendering and selling fish.
 */

class Inventory {
    constructor(game) { this.game = game; }

    render() {
        const tableBody = document.querySelector('#inventory-table tbody');
        const inventory = this.game.state.inventory;
        const currentRows = tableBody.children.length;

        // Optimization: If inventory is empty, clear table immediately
        if (inventory.length === 0) {
            tableBody.innerHTML = '';
            return;
        }

        // Optimization: Differential Update
        if (inventory.length > currentRows) {
            const newCount = inventory.length - currentRows;
            const newItems = inventory.slice(-newCount);

            newItems.forEach(item => {
                tableBody.prepend(this.createRow(item));
            });
            return;
        }

        // Fallback: Full Re-render
        tableBody.innerHTML = '';
        [...inventory].reverse().forEach(item => {
            tableBody.appendChild(this.createRow(item));
        });
    }

    createRow(item) {
        const tr = document.createElement('tr');
        const rarityColor = RARITY[item.rarity].color;
        const buffHtml = item.buff
            ? `<span style="font-size:0.75rem; background:${rarityColor}33; color:${rarityColor}; padding:2px 6px; border-radius:4px; margin-left:0.5rem;">${item.buff}</span>`
            : '';

        // Variant badge (Golden/Shadow/Prismatic)
        let variantHtml = '';
        if (item.variant) {
            const vColor = item.variant.label === 'Prismatic' ? '#e879f9' :
                item.variant.label === 'Shadow' ? '#6366f1' : '#facc15';
            variantHtml = `<span class="variant-tag" style="background:${vColor}22; color:${vColor}; font-size:0.7rem; padding:1px 5px; border-radius:4px; margin-left:0.35rem; font-weight:700;">${item.variant.icon} ${item.variant.label}</span>`;
        }

        tr.innerHTML = `
            <td>
                <span style="color:${rarityColor}; font-weight:600">${item.name}</span>
                ${variantHtml}${buffHtml}
            </td>
            <td><span class="rarity-tag" style="background:${rarityColor}22; color:${rarityColor}">${item.rarity}</span></td>
            <td>${item.weight} kg</td>
            <td style="color:#facc15; font-weight:600">${item.value.toLocaleString()}</td>
        `;
        return tr;
    }

    sellAll() {
        if (this.game.state.inventory.length === 0) return;

        let total = 0;
        this.game.state.inventory.forEach(i => total += i.value);
        this.game.addCoins(total);

        const count = this.game.state.inventory.length;
        this.game.state.inventory = [];

        this.game.log(`Sold ${count} fish for ${total} coins.`);
        this.game.achievementManager.onCoinsChange();
        this.game.ui.renderAll();
        this.game.saveSystem.save();
    }
}

