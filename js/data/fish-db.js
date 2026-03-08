/**
 * FISH DATABASE ASSEMBLER
 * Combines all individual biome fish data into a unified FISH_DB constant.
 * Each biome file defines a FISH_<BIOME> constant that is referenced here.
 */

const FISH_DB = {
    mistvale: FISH_MISTVALE,
    stone_rapids: FISH_STONE_RAPIDS,
    volcanic: FISH_VOLCANIC,
    emerald: FISH_EMERALD,
    midnight: FISH_MIDNIGHT,
    crystalline_abyss: FISH_CRYSTALLINE_ABYSS,
    skyhollow_reaches: FISH_SKYHOLLOW_REACHES,
    resonant_depths: FISH_RESONANT_DEPTHS,
    mycelial_depths: FISH_MYCELIAL_DEPTHS,
    sunken_citadel: FISH_SUNKEN_CITADEL,
    glacial_spire: FISH_GLACIAL_SPIRE,
    chrono_river: FISH_CHRONO_RIVER,
    neon_bayou: FISH_NEON_BAYOU,
    gearwork_grotto: FISH_GEARWORK_GROTTO,
    aetherial_void: FISH_AETHERIAL_VOID,
    confection_coast: FISH_CONFECTION_COAST,
    origami_archipelago: FISH_ORIGAMI_ARCHIPELAGO,
    vaporwave_vista: FISH_VAPORWAVE_VISTA,
    prism_light_pools: FISH_PRISM_LIGHT_POOLS,
    silk_thread_stream: FISH_SILK_THREAD_STREAM,
    ferromagnetic_falls: FISH_FERROMAGNETIC_FALLS,
    amber_aquifer: FISH_AMBER_AQUIFER,
    tar_pit_tributary: FISH_TAR_PIT_TRIBUTARY,
    ossuary_ocean: FISH_OSSUARY_OCEAN,
    cellular_sea: FISH_CELLULAR_SEA,
    isotope_estuary: FISH_ISOTOPE_ESTUARY
};

// Freeze fish database to prevent console exploits
deepFreeze(FISH_DB);


