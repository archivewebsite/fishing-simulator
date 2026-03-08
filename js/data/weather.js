/**
 * WEATHER DATA
 * All weather types with their effects on luck, buffs, difficulty, and probability.
 * Also includes the deepFreeze utility used across data files.
 */

// Deep freeze utility for nested objects
const deepFreeze = obj => {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) deepFreeze(obj[key]);
    });
    return Object.freeze(obj);
};

const WEATHER_DATA = {
    // Legacy Weather Types
    clear: { name: 'Clear Skies', icon: '☀️', luck: 1.0, buff: null, buffChance: 0, valBonus: 0, difficulty_mod: 1.0, probability: 0.25, desc: "Standard fishing conditions." },
    rain: { name: 'Light Rain', icon: '🌧️', luck: 1.1, buff: 'Soaked', buffChance: 0.4, valBonus: 0.1, difficulty_mod: 0.95, probability: 0.12, desc: "+10% Luck. Fish may be Soaked (+10% Value)." },
    storm: { name: 'Thunderstorm', icon: '⛈️', luck: 1.25, buff: 'Stormcharged', buffChance: 0.3, valBonus: 0.3, difficulty_mod: 1.2, probability: 0.08, desc: "+25% Luck. Fish may be Stormcharged (+30% Value)." },
    fog: { name: 'Dense Fog', icon: '🌫️', luck: 1.15, buff: 'Mystified', buffChance: 0.35, valBonus: 0.15, difficulty_mod: 0.9, probability: 0.1, desc: "+15% Luck. Fish may be Mystified (+15% Value)." },
    heatwave: { name: 'Heatwave', icon: '🔥', luck: 1.05, buff: 'Sun-Kissed', buffChance: 0.25, valBonus: 0.2, difficulty_mod: 1.1, probability: 0.08, desc: "+5% Luck. Fish may be Sun-Kissed (+20% Value)." },
    gale: { name: 'Gale Force', icon: '🌬️', luck: 1.2, buff: 'Wind-Swept', buffChance: 0.5, valBonus: 0.15, difficulty_mod: 1.15, probability: 0.1, desc: "+20% Luck. Fish may be Wind-Swept (+15% Value)." },
    // Exotic Weather Types
    locust_plague: { name: 'Locust Plague', icon: '🦗', luck: 1.4, buff: 'Engorged', buffChance: 0.8, valBonus: 0.1, difficulty_mod: 0.9, probability: 0.05, desc: "A swarm of insects hits the water. +40% Luck due to feeding frenzy. Fish are 'Engorged' (+10% Value)." },
    silica_storm: { name: 'Silica Storm', icon: '🏜️', luck: 1.05, buff: 'Polished', buffChance: 0.5, valBonus: 0.35, difficulty_mod: 1.3, probability: 0.06, desc: "Abrasive sands scour the scales. +5% Luck. Fish may be 'Polished' (+35% Value) but are harder to catch." },
    sakura_drift: { name: 'Sakura Drift', icon: '🌸', luck: 1.3, buff: 'Decorated', buffChance: 0.6, valBonus: 0.2, difficulty_mod: 0.7, probability: 0.08, desc: "Pink petals calm the waters. +30% Luck. Fish are calmer (slower minigame) and 'Decorated' (+20% Value)." },
    flash_blizzard: { name: 'Flash Blizzard', icon: '❄️', luck: 0.8, buff: 'Cryo-Preserved', buffChance: 1.0, valBonus: 0.6, difficulty_mod: 1.5, probability: 0.03, desc: "-20% Luck (Lines freeze). However, 100% chance for fish to be 'Cryo-Preserved' (+60% Value)." },
    acid_downpour: { name: 'Acid Downpour', icon: '🧪', luck: 0.9, buff: 'Mutated', buffChance: 0.3, valBonus: 1.5, difficulty_mod: 1.2, probability: 0.02, desc: "Corrosive rain burns gear (-10% Luck). Small chance for 'Mutated' fish (+150% Value)." },
    spore_bloom: { name: 'Spore Bloom', icon: '🍄', luck: 1.15, buff: 'Symbiotic', buffChance: 0.45, valBonus: 0.25, difficulty_mod: 1.1, probability: 0.05, desc: "Fungal clouds drift over the water. +15% Luck. Fish may become 'Symbiotic' (+25% Value)." },
    tectonic_shift: { name: 'Tectonic Shift', icon: '🌋', luck: 1.5, buff: 'Agitated', buffChance: 0.2, valBonus: 0.15, difficulty_mod: 1.4, probability: 0.04, desc: "Earthquakes startle bottom-feeders. +50% Luck (Massive bite rate) but fish are erratic and 'Agitated'." },
    // Additional Weather
    golden_hour: { name: 'Golden Hour', icon: '🌅', luck: 1.5, buff: 'Gilded', buffChance: 0.5, valBonus: 0.5, difficulty_mod: 1.2, probability: 0.05, desc: "The sun hits the water just right. +50% Luck. Fish shimmer with 'Gilded' scales (+50% Value), but are faster to flee." },
    crimson_tide: { name: 'Crimson Tide', icon: '🩸', luck: 1.3, buff: 'Frenzied', buffChance: 0.3, valBonus: 0.25, difficulty_mod: 1.6, probability: 0.08, desc: "A red algal bloom spreads. +30% Luck. Fish are aggressive and 'Frenzied' (+25% Value), making the minigame very fast." },
    ashfall: { name: 'Ashfall', icon: '🌋', luck: 0.9, buff: 'Obsidian-Clad', buffChance: 0.4, valBonus: 0.4, difficulty_mod: 0.8, probability: 0.06, desc: "Volcanic grit fills the air. -10% Luck (Gills clogged). Fish are sluggish (easier catch) and 'Obsidian-Clad' (+40% Value)." },
    diamond_dust: { name: 'Diamond Dust', icon: '✨', luck: 1.1, buff: 'Crystallized', buffChance: 0.7, valBonus: 0.15, difficulty_mod: 1.1, probability: 0.1, desc: "Suspended ice crystals refract light. +10% Luck. High chance for 'Crystallized' fish (+15% Value) due to extreme cold." },
    monsoon: { name: 'Monsoon', icon: '🌊', luck: 1.25, buff: 'Torrential', buffChance: 0.2, valBonus: 0.3, difficulty_mod: 1.4, probability: 0.07, desc: "Relentless tropical rain. +25% Luck. Massive fish surface to feed, becoming 'Torrential' (+30% Value) but fighting hard." },
    autumn_drift: { name: 'Autumn Drift', icon: '🍂', luck: 1.2, buff: 'Harvest-Ready', buffChance: 0.5, valBonus: 0.2, difficulty_mod: 0.9, probability: 0.15, desc: "Orange leaves blanket the surface. +20% Luck. Fish mistake leaves for food; they are 'Harvest-Ready' (+20% Value) and calm." },
    swamp_haze: { name: 'Swamp Haze', icon: '🐊', luck: 1.0, buff: 'Ancient', buffChance: 0.1, valBonus: 2.0, difficulty_mod: 1.3, probability: 0.04, desc: "A thick, humid vapor rises. Neutral Luck. Very rare chance to find 'Ancient' fish variants that sell for triple value (+200%)." },

    // User-requested Weather Types
    frozen: {
        name: 'Deep Freeze',
        icon: '🥶',
        luck: 1.5,
        buff: 'Cryogenic',
        buffChance: 1.0,
        valBonus: 0.8,
        difficulty_mod: 1.8,
        probability: 0.04,
        desc: "Temperatures approach absolute zero. Lines get stiff, but fish are perfectly preserved ('Cryogenic' +80% Value)."
    },
    disco: {
        name: 'Disco Fever',
        icon: '🪩',
        luck: 2.5,
        buff: 'Funky',
        buffChance: 0.5,
        valBonus: 0.5,
        difficulty_mod: 1.4,
        probability: 0.02,
        desc: "Colorful lights reflect on the water. Fish swarm toward the party glow, increasing rare variant potential."
    },
    bloodlit: {
        name: 'Blood Moon',
        icon: '🩸',
        luck: 1.8,
        buff: 'Cursed',
        buffChance: 0.6,
        valBonus: 0.66,
        difficulty_mod: 1.6,
        probability: 0.05,
        desc: "A crimson moon awakens ancient predators. Fish may become 'Cursed' (+66% Value) and fight aggressively."
    },
    galactic: {
        name: 'Galactic Alignment',
        icon: '🌌',
        luck: 3.5,
        buff: 'Cosmic',
        buffChance: 0.8,
        valBonus: 1.2,
        difficulty_mod: 1.1,
        probability: 0.01,
        desc: "The water reflects the entire galaxy. 'Cosmic' fish with extreme value rise to the surface."
    },
    radioactive: {
        name: 'Radioactive Fallout',
        icon: '☢️',
        luck: 2.0,
        buff: 'Mutated',
        buffChance: 0.9,
        valBonus: 1.5,
        difficulty_mod: 2.0,
        probability: 0.03,
        desc: "Radiation warnings spread across the biome. Fish can mutate ('Mutated' +150% Value) but become much harder to catch."
    },
    spaghetti: {
        name: 'Meatball Shower',
        icon: '🍝',
        luck: 1.2,
        buff: 'Saucy',
        buffChance: 0.4,
        valBonus: 0.4,
        difficulty_mod: 1.5,
        probability: 0.05,
        desc: "A rain of pasta oils the surface. Your line tangles more easily, but fish gain rich 'Saucy' value."
    },
    eclipsed: {
        name: 'Total Eclipse',
        icon: '🌑',
        luck: 1.6,
        buff: 'Umbral',
        buffChance: 0.5,
        valBonus: 0.7,
        difficulty_mod: 0.9,
        probability: 0.06,
        desc: "Day turns to night. Shadow creatures marked as 'Umbral' rise from the depths while light fades."
    },
    brainrot: {
        name: 'Meme Singularity',
        icon: '🥴',
        luck: 2.2,
        buff: 'Meme-Touched',
        buffChance: 0.69,
        valBonus: 1.0,
        difficulty_mod: 2.5,
        probability: 0.02,
        desc: "Reality collapses into absurd memes. Catch rates surge, but the minigame becomes highly unstable."
    },
    maelstrom: {
        name: 'Grand Maelstrom',
        icon: '🌪️',
        luck: 3.0,
        buff: 'Abyssal',
        buffChance: 0.75,
        valBonus: 1.0,
        difficulty_mod: 3.0,
        probability: 0.01,
        desc: "A giant vortex forms. Only skilled anglers can hold steady, but the rewards are massive."
    },
    golden: {
        name: 'Midas Touch',
        icon: '🏆',
        luck: 1.3,
        buff: 'Gilded',
        buffChance: 1.0,
        valBonus: 3.0,
        difficulty_mod: 1.0,
        probability: 0.03,
        desc: "Everything touched by water turns to gold. Fish are guaranteed 'Gilded' with triple sale value."
    }
};

// Freeze weather data to prevent console exploits
deepFreeze(WEATHER_DATA);

