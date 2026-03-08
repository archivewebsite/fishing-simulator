/**
 * AMBER AQUIFER — Fish Data
 * Theme: Fossils, ancient tree sap, and trapped time.
 * Water: Viscous flow of golden sap from the roots of Yggdrasil.
 * Palette: ["#ff8f00", "#ffe082"]
 */
const FISH_AMBER_AQUIFER = {
    // 01. common: ada di mana-mana, gampang ditemukan
    common: [
        ['Sap Guppy', 0.1, 1.2], ['Sticky Minnow', 0.2, 1.5], ['Amber Fry', 0.1, 0.8],
        ['Resin Roach', 0.3, 1.8], ['Fossilized Tadpole', 0.2, 0.9], ['Bark Loach', 0.4, 2.0],
        ['Honeyed Sardine', 0.1, 1.1], ['Golden Smelt', 0.3, 1.4], ['Tree-Tear Tetra', 0.1, 0.7],
        ['Syrupy Sprat', 0.2, 1.0], ['Root-dweller Chub', 0.5, 2.5], ['Trapped Pinfish', 0.4, 1.6],
        ['Muck Minnow', 0.2, 1.3], ['Pine-pitch Puffer', 0.6, 2.8], ['Yellowed Shiner', 0.1, 0.9]
    ],

    // 02. uncommon: perlu usaha, tapi masih realistis
    uncommon: [
        ['Preserved Perch', 2.0, 5.5], ['Petrified Pickerel', 3.0, 7.0], ['Amber Carp', 4.0, 9.0],
        ['Resin Ray', 2.5, 6.0], ['Golden Grouper', 4.5, 10.0], ['Sap-locked Salmon', 5.0, 11.0],
        ['Fossil Flounder', 3.5, 8.0], ['Bark-bite Bass', 3.0, 7.5], ['Ancient Angelfish', 2.0, 4.5],
        ['Hardened Halibut', 3.8, 8.5], ['Viscous Velvetfish', 2.2, 5.0], ['Sticky Sturgeon', 5.5, 12.0],
        ['Honey-comb Catfish', 4.0, 9.5], ['Root-snag Snapper', 3.2, 7.2], ['Yggdrasil Trout', 4.2, 9.8]
    ],

    // 03. rare: butuh keberuntungan untuk dapat
    rare: [
        ['Amberjack Antiquity', 12.0, 28.0], ['Jurassic Gar', 18.0, 42.0], ['Prehistoric Pike', 15.0, 35.0],
        ['Golden Coelacanth', 20.0, 48.0], ['Time-Trapped Tarpon', 22.0, 50.0], ['Epoch Eel', 10.0, 25.0],
        ['Fossilized Fangtooth', 8.0, 18.0], ['Resin-coated Ray', 17.0, 40.0], ['Mesozoic Marlin', 25.0, 55.0],
        ['Sap-swimmer Shark', 24.0, 52.0], ['Petrified Piranha', 9.0, 20.0], ['Tree-Tear Trevally', 14.0, 32.0],
        ['Arboreal Arowana', 16.0, 38.0], ['Honey-glazed Goliath', 19.0, 45.0], ['Ancient Arapaima', 28.0, 60.0]
    ],

    // 04. epic: masuk cerita, dikenang orang banyak
    epic: [
        ['The Golden Goliath', 45.0, 105.0], ['Amber Leviathan', 80.0, 180.0], ['Prehistoric Plesiosaur', 90.0, 210.0],
        ['Root-bound Behemoth', 85.0, 195.0], ['Sap-sealed Serpent', 60.0, 140.0], ['Chrono-Carp', 40.0, 95.0],
        ['Fossil-King Crabfish', 35.0, 85.0], ['Petrified Predator', 65.0, 150.0], ['The Viscous Vanguard', 50.0, 115.0],
        ['Epoch Emperor', 75.0, 170.0], ['Yggdrasil\'s Echo', 55.0, 125.0], ['Time-Lost Lungfish', 48.0, 110.0],
        ['Honey-Trap Hunter', 42.0, 98.0], ['Ancient Apex', 70.0, 160.0], ['Resin-Crowned Ray', 58.0, 130.0]
    ],

    // 05. legendary: jadi legenda, melampaui zaman
    legendary: [
        ['Sovereign of Sap', 250.0, 600.0], ['The Golden Fossil', 280.0, 650.0], ['Epoch-Eater', 420.0, 980.0],
        ['The Amber Ancestor', 350.0, 800.0], ['Yggdrasil\'s Memory', 500.0, 1200.0], ['Primeval Phantom', 320.0, 750.0],
        ['The Petrified Paladin', 260.0, 620.0], ['Time-Tethered Titan', 480.0, 1150.0], ['Mesozoic Monarch', 450.0, 1050.0],
        ['The Root-King\'s Remnant', 400.0, 950.0], ['Resin-Bound Ruler', 380.0, 880.0], ['Chrono-Colossus', 460.0, 1080.0],
        ['The Forever-Trapped', 290.0, 680.0], ['Honey-Drowned Hydra', 550.0, 1300.0], ['Ancient-Abyss Angler', 310.0, 720.0]
    ],

    // 06. liminal: di ambang batas dua dunia
    liminal: [
        ['Threshold Tarpon', 800.0, 1800.0], ['The In-Between Ichthyosaur', 1100.0, 2400.0], ['Half-Fossilized Horror', 950.0, 2100.0],
        ['Wavering Wood-fish', 750.0, 1750.0], ['The Sap-Shadow', 850.0, 1950.0], ['Edge of Antiquity', 1200.0, 2600.0],
        ['Time-Slip Sturgeon', 1050.0, 2300.0], ['The Shifting Sapling', 780.0, 1820.0], ['Boundary Bass', 720.0, 1680.0],
        ['Amorphous Amber', 1150.0, 2500.0], ['The Fading Flora', 880.0, 1980.0], ['Between-Epochs Eel', 920.0, 2050.0],
        ['The Golden Ghost', 1000.0, 2250.0], ['Spectral Sap-swimmer', 900.0, 2000.0], ['Twilight Tree-Tear', 1250.0, 2700.0]
    ],

    // 07. mythic: kebenarannya dipertanyakan
    mythic: [
        ['Myth of the Mesozoic', 3500.0, 7800.0], ['The World-Tree\'s Whisper', 5000.0, 11000.0], ['Fossilized Fenrir-Fish', 4500.0, 9800.0],
        ['The Golden Griffin-Gar', 4200.0, 9200.0], ['Yggdrasil\'s Firstborn', 4800.0, 10500.0], ['The Amber Oracle', 3800.0, 8400.0],
        ['Prehistoric Pantheon', 4100.0, 9000.0], ['Sap-Sealed Sphinx', 3900.0, 8600.0], ['The Chrono-Chimera', 4700.0, 10200.0],
        ['Legend of the Loam', 3300.0, 7200.0], ['The Root-Realm Ruler', 4000.0, 8800.0], ['The Petrified Prophet', 3600.0, 7900.0],
        ['Ancient Avatar', 4400.0, 9500.0], ['The Honeyed Haruspex', 3400.0, 7500.0], ['Mythic Megalodon', 5500.0, 12000.0]
    ],

    // 08. ascendant: sedang naik ke level yang lebih tinggi
    ascendant: [
        ['Rising Resin', 12000.0, 26000.0], ['Ascending Antiquity', 11500.0, 25500.0], ['The Evolving Epoch', 14000.0, 31000.0],
        ['Climbing Chrono-Carp', 10500.0, 23000.0], ['The Golden Growth', 13000.0, 28000.0], ['Uplifted Umbra', 12500.0, 27500.0],
        ['The Soaring Sap', 15000.0, 33000.0], ['Transcending Tree-Tear', 16000.0, 35000.0], ['The Upward Yggdrasil', 17000.0, 37000.0],
        ['Elevating Ember', 11000.0, 24000.0], ['The Ascendant Amber', 14500.0, 32000.0], ['Awakening Ancestor', 13500.0, 29500.0],
        ['The Fossil-Flight', 11800.0, 26500.0], ['Skyward Sapling', 10000.0, 22000.0], ['The Boundless Bark', 15500.0, 34000.0]
    ],

    // 09. celestial: skala surga dan bintang
    celestial: [
        ['Star-Trapped Sturgeon', 35000.0, 75000.0], ['Cosmic Copal', 48000.0, 105000.0], ['Meteor-Melt Marlin', 42000.0, 92000.0],
        ['The Golden Galaxy', 50000.0, 110000.0], ['Nebula Nemesis', 40000.0, 88000.0], ['Astral Amber', 45000.0, 98000.0],
        ['Solar-Sap Shark', 55000.0, 120000.0], ['Lunar Leviathan', 38000.0, 84000.0], ['The Celestial Coelacanth', 47000.0, 102000.0],
        ['Orbiting Origin', 41000.0, 90000.0], ['Zodiac Zander', 36000.0, 79000.0], ['Stellar Stone-fish', 39000.0, 86000.0],
        ['The Comet\'s Core', 34000.0, 75000.0], ['Yggdrasil\'s Constellation', 52000.0, 115000.0], ['Galactic Gum', 44000.0, 95000.0]
    ],

    // 10. eldritch: kuno dan tak terbayangkan
    eldritch: [
        ['The Crawling Chronos', 150000.0, 320000.0], ['Eldritch Epoch', 180000.0, 380000.0], ['Unfathomable Fossil', 200000.0, 420000.0],
        ['The Creeping Copal', 145000.0, 310000.0], ['Sap-Drowned Shoggoth', 250000.0, 520000.0], ['The Amber Abomination', 220000.0, 460000.0],
        ['Yggdrasil\'s Rot', 280000.0, 580000.0], ['Ancient Agony', 135000.0, 290000.0], ['The Petrified Panic', 165000.0, 350000.0],
        ['Viscous Void-Fish', 190000.0, 400000.0], ['The Golden Grotesque', 175000.0, 370000.0], ['Time-Twisted Terror', 210000.0, 440000.0],
        ['Nameless Nematode', 120000.0, 260000.0], ['The Root-Horror', 240000.0, 500000.0], ['Fossilized Fear', 155000.0, 330000.0]
    ],

    // 11. eternal: tidak lahir, tidak mati
    eternal: [
        ['The Everlasting Eel', 420000.0, 880000.0], ['Immortal Amber', 500000.0, 1050000.0], ['Timeless Tarpon', 450000.0, 950000.0],
        ['The Unaging Arowana', 380000.0, 800000.0], ['Forever-Fossil', 480000.0, 1000000.0], ['The Permanent Predator', 550000.0, 1150000.0],
        ['Enduring Epoch', 400000.0, 850000.0], ['Undying Yggdrasil', 650000.0, 1350000.0], ['The Perpetual Pike', 430000.0, 920000.0],
        ['Boundless Bark-fish', 520000.0, 1100000.0], ['The Infinite Inclusion', 600000.0, 1250000.0], ['Ageless Amberjack', 350000.0, 750000.0],
        ['The Constant Copal', 460000.0, 980000.0], ['Ever-Living Loach', 320000.0, 680000.0], ['The Eternal Enigma', 700000.0, 1450000.0]
    ],

    // 12. divine: setara dewa
    divine: [
        ['The Sap-God\'s Smelt', 1500000.0, 3100000.0], ['Divine Drop', 1800000.0, 3700000.0], ['The Holy Honey', 1200000.0, 2500000.0],
        ['Sacred Sapling', 1350000.0, 2800000.0], ['Yggdrasil\'s Blessing', 2500000.0, 5200000.0], ['The Golden Grail', 2000000.0, 4200000.0],
        ['Deity of the Depths', 2200000.0, 4500000.0], ['The Fossilized Father', 1650000.0, 3400000.0], ['Celestial Canopy Carp', 1900000.0, 3900000.0],
        ['Heavenly Heartwood', 1450000.0, 3000000.0], ['The Blessed Bark', 1550000.0, 3200000.0], ['Arboreal Angel', 1750000.0, 3600000.0],
        ['God-Forged Gar', 2800000.0, 5800000.0], ['The Divine Drip', 2100000.0, 4400000.0], ['Seraphic Seed', 1100000.0, 2300000.0]
    ],

    // 13. cosmic: skala alam semesta penuh
    cosmic: [
        ['Universal Umbra', 4800000.0, 10000000.0], ['The Cosmic Copal', 5500000.0, 11500000.0], ['Multiverse Marlin', 6000000.0, 12500000.0],
        ['Pan-Dimensional Pike', 5000000.0, 10500000.0], ['The Galaxy\'s Gum', 4200000.0, 8800000.0], ['Reality-Root Ray', 6500000.0, 13500000.0],
        ['Spacetime Sturgeon', 5800000.0, 12000000.0], ['The Cosmic Canopy', 4500000.0, 9500000.0], ['Astral-Amber Apex', 5200000.0, 11000000.0],
        ['The Big Bang Bass', 7500000.0, 15000000.0], ['Interstellar Ichthyosaur', 3800000.0, 8000000.0], ['Macro-Mesozoic', 4000000.0, 8500000.0],
        ['The Universal Yggdrasil', 8000000.0, 16500000.0], ['Galactic Golden-Tear', 3500000.0, 7200000.0], ['The Orbiting Ouroboros', 7000000.0, 14500000.0]
    ],

    // 14. primordial: ada sebelum segalanya bermula
    primordial: [
        ['The First Fossil', 15000000.0, 31000000.0], ['Proto-Pine', 12000000.0, 25000000.0], ['Before-Time Bass', 18000000.0, 38000000.0],
        ['Ancestral Amber', 20000000.0, 42000000.0], ['The Original Origin', 25000000.0, 52000000.0], ['Dawn of the Depths', 13500000.0, 28000000.0],
        ['Alpha-Arowana', 16500000.0, 34000000.0], ['Genesis Gar', 22000000.0, 46000000.0], ['Pre-Existence Pike', 19000000.0, 39000000.0],
        ['The First Fall', 14500000.0, 30000000.0], ['Primeval Pulse', 28000000.0, 58000000.0], ['The Root of Reality', 30000000.0, 62000000.0],
        ['The Formative Flora', 17500000.0, 36000000.0], ['Ancient-Alpha', 15500000.0, 32000000.0], ['Dawn-Tear Drop', 11000000.0, 23000000.0]
    ],

    // 15. transcendent: berada di luar semua kategori
    transcendent: [
        ['Beyond-Bark', 42000000.0, 88000000.0], ['The Unbound Amber', 50000000.0, 105000000.0], ['Transcendent Tree-Tear', 55000000.0, 115000000.0],
        ['Limitless Loach', 38000000.0, 80000000.0], ['The Uncategorized Umbra', 48000000.0, 100000000.0], ['Bound-Breaking Bass', 45000000.0, 95000000.0],
        ['The Formless Fossil', 60000000.0, 125000000.0], ['Ineffable Inclusion', 75000000.0, 150000000.0], ['Above-All Arowana', 65000000.0, 135000000.0],
        ['The Peerless Pine', 52000000.0, 110000000.0], ['Unfettered Flora', 40000000.0, 85000000.0], ['The Supernal Sap', 35000000.0, 75000000.0],
        ['Untethered Time', 70000000.0, 145000000.0], ['The Ultimate Upwelling', 80000000.0, 165000000.0], ['Beyond-Yggdrasil', 85000000.0, 180000000.0]
    ],

    // 16. apotheosis: puncak tertinggi menjadi sesuatu yang ilahi
    apotheosis: [
        ['The Pinnacle of Pines', 150000000.0, 320000000.0], ['Ascension\'s Amber', 180000000.0, 380000000.0], ['The God-Tier Gum', 200000000.0, 420000000.0],
        ['Perfection\'s Preserved', 135000000.0, 280000000.0], ['The Absolute Ancestor', 250000000.0, 520000000.0], ['Peak of the Primeval', 165000000.0, 350000000.0],
        ['Ultimate Uplift', 220000000.0, 460000000.0], ['Divine-Drop\'s Destiny', 190000000.0, 400000000.0], ['The Final Fossil', 280000000.0, 580000000.0],
        ['Yggdrasil\'s Zenith', 300000000.0, 620000000.0], ['Supreme Sap-Swimmer', 175000000.0, 360000000.0], ['The Crown of Copal', 145000000.0, 310000000.0],
        ['Exalted Epoch', 210000000.0, 440000000.0], ['Apex of Antiquity', 155000000.0, 330000000.0], ['The Sovereign Seed', 120000000.0, 250000000.0]
    ],

    // 17. absolute: tidak ada yang di atasnya dalam sistem ini
    absolute: [
        ['The Absolute Amber', 420000000.0, 880000000.0], ['Unconditional Umbra', 380000000.0, 800000000.0], ['Categorical Copal', 500000000.0, 1050000000.0],
        ['Indisputable Inclusion', 480000000.0, 1000000000.0], ['The Certain Seed', 350000000.0, 750000000.0], ['Unerring Yggdrasil', 600000000.0, 1250000000.0],
        ['Definite Drop', 450000000.0, 950000000.0], ['Incontestable Ichthyosaur', 550000000.0, 1150000000.0], ['The Undeniable Origin', 650000000.0, 1350000000.0],
        ['Flawless Fossil', 520000000.0, 1100000000.0], ['The Ultimate Unity', 750000000.0, 1500000000.0], ['Unquestionable Quartz-Fish', 400000000.0, 850000000.0],
        ['The Decisive Drop', 320000000.0, 680000000.0], ['Purest Primeval', 800000000.0, 1650000000.0], ['The Final Flora', 700000000.0, 1450000000.0]
    ],

    // 18. singularity: satu-satunya yang pernah dan akan pernah ada
    singularity: [
        ['The Singular Sap', 1500000000.0, 3200000000.0], ['Point-of-No-Return Pike', 1800000000.0, 3800000000.0], ['The One-and-Only Origin', 2000000000.0, 4200000000.0],
        ['Solitary Seed', 1350000000.0, 2800000000.0], ['The Lone Leaf', 1200000000.0, 2500000000.0], ['Isolated Inclusion', 2200000000.0, 4600000000.0],
        ['The Unique Umbra', 1650000000.0, 3500000000.0], ['Mono-Mesozoic', 1450000000.0, 3100000000.0], ['Single-State Sapling', 1900000000.0, 4000000000.0],
        ['The Convergence Copal', 2800000000.0, 5800000000.0], ['Absolute Alpha-Amber', 3000000000.0, 6200000000.0], ['The Only Ouroboros', 2500000000.0, 5200000000.0],
        ['The Solitary Spire', 1750000000.0, 3600000000.0], ['Yggdrasil\'s Core', 3500000000.0, 7200000000.0], ['The Singular Stone', 1100000000.0, 2400000000.0]
    ],

    // 19. paradox: seharusnya tidak mungkin eksis, tapi ada
    paradox: [
        ['The Impossible Inclusion', 5000000000.0, 10500000000.0], ['Contradiction Copal', 4500000000.0, 9500000000.0], ['The Logical Loop', 6000000000.0, 12500000000.0],
        ['Unreasonable Umbra', 5500000000.0, 11500000000.0], ['The Defiant Drop', 4200000000.0, 8800000000.0], ['Oxymoron Origin', 4800000000.0, 10000000000.0],
        ['Illogical Ichthyosaur', 6500000000.0, 13500000000.0], ['Irrational Yggdrasil', 7500000000.0, 15000000000.0], ['Baffling Bark', 3800000000.0, 8000000000.0],
        ['Conflicting Canopy', 5200000000.0, 11000000000.0], ['The Enigmatic Epoch', 7000000000.0, 14500000000.0], ['Perplexing Pine', 4600000000.0, 9800000000.0],
        ['Nonsensical Nematode', 3500000000.0, 7500000000.0], ['Mystery Mesozoic', 4000000000.0, 8500000000.0], ['The Riddle of Roots', 8000000000.0, 16500000000.0]
    ],

    // 20. null: di luar eksistensi itu sendiri
    null: [
        ['The Non-Existent Nodule', 15000000000.0, 32000000000.0], ['Void-Form Flora', 18000000000.0, 38000000000.0], ['The Empty Epoch', 20000000000.0, 42000000000.0],
        ['Zero-State Sap', 12000000000.0, 25000000000.0], ['The Blank Bark', 13500000000.0, 28000000000.0], ['Cipher Copal', 22000000000.0, 46000000000.0],
        ['Nullified Nectar', 16500000000.0, 35000000000.0], ['Absence of Amber', 25000000000.0, 52000000000.0], ['The Missing Mesozoic', 14500000000.0, 31000000000.0],
        ['Unwritten Umbra', 28000000000.0, 58000000000.0], ['Erased Entity', 19000000000.0, 40000000000.0], ['Forgotten Fossil', 30000000000.0, 62000000000.0],
        ['The Nameless Nothings', 17500000000.0, 36000000000.0], ['Zero-Point Zenith', 40000000000.0, 85000000000.0], ['Out-of-Bounds Origin', 11000000000.0, 24000000000.0]
    ]
};