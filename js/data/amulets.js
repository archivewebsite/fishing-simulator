/**
 * AMULETS DATA
 * One amulet per biome (20 total). Each provides a luck bonus
 * that only applies when the player is in the matching biome.
 * Amulets are consumable stock items — wearing one consumes 1 from stock.
 */

const AMULETS = {
    mistvale: {
        id: 'amulet_mistvale', biome: 'mistvale',
        name: 'Mistweaver Charm', icon: '🌫️',
        cost: 200, luckBonus: 15,
        desc: 'A silver pendant that hums when mist is near.'
    },
    stone_rapids: {
        id: 'amulet_stone_rapids', biome: 'stone_rapids',
        name: 'Riverstone Talisman', icon: '🪨',
        cost: 250, luckBonus: 18,
        desc: 'A smooth pebble carved with rushing water runes.'
    },
    volcanic: {
        id: 'amulet_volcanic', biome: 'volcanic',
        name: 'Magma Core Amulet', icon: '🌋',
        cost: 400, luckBonus: 25,
        desc: 'A crystallized lava fragment pulsing with heat.'
    },
    emerald: {
        id: 'amulet_emerald', biome: 'emerald',
        name: 'Verdant Leaf Brooch', icon: '🍃',
        cost: 350, luckBonus: 22,
        desc: 'A living leaf that never wilts, woven with vines.'
    },
    midnight: {
        id: 'amulet_midnight', biome: 'midnight',
        name: 'Abyssal Lantern', icon: '🔮',
        cost: 500, luckBonus: 30,
        desc: 'A tiny glass orb flickering with bioluminescence.'
    },
    crystalline_abyss: {
        id: 'amulet_crystalline_abyss', biome: 'crystalline_abyss',
        name: 'Prismatic Shard', icon: '💎',
        cost: 600, luckBonus: 35,
        desc: 'A crystal fragment refracting impossible colors.'
    },
    skyhollow_reaches: {
        id: 'amulet_skyhollow_reaches', biome: 'skyhollow_reaches',
        name: 'Cloudweave Feather', icon: '🪶',
        cost: 550, luckBonus: 32,
        desc: 'A feather from a sky-whale, lighter than air.'
    },
    resonant_depths: {
        id: 'amulet_resonant_depths', biome: 'resonant_depths',
        name: 'Harmonic Tuning Fork', icon: '🎵',
        cost: 650, luckBonus: 38,
        desc: 'A fork that vibrates at the frequency of the deep.'
    },
    mycelial_depths: {
        id: 'amulet_mycelial_depths', biome: 'mycelial_depths',
        name: 'Sporelight Pendant', icon: '🍄',
        cost: 700, luckBonus: 40,
        desc: 'A bioluminescent mushroom cap on a golden chain.'
    },
    sunken_citadel: {
        id: 'amulet_sunken_citadel', biome: 'sunken_citadel',
        name: 'Relic Seal Ring', icon: '🏛️',
        cost: 750, luckBonus: 42,
        desc: 'An ancient signet ring from a drowned civilization.'
    },
    glacial_spire: {
        id: 'amulet_glacial_spire', biome: 'glacial_spire',
        name: 'Frostbound Ankh', icon: '❄️',
        cost: 800, luckBonus: 45,
        desc: 'An icy symbol that never melts, preserving cold.'
    },
    chrono_river: {
        id: 'amulet_chrono_river', biome: 'chrono_river',
        name: 'Temporal Hourglass', icon: '⏳',
        cost: 900, luckBonus: 50,
        desc: 'Sand flows upward in this tiny hourglass charm.'
    },
    neon_bayou: {
        id: 'amulet_neon_bayou', biome: 'neon_bayou',
        name: 'Neon Circuit Badge', icon: '💡',
        cost: 850, luckBonus: 48,
        desc: 'A glowing circuit board fragment from the bayou.'
    },
    gearwork_grotto: {
        id: 'amulet_gearwork_grotto', biome: 'gearwork_grotto',
        name: 'Cogwheel Compass', icon: '⚙️',
        cost: 950, luckBonus: 52,
        desc: 'A miniature gear assembly that spins on its own.'
    },
    aetherial_void: {
        id: 'amulet_aetherial_void', biome: 'aetherial_void',
        name: 'Stardust Vial', icon: '✨',
        cost: 1200, luckBonus: 60,
        desc: 'A vial of pure condensed stardust from the void.'
    },
    confection_coast: {
        id: 'amulet_confection_coast', biome: 'confection_coast',
        name: 'Sugar Crystal Heart', icon: '🍬',
        cost: 1000, luckBonus: 55,
        desc: 'A candy-coated heart that smells impossibly sweet.'
    },
    origami_archipelago: {
        id: 'amulet_origami_archipelago', biome: 'origami_archipelago',
        name: 'Paper Crane Pin', icon: '🦢',
        cost: 1100, luckBonus: 58,
        desc: 'A perfectly folded origami crane that flutters.'
    },
    vaporwave_vista: {
        id: 'amulet_vaporwave_vista', biome: 'vaporwave_vista',
        name: 'Synth Wave Disc', icon: '📀',
        cost: 1050, luckBonus: 55,
        desc: 'A holographic disc playing an endless 80s loop.'
    },
    prism_light_pools: {
        id: 'amulet_prism_light_pools', biome: 'prism_light_pools',
        name: 'Rainbow Lens', icon: '🌈',
        cost: 1300, luckBonus: 65,
        desc: 'A lens that splits all light into vivid rainbows.'
    },
    silk_thread_stream: {
        id: 'amulet_silk_thread_stream', biome: 'silk_thread_stream',
        name: 'Golden Thread Spool', icon: '🧵',
        cost: 1500, luckBonus: 80,
        desc: 'A spool of luminous silk that weaves itself.'
    }
};

deepFreeze(AMULETS);
