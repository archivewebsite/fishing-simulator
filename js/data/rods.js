/**
 * ROD DEFINITIONS
 * All fishing rods with their stats: cost, luck bonus, weight capacity, and speed.
 */

const RODS = [
    { id: 'bamboo', name: 'Bamboo Pole', cost: 0, luck: 2, capacity: 15, speed: 5 },
    { id: 'fiberglass', name: 'Fiberglass Rod', cost: 450, luck: 12, capacity: 35, speed: 10 },
    { id: 'graphite', name: 'Graphite Precision', cost: 2500, luck: 18, capacity: 60, speed: 15 },
    { id: 'carbon', name: 'Carbon Striker', cost: 2500, luck: 30, capacity: 100, speed: 20 },
    { id: 'alloy', name: 'Titanium Alloy', cost: 8000, luck: 45, capacity: 200, speed: 30 },
    { id: 'neofiber', name: 'Nano-Weave Pro', cost: 50000, luck: 65, capacity: 400, speed: 35 },
    { id: 'quantum', name: 'Quantum Weaver', cost: 25000, luck: 80, capacity: 600, speed: 40 },
    { id: 'starcaller', name: 'Starcaller', cost: 75000, luck: 150, capacity: 2000, speed: 50 },
    { id: 'void', name: 'Void Walker', cost: 250000, luck: 300, capacity: 10000, speed: 60 },
    { id: 'aether', name: 'Aether-Caster', cost: 2500000, luck: 200, capacity: 5000, speed: 55 },
    { id: 'chronos', name: 'Chrono-Spinner', cost: 25000000, luck: 450, capacity: 25000, speed: 70 },
    { id: 'omniverse', name: 'Omni-Verse Rod', cost: 500000000, luck: 800, capacity: 100000, speed: 90 }
];

// Re-sorting rods by cost to ensure logical progression in UI
RODS.sort((a, b) => a.cost - b.cost);
// Freeze static data to prevent console exploits
RODS.forEach(rod => Object.freeze(rod));
Object.freeze(RODS);
