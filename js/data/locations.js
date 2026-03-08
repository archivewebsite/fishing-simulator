/**
 * LOCATION DEFINITIONS
 * All fishing locations/biomes with their name, description, and theme colors.
 */

const LOCATIONS = {
    mistvale: {
        name: "Mistvale Lake",
        desc: "A serene lake shrouded in perpetual morning mist.",
        colors: ["#e0f7fa", "#b2ebf2"]
    },
    stone_rapids: {
        name: "Stone Rapids",
        desc: "Fast-flowing waters carving through ancient granite.",
        colors: ["#eceff1", "#cfd8dc"]
    },
    volcanic: {
        name: "Volcanic Bay",
        desc: "Boiling waters rich with minerals and danger.",
        colors: ["#ffe0b2", "#ffcc80"]
    },
    emerald: {
        name: "Emerald Basin",
        desc: "Lush, overgrown waters hiding massive beasts.",
        colors: ["#c8e6c9", "#a5d6a7"]
    },
    midnight: {
        name: "Midnight Ocean",
        desc: "Deep, dark waters where bioluminescence rules.",
        colors: ["#d1c4e9", "#b39ddb"]
    },
    crystalline_abyss: {
        name: "Crystalline Abyss",
        desc: "Geometric caverns where light refracts through living crystal formations, creating impossible colors and temporal distortions.",
        colors: ["#f8bbd0", "#f48fb1"]
    },
    skyhollow_reaches: {
        name: "Skyhollow Reaches",
        desc: "Floating islands suspended above an endless sky, where water defies gravity and clouds form living ecosystems beneath crystalline equilibrium.",
        colors: ["#bbdefb", "#90caf9"]
    },
    resonant_depths: {
        name: "Resonant Depths",
        desc: "Subterranean underwater caverns where sound materializes into visible harmonics, and every movement creates symphonic ripples through sentient waters.",
        colors: ["#b2dfdb", "#80cbc4"]
    },
    mycelial_depths: {
        name: "Mycelial Depths",
        desc: "An underground civilization of bioluminescent fungal forests where spore clouds drift like clouds. Waters shimmer with ethereal light from countless living organisms.",
        colors: ["#e1bee7", "#ce93d8"]
    },
    sunken_citadel: {
        name: "Sunken Citadel",
        desc: "The ruins of an advanced civilization lie submerged beneath crystalline waters. Ancient architecture blends seamlessly with coral growth.",
        colors: ["#cfd8dc", "#b0bec5"]
    },
    glacial_spire: {
        name: "Glacial Spire",
        desc: "Towering frozen peaks where the water is supercooled and the aurora borealis touches the surface.",
        colors: ["#e3f2fd", "#ffffff"]
    },
    chrono_river: {
        name: "Chrono-River",
        desc: "A river flowing backwards through time, surrounded by golden dunes and floating hourglasses.",
        colors: ["#fff9c4", "#fbc02d"]
    },
    neon_bayou: {
        name: "Neon Bayou",
        desc: "A synthetic wetland lit by holographic advertisements and leaking coolant streams.",
        colors: ["#ea80fc", "#8c9eff"]
    },
    gearwork_grotto: {
        name: "Gearwork Grotto",
        desc: "An industrial cavern filled with grinding gears, steam vents, and oil-slicked waters.",
        colors: ["#d7ccc8", "#a1887f"]
    },
    aetherial_void: {
        name: "Aetherial Void",
        desc: "The edge of the universe where stars are born. You aren't fishing in water, but in pure stardust.",
        colors: ["#311b92", "#000000"]
    },
    confection_coast: {
        name: "Confection Coast",
        desc: "A sugary paradise where the waves are made of warm syrup and the sand is pure powdered sugar.",
        colors: ["#ffb7b2", "#b5ead7"]
    },
    origami_archipelago: {
        name: "Origami Archipelago",
        desc: "A delicate world of folded parchment and ink, where paper cranes nest in cardboard cliffs.",
        colors: ["#fdfbf7", "#9a8c98"]
    },
    vaporwave_vista: {
        name: "Vaporwave Vista",
        desc: "An eternal 80s sunset over a wireframe ocean, humming with low-fidelity synth nostalgia.",
        colors: ["#e0bbe4", "#ffdfd3"]
    },
    prism_light_pools: {
        name: "Prism-Light Pools",
        desc: "Blindingly clear shallows where light shatters into rainbows across mirror-smooth surfaces.",
        colors: ["#ffffff", "#e6e6fa"]
    },
    silk_thread_stream: {
        name: "Silk-Thread Stream",
        desc: "A river composed of millions of flowing golden threads, woven by the hands of unseen giants.",
        colors: ["#fff9c4", "#d1c4e9"]
    },
    ferromagnetic_falls: {
        name: "Ferromagnetic Falls",
        desc: "Pitch-black ferrofluid currents bend and surge under unstable magnetic fields.",
        colors: ["#1a1a1a", "#b3b3b3"]
    },
    amber_aquifer: {
        name: "Amber Aquifer",
        desc: "Ancient golden sap traps life in viscous time-locked channels.",
        colors: ["#ff8f00", "#ffe082"]
    },
    tar_pit_tributary: {
        name: "Tar-Pit Tributary",
        desc: "Boiling asphalt and suction-heavy currents hide prehistoric predators.",
        colors: ["#212121", "#424242"]
    },
    ossuary_ocean: {
        name: "Ossuary Ocean",
        desc: "Milky calcium tides roll over vast reefs of bones and leviathan remains.",
        colors: ["#e0e0e0", "#8d6e63"]
    },
    cellular_sea: {
        name: "Cellular Sea",
        desc: "A giant petri-dish ocean where life multiplies and mutates in real time.",
        colors: ["#76ff03", "#69f0ae"]
    },
    isotope_estuary: {
        name: "Isotope Estuary",
        desc: "Cherenkov-green waters glow with radioactive drift and unstable mutations.",
        colors: ["#ccff00", "#111111"]
    }
};

// Freeze locations to prevent console exploits
deepFreeze(LOCATIONS);



