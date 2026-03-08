/**
 * OSSUARY OCEAN — Fish Data
 * Theme: Bones, calcium, Leviathan graveyard, silence.
 * Water: Milky white, heavily laden with calcium and dust.
 * Palette: ["#e0e0e0", "#8d6e63"] (Bone White & Marrow Brown)
 */
const FISH_OSSUARY_OCEAN = {
    // 01. common: ada di mana-mana, gampang ditemukan
    common: [
        ['Bone Guppy', 0.1, 1.2], ['Calcium Minnow', 0.2, 1.5], ['Chalk Sprat', 0.1, 0.8],
        ['Ribcage Roach', 0.3, 1.8], ['Pale Pinfish', 0.2, 0.9], ['Ivory Smelt', 0.4, 2.0],
        ['Skeleton Sardine', 0.1, 1.1], ['Marrow Fry', 0.3, 1.4], ['Milky Shiner', 0.1, 0.7],
        ['Skull Loach', 0.2, 1.0], ['Vertebrae Tetra', 0.5, 2.5], ['Ash Chub', 0.4, 1.6],
        ['Dust Minnow', 0.2, 1.3], ['Splinter Puffer', 0.6, 2.8], ['Pale-fin Perch', 0.1, 0.9]
    ],

    // 02. uncommon: perlu usaha, tapi masih realistis
    uncommon: [
        ['Femur Flounder', 2.0, 5.5], ['Spinal Snapper', 3.0, 7.0], ['Pelvic Pickerel', 4.0, 9.0],
        ['Cranial Carp', 2.5, 6.0], ['Ivory Angelfish', 4.5, 10.0], ['Osteo Bass', 5.0, 11.0],
        ['Tibia Trout', 3.5, 8.0], ['Skeleton Salmon', 3.0, 7.5], ['Marrow Mullet', 2.0, 4.5],
        ['Chalk Catfish', 3.8, 8.5], ['Ossified Oarfish', 2.2, 5.0], ['Grave Grouper', 5.5, 12.0],
        ['Bone-Plated Bream', 4.0, 9.5], ['Crypt Chub', 3.2, 7.2], ['Pale Pike', 4.2, 9.8]
    ],

    // 03. rare: butuh keberuntungan untuk dapat
    rare: [
        ['Rib-Woven Ray', 12.0, 28.0], ['Skeletal Shark', 18.0, 42.0], ['Phantom Paddlefish', 15.0, 35.0],
        ['Marrow Marlin', 20.0, 48.0], ['Jawbone Jack', 22.0, 50.0], ['Calcium Coelacanth', 10.0, 25.0],
        ['Ivory Arowana', 8.0, 18.0], ['Skull-Crusher Crabfish', 17.0, 40.0], ['Vertebrae Viperfish', 25.0, 55.0],
        ['Tomb Tarpon', 24.0, 52.0], ['Ossuary Orca', 9.0, 20.0], ['Calcified Cobia', 14.0, 32.0],
        ['Bone-Spur Sturgeon', 16.0, 38.0], ['Ghost-White Grouper', 19.0, 45.0], ['Leviathan\'s Tooth', 28.0, 60.0]
    ],

    // 04. epic: masuk cerita, dikenang orang banyak
    epic: [
        ['Grave-Robber Ray', 45.0, 105.0], ['Mausoleum Manta', 80.0, 180.0], ['Rib-Cage Requiem', 90.0, 210.0],
        ['Skeleton-King Salmon', 85.0, 195.0], ['Ivory Leviathan', 60.0, 140.0], ['Osteoderm Octopus', 40.0, 95.0],
        ['Skull-Faced Shark', 35.0, 85.0], ['The Marrow Monarch', 65.0, 150.0], ['Fossilized Fangtooth', 50.0, 115.0],
        ['Chalk Colossus', 75.0, 170.0], ['Rib-Reaver', 55.0, 125.0], ['Calcium Kraken', 48.0, 110.0],
        ['Spine-Tail Stingray', 42.0, 98.0], ['Pale Phantom', 70.0, 160.0], ['The Crypt-Keeper Carp', 58.0, 130.0]
    ],

    // 05. legendary: jadi legenda, melampaui zaman
    legendary: [
        ['Sovereign of Bones', 250.0, 600.0], ['Leviathan\'s Rib', 280.0, 650.0], ['The Ivory Emperor', 420.0, 980.0],
        ['Ghost-Whale Guardian', 350.0, 800.0], ['Marrow-Eater Megalodon', 500.0, 1200.0], ['The Calcified King', 320.0, 750.0],
        ['Skull-Island Serpent', 260.0, 620.0], ['Spinal Sovereign', 480.0, 1150.0], ['The Pale Patriarch', 450.0, 1050.0],
        ['Bone-Armored Behemoth', 400.0, 950.0], ['Guardian of the Grave', 380.0, 880.0], ['The White Wake', 460.0, 1080.0],
        ['Osteo-Oracle', 290.0, 680.0], ['Titan\'s Tibia', 550.0, 1300.0], ['The Skeletal Sentinel', 310.0, 720.0]
    ],

    // 06. liminal: di ambang batas dua dunia
    liminal: [
        ['Threshold Terror', 800.0, 1800.0], ['The Half-Bone Halibut', 1100.0, 2400.0], ['Wavering Wraith', 950.0, 2100.0],
        ['Liminal Leviathan', 750.0, 1750.0], ['The Ghostly Gills', 850.0, 1950.0], ['Edge of the Ossuary', 1200.0, 2600.0],
        ['Spectral Spine', 1050.0, 2300.0], ['The Fading Femur', 780.0, 1820.0], ['Between-Realms Ray', 720.0, 1680.0],
        ['Phantom Pelvis', 1150.0, 2500.0], ['The Ivory Illusion', 880.0, 1980.0], ['Shifting Skull', 920.0, 2050.0],
        ['Purgatory Pike', 1000.0, 2250.0], ['Borderline Bone-Fish', 900.0, 2000.0], ['The Pale Passage', 1250.0, 2700.0]
    ],

    // 07. mythic: kebenarannya dipertanyakan
    mythic: [
        ['Myth of the Marrow', 3500.0, 7800.0], ['Leviathan\'s Ghost', 5000.0, 11000.0], ['The Bone Basilisk', 4500.0, 9800.0],
        ['Skull-Throne Serpent', 4200.0, 9200.0], ['The Ivory Idol', 4800.0, 10500.0], ['Calcified Chimera', 3800.0, 8400.0],
        ['The Skeletal Sphinx', 4100.0, 9000.0], ['Oracle of the Ossuary', 3900.0, 8600.0], ['Bone-Woven Wyrm', 4700.0, 10200.0],
        ['Grave-God\'s Grouper', 3300.0, 7200.0], ['The Pale Prophet', 4000.0, 8800.0], ['Mythic Mastodon-Fish', 3600.0, 7900.0],
        ['Cryptic Coelacanth', 4400.0, 9500.0], ['Legend of the Leviathan', 3400.0, 7500.0], ['The Skeletal Siren', 5500.0, 12000.0]
    ],

    // 08. ascendant: sedang naik ke level yang lebih tinggi
    ascendant: [
        ['Ascending Ash', 12000.0, 26000.0], ['Rising Ribcage', 11500.0, 25500.0], ['The Uplifted Urn', 14000.0, 31000.0],
        ['Transcending Tomb', 10500.0, 23000.0], ['Evolving Osteo', 13000.0, 28000.0], ['The Skyward Skull', 12500.0, 27500.0],
        ['Elevating Ivory', 15000.0, 33000.0], ['Awakened Ancestor', 16000.0, 35000.0], ['Resurrected Ray', 17000.0, 37000.0],
        ['The Ascendant Apparition', 11000.0, 24000.0], ['Soaring Skeleton', 14500.0, 32000.0], ['Upward Ossuary', 13500.0, 29500.0],
        ['The Bone-Climber', 11800.0, 26500.0], ['Rising Relic', 10000.0, 22000.0], ['Ascended Anomaly', 15500.0, 34000.0]
    ],

    // 09. celestial: skala surga dan bintang
    celestial: [
        ['Stellar Skull', 35000.0, 75000.0], ['Cosmic Calcium', 48000.0, 105000.0], ['Nebula Necropolis', 42000.0, 92000.0],
        ['Astral Ash', 50000.0, 110000.0], ['The Milky-Way Marrow', 40000.0, 88000.0], ['Celestial Spine', 45000.0, 98000.0],
        ['Galactic Grave', 55000.0, 120000.0], ['Solar Skeleton', 38000.0, 84000.0], ['Orbiting Ossuary', 47000.0, 102000.0],
        ['The Comet\'s Cranium', 41000.0, 90000.0], ['Zodiac Zombie-Fish', 36000.0, 79000.0], ['Meteorite Mandible', 39000.0, 86000.0],
        ['The Lunar Leviathan', 34000.0, 75000.0], ['Star-Dust Sturgeon', 52000.0, 115000.0], ['The Ivory Infinity', 44000.0, 95000.0]
    ],

    // 10. eldritch: kuno dan tak terbayangkan
    eldritch: [
        ['Eldritch Endoskeleton', 150000.0, 320000.0], ['The Crawling Crypt', 180000.0, 380000.0], ['Unfathomable Urn', 200000.0, 420000.0],
        ['Abyssal Ash', 145000.0, 310000.0], ['The Creeping Calcium', 250000.0, 520000.0], ['Skull of the Nameless', 220000.0, 460000.0],
        ['Lovecraftian Leviathan', 280000.0, 580000.0], ['The Marrow Madness', 135000.0, 290000.0], ['Deep-Grave Demon', 165000.0, 350000.0],
        ['Horrifying Husk', 190000.0, 400000.0], ['Osteo-Occultist', 175000.0, 370000.0], ['Bone-Chilling Behemoth', 210000.0, 440000.0],
        ['The Pale Panic', 120000.0, 260000.0], ['Crypt-Crawler', 240000.0, 500000.0], ['Void-Touched Vertebrae', 155000.0, 330000.0]
    ],

    // 11. eternal: tidak lahir, tidak mati
    eternal: [
        ['Timeless Tibia', 420000.0, 880000.0], ['Immortal Ivory', 500000.0, 1050000.0], ['The Everlasting Endoskeleton', 450000.0, 950000.0],
        ['Undying Ossuary', 380000.0, 800000.0], ['Permanent Pale', 480000.0, 1000000.0], ['The Forever Fossil', 550000.0, 1150000.0],
        ['Boundless Bone', 400000.0, 850000.0], ['Endless Enigma', 650000.0, 1350000.0], ['The Perpetual Phantom', 430000.0, 920000.0],
        ['Ageless Ash', 520000.0, 1100000.0], ['Unaging Urn', 600000.0, 1250000.0], ['Deathless Dust', 350000.0, 750000.0],
        ['The Constant Cranium', 460000.0, 980000.0], ['Ever-Living Marrow', 320000.0, 680000.0], ['Eternal Echo', 700000.0, 1450000.0]
    ],

    // 12. divine: setara dewa
    divine: [
        ['Divine Dust', 1500000.0, 3100000.0], ['Sacred Skull', 1800000.0, 3700000.0], ['The Holy Husk', 1200000.0, 2500000.0],
        ['God-Forged Grave', 1350000.0, 2800000.0], ['Celestial Cenotaph', 2500000.0, 5200000.0], ['The Bone-God\'s Blessing', 2000000.0, 4200000.0],
        ['Heavenly Halibut', 2200000.0, 4500000.0], ['Blessed Bone', 1650000.0, 3400000.0], ['Deity of the Dead', 1900000.0, 3900000.0],
        ['The Seraphic Spine', 1450000.0, 3000000.0], ['Seraphic Skeleton', 1550000.0, 3200000.0], ['The Righteous Rib', 1750000.0, 3600000.0],
        ['Holy-Water Wraith', 2800000.0, 5800000.0], ['Sovereign of the Silent Sea', 2100000.0, 4400000.0], ['The Revered Relic', 1100000.0, 2300000.0]
    ],

    // 13. cosmic: skala alam semesta penuh
    cosmic: [
        ['Universal Urn', 4800000.0, 10000000.0], ['Pan-Dimensional Pelvis', 5500000.0, 11500000.0], ['Multiverse Marrow', 6000000.0, 12500000.0],
        ['The Cosmic Crypt', 5000000.0, 10500000.0], ['Macro-Mausoleum', 4200000.0, 8800000.0], ['Spacetime Skeleton', 6500000.0, 13500000.0],
        ['Astral Anatomy', 5800000.0, 12000000.0], ['Interstellar Ivory', 4500000.0, 9500000.0], ['Galactic Ghost', 5200000.0, 11000000.0],
        ['The Void-Vertebrae', 7500000.0, 15000000.0], ['Reality-Rending Rib', 3800000.0, 8000000.0], ['Constellation Cranium', 4000000.0, 8500000.0],
        ['The Big-Bang Bone', 8000000.0, 16500000.0], ['Orbiting Osteo', 3500000.0, 7200000.0], ['Cosmic Carcass', 7000000.0, 14500000.0]
    ],

    // 14. primordial: ada sebelum segalanya bermula
    primordial: [
        ['The First Fossil', 15000000.0, 31000000.0], ['Proto-Pelvis', 12000000.0, 25000000.0], ['Alpha-Ash', 18000000.0, 38000000.0],
        ['Ancestral Anatomy', 20000000.0, 42000000.0], ['Dawn of the Dead', 25000000.0, 52000000.0], ['Primeval Phantom', 13500000.0, 28000000.0],
        ['The Original Osteo', 16500000.0, 34000000.0], ['Genesis Grave', 22000000.0, 46000000.0], ['Before-Time Bone', 19000000.0, 39000000.0],
        ['Firstborn of the Ossuary', 14500000.0, 30000000.0], ['The Primordial Pale', 28000000.0, 58000000.0], ['Ancient Apparition', 30000000.0, 62000000.0],
        ['Root of the Rib', 17500000.0, 36000000.0], ['The Formative Frame', 15500000.0, 32000000.0], ['The First Phantom', 11000000.0, 23000000.0]
    ],

    // 15. transcendent: berada di luar semua kategori
    transcendent: [
        ['Transcendent Tomb', 42000000.0, 88000000.0], ['Beyond-Bone', 50000000.0, 105000000.0], ['The Unbound Urn', 55000000.0, 115000000.0],
        ['Limitless Leviathan', 38000000.0, 80000000.0], ['The Formless Frame', 48000000.0, 100000000.0], ['Above-All Ash', 45000000.0, 95000000.0],
        ['Ineffable Ivory', 60000000.0, 125000000.0], ['Peerless Phantom', 75000000.0, 150000000.0], ['Bound-Breaking Bone', 65000000.0, 135000000.0],
        ['The Supernal Skeleton', 52000000.0, 110000000.0], ['Untethered Tibia', 40000000.0, 85000000.0], ['Transcending Terror', 35000000.0, 75000000.0],
        ['The Ultimate Undead', 70000000.0, 145000000.0], ['Unfettered Fossil', 80000000.0, 165000000.0], ['Beyond-the-Grave', 85000000.0, 180000000.0]
    ],

    // 16. apotheosis: puncak tertinggi menjadi sesuatu yang ilahi
    apotheosis: [
        ['Apex of Ash', 150000000.0, 320000000.0], ['Pinnacle of the Pale', 180000000.0, 380000000.0], ['The Bone-God\'s Zenith', 200000000.0, 420000000.0],
        ['Perfection\'s Phantom', 135000000.0, 280000000.0], ['Supreme Skeleton', 250000000.0, 520000000.0], ['The God-Tier Grave', 165000000.0, 350000000.0],
        ['Ultimate Urn', 220000000.0, 460000000.0], ['Exalted Endoskeleton', 190000000.0, 400000000.0], ['The Crowned Cranium', 280000000.0, 580000000.0],
        ['Sovereign of the Silence', 300000000.0, 620000000.0], ['The Apotheosis of Anatomy', 175000000.0, 360000000.0], ['The Highest Husk', 145000000.0, 310000000.0],
        ['Zenith of the Zombie-Fish', 210000000.0, 440000000.0], ['The Final Frame', 155000000.0, 330000000.0], ['Culmination of Calcium', 120000000.0, 250000000.0]
    ],

    // 17. absolute: tidak ada yang di atasnya dalam sistem ini
    absolute: [
        ['Absolute Ash', 420000000.0, 880000000.0], ['The Certain Skull', 380000000.0, 800000000.0], ['Indisputable Ivory', 500000000.0, 1050000000.0],
        ['Categorical Calcium', 480000000.0, 1000000000.0], ['Unerring Urn', 350000000.0, 750000000.0], ['Flawless Frame', 600000000.0, 1250000000.0],
        ['The Undeniable Undead', 450000000.0, 950000000.0], ['Definite Death', 550000000.0, 1150000000.0], ['Incontestable Crypt', 650000000.0, 1350000000.0],
        ['Purest Phantom', 520000000.0, 1100000000.0], ['Unquestionable Osteo', 750000000.0, 1500000000.0], ['The Final Fossil', 400000000.0, 850000000.0],
        ['The Ultimate Ossuary', 320000000.0, 680000000.0], ['Decisive Dust', 800000000.0, 1650000000.0], ['The Absolute Anatomy', 700000000.0, 1450000000.0]
    ],

    // 18. singularity: satu-satunya yang pernah dan akan pernah ada
    singularity: [
        ['The Singular Skull', 1500000000.0, 3200000000.0], ['Point-of-No-Return Pelvis', 1800000000.0, 3800000000.0], ['Solitary Skeleton', 2000000000.0, 4200000000.0],
        ['The One-and-Only Ossuary', 1350000000.0, 2800000000.0], ['Isolated Ivory', 1200000000.0, 2500000000.0], ['Unique Urn', 2200000000.0, 4600000000.0],
        ['The Lone Leviathan', 1650000000.0, 3500000000.0], ['Mono-Marrow', 1450000000.0, 3100000000.0], ['Convergence Crypt', 1900000000.0, 4000000000.0],
        ['Alpha-Omega Ash', 2800000000.0, 5800000000.0], ['The Only Osteo', 3000000000.0, 6200000000.0], ['Single-State Skeleton', 2500000000.0, 5200000000.0],
        ['The Sole Survivor', 1750000000.0, 3600000000.0], ['The Singular Spine', 3500000000.0, 7200000000.0], ['Core of the Crypt', 1100000000.0, 2400000000.0]
    ],

    // 19. paradox: seharusnya tidak mungkin eksis, tapi ada
    paradox: [
        ['Living Bone', 5000000000.0, 10500000000.0], ['The Impossible Ivory', 4500000000.0, 9500000000.0], ['Contradiction Crypt', 6000000000.0, 12500000000.0],
        ['The Logical Loop of Life', 5500000000.0, 11500000000.0], ['Unreasonable Urn', 4200000000.0, 8800000000.0], ['Oxymoron Osteo', 4800000000.0, 10000000000.0],
        ['Defiant Dust', 6500000000.0, 13500000000.0], ['Illogical Illusion', 7500000000.0, 15000000000.0], ['The Baffling Bone', 3800000000.0, 8000000000.0],
        ['Conflicting Cranium', 5200000000.0, 11000000000.0], ['Perplexing Phantom', 7000000000.0, 14500000000.0], ['Nonsensical Necropolis', 4600000000.0, 9800000000.0],
        ['The Riddle of the Rib', 3500000000.0, 7500000000.0], ['Mystery Marrow', 4000000000.0, 8500000000.0], ['The Paradoxical Pelvis', 8000000000.0, 16500000000.0]
    ],

    // 20. null: di luar eksistensi itu sendiri
    null: [
        ['The Non-Existent Necropolis', 15000000000.0, 32000000000.0], ['Void-Form Vertebrae', 18000000000.0, 38000000000.0], ['Empty Endoskeleton', 20000000000.0, 42000000000.0],
        ['Zero-State Zombie', 12000000000.0, 25000000000.0], ['The Blank Bone', 13500000000.0, 28000000000.0], ['Cipher Cranium', 22000000000.0, 46000000000.0],
        ['Nullified Necromancer', 16500000000.0, 35000000000.0], ['Absence of Ash', 25000000000.0, 52000000000.0], ['The Missing Marrow', 14500000000.0, 31000000000.0],
        ['Unwritten Urn', 28000000000.0, 58000000000.0], ['Erased Entity', 19000000000.0, 40000000000.0], ['Forgotten Frame', 30000000000.0, 62000000000.0],
        ['The Nameless Nothing', 17500000000.0, 36000000000.0], ['Zero-Point Zenith', 40000000000.0, 85000000000.0], ['Out-of-Bounds Ossuary', 11000000000.0, 24000000000.0]
    ]
};