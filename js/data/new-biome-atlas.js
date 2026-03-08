/**
 * NEW BIOME ATLAS (Display-Only)
 * Concept biomes requested in newbiome.md.
 * The atlas may include biomes that later become playable; UI filters playable IDs out.
 */

const NEW_BIOME_ATLAS = [
    {
        category: "Extreme Nature & Exotic Geology",
        blurb: "Physical environments pushed to impossible extremes.",
        biomes: [
            {
                id: "ferromagnetic_falls",
                name: "Ferromagnetic Falls",
                theme: "Liquid metal, magnetism, polarity",
                identity: "Pitch-black ferrofluid currents twist with shifting magnetic fields.",
                colors: ["#1a1a1a", "#b3b3b3"]
            },
            {
                id: "amber_aquifer",
                name: "Amber Aquifer",
                theme: "Fossils, ancient sap, trapped time",
                identity: "Golden resin streams suspend prehistoric life in viscous flow.",
                colors: ["#ff8f00", "#ffe082"]
            },
            {
                id: "tar_pit_tributary",
                name: "Tar-Pit Tributary",
                theme: "Asphalt boil, ice-age deathtrap",
                identity: "Bubbling tar waters cling to everything and hide ancient predators.",
                colors: ["#212121", "#424242"]
            },
            {
                id: "ossuary_ocean",
                name: "Ossuary Ocean",
                theme: "Bones, calcium, leviathan graveyard",
                identity: "Milky tides drift over reefs made of giant ribs and skulls.",
                colors: ["#e0e0e0", "#8d6e63"]
            }
        ]
    },
    {
        category: "Conceptual & Chemical Laboratories",
        blurb: "Science, biology, and volatile experimentation.",
        biomes: [
            {
                id: "cellular_sea",
                name: "Cellular Sea",
                theme: "Microscopic biology, DNA, mitosis",
                identity: "A giant petri-dish ocean where life divides in real time.",
                colors: ["#76ff03", "#69f0ae"]
            },
            {
                id: "isotope_estuary",
                name: "Isotope Estuary",
                theme: "Radiation, decay, mutation",
                identity: "Cherenkov-green currents glow with unstable isotope runoff.",
                colors: ["#ccff00", "#111111"]
            },
            {
                id: "transmutation_tide",
                name: "Transmutation Tide",
                theme: "Alchemy, potions, philosopher motifs",
                identity: "A boiling alchemical sea where metal life evolves during the reel.",
                colors: ["#ffd700", "#9c27b0"]
            },
            {
                id: "steeped_springs",
                name: "Steeped Springs",
                theme: "Tea, herbs, caffeine haze",
                identity: "Fragrant matcha steam rises over hyperactive herbal pools.",
                colors: ["#33691e", "#aed581"]
            }
        ]
    },
    {
        category: "Art, Canvas, and Aesthetics",
        blurb: "Visual mediums transformed into living ecosystems.",
        biomes: [
            {
                id: "pigment_peninsula",
                name: "Pigment Peninsula",
                theme: "Wet paint, acrylic oceans",
                identity: "Tides look like living brushstrokes that never dry.",
                colors: ["#ff007f", "#00e5ff"]
            },
            {
                id: "porcelain_ponds",
                name: "Porcelain Ponds",
                theme: "Ceramic glaze, kintsugi veins",
                identity: "Smooth white basins split by glowing gold fracture lines.",
                colors: ["#fafafa", "#ffb300"]
            },
            {
                id: "celluloid_cenote",
                name: "Celluloid Cenote",
                theme: "Vintage film, sepia frame rate",
                identity: "A sepia sinkhole where motion jitters like old projector footage.",
                colors: ["#705a45", "#d6c4a8"]
            },
            {
                id: "stained_glass_sanctuary",
                name: "Stained-Glass Sanctuary",
                theme: "Gothic mosaics, refracted shards",
                identity: "Refracted ruby and cobalt light dances through glass reefs.",
                colors: ["#b71c1c", "#01579b"]
            }
        ]
    },
    {
        category: "Surrealism & Dimensional Anomalies",
        blurb: "Dream logic, abstraction, and impossible dimensions.",
        biomes: [
            {
                id: "somnambulist_shallows",
                name: "Somnambulist Shallows",
                theme: "Dream-state gravity, subconscious echoes",
                identity: "Melting clocks and impossible doors drift through dreamwater.",
                colors: ["#4a148c", "#b388ff"]
            },
            {
                id: "tabletop_trench",
                name: "Tabletop Trench",
                theme: "Casino felt, dice logic, luck engines",
                identity: "Catch rates surge and crash with invisible table rolls.",
                colors: ["#1b5e20", "#f44336"]
            },
            {
                id: "silhouette_strait",
                name: "Silhouette Strait",
                theme: "2D contrast, shadow geometry",
                identity: "A flat realm of black forms crossing a blinding white field.",
                colors: ["#000000", "#ffffff"]
            },
            {
                id: "typography_trench",
                name: "Typography Trench",
                theme: "Ink ocean, punctuation reefs",
                identity: "Sentences and symbols jump from an ocean of language.",
                colors: ["#263238", "#cfd8dc"]
            },
            {
                id: "broth_basin",
                name: "Broth Basin",
                theme: "Culinary boil, spice steam",
                identity: "A savory sea where spice islands float in simmering stock.",
                colors: ["#d84315", "#ffcc80"]
            },
            {
                id: "cartographers_cove",
                name: "Cartographer's Cove",
                theme: "Living maps, compass lines",
                identity: "Topographic grids ripple across parchment-toned waters.",
                colors: ["#ffecb3", "#bcaaa4"]
            },
            {
                id: "aromatic_archipelago",
                name: "Aromatic Archipelago",
                theme: "Perfume essence, floral vapor",
                identity: "Lavender and rose vapor rises from translucent oil seas.",
                colors: ["#f8bbd0", "#e1bee7"]
            },
            {
                id: "ectoplasmic_eddy",
                name: "Ectoplasmic Eddy",
                theme: "Spirits, supernatural chill",
                identity: "No water remains, only spectral vapor and glitching echoes.",
                colors: ["#84ffff", "#1de9b6"]
            }
        ]
    },
    {
        category: "Macro-Botany & Extreme Horticulture",
        blurb: "Plant ecosystems scaled up into dangerous oceans.",
        biomes: [
            {
                id: "carnivorous_canopy",
                name: "Carnivorous Canopy",
                theme: "Pitcher plants, digestive acid",
                identity: "Acidic pools form inside massive carnivorous flora.",
                colors: ["#b71c1c", "#33691e"]
            },
            {
                id: "pollen_ponds",
                name: "Pollen Ponds",
                theme: "Spores, dust tides, stamen forests",
                identity: "A fluid sea of pollen erupts into golden clouds each cast.",
                colors: ["#fbc02d", "#fff9c4"]
            },
            {
                id: "nectar_nexus",
                name: "Nectar Nexus",
                theme: "Orchid core, ultraviolet nectar",
                identity: "Sticky neon nectar glows beneath giant flower petals.",
                colors: ["#ff4081", "#ea80fc"]
            },
            {
                id: "petrified_peat_bog",
                name: "Petrified Peat-Bog",
                theme: "Compressed moss, methane vents",
                identity: "A root-heavy marsh bubbles with trapped ancient gases.",
                colors: ["#3e2723", "#1b5e20"]
            },
            {
                id: "thorn_thicket_trench",
                name: "Thorn-Thicket Trench",
                theme: "Rose briars, razor defenses",
                identity: "A dense thorn maze where every path threatens your line.",
                colors: ["#212121", "#880e4f"]
            }
        ]
    },
    {
        category: "Mathematical & Physics Anomalies",
        blurb: "Theoretical systems made tangible and fishable.",
        biomes: [
            {
                id: "mandelbrot_maelstrom",
                name: "Mandelbrot Maelstrom",
                theme: "Infinite fractals, recursion",
                identity: "Each wave contains a smaller copy of the same whirlpool.",
                colors: ["#6200ea", "#00bfff"]
            },
            {
                id: "quantum_superposition_sea",
                name: "Quantum Superposition Sea",
                theme: "Probability states, observation collapse",
                identity: "Everything flickers until your catch event defines reality.",
                colors: ["#000000", "#ffffff"]
            },
            {
                id: "mobius_strip_stream",
                name: "Möbius Strip Stream",
                theme: "Topology loops, one-sided rivers",
                identity: "Cast too far and your hook returns from behind you.",
                colors: ["#ff5722", "#607d8b"]
            },
            {
                id: "fibonacci_floodplain",
                name: "Fibonacci Floodplain",
                theme: "Golden ratio, spiral precision",
                identity: "Ripples and migration patterns obey sequence mathematics.",
                colors: ["#ffd54f", "#5d4037"]
            },
            {
                id: "tesseract_trench",
                name: "Tesseract Trench",
                theme: "4D folding, hypercube drift",
                identity: "Bobbers appear in impossible axes beyond normal space.",
                colors: ["#00e676", "#1a237e"]
            }
        ]
    },
    {
        category: "The Giant's Domestic Domain",
        blurb: "Household spaces magnified into hostile frontiers.",
        biomes: [
            {
                id: "bathtub_billows",
                name: "Bathtub Billows",
                theme: "Soap foam, ceramic cliffs, ducks",
                identity: "Foam swells crash between glossy tile canyons.",
                colors: ["#e0f7fa", "#ffffff"]
            },
            {
                id: "attic_dust_sea",
                name: "Attic Dust-Sea",
                theme: "Dust currents, cobweb dunes",
                identity: "Sunbeams cut through a dry ocean of drifting dust.",
                colors: ["#9e9e9e", "#795548"]
            },
            {
                id: "junk_drawer_delta",
                name: "Junk Drawer Delta",
                theme: "Tangled wires, battery leaks",
                identity: "Metallic swamps surge with erratic magnetic currents.",
                colors: ["#757575", "#ff9800"]
            },
            {
                id: "static_carpet_shallows",
                name: "Static-Carpet Shallows",
                theme: "Nylon plains, friction storms",
                identity: "Towering carpet fibers spark with high-voltage static.",
                colors: ["#d32f2f", "#ffeb3b"]
            },
            {
                id: "refrigerator_rill",
                name: "Refrigerator Rill",
                theme: "Coolant channels, artificial frost",
                identity: "A sterile tundra forms among frozen leftovers and freon mist.",
                colors: ["#b2ebf2", "#c5e1a5"]
            }
        ]
    },
    {
        category: "Philosophical Paradigms",
        blurb: "Endgame abstractions of emotion, ethics, and identity.",
        biomes: [
            {
                id: "sea_of_solipsism",
                name: "Sea of Solipsism",
                theme: "Mirrors, reflection, self",
                identity: "A flawless mirror-ocean reflects only the player.",
                colors: ["#eceff1", "#b0bec5"]
            },
            {
                id: "utilitarian_utopia",
                name: "Utilitarian Utopia",
                theme: "Pure logic, optimization grids",
                identity: "A sterile world where every movement is utility-calculated.",
                colors: ["#fafafa", "#90caf9"]
            },
            {
                id: "nihilists_null",
                name: "Nihilist's Null",
                theme: "Apathy, grayscale emptiness",
                identity: "A featureless void with no music, weather, or resistance.",
                colors: ["#424242", "#212121"]
            },
            {
                id: "hedonists_haven",
                name: "Hedonist's Haven",
                theme: "Dopamine surge, sensory overload",
                identity: "Violent color shifts amplify risk and reward in every moment.",
                colors: ["#d50000", "#aa00ff"]
            },
            {
                id: "ship_of_theseus_shoals",
                name: "Ship of Theseus Shoals",
                theme: "Replacement paradox, identity drift",
                identity: "A vortex of planks and nails questions what remains the same.",
                colors: ["#8d6e63", "#546e7a"]
            }
        ]
    }
];

deepFreeze(NEW_BIOME_ATLAS);


