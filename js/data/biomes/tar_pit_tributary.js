/**
 * TAR-PIT TRIBUTARY — Fish Data
 * Theme: Boiling asphalt, ice age, death traps.
 * Water: Bubbling hot asphalt, sticky and highly viscous.
 * Palette: ["#212121", "#424242"] (Obsidian & Dark Gray)
 */
const FISH_TAR_PIT_TRIBUTARY = {
    // 01. common: ada di mana-mana, gampang ditemukan
    common: [
        ['Tar Guppy', 0.5, 3.5], ['Sticky Smelt', 0.8, 4.0], ['Pitch Minnow', 0.6, 2.5],
        ['Sludge Sardine', 0.9, 3.8], ['Asphalt Fry', 0.5, 2.0], ['Obsidian Loach', 1.0, 4.5],
        ['Boiling Bubble-fish', 0.7, 3.0], ['Heavy Shiner', 1.2, 5.0], ['Muck Pupa', 0.4, 1.8],
        ['Trap Pinfish', 1.5, 4.2], ['Viscous Tetra', 0.6, 2.8], ['Dark Roach', 0.8, 3.2],
        ['Crusted Chub', 1.5, 6.0], ['Fossilized Fry', 0.5, 2.2], ['Snared Sprat', 1.0, 3.5]
    ],

    // 02. uncommon: perlu usaha, tapi masih realistis
    uncommon: [
        ['Bog Bass', 4.0, 12.0], ['Tar-Coated Trout', 5.5, 15.0], ['Asphalt Angelfish', 3.5, 10.0],
        ['Sludge Snapper', 6.0, 18.0], ['Sticky Sturgeon', 8.0, 25.0], ['Pitch Perch', 4.5, 14.0],
        ['Obsidian Pickerel', 5.0, 16.0], ['Sinking Salmon', 7.5, 22.0], ['Heavy Halibut', 9.0, 28.0],
        ['Bone-Fin Bass', 6.5, 19.0], ['Mire Mullet', 4.2, 13.0], ['Crusty Carp', 7.0, 20.0],
        ['Viscous Velvetfish', 3.8, 11.0], ['Mired Mackerel', 5.8, 17.0], ['Prehistoric Puffer', 8.5, 24.0]
    ],

    // 03. rare: butuh keberuntungan untuk dapat
    rare: [
        ['La Brea Lungfish', 25.0, 65.0], ['Bone-Plated Pike', 30.0, 75.0], ['Sabertooth Salmon', 35.0, 85.0],
        ['Mammoth Marlin', 50.0, 120.0], ['Obsidian Orca', 80.0, 190.0], ['Tar-Trapped Tarpon', 28.0, 70.0],
        ['Fossil Fangtooth', 20.0, 45.0], ['Asphalt Arowana', 32.0, 78.0], ['Boiling Barracuda', 40.0, 95.0],
        ['Viscous Viperfish', 22.0, 55.0], ['Sludge Shark', 60.0, 140.0], ['Prehistoric Paddlefish', 45.0, 105.0],
        ['Sticky Stingray', 38.0, 90.0], ['Bog Behemoth', 75.0, 180.0], ['Crusted Coelacanth', 42.0, 100.0]
    ],

    // 04. epic: masuk cerita, dikenang orang banyak
    epic: [
        ['Dire-Wolf Dolphin', 120.0, 280.0], ['Asphalt Alligator-Gar', 150.0, 350.0], ['Megaloceros Manta', 180.0, 420.0],
        ['Obsidian Octopus', 100.0, 240.0], ['Pitch-Black Predator', 140.0, 320.0], ['Tar-Pit Titan', 250.0, 580.0],
        ['Mammoth Megalodon', 300.0, 750.0], ['Sludge Serpent', 160.0, 380.0], ['The Bone-Crusher', 200.0, 480.0],
        ['Viscous Vanguard', 130.0, 310.0], ['Heavy-Water Hydra', 220.0, 520.0], ['Trapped Terror', 190.0, 450.0],
        ['Smilodon Shark', 280.0, 650.0], ['Fossilized Fluke', 110.0, 260.0], ['Bog Goliath', 260.0, 600.0]
    ],

    // 05. legendary: jadi legenda, melampaui zaman
    legendary: [
        ['The Tar-King Sturgeon', 500.0, 1200.0], ['La Brea Leviathan', 650.0, 1500.0], ['Obsidian Overlord', 700.0, 1650.0],
        ['The Boiling Behemoth', 550.0, 1300.0], ['Asphalt Ancestor', 450.0, 1050.0], ['Prehistoric Phantom', 400.0, 950.0],
        ['The Sticky Sovereign', 600.0, 1400.0], ['Dire-Depth Dragonfish', 520.0, 1250.0], ['Mammoth Monarch', 800.0, 1900.0],
        ['Sludge-Born Serpent', 480.0, 1150.0], ['The Fossilized Father', 750.0, 1800.0], ['Pitch-Black Paladin', 420.0, 980.0],
        ['Bone-Woven Whale', 850.0, 2000.0], ['Tar-Bound Titan', 900.0, 2200.0], ['The Crusted Colossus', 950.0, 2300.0]
    ],

    // 06. liminal: di ambang batas dua dunia
    liminal: [
        ['Threshold Tarpon', 1500.0, 3500.0], ['The Sinking Shadow', 1800.0, 4200.0], ['Half-Fossilized Flounder', 1200.0, 2800.0],
        ['Wavering Whale', 2500.0, 5800.0], ['Between-Bones Bass', 1400.0, 3200.0], ['Phantom Pitch', 1600.0, 3800.0],
        ['The Liminal Lungfish', 1300.0, 3000.0], ['Shifting Sludge', 1900.0, 4500.0], ['Borderline Behemoth', 2200.0, 5200.0],
        ['The Ghostly Gar', 1700.0, 4000.0], ['Viscous Veil', 1100.0, 2500.0], ['Edge of Extinction', 2800.0, 6500.0],
        ['Spectral Smilodon', 3000.0, 7200.0], ['The Trapped Twilight', 2000.0, 4800.0], ['Amorphous Asphalt', 2600.0, 6000.0]
    ],

    // 07. mythic: kebenarannya dipertanyakan
    mythic: [
        ['Myth of the Mire', 4500.0, 10500.0], ['The Mastodon Megalodon', 6000.0, 14000.0], ['Fossilized Fenrir', 5200.0, 12000.0],
        ['Obsidian Oracle', 4000.0, 9500.0], ['The Tar-Pit Terror', 5500.0, 13000.0], ['Legend of La Brea', 7000.0, 16000.0],
        ['The Boiling Basilisk', 4800.0, 11000.0], ['Sludge-Sealed Sphinx', 3800.0, 8800.0], ['Asphalt Avatar', 5800.0, 13500.0],
        ['Prehistoric Prophet', 4200.0, 9800.0], ['The Bone-Chiller', 6500.0, 15000.0], ['Mythic Manta', 5000.0, 11500.0],
        ['The Pitch-Black Phantom', 4600.0, 10800.0], ['Lore of the Loam', 3500.0, 8000.0], ['The Crusted Chimera', 7500.0, 17500.0]
    ],

    // 08. ascendant: sedang naik ke level yang lebih tinggi
    ascendant: [
        ['Rising Resin', 12000.0, 28000.0], ['Ascending Asphalt', 15000.0, 35000.0], ['The Uplifted Umbra', 11000.0, 25000.0],
        ['Evolving Extinction', 18000.0, 42000.0], ['The Soaring Sludge', 14000.0, 32000.0], ['Climbing Crust', 13000.0, 30000.0],
        ['Transcending Tar', 20000.0, 48000.0], ['The Upward Obsidian', 16000.0, 38000.0], ['Elevating Epoch', 19000.0, 45000.0],
        ['Awakened Ancestor', 22000.0, 52000.0], ['The Skyward Sabertooth', 25000.0, 60000.0], ['Rising Remains', 10500.0, 24000.0],
        ['The Ascendant Abyss', 28000.0, 65000.0], ['Uprising Undead', 17000.0, 40000.0], ['The Elevated Enigma', 30000.0, 72000.0]
    ],

    // 09. celestial: skala surga dan bintang
    celestial: [
        ['Meteor Sludge', 45000.0, 105000.0], ['Cosmic Crust', 55000.0, 125000.0], ['The Stellar Sabertooth', 60000.0, 140000.0],
        ['Obsidian Orbit', 40000.0, 95000.0], ['Galactic Gar', 50000.0, 115000.0], ['Solar Sludge', 48000.0, 110000.0],
        ['Astral Asphalt', 70000.0, 160000.0], ['The Comet\'s Core', 38000.0, 88000.0], ['Nebula Node', 65000.0, 150000.0],
        ['Space-Tar Sturgeon', 75000.0, 175000.0], ['Cosmic Carcass', 42000.0, 98000.0], ['The Celestial Coelacanth', 52000.0, 120000.0],
        ['Planetary Pitch', 46000.0, 108000.0], ['Orbiting Origin', 58000.0, 135000.0], ['Meteorite Manta', 80000.0, 190000.0]
    ],

    // 10. eldritch: kuno dan tak terbayangkan
    eldritch: [
        ['Abyssal Asphalt', 150000.0, 350000.0], ['Sludge Shoggoth', 250000.0, 580000.0], ['Unfathomable Fossil', 180000.0, 420000.0],
        ['The Creeping Crust', 120000.0, 280000.0], ['Tar-Drowned Terror', 200000.0, 480000.0], ['Eldritch Extinction', 280000.0, 650000.0],
        ['The Boiling Blight', 160000.0, 380000.0], ['Horrifying Halibut', 140000.0, 320000.0], ['Obsidian Ooze', 220000.0, 520000.0],
        ['The Pitch-Black Panic', 190000.0, 450000.0], ['Nameless Nightmare', 110000.0, 250000.0], ['The Viscous Void', 300000.0, 700000.0],
        ['Ancient Agony', 170000.0, 400000.0], ['The Deep-Trap Demon', 260000.0, 600000.0], ['Reality-Rending Resin', 350000.0, 800000.0]
    ],

    // 11. eternal: tidak lahir, tidak mati
    eternal: [
        ['Timeless Tar', 600000.0, 1400000.0], ['Undying Obsidian', 800000.0, 1800000.0], ['The Everlasting Epoch', 550000.0, 1300000.0],
        ['Immortal Ice-Age', 900000.0, 2100000.0], ['The Forever Fossil', 700000.0, 1600000.0], ['Permanent Pitch', 500000.0, 1150000.0],
        ['Endless Extinction', 1000000.0, 2400000.0], ['Ageless Asphalt', 650000.0, 1500000.0], ['The Perpetual Predator', 850000.0, 1950000.0],
        ['Unaging Umbra', 480000.0, 1100000.0], ['The Boundless Bone', 750000.0, 1750000.0], ['Constant Crust', 580000.0, 1350000.0],
        ['Unceasing Sludge', 950000.0, 2250000.0], ['The Eternal Enigma', 1200000.0, 2800000.0], ['The Deathless Drop', 1100000.0, 2600000.0]
    ],

    // 12. divine: setara dewa
    divine: [
        ['Sacred Sludge', 2000000.0, 4800000.0], ['Deity of the Deep Pit', 3500000.0, 8000000.0], ['The Holy Halibut', 1500000.0, 3500000.0],
        ['Divine Drop', 2500000.0, 5800000.0], ['God-Forged Gar', 1800000.0, 4200000.0], ['The Blessed Bone', 2200000.0, 5200000.0],
        ['Heavenly Heavy-Water', 1600000.0, 3800000.0], ['The Tar-Pit Templar', 2800000.0, 6500000.0], ['Obsidian Omnipotence', 4000000.0, 9500000.0],
        ['Seraphic Sabertooth', 3200000.0, 7500000.0], ['The Almighty Asphalt', 4500000.0, 10500000.0], ['Celestial Crust', 1900000.0, 4500000.0],
        ['Divine Death-Trap', 3800000.0, 8800000.0], ['The Righteous Resin', 2600000.0, 6000000.0], ['Sovereign of the Sink', 5000000.0, 12000000.0]
    ],

    // 13. cosmic: skala alam semesta penuh
    cosmic: [
        ['Universal Umbra', 8000000.0, 19000000.0], ['Galactic Grave', 12000000.0, 28000000.0], ['Multiverse Mastodon', 15000000.0, 35000000.0],
        ['Pan-Dimensional Pitch', 10000000.0, 24000000.0], ['The Cosmic Crust', 7500000.0, 17500000.0], ['Spacetime Sludge', 18000000.0, 42000000.0],
        ['Macro-Mire', 9000000.0, 21000000.0], ['The Astral Asphalt', 11000000.0, 25000000.0], ['Reality-Rending Remains', 22000000.0, 52000000.0],
        ['Big-Bang Bone', 25000000.0, 58000000.0], ['Interstellar Ice-Age', 16000000.0, 38000000.0], ['The Void-Viscosity', 28000000.0, 65000000.0],
        ['Universal Unrest', 14000000.0, 32000000.0], ['The Orbiting Obsidian', 13000000.0, 30000000.0], ['Cosmic Carcass-Fish', 20000000.0, 48000000.0]
    ],

    // 14. primordial: ada sebelum segalanya bermula
    primordial: [
        ['First Fossil', 35000000.0, 80000000.0], ['Proto-Pitch', 40000000.0, 95000000.0], ['Ancestral Asphalt', 50000000.0, 120000000.0],
        ['Dawn of the Death-Trap', 45000000.0, 105000000.0], ['The Original Obsidian', 60000000.0, 140000000.0], ['Alpha-Abyss', 30000000.0, 70000000.0],
        ['Genesis Gar', 55000000.0, 130000000.0], ['The Primeval Predator', 75000000.0, 175000000.0], ['Before-Time Bone', 38000000.0, 88000000.0],
        ['First Fall of Tar', 48000000.0, 110000000.0], ['The Formative Fossil', 42000000.0, 98000000.0], ['Ancient-Alpha', 65000000.0, 150000000.0],
        ['Primeval Pulse', 80000000.0, 190000000.0], ['The Root of Ruin', 70000000.0, 165000000.0], ['Dawn-Drop Sturgeon', 90000000.0, 210000000.0]
    ],

    // 15. transcendent: berada di luar semua kategori
    transcendent: [
        ['Beyond-Bone', 150000000.0, 350000000.0], ['Unbound Obsidian', 200000000.0, 480000000.0], ['Transcendent Tar', 180000000.0, 420000000.0],
        ['Limitless La Brea', 250000000.0, 580000000.0], ['The Formless Fossil', 220000000.0, 520000000.0], ['Above-All Asphalt', 300000000.0, 700000000.0],
        ['The Peerless Pitch', 160000000.0, 380000000.0], ['Untethered Terror', 280000000.0, 650000000.0], ['Bound-Breaking Bass', 120000000.0, 280000000.0],
        ['Ineffable Ice-Age', 350000000.0, 800000000.0], ['The Supernal Sludge', 190000000.0, 450000000.0], ['Unfettered Fossil', 140000000.0, 320000000.0],
        ['Transcending Trap', 400000000.0, 950000000.0], ['The Ultimate Umbra', 320000000.0, 750000000.0], ['Beyond-The-Mire', 450000000.0, 1050000000.0]
    ],

    // 16. apotheosis: puncak tertinggi menjadi sesuatu yang ilahi
    apotheosis: [
        ['Apex of Asphalt', 600000000.0, 1400000000.0], ['Pinnacle of Pitch', 750000000.0, 1750000000.0], ['The Tar-God\'s Triumph', 900000000.0, 2100000000.0],
        ['Perfection\'s Phantom', 550000000.0, 1300000000.0], ['Absolute Ancestor', 800000000.0, 1900000000.0], ['The Divine Drop', 1000000000.0, 2400000000.0],
        ['Exalted Extinction', 650000000.0, 1500000000.0], ['Supreme Sludge', 850000000.0, 1950000000.0], ['Zenith of the Sink', 1200000000.0, 2800000000.0],
        ['The God-Tier Grave', 1100000000.0, 2500000000.0], ['Ultimate Uplift', 500000000.0, 1150000000.0], ['Sovereign of the Snare', 1300000000.0, 3000000000.0],
        ['The Crowned Crust', 700000000.0, 1600000000.0], ['Apex Predator', 1400000000.0, 3200000000.0], ['The Concluding Carcass', 1500000000.0, 3500000000.0]
    ],

    // 17. absolute: tidak ada yang di atasnya dalam sistem ini
    absolute: [
        ['Absolute Asphalt', 2000000000.0, 4800000000.0], ['Inevitable Obsidian', 2500000000.0, 5800000000.0], ['The Certain Sink', 1800000000.0, 4200000000.0],
        ['Categorical Crust', 3000000000.0, 7000000000.0], ['Unerring Umbra', 2200000000.0, 5200000000.0], ['Indisputable Ice-Age', 3500000000.0, 8000000000.0],
        ['The Definite Death-Trap', 2800000000.0, 6500000000.0], ['Incontestable Extinction', 4000000000.0, 9500000000.0], ['Undeniable Origin', 1600000000.0, 3800000000.0],
        ['Flawless Fossil', 4500000000.0, 10500000000.0], ['The Final Fall', 3200000000.0, 7500000000.0], ['Purest Pitch', 5000000000.0, 12000000000.0],
        ['The Decisive Drop', 1900000000.0, 4500000000.0], ['The Ultimate Unison', 5500000000.0, 13000000000.0], ['Absolute Abyss', 6000000000.0, 14000000000.0]
    ],

    // 18. singularity: satu-satunya yang pernah dan akan pernah ada
    singularity: [
        ['Singularity Sludge', 8000000000.0, 19000000000.0], ['The Black Hole Bass', 12000000000.0, 28000000000.0], ['Solitary Sink', 7000000000.0, 16000000000.0],
        ['Point-of-No-Return Pitch', 10000000000.0, 24000000000.0], ['The Event Horizon', 15000000000.0, 35000000000.0], ['One-and-Only Obsidian', 9000000000.0, 21000000000.0],
        ['Isolated Ice-Age', 11000000000.0, 25000000000.0], ['Unique Umbra', 6500000000.0, 15000000000.0], ['Mono-Mire', 13000000000.0, 30000000000.0],
        ['The Convergence Crust', 18000000000.0, 42000000000.0], ['Absolute Alpha-Asphalt', 22000000000.0, 52000000000.0], ['The Only Origin', 14000000000.0, 32000000000.0],
        ['The Singular Snare', 20000000000.0, 48000000000.0], ['The Sole Survivor', 16000000000.0, 38000000000.0], ['Tar-Pit\'s Core', 25000000000.0, 58000000000.0]
    ],

    // 19. paradox: seharusnya tidak mungkin eksis, tapi ada
    paradox: [
        ['Flowing Stone', 35000000000.0, 80000000000.0], ['Ice-Tar Illusion', 28000000000.0, 65000000000.0], ['The Impossible Ice-Age', 45000000000.0, 105000000000.0],
        ['Contradiction Crust', 30000000000.0, 70000000000.0], ['Logical Loop of La Brea', 50000000000.0, 120000000000.0], ['Unreasonable Umbra', 38000000000.0, 88000000000.0],
        ['The Defiant Drop', 40000000000.0, 95000000000.0], ['Oxymoron Obsidian', 32000000000.0, 75000000000.0], ['Illogical Extinction', 55000000000.0, 130000000000.0],
        ['Baffling Bone', 26000000000.0, 60000000000.0], ['Conflicting Core', 60000000000.0, 140000000000.0], ['The Enigmatic Epoch', 42000000000.0, 98000000000.0],
        ['Perplexing Pitch', 48000000000.0, 110000000000.0], ['Nonsensical Snare', 65000000000.0, 150000000000.0], ['The Riddle of the Ruin', 75000000000.0, 175000000000.0]
    ],

    // 20. null: di luar eksistensi itu sendiri
    null: [
        ['Void Pitch', 150000000000.0, 350000000000.0], ['Non-Existent Nodule', 120000000000.0, 280000000000.0], ['Empty Extinction', 200000000000.0, 480000000000.0],
        ['Zero-State Sludge', 180000000000.0, 420000000000.0], ['The Blank Bone', 140000000000.0, 320000000000.0], ['Cipher Crust', 250000000000.0, 580000000000.0],
        ['Nullified Nightmare', 100000000000.0, 240000000000.0], ['Absence of Asphalt', 300000000000.0, 700000000000.0], ['The Missing Mire', 160000000000.0, 380000000000.0],
        ['Unwritten Umbra', 220000000000.0, 520000000000.0], ['Erased Entity', 280000000000.0, 650000000000.0], ['Forgotten Fossil', 350000000000.0, 800000000000.0],
        ['The Nameless Nothing', 190000000000.0, 450000000000.0], ['Zero-Point Zenith', 400000000000.0, 950000000000.0], ['Out-of-Bounds Obsidian', 500000000000.0, 1200000000000.0]
    ]
};