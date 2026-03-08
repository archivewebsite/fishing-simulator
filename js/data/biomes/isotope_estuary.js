/**
 * ISOTOPE ESTUARY — Fish Data (Extended 20-Tier Ecosystem)
 * Theme: Radiation, radioactive decay, nuclear waste, Cherenkov radiation.
 * Color Palette: ["#ccff00", "#111111"]
 * Format: ['Name', minWeight, maxWeight, randomBasePrice]
 */

const FISH_ISOTOPE_ESTUARY = {
    // 01 COMMON - Ada di mana-mana, gampang ditemukan
    common: [
        ['Sludge Guppy', 0.1, 0.5, 5],
        ['Rad-Minnow', 0.2, 0.8, 8],
        ['Toxic Sprat', 0.1, 0.6, 6],
        ['Slag Roach', 0.3, 1.0, 10],
        ['Isotope Fry', 0.5, 1.5, 12],
        ['Neon Tetra', 0.4, 1.2, 15],
        ['Scum Sucker', 0.2, 0.9, 9],
        ['Rad-Goby', 0.1, 0.4, 4],
        ['Glowing Loach', 0.3, 0.7, 7],
        ['Decay Darter', 0.1, 0.3, 5],
        ['Ash-Flounder', 0.4, 1.1, 11],
        ['Sump Carp', 0.2, 0.8, 8],
        ['Slime Eel', 0.1, 0.5, 5],
        ['Waste-Bass', 0.3, 1.2, 14],
        ['Core-Guppy', 0.4, 1.4, 16]
    ],

    // 02 UNCOMMON - Perlu usaha, tapi masih realistis
    uncommon: [
        ['Uranium Trout', 1.5, 4.0, 45],
        ['Cobalt Crab', 2.0, 5.0, 50],
        ['Strontium Snapper', 3.0, 8.0, 75],
        ['Bismuth Bream', 2.5, 6.0, 60],
        ['Radon Ray', 1.0, 3.5, 30],
        ['Fission Frogfish', 0.8, 2.5, 25],
        ['Gamma Gar', 1.2, 4.5, 40],
        ['Tritium Tilapia', 3.5, 9.0, 85],
        ['Plutonium Prawn', 4.0, 11.0, 110],
        ['Cesium Catfish', 2.5, 7.0, 65],
        ['Thorium Tetra', 1.5, 4.0, 45],
        ['Polonium Perch', 0.5, 2.0, 20],
        ['Radium Rasbora', 3.0, 8.5, 80],
        ['Reactor Roach', 2.0, 5.5, 55],
        ['Halflife Herring', 4.5, 12.0, 120]
    ],

    // 03 RARE - Butuh keberuntungan untuk dapat
    rare: [
        ['Meltdown Mackerel', 15.0, 40.0, 350],
        ['Cherenkov Cichlid', 10.0, 25.0, 250],
        ['Heavy-Water Halibut', 20.0, 55.0, 450],
        ['Isotope Angler', 18.0, 48.0, 400],
        ['Fallout Fluke', 12.0, 35.0, 300],
        ['Mutated Mullet', 25.0, 60.0, 500],
        ['Atomic Arapaima', 30.0, 75.0, 650],
        ['Nucleus Needlefish', 15.0, 38.0, 320],
        ['Alpha-Particle Pike', 14.0, 36.0, 310],
        ['Beta-Ray Bass', 40.0, 100.0, 850],
        ['Ionized Oscar', 8.0, 20.0, 180],
        ['Plasma Puffer', 16.0, 42.0, 380],
        ['Neutron-Star Newt', 10.0, 28.0, 260],
        ['Contraband Cod', 5.0, 15.0, 150],
        ['Sievert Shark', 22.0, 50.0, 420]
    ],

    // 04 EPIC - Masuk cerita, dikenang orang banyak
    epic: [
        ['Corium Carp', 150.0, 350.0, 2500],
        ['Criticality Crab', 200.0, 450.0, 3200],
        ['Fission-Core Flounder', 120.0, 280.0, 1800],
        ['Ground-Zero Grouper', 140.0, 320.0, 2100],
        ['Atomic-Blast Barracuda', 160.0, 380.0, 2400],
        ['Mega-Rad Marlin', 180.0, 420.0, 2900],
        ['Fusion Fangtooth', 100.0, 250.0, 1500],
        ['Dosimeter Dolphin-Fish', 150.0, 340.0, 2200],
        ['Roentgen Ray', 80.0, 200.0, 1200],
        ['Glowing Goliath', 220.0, 500.0, 3800],
        ['The Toxic Titan', 250.0, 600.0, 4500],
        ['Scavenger Shark', 180.0, 400.0, 2700],
        ['Mutant Megalodon', 110.0, 260.0, 1600],
        ['Radiant Ribbonfish', 130.0, 300.0, 1900],
        ['Wasteland Wahoo', 280.0, 650.0, 5000]
    ],

    // 05 LEGENDARY - Jadi legenda, melampaui zaman
    legendary: [
        ['Chernobyl Char', 800.0, 1800.0, 15000],
        ['Fukushima Fluke', 600.0, 1400.0, 11000],
        ['Trinity Tarpon', 1000.0, 2500.0, 22000],
        ['Tsar Bomba Bass', 700.0, 1600.0, 13000],
        ['Demon-Core Dorado', 900.0, 2000.0, 18000],
        ['Elephant-Foot Eel', 500.0, 1200.0, 9000],
        ['Atomic Leviathan', 1100.0, 2600.0, 24000],
        ['Nuclear Nautilus', 650.0, 1500.0, 12000],
        ['Doomsday Drum', 850.0, 1900.0, 16000],
        ['Mutagenic Monster', 1200.0, 2800.0, 26000],
        ['The Glowing Behemoth', 750.0, 1700.0, 14000],
        ['Apex Isotope', 550.0, 1300.0, 10000],
        ['Core-Meltdown Kraken', 680.0, 1550.0, 12500],
        ['Radiant Rex', 450.0, 1100.0, 8000],
        ['Splitting-Atom Sturgeon', 1500.0, 3500.0, 35000]
    ],

    // 06 LIMINAL - Berdiri di ambang batas dua dunia
    liminal: [
        ['Phase-Shift Snapper', 3000.0, 6000.0, 85000],
        ['Schrödinger\'s Sardine', 2500.0, 5000.0, 70000],
        ['The Blinking Bream', 2800.0, 5500.0, 78000],
        ['Quantum-Fluctuation Fish', 3200.0, 6500.0, 92000],
        ['Half-Life Haunt', 2000.0, 4500.0, 60000],
        ['The Unstable Entity', 3500.0, 7000.0, 105000],
        ['Ecto-Rad Eel', 4000.0, 8000.0, 120000],
        ['Transient Trout', 3800.0, 7500.0, 110000],
        ['The Fading Isotope', 2700.0, 5200.0, 75000],
        ['Between-States Bass', 4500.0, 9000.0, 140000],
        ['The Flickering Phage', 2200.0, 4800.0, 65000],
        ['Dimensional Darter', 3100.0, 6200.0, 88000],
        ['The Spectral Spark', 2600.0, 5100.0, 72000],
        ['Ghost-Particle Guppy', 3300.0, 6700.0, 95000],
        ['Uncertainty Ur-Fish', 5000.0, 10000.0, 160000]
    ],

    // 07 MYTHIC - Sudah bukan sejarah, ini mitologi
    mythic: [
        ['The Atomic Chimera', 12000.0, 25000.0, 450000],
        ['Rad-Wraith Ray', 15000.0, 30000.0, 550000],
        ['Core-Born Cerberus', 18000.0, 35000.0, 650000],
        ['The Radioactive Roc', 25000.0, 50000.0, 950000],
        ['Hydra of the Wastes', 14000.0, 28000.0, 500000],
        ['Wasteland Wyrm', 16000.0, 32000.0, 580000],
        ['Mutation Matrix', 22000.0, 45000.0, 820000],
        ['The Emerald Emperor', 11000.0, 22000.0, 380000],
        ['Reactor-Bred Basilisk', 13000.0, 26000.0, 460000],
        ['Nuclear Nymph', 17000.0, 34000.0, 620000],
        ['Isotope Ifrit', 19000.0, 38000.0, 700000],
        ['Toxic Thunderbird', 21000.0, 42000.0, 780000],
        ['Radiance Reaver', 12500.0, 24000.0, 420000],
        ['The Alpha Ouroboros', 14500.0, 29000.0, 520000],
        ['Behemoth of the Bay', 10000.0, 20000.0, 350000]
    ],

    // 08 ASCENDANT - Melampaui batasnya sendiri
    ascendant: [
        ['The Evolving Alpha', 50000.0, 120000.0, 2500000],
        ['Apex Atom', 65000.0, 150000.0, 3200000],
        ['Transcendent Tritium', 80000.0, 180000.0, 4000000],
        ['The Surging Strontium', 55000.0, 130000.0, 2700000],
        ['Overcharged Orca', 45000.0, 100000.0, 2100000],
        ['Limit-Breaker Loach', 70000.0, 160000.0, 3500000],
        ['The Ascending Anomaly', 90000.0, 200000.0, 4500000],
        ['Peak-Radiation Pike', 60000.0, 140000.0, 2900000],
        ['The Escalating Eel', 100000.0, 220000.0, 5000000],
        ['Upward-Fission Fish', 120000.0, 250000.0, 6000000],
        ['Beyond-Base Bismuth', 48000.0, 110000.0, 2300000],
        ['The Culminating Core', 75000.0, 170000.0, 3700000],
        ['Hyper-Mutated Halibut', 85000.0, 190000.0, 4200000],
        ['Zenith Zirconium', 110000.0, 240000.0, 5500000],
        ['The Crowned Contaminant', 150000.0, 300000.0, 7500000]
    ],

    // 09 CELESTIAL - Skala surga dan bintang
    celestial: [
        ['Solar Flare Salmon', 350000.0, 800000.0, 18000000],
        ['Cosmic Ray Carp', 500000.0, 1200000.0, 28000000],
        ['Pulsar Predator', 400000.0, 950000.0, 22000000],
        ['Supernova Shark', 600000.0, 1400000.0, 35000000],
        ['Gamma-Burst Grouper', 800000.0, 1800000.0, 45000000],
        ['Quasar Coelacanth', 450000.0, 1000000.0, 25000000],
        ['Stellar-Wind Sturgeon', 550000.0, 1250000.0, 31000000],
        ['Nebula Nucleus', 300000.0, 700000.0, 15000000],
        ['Astro-Rad Angler', 250000.0, 600000.0, 12000000],
        ['Galactic Glow-Fish', 380000.0, 850000.0, 20000000],
        ['Meteorite Minnow', 650000.0, 1500000.0, 38000000],
        ['Orbiting Oscar', 900000.0, 2000000.0, 55000000],
        ['Void-Radiation Ray', 420000.0, 980000.0, 23000000],
        ['The Sun-Spot Snapper', 700000.0, 1600000.0, 40000000],
        ['Celestial Core-Fish', 480000.0, 1100000.0, 26000000]
    ],

    // 10 ELDRITCH - Kuno, meretakkan realitas
    eldritch: [
        ['The Ancient Isotope', 2500000.0, 6000000.0, 150000000],
        ['Abyssal Core-Spawn', 3000000.0, 7500000.0, 180000000],
        ['Rad-Tainted Terror', 8000000.0, 20000000.0, 500000000],
        ['The Mutated Old One', 2000000.0, 5000000.0, 120000000],
        ['Tentacled Tritium', 4500000.0, 11000000.0, 280000000],
        ['Deep-Sea Decay', 3500000.0, 8500000.0, 210000000],
        ['The Whispering Waste', 6000000.0, 15000000.0, 380000000],
        ['Shoggoth Sturgeon', 2800000.0, 6800000.0, 160000000],
        ['Eldritch Emitter', 9500000.0, 25000000.0, 650000000],
        ['Cthulhu\'s Core', 7000000.0, 18000000.0, 450000000],
        ['The Crawling Contagion', 3200000.0, 7800000.0, 190000000],
        ['Unnamable Uranium', 4000000.0, 9500000.0, 240000000],
        ['Void-Warped Viperfish', 5500000.0, 13000000.0, 340000000],
        ['Madness Mutation', 6500000.0, 16000000.0, 410000000],
        ['The Radioactive Ruin', 8500000.0, 22000000.0, 550000000]
    ],

    // 11 ETERNAL - Berada di luar konsep waktu
    eternal: [
        ['The Infinite Half-Life', 30000000.0, 70000000.0, 1800000000],
        ['Undying Rad-Beast', 25000000.0, 60000000.0, 1500000000],
        ['Ever-Glowing Eel', 40000000.0, 90000000.0, 2400000000],
        ['The Ceaseless Core', 35000000.0, 80000000.0, 2100000000],
        ['Immortal Isotope', 45000000.0, 100000000.0, 2700000000],
        ['Unfading Fission', 50000000.0, 120000000.0, 3200000000],
        ['The Endless Emitter', 28000000.0, 65000000.0, 1600000000],
        ['Perpetuity Pike', 32000000.0, 75000000.0, 1900000000],
        ['Time-Locked Tetra', 55000000.0, 130000000.0, 3500000000],
        ['Boundless Bismuth', 60000000.0, 150000000.0, 4000000000],
        ['The Forever Fallout', 38000000.0, 95000000.0, 2300000000],
        ['Never-Dying Nucleon', 42000000.0, 105000000.0, 2600000000],
        ['Epoch Emitter', 70000000.0, 180000000.0, 4800000000],
        ['The Eternal Emerald', 48000000.0, 115000000.0, 2900000000],
        ['Eon\'s Energy', 80000000.0, 200000000.0, 5500000000]
    ],

    // 12 DIVINE - Setara dewa, melampaui logika manusia
    divine: [
        ['Atom\'s Avatar', 250000000.0, 600000000.0, 15000000000],
        ['The Nuclear Seraph', 350000000.0, 850000000.0, 22000000000],
        ['Fission Deity', 180000000.0, 450000000.0, 11000000000],
        ['The Sacred Strontium', 200000000.0, 500000000.0, 13000000000],
        ['Hallowed Half-Life', 400000000.0, 950000000.0, 25000000000],
        ['Consecrated Core', 220000000.0, 550000000.0, 14000000000],
        ['The Divine Decay', 280000000.0, 680000000.0, 17000000000],
        ['Venerated Valence', 320000000.0, 780000000.0, 20000000000],
        ['Exalted Electron', 450000000.0, 1100000000.0, 28000000000],
        ['The Holy Halo', 300000000.0, 720000000.0, 19000000000],
        ['Archangel of Atoms', 260000000.0, 640000000.0, 16000000000],
        ['God-Particle Grouper', 500000000.0, 1200000000.0, 32000000000],
        ['The Sanctified Spark', 380000000.0, 900000000.0, 24000000000],
        ['Omnipotent Oscillator', 420000000.0, 1000000000.0, 26000000000],
        ['Creator\'s Core', 600000000.0, 1500000000.0, 40000000000]
    ],

    // 13 COSMIC - Skala alam semesta penuh
    cosmic: [
        ['Macrocosm Mutagen', 2000000000.0, 5000000000.0, 120000000000],
        ['Universal Uranium', 3500000000.0, 8000000000.0, 220000000000],
        ['Multiverse Meltdown', 5000000000.0, 12000000000.0, 320000000000],
        ['Omniverse Oscillator', 8000000000.0, 20000000000.0, 550000000000],
        ['The Galaxy-Devouring Core', 4500000000.0, 11000000000.0, 280000000000],
        ['Infinity Isotope', 6000000000.0, 15000000000.0, 380000000000],
        ['All-Encompassing Atom', 2500000000.0, 6500000000.0, 160000000000],
        ['Cosmic-Scale Contaminant', 3000000000.0, 7500000000.0, 190000000000],
        ['The Planetary Plutonium', 1500000000.0, 4000000000.0, 95000000000],
        ['Void-Walker Valence', 4000000000.0, 9500000000.0, 250000000000],
        ['The Space-Time Strontium', 5500000000.0, 13000000000.0, 350000000000],
        ['Event-Horizon Emitter', 7000000000.0, 18000000000.0, 450000000000],
        ['The Big-Bang Bismuth', 9500000000.0, 25000000000.0, 680000000000],
        ['Celestial-Sphere Core', 2800000000.0, 7000000000.0, 180000000000],
        ['The Cosmos Contagion', 3200000000.0, 8500000000.0, 210000000000]
    ],

    // 14 PRIMORDIAL - Mendahului waktu dan ruang
    primordial: [
        ['The First Fission', 25000000000.0, 60000000000.0, 1500000000000],
        ['Prehistoric Plutonium', 40000000000.0, 95000000000.0, 2500000000000],
        ['Dawn-Time Decay', 18000000000.0, 45000000000.0, 1100000000000],
        ['The Original Oscillator', 20000000000.0, 50000000000.0, 1200000000000],
        ['Primeval Particle', 35000000000.0, 85000000000.0, 2200000000000],
        ['The Initial Isotope', 30000000000.0, 75000000000.0, 1900000000000],
        ['Ur-Core of the Abyss', 22000000000.0, 55000000000.0, 1400000000000],
        ['Origin Oscillator', 45000000000.0, 110000000000.0, 2800000000000],
        ['The Source Strontium', 50000000000.0, 125000000000.0, 3100000000000],
        ['Foundation Fallout', 55000000000.0, 135000000000.0, 3500000000000],
        ['Root Radium', 28000000000.0, 68000000000.0, 1700000000000],
        ['The Base Bismuth', 32000000000.0, 78000000000.0, 2000000000000],
        ['Alpha-Origin Atom', 38000000000.0, 90000000000.0, 2400000000000],
        ['The Ancient Anomaly', 42000000000.0, 105000000000.0, 2600000000000],
        ['Before-Time Barium', 70000000000.0, 180000000000.0, 4500000000000]
    ],

    // 15 TRANSCENDENT - Di luar semua kategori fisik
    transcendent: [
        ['The Metaphysical Meltdown', 250000000000.0, 600000000000.0, 15000000000000],
        ['Concept Core', 180000000000.0, 450000000000.0, 11000000000000],
        ['Abstract Atom', 200000000000.0, 500000000000.0, 12000000000000],
        ['Theoretical Tritium', 350000000000.0, 850000000000.0, 22000000000000],
        ['Hypothetical Halflife', 300000000000.0, 750000000000.0, 19000000000000],
        ['The Imaginary Isotope', 220000000000.0, 550000000000.0, 14000000000000],
        ['Visionary Valence', 400000000000.0, 950000000000.0, 25000000000000],
        ['Spectral Strontium', 450000000000.0, 1100000000000.0, 28000000000000],
        ['Ethereal Electron', 280000000000.0, 680000000000.0, 17000000000000],
        ['The Thought-Form Fission', 320000000000.0, 780000000000.0, 20000000000000],
        ['Spirit Spark', 380000000000.0, 900000000000.0, 24000000000000],
        ['The Unbound Uranium', 500000000000.0, 1250000000000.0, 31000000000000],
        ['Beyond-Matter Mutation', 550000000000.0, 1350000000000.0, 35000000000000],
        ['The Conceptual Contaminant', 420000000000.0, 1050000000000.0, 26000000000000],
        ['The Pure Particle', 700000000000.0, 1800000000000.0, 45000000000000]
    ],

    // 16 APOTHEOSIS - Puncak tertinggi menjadi sesuatu yang ilahi
    apotheosis: [
        ['The Ultimate Uranium', 2500000000000.0, 6000000000000.0, 150000000000000],
        ['Peak Perfection Particle', 3500000000000.0, 8500000000000.0, 220000000000000],
        ['Pinnacle Plutonium', 2000000000000.0, 5000000000000.0, 120000000000000],
        ['The Apex Atom', 3000000000000.0, 7500000000000.0, 190000000000000],
        ['Culmination Core', 2800000000000.0, 6800000000000.0, 170000000000000],
        ['Summit Strontium', 4000000000000.0, 9500000000000.0, 250000000000000],
        ['Crowned Contaminant', 4500000000000.0, 11000000000000.0, 280000000000000],
        ['Sovereign Spark', 2200000000000.0, 5500000000000.0, 140000000000000],
        ['Royal Radium', 3200000000000.0, 7800000000000.0, 200000000000000],
        ['Majestic Mutation', 3800000000000.0, 9000000000000.0, 240000000000000],
        ['Imperial Isotope', 5000000000000.0, 12500000000000.0, 310000000000000],
        ['The Final Fission', 5500000000000.0, 13500000000000.0, 350000000000000],
        ['Monarch Meltdown', 4200000000000.0, 10500000000000.0, 260000000000000],
        ['The Regal Ray', 7000000000000.0, 18000000000000.0, 450000000000000],
        ['Godhood Gamma', 9500000000000.0, 25000000000000.0, 680000000000000]
    ],

    // 17 ABSOLUTE - Tidak ada yang di atasnya... secara teoretis
    absolute: [
        ['The Flawless Fission', 25000000000000.0, 60000000000000.0, 1500000000000000],
        ['Perfect Plutonium', 18000000000000.0, 45000000000000.0, 1100000000000000],
        ['Ideal Isotope', 20000000000000.0, 50000000000000.0, 1200000000000000],
        ['The Supreme Strontium', 35000000000000.0, 85000000000000.0, 2200000000000000],
        ['Unsurpassed Uranium', 30000000000000.0, 75000000000000.0, 1900000000000000],
        ['Peerless Particle', 22000000000000.0, 55000000000000.0, 1400000000000000],
        ['Matchless Mutation', 40000000000000.0, 95000000000000.0, 2500000000000000],
        ['Incomparable Isotope', 45000000000000.0, 110000000000000.0, 2800000000000000],
        ['Unrivaled Radium', 28000000000000.0, 68000000000000.0, 1700000000000000],
        ['Unequaled Electron', 32000000000000.0, 78000000000000.0, 2000000000000000],
        ['Nonpareil Nucleon', 38000000000000.0, 90000000000000.0, 2400000000000000],
        ['Optimum Oscillator', 50000000000000.0, 125000000000000.0, 3100000000000000],
        ['Par-Excellence Particle', 55000000000000.0, 135000000000000.0, 3500000000000000],
        ['Consummate Core', 42000000000000.0, 105000000000000.0, 2600000000000000],
        ['The Absolute Atom', 80000000000000.0, 200000000000000.0, 5000000000000000]
    ],

    // 18 SINGULARITY - Satu-satunya yang pernah dan akan ada
    singularity: [
        ['The Monad Meltdown', 250000000000000.0, 600000000000000.0, 15000000000000000],
        ['The One Core', 500000000000000.0, 1250000000000000.0, 32000000000000000],
        ['Alpha-Omega Atom', 800000000000000.0, 2000000000000000.0, 48000000000000000],
        ['Singular Strontium', 350000000000000.0, 850000000000000.0, 22000000000000000],
        ['The Unique Uranium', 450000000000000.0, 1100000000000000.0, 28000000000000000],
        ['Solitary Spark', 200000000000000.0, 500000000000000.0, 12000000000000000],
        ['Lone Radium', 300000000000000.0, 750000000000000.0, 19000000000000000],
        ['The Only Oscillator', 600000000000000.0, 1500000000000000.0, 38000000000000000],
        ['Single Strontium', 280000000000000.0, 680000000000000.0, 17000000000000000],
        ['Individual Isotope', 320000000000000.0, 780000000000000.0, 20000000000000000],
        ['Distinct Decay', 400000000000000.0, 950000000000000.0, 25000000000000000],
        ['Separate Spark', 220000000000000.0, 550000000000000.0, 14000000000000000],
        ['Exclusive Electron', 380000000000000.0, 900000000000000.0, 24000000000000000],
        ['Sole Strontium', 550000000000000.0, 1350000000000000.0, 35000000000000000],
        ['One-and-Only Particle', 950000000000000.0, 2500000000000000.0, 65000000000000000]
    ],

    // 19 PARADOX - Seharusnya tidak ada, eksistensi yang kontradiktif
    paradox: [
        ['Retro-Causal Radium', 2500000000000000.0, 6000000000000000.0, 150000000000000000],
        ['The Un-Fissioned Fission', 1800000000000000.0, 4500000000000000.0, 110000000000000000],
        ['Impossible Isotope', 2000000000000000.0, 5000000000000000.0, 120000000000000000],
        ['Contradictory Core', 3500000000000000.0, 8500000000000000.0, 220000000000000000],
        ['Logical-Fallacy Lead', 3000000000000000.0, 7500000000000000.0, 190000000000000000],
        ['Absurd Atom', 2200000000000000.0, 5500000000000000.0, 140000000000000000],
        ['Illogical Isotope', 4000000000000000.0, 9500000000000000.0, 250000000000000000],
        ['The Unreasonable Uranium', 4500000000000000.0, 11000000000000000.0, 280000000000000000],
        ['Nonsensical Nucleon', 2800000000000000.0, 6800000000000000.0, 170000000000000000],
        ['Irrational Isotope', 3200000000000000.0, 7800000000000000.0, 200000000000000000],
        ['Inconsistent Isotope', 5000000000000000.0, 12500000000000000.0, 310000000000000000],
        ['The Conflicting Core', 5500000000000000.0, 13500000000000000.0, 350000000000000000],
        ['Incompatible Isotope', 3800000000000000.0, 9000000000000000.0, 240000000000000000],
        ['Paradoxical Particle', 4200000000000000.0, 10500000000000000.0, 260000000000000000],
        ['Enigma Electron', 8000000000000000.0, 20000000000000000.0, 500000000000000000]
    ],

    // 20 NULL - Di luar eksistensi, di luar metrik, error di dalam matriks
    // (Karena tidak eksis secara fisik, beratnya adalah 0 mutlak, 
    // dengan harga abstrak yang tak terhingga/simbolis)
    null: [
        ['Error 404 Isotope', 0.0, 0.0, 999999999999999999],
        ['The Void-Enveloped Valence', 0.0, 0.0, 999999999999999999],
        ['Nullified Nucleon', 0.0, 0.0, 999999999999999999],
        ['Erased Electron', 0.0, 0.0, 999999999999999999],
        ['The Missing Meltdown', 0.0, 0.0, 999999999999999999],
        ['Zero Zirconium', 0.0, 0.0, 999999999999999999],
        ['Empty Emitter', 0.0, 0.0, 999999999999999999],
        ['Blank Bismuth', 0.0, 0.0, 999999999999999999],
        ['Nothingness Nucleon', 0.0, 0.0, 999999999999999999],
        ['Absent Atom', 0.0, 0.0, 999999999999999999],
        ['Lacking Lead', 0.0, 0.0, 999999999999999999],
        ['Wanting Waste', 0.0, 0.0, 999999999999999999],
        ['Deprived Decay', 0.0, 0.0, 999999999999999999],
        ['Destitute Decay', 0.0, 0.0, 999999999999999999],
        ['The Devoid Decay', 0.0, 0.0, 999999999999999999]
    ]
};