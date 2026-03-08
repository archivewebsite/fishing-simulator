/**
 * CELLULAR SEA — Fish Data (Extended 20-Tier Ecosystem)
 * Theme: Microscopic, microbiology, DNA, giant petri dish.
 * Color Palette: ["#76ff03", "#69f0ae"]
 * Format: ['Name', minWeight, maxWeight, randomBasePrice]
 */

const FISH_CELLULAR_SEA = {
    // 01 COMMON - Ada di mana-mana, gampang ditemukan
    common: [
        ['Cytoplasmic Drifter', 0.01, 0.05, 5],
        ['Cilia Swarmer', 0.02, 0.08, 8],
        ['Basic Bacilli', 0.01, 0.06, 6],
        ['Mitosis Minnow', 0.03, 0.10, 10],
        ['Vacuole Blimp', 0.05, 0.15, 12],
        ['Peptidoglycan Prawn', 0.04, 0.12, 15],
        ['Flagellar Tadpole', 0.02, 0.09, 9],
        ['Ribosome Cluster', 0.01, 0.04, 4],
        ['Lysosome Nibbler', 0.03, 0.07, 7],
        ['Membrane Mite', 0.01, 0.03, 5],
        ['Protoplasm Guppy', 0.04, 0.11, 11],
        ['Simple Spirillum', 0.02, 0.08, 8],
        ['Drifting Coccus', 0.01, 0.05, 5],
        ['Endosome Floater', 0.03, 0.12, 14],
        ['Golgi Guppy', 0.04, 0.14, 16]
    ],

    // 02 UNCOMMON - Perlu usaha, tapi masih realistis
    uncommon: [
        ['Mitochondria Mackerel', 0.15, 0.40, 45],
        ['Chloroplast Cruiser', 0.20, 0.50, 50],
        ['Eukaryotic Eel', 0.30, 0.80, 75],
        ['Plasmid Ray', 0.25, 0.60, 60],
        ['Centriole Crab', 0.10, 0.35, 30],
        ['Microtubule Worm', 0.08, 0.25, 25],
        ['Vesicle Voyager', 0.12, 0.45, 40],
        ['Phagocyte Flounder', 0.35, 0.90, 85],
        ['Pathogenic Puffer', 0.40, 1.10, 110],
        ['Antigen Angler', 0.25, 0.70, 65],
        ['Antibody Arrowfish', 0.15, 0.40, 45],
        ['Spore Sprat', 0.05, 0.20, 20],
        ['Cytoskeleton Squid', 0.30, 0.85, 80],
        ['Chromatin Chub', 0.20, 0.55, 55],
        ['Nucleolus Navigator', 0.45, 1.20, 120]
    ],

    // 03 RARE - Butuh keberuntungan untuk dapat
    rare: [
        ['Double Helix Halibut', 1.5, 4.0, 350],
        ['RNA Messenger', 1.0, 2.5, 250],
        ['Retroviral Ray', 2.0, 5.5, 450],
        ['Bacteriophage Bass', 1.8, 4.8, 400],
        ['CRISPR Clipper', 1.2, 3.5, 300],
        ['Stem Cell Snapper', 2.5, 6.0, 500],
        ['Zygotic Zander', 3.0, 7.5, 650],
        ['T-Cell Torpedo', 1.5, 3.8, 320],
        ['B-Cell Bream', 1.4, 3.6, 310],
        ['Macrophage Manta', 4.0, 10.0, 850],
        ['Neutrophil Needle', 0.8, 2.0, 180],
        ['Leukocyte Loach', 1.6, 4.2, 380],
        ['Erythrocyte Disc', 1.0, 2.8, 260],
        ['Platelet Prawn', 0.5, 1.5, 150],
        ['Histamine Hunter', 2.2, 5.0, 420]
    ],

    // 04 EPIC - Masuk cerita, dikenang orang banyak
    epic: [
        ['Megaphage Marlin', 15.0, 35.0, 2500],
        ['Cyanobacterial Shark', 20.0, 45.0, 3200],
        ['Extremophile Eel', 12.0, 28.0, 1800],
        ['Thermophilic Trout', 14.0, 32.0, 2100],
        ['Halophilic Halibut', 16.0, 38.0, 2400],
        ['Radiotrophic Ray', 18.0, 42.0, 2900],
        ['Acidophilic Angler', 10.0, 25.0, 1500],
        ['Cryophilic Carp', 15.0, 34.0, 2200],
        ['Alkaliphilic Anchovy', 8.0, 20.0, 1200],
        ['Barophilic Bass', 22.0, 50.0, 3800],
        ['Endospore Sturgeon', 25.0, 60.0, 4500],
        ['Biofilm Barracuda', 18.0, 40.0, 2700],
        ['Planktonic Puffer', 11.0, 26.0, 1600],
        ['Quorum-Sensing Squid', 13.0, 30.0, 1900],
        ['Mutagenic Manta', 28.0, 65.0, 5000]
    ],

    // 05 LEGENDARY - Jadi legenda, melampaui zaman
    legendary: [
        ['LUCA Leviathan', 80.0, 180.0, 15000],
        ['Immortal HeLa-Fish', 60.0, 140.0, 11000],
        ['Tardigrade Whale', 100.0, 250.0, 22000],
        ['Progenitor Pike', 70.0, 160.0, 13000],
        ['Genesis Grouper', 90.0, 200.0, 18000],
        ['Alpha Amoeba', 50.0, 120.0, 9000],
        ['Omega Organelle', 110.0, 260.0, 24000],
        ['Telomere Tarpon', 65.0, 150.0, 12000],
        ['Enzyme Emperor', 85.0, 190.0, 16000],
        ['Catalyst Colossus', 120.0, 280.0, 26000],
        ['Synthetase Shark', 75.0, 170.0, 14000],
        ['Polymerase Puffer', 55.0, 130.0, 10000],
        ['Helicase Halibut', 68.0, 155.0, 12500],
        ['Ligase Loach', 45.0, 110.0, 8000],
        ['Nuclease Narwhal', 150.0, 350.0, 35000]
    ],

    // 06 LIMINAL - Berdiri di ambang batas dua dunia
    liminal: [
        ['The In-Between Strain', 300.0, 600.0, 85000],
        ['Schrödinger\'s Phage', 250.0, 500.0, 70000],
        ['Asymptotic Amoeba', 280.0, 550.0, 78000],
        ['Twilight Telomere', 320.0, 650.0, 92000],
        ['The Blinking Virion', 200.0, 450.0, 60000],
        ['State-Shift Spore', 350.0, 700.0, 105000],
        ['Half-Life Helix', 400.0, 800.0, 120000],
        ['Membrane of Doubt', 380.0, 750.0, 110000],
        ['Ectoplasmic Isolate', 270.0, 520.0, 75000],
        ['The Phantom Node', 450.0, 900.0, 140000],
        ['Borderline Biota', 220.0, 480.0, 65000],
        ['Non-Binary Bacilli', 310.0, 620.0, 88000],
        ['The Fading Karyotype', 260.0, 510.0, 72000],
        ['Wraith-Cell', 330.0, 670.0, 95000],
        ['Ghost in the DNA', 500.0, 1000.0, 160000]
    ],

    // 07 MYTHIC - Sudah bukan sejarah, ini mitologi
    mythic: [
        ['The Yggdrasil Sequence', 1200.0, 2500.0, 450000],
        ['Hydra\'s Replication', 1500.0, 3000.0, 550000],
        ['Ouroboros Chromosome', 1800.0, 3500.0, 650000],
        ['Leviathan Leukocyte', 2500.0, 5000.0, 950000],
        ['Chimera Strain', 1400.0, 2800.0, 500000],
        ['Cerberus Mitosis', 1600.0, 3200.0, 580000],
        ['Kraken\'s Karyotype', 2200.0, 4500.0, 820000],
        ['Midas Mitochondria', 1100.0, 2200.0, 380000],
        ['Gorgon\'s Gaze Gene', 1300.0, 2600.0, 460000],
        ['Phoenix Virion', 1700.0, 3400.0, 620000],
        ['Sphinx Spore', 1900.0, 3800.0, 700000],
        ['The Minotaur Maze-Cell', 2100.0, 4200.0, 780000],
        ['Pegasus Plasmid', 1250.0, 2400.0, 420000],
        ['Medusa\'s Nucleolus', 1450.0, 2900.0, 520000],
        ['Siren\'s Synechocystis', 1000.0, 2000.0, 350000]
    ],

    // 08 ASCENDANT - Melampaui batasnya sendiri
    ascendant: [
        ['The Overcoming Organelle', 5000.0, 12000.0, 2500000],
        ['Ascension Helix', 6500.0, 15000.0, 3200000],
        ['The Mutating Monarch', 8000.0, 18000.0, 4000000],
        ['Elevating Enzyme', 5500.0, 13000.0, 2700000],
        ['Beyond-Base Bacilli', 4500.0, 10000.0, 2100000],
        ['The Surging Strain', 7000.0, 16000.0, 3500000],
        ['Apex Amoeba', 9000.0, 20000.0, 4500000],
        ['Escalating Eukaryote', 6000.0, 14000.0, 2900000],
        ['The Zenith Zygote', 10000.0, 22000.0, 5000000],
        ['Limit-Breaker Leukocyte', 12000.0, 25000.0, 6000000],
        ['The Upward Sequence', 4800.0, 11000.0, 2300000],
        ['Culminating Catalyst', 7500.0, 17000.0, 3700000],
        ['Peak Polymerase', 8500.0, 19000.0, 4200000],
        ['Transcending Transcriptase', 11000.0, 24000.0, 5500000],
        ['The Crowned Cell', 15000.0, 30000.0, 7500000]
    ],

    // 09 CELESTIAL - Skala surga dan bintang
    celestial: [
        ['Nebula Nucleus', 35000.0, 80000.0, 18000000],
        ['Supernova Spore', 50000.0, 120000.0, 28000000],
        ['Astrobiological Anomaly', 40000.0, 95000.0, 22000000],
        ['Panspermia Seed', 60000.0, 140000.0, 35000000],
        ['Galaxy Genome', 80000.0, 180000.0, 45000000],
        ['Constellation Chromosome', 45000.0, 100000.0, 25000000],
        ['Solar Flare Phage', 55000.0, 125000.0, 31000000],
        ['Meteoritic Microbe', 30000.0, 70000.0, 15000000],
        ['Asteroid Amoeba', 25000.0, 60000.0, 12000000],
        ['Cosmic Dust Diatom', 38000.0, 85000.0, 20000000],
        ['Pulsar Plasmid', 65000.0, 150000.0, 38000000],
        ['Quasar Karyotype', 90000.0, 200000.0, 55000000],
        ['Lunar Leukocyte', 42000.0, 98000.0, 23000000],
        ['The Stardust Strain', 70000.0, 160000.0, 40000000],
        ['Orbital Organelle', 48000.0, 110000.0, 26000000]
    ],

    // 10 ELDRITCH - Kuno, meretakkan realitas
    eldritch: [
        ['The Deep-One DNA', 250000.0, 600000.0, 150000000],
        ['Non-Euclidean Nucleotide', 300000.0, 750000.0, 180000000],
        ['Azathoth\'s Amoeba', 800000.0, 2000000.0, 500000000],
        ['The Whispering Virion', 200000.0, 500000.0, 120000000],
        ['Shoggoth Spore', 450000.0, 1100000.0, 280000000],
        ['Tentacled Telomere', 350000.0, 850000.0, 210000000],
        ['The Unnamable Ur-Cell', 600000.0, 1500000.0, 380000000],
        ['Madness Microbe', 280000.0, 680000.0, 160000000],
        ['Yog-Sothoth\'s Zygote', 950000.0, 2500000.0, 650000000],
        ['Cthulhu\'s Cytoplasm', 700000.0, 1800000.0, 450000000],
        ['The Abyssal Antigen', 320000.0, 780000.0, 190000000],
        ['Eldritch Enzyme', 400000.0, 950000.0, 240000000],
        ['The Crawling Chaos-Cell', 550000.0, 1300000.0, 340000000],
        ['Incomprehensible Isolate', 650000.0, 1600000.0, 410000000],
        ['Void-Spawned Phage', 850000.0, 2200000.0, 550000000]
    ],

    // 11 ETERNAL - Berada di luar konsep waktu
    eternal: [
        ['The Undying Strand', 3000000.0, 7000000.0, 1800000000],
        ['Ageless Antigen', 2500000.0, 6000000.0, 1500000000],
        ['Immortal Isolate', 4000000.0, 9000000.0, 2400000000],
        ['Perpetuity Plasmid', 3500000.0, 8000000.0, 2100000000],
        ['The Endless Enzyme', 4500000.0, 10000000.0, 2700000000],
        ['Time-Locked Telomere', 5000000.0, 12000000.0, 3200000000],
        ['Unfading Ur-Cell', 2800000.0, 6500000.0, 1600000000],
        ['Boundless Bacteria', 3200000.0, 7500000.0, 1900000000],
        ['The Ceaseless Cell', 5500000.0, 13000000.0, 3500000000],
        ['Never-Dying Nucleus', 6000000.0, 15000000.0, 4000000000],
        ['The Forever Phage', 3800000.0, 9500000.0, 2300000000],
        ['Epoch Eukaryote', 4200000.0, 10500000.0, 2600000000],
        ['The Infinite Isotope', 7000000.0, 18000000.0, 4800000000],
        ['Eon\'s Endosome', 4800000.0, 11500000.0, 2900000000],
        ['The Everlasting Entity', 8000000.0, 20000000.0, 5500000000]
    ],

    // 12 DIVINE - Setara dewa, melampaui logika manusia
    divine: [
        ['The God-Particle Phage', 25000000.0, 60000000.0, 15000000000],
        ['Creator\'s Chromosome', 35000000.0, 85000000.0, 22000000000],
        ['Holy Helix', 18000000.0, 45000000.0, 11000000000],
        ['Sacred Spore', 20000000.0, 50000000.0, 13000000000],
        ['The Miracle Microbe', 40000000.0, 95000000.0, 25000000000],
        ['Consecrated Cell', 22000000.0, 55000000.0, 14000000000],
        ['Hallowed Helix', 28000000.0, 68000000.0, 17000000000],
        ['Anointed Antigen', 32000000.0, 78000000.0, 20000000000],
        ['The Sanctified Stem Cell', 45000000.0, 110000000.0, 28000000000],
        ['Venerated Virion', 30000000.0, 72000000.0, 19000000000],
        ['Revered Ribosome', 26000000.0, 64000000.0, 16000000000],
        ['The Genesis Gene', 50000000.0, 120000000.0, 32000000000],
        ['Exalted Enzyme', 38000000.0, 90000000.0, 24000000000],
        ['The Divine Diatom', 42000000.0, 100000000.0, 26000000000],
        ['Archangel\'s Amoeba', 60000000.0, 150000000.0, 40000000000]
    ],

    // 13 COSMIC - Skala alam semesta penuh
    cosmic: [
        ['The Macrocosm Microbe', 200000000.0, 500000000.0, 120000000000],
        ['Universal Ur-Cell', 350000000.0, 800000000.0, 220000000000],
        ['Multiverse Microbe', 500000000.0, 1200000000.0, 320000000000],
        ['Omniverse Organelle', 800000000.0, 2000000000.0, 550000000000],
        ['The Galaxy-Devouring Phage', 450000000.0, 1100000000.0, 280000000000],
        ['Infinity Isolate', 600000000.0, 1500000000.0, 380000000000],
        ['All-Encompassing Antigen', 250000000.0, 650000000.0, 160000000000],
        ['Cosmic-Scale Cell', 300000000.0, 750000000.0, 190000000000],
        ['The Planetary Plasmid', 150000000.0, 400000000.0, 95000000000],
        ['Void-Walker Virion', 400000000.0, 950000000.0, 250000000000],
        ['The Space-Time Strain', 550000000.0, 1300000000.0, 350000000000],
        ['Event-Horizon Enzyme', 700000000.0, 1800000000.0, 450000000000],
        ['The Big-Bang Bacilli', 950000000.0, 2500000000.0, 680000000000],
        ['Celestial-Sphere Cell', 280000000.0, 700000000.0, 180000000000],
        ['The Cosmos Karyotype', 320000000.0, 850000000.0, 210000000000]
    ],

    // 14 PRIMORDIAL - Mendahului waktu dan ruang
    primordial: [
        ['The First RNA', 2500000000.0, 6000000000.0, 1500000000000],
        ['LUCA\'s Shadow', 4000000000.0, 9500000000.0, 2500000000000],
        ['Prehistoric Plasmid', 1800000000.0, 4500000000.0, 1100000000000],
        ['The Dawn Diatom', 2000000000.0, 5000000000.0, 1200000000000],
        ['Alpha-Origin Amoeba', 3500000000.0, 8500000000.0, 2200000000000],
        ['Primeval Polymerase', 3000000000.0, 7500000000.0, 1900000000000],
        ['The Initial Isolate', 2200000000.0, 5500000000.0, 1400000000000],
        ['Ur-Cell of the Abyss', 4500000000.0, 11000000000.0, 2800000000000],
        ['Origin Organism', 5000000000.0, 12500000000.0, 3100000000000],
        ['The Source Stem Cell', 5500000000.0, 13500000000.0, 3500000000000],
        ['Root Ribosome', 2800000000.0, 6800000000.0, 1700000000000],
        ['The Base Bacilli', 3200000000.0, 7800000000.0, 2000000000000],
        ['Foundation Phage', 3800000000.0, 9000000000.0, 2400000000000],
        ['The Ancient Antigen', 4200000000.0, 10500000000.0, 2600000000000],
        ['Before-Time Bacteria', 7000000000.0, 18000000000.0, 4500000000000]
    ],

    // 15 TRANSCENDENT - Di luar semua kategori fisik
    transcendent: [
        ['The Metaphysical Microbe', 25000000000.0, 60000000000.0, 15000000000000],
        ['Concept Cell', 18000000000.0, 45000000000.0, 11000000000000],
        ['Abstract Antigen', 20000000000.0, 50000000000.0, 12000000000000],
        ['Theoretical Telomere', 35000000000.0, 85000000000.0, 22000000000000],
        ['Hypothetical Helix', 30000000000.0, 75000000000.0, 19000000000000],
        ['The Imaginary Isolate', 22000000000.0, 55000000000.0, 14000000000000],
        ['Visionary Virion', 40000000000.0, 95000000000.0, 25000000000000],
        ['Dream DNA', 45000000000.0, 110000000000.0, 28000000000000],
        ['The Idea Isotope', 28000000000.0, 68000000000.0, 17000000000000],
        ['Spectral Spore', 32000000000.0, 78000000000.0, 20000000000000],
        ['Ethereal Enzyme', 38000000000.0, 90000000000.0, 24000000000000],
        ['The Thought-Form Phage', 50000000000.0, 125000000000.0, 31000000000000],
        ['Spirit Stem Cell', 55000000000.0, 135000000000.0, 35000000000000],
        ['The Unbound Biota', 42000000000.0, 105000000000.0, 26000000000000],
        ['Beyond-Biology Bacteria', 70000000000.0, 180000000000.0, 45000000000000]
    ],

    // 16 APOTHEOSIS - Puncak tertinggi menjadi sesuatu yang ilahi
    apotheosis: [
        ['The Ultimate Ur-Cell', 250000000000.0, 600000000000.0, 150000000000000],
        ['Peak Perfection Phage', 350000000000.0, 850000000000.0, 220000000000000],
        ['Pinnacle Plasmid', 200000000000.0, 500000000000.0, 120000000000000],
        ['The Apex Antigen', 300000000000.0, 750000000000.0, 190000000000000],
        ['Culmination Cell', 280000000000.0, 680000000000.0, 170000000000000],
        ['Summit Stem Cell', 400000000000.0, 950000000000.0, 250000000000000],
        ['Crowned Chromosome', 450000000000.0, 1100000000000.0, 280000000000000],
        ['Sovereign Spore', 220000000000.0, 550000000000.0, 140000000000000],
        ['Royal Ribosome', 320000000000.0, 780000000000.0, 200000000000000],
        ['Majestic Microbe', 380000000000.0, 900000000000.0, 240000000000000],
        ['Imperial Isolate', 500000000000.0, 1250000000000.0, 310000000000000],
        ['The Regal RNA', 550000000000.0, 1350000000000.0, 350000000000000],
        ['Monarch Microbe', 420000000000.0, 1050000000000.0, 260000000000000],
        ['The Final Form Phage', 700000000000.0, 1800000000000.0, 450000000000000],
        ['Godhood Gene', 950000000000.0, 2500000000000.0, 680000000000000]
    ],

    // 17 ABSOLUTE - Tidak ada yang di atasnya... secara teoretis
    absolute: [
        ['The Flawless Phage', 2500000000000.0, 6000000000000.0, 1500000000000000],
        ['Perfect Plasmid', 1800000000000.0, 4500000000000.0, 1100000000000000],
        ['Ideal Isolate', 2000000000000.0, 5000000000000.0, 1200000000000000],
        ['The Supreme Stem Cell', 3500000000000.0, 8500000000000.0, 2200000000000000],
        ['Unsurpassed Ur-Cell', 3000000000000.0, 7500000000000.0, 1900000000000000],
        ['Peerless Polymerase', 2200000000000.0, 5500000000000.0, 1400000000000000],
        ['Matchless Microbe', 4000000000000.0, 9500000000000.0, 2500000000000000],
        ['Incomparable Isotope', 4500000000000.0, 11000000000000.0, 2800000000000000],
        ['Unrivaled RNA', 2800000000000.0, 6800000000000.0, 1700000000000000],
        ['Unequaled Enzyme', 3200000000000.0, 7800000000000.0, 2000000000000000],
        ['Nonpareil Nucleus', 3800000000000.0, 9000000000000.0, 2400000000000000],
        ['Optimum Organelle', 5000000000000.0, 12500000000000.0, 3100000000000000],
        ['Par Excellence Phage', 5500000000000.0, 13500000000000.0, 3500000000000000],
        ['Consummate Cell', 4200000000000.0, 10500000000000.0, 2600000000000000],
        ['The Absolute Antigen', 8000000000000.0, 20000000000000.0, 5000000000000000]
    ],

    // 18 SINGULARITY - Satu-satunya yang pernah dan akan ada
    singularity: [
        ['The Monad Microbe', 25000000000000.0, 60000000000000.0, 15000000000000000],
        ['The One Cell', 50000000000000.0, 125000000000000.0, 32000000000000000],
        ['Alpha-Omega Organelle', 80000000000000.0, 200000000000000.0, 48000000000000000],
        ['Singular Stem Cell', 35000000000000.0, 85000000000000.0, 22000000000000000],
        ['The Unique Ur-Cell', 45000000000000.0, 110000000000000.0, 28000000000000000],
        ['Solitary Spore', 20000000000000.0, 50000000000000.0, 12000000000000000],
        ['Lone Leukocyte', 30000000000000.0, 75000000000000.0, 19000000000000000],
        ['The Only Organism', 60000000000000.0, 150000000000000.0, 38000000000000000],
        ['Single Synechocystis', 28000000000000.0, 68000000000000.0, 17000000000000000],
        ['Individual Isolate', 32000000000000.0, 78000000000000.0, 20000000000000000],
        ['Distinct DNA', 40000000000000.0, 95000000000000.0, 25000000000000000],
        ['Separate Spore', 22000000000000.0, 55000000000000.0, 14000000000000000],
        ['Exclusive Enzyme', 38000000000000.0, 90000000000000.0, 24000000000000000],
        ['Sole Stem Cell', 55000000000000.0, 135000000000000.0, 35000000000000000],
        ['One-and-Only Organelle', 95000000000000.0, 250000000000000.0, 65000000000000000]
    ],

    // 19 PARADOX - Seharusnya tidak ada, eksistensi yang kontradiktif
    paradox: [
        ['Retro-Causal RNA', 250000000000000.0, 600000000000000.0, 150000000000000000],
        ['The Self-Eating Spore', 180000000000000.0, 450000000000000.0, 110000000000000000],
        ['Impossible Isolate', 200000000000000.0, 500000000000000.0, 120000000000000000],
        ['Contradictory Chromosome', 350000000000000.0, 850000000000000.0, 220000000000000000],
        ['Logical-Fallacy Leukocyte', 300000000000000.0, 750000000000000.0, 190000000000000000],
        ['Absurd Antigen', 220000000000000.0, 550000000000000.0, 140000000000000000],
        ['Illogical Isotope', 400000000000000.0, 950000000000000.0, 250000000000000000],
        ['The Unreasonable Ur-Cell', 450000000000000.0, 1100000000000000.0, 280000000000000000],
        ['Nonsensical Nucleus', 280000000000000.0, 680000000000000.0, 170000000000000000],
        ['Irrational Isolate', 320000000000000.0, 780000000000000.0, 200000000000000000],
        ['Inconsistent Isotope', 500000000000000.0, 1250000000000000.0, 310000000000000000],
        ['The Conflicting Cell', 550000000000000.0, 1350000000000000.0, 350000000000000000],
        ['Incompatible Isolate', 380000000000000.0, 900000000000000.0, 240000000000000000],
        ['Paradoxical Phage', 420000000000000.0, 1050000000000000.0, 260000000000000000],
        ['Enigma Enzyme', 800000000000000.0, 2000000000000000.0, 500000000000000000]
    ],

    // 20 NULL - Di luar eksistensi, di luar metrik, error di dalam matriks
    // (Karena tidak eksis secara fisik, beratnya adalah 0 atau angka abstrak yang mendekati nol mutlak, 
    // dengan harga yang tak terbatas/simbolik)
    null: [
        ['Error 404 Plasmid', 0.0, 0.0, 999999999999999999],
        ['The Void-Enveloped Virion', 0.0, 0.0, 999999999999999999],
        ['Nullified Nucleotide', 0.0, 0.0, 999999999999999999],
        ['Erased Engram', 0.0, 0.0, 999999999999999999],
        ['The Missing Sequence', 0.0, 0.0, 999999999999999999],
        ['Zero Zygote', 0.0, 0.0, 999999999999999999],
        ['Empty Enzyme', 0.0, 0.0, 999999999999999999],
        ['Blank Bacteria', 0.0, 0.0, 999999999999999999],
        ['Nothingness Nucleus', 0.0, 0.0, 999999999999999999],
        ['Absent Antigen', 0.0, 0.0, 999999999999999999],
        ['Lacking Leukocyte', 0.0, 0.0, 999999999999999999],
        ['Wanting Ur-Cell', 0.0, 0.0, 999999999999999999],
        ['Deprived DNA', 0.0, 0.0, 999999999999999999],
        ['Destitute Diatom', 0.0, 0.0, 999999999999999999],
        ['The Devoid DNA', 0.0, 0.0, 999999999999999999]
    ]
};