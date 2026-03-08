/**
 * RARITY DEFINITIONS
 * Defines all fish rarity tiers with their colors, weights, multipliers, XP, and difficulty.
 */

const RARITY = {
    common: { name: "Common", color: "#94a3b8", weight: 42, mult: 4, xp: 75, difficulty: 0.8 },
    uncommon: { name: "Uncommon", color: "#4ade80", weight: 24, mult: 9, xp: 150, difficulty: 0.6 },
    rare: { name: "Rare", color: "#6dd6ff", weight: 15, mult: 25, xp: 350, difficulty: 0.45 },
    epic: { name: "Epic", color: "#a78bfa", weight: 10, mult: 45, xp: 800, difficulty: 0.3 },
    legendary: { name: "Legendary", color: "#fb7185", weight: 6, mult: 110, xp: 2000, difficulty: 0.2 },
    mythic: { name: "Mythic", color: "#facc15", weight: 3, mult: 260, xp: 5000, difficulty: 0.12 }
};

// Freeze rarity data to prevent console exploits
Object.values(RARITY).forEach(r => Object.freeze(r));
Object.freeze(RARITY);
