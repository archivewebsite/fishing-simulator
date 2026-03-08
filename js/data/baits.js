/**
 * BAIT DEFINITIONS
 * All bait types with their cost and luck bonus.
 */

const BAITS = [
    { id: 'worm', name: 'Worm', cost: 0, luck: 1 },
    { id: 'cricket', name: 'Cricket', cost: 150, luck: 7 },
    { id: 'glow_grub', name: 'Biolume Grub', cost: 800, luck: 10 },
    { id: 'minnow', name: 'Live Minnow', cost: 3000, luck: 18 },
    { id: 'flux_jelly', name: 'Flux Jelly', cost: 5000, luck: 25 },
    { id: 'spinner', name: 'Neon Spinner', cost: 5000, luck: 30 },
    { id: 'magic', name: 'Magic Paste', cost: 20000, luck: 60 },
    { id: 'void_shrimp', name: 'Abyssal Shrimp', cost: 25000, luck: 50 },
    { id: 'void_essence', name: 'Void Essence', cost: 50000, luck: 120 },
    { id: 'star_dust', name: 'Stardust Cluster', cost: 200000, luck: 90 },
    { id: 'singularity', name: 'Singularity Lure', cost: 2000000, luck: 200 }
];

// Re-sorting baits by cost
BAITS.sort((a, b) => a.cost - b.cost);
// Freeze static data to prevent console exploits
BAITS.forEach(bait => Object.freeze(bait));
Object.freeze(BAITS);
