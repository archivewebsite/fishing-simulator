/**
 * ACHIEVEMENTS DATA
 * All 21 achievements with their metadata.
 * Conditions are checked by the AchievementManager at runtime.
 */
const ACHIEVEMENTS = {
    // --- Progression & Economy ---
    humble_beginnings: {
        name: 'From Humble Beginnings',
        desc: 'Every legend starts somewhere. Catch your very first fish with the Bamboo Pole.',
        icon: '🎣',
        category: 'progression',
        secret: false
    },
    pastel_tycoon: {
        name: 'Pastel Tycoon',
        desc: 'Your pockets are jingling with success! Accumulate 1,000,000 coins.',
        icon: '💰',
        category: 'progression',
        secret: false
    },
    gearhead: {
        name: 'Gearhead',
        desc: 'Upgrade your arsenal by purchasing the Titanium Alloy rod.',
        icon: '🔧',
        category: 'progression',
        secret: false
    },
    omni_presence: {
        name: 'The Omni-Presence',
        desc: 'Obtain the ultimate fishing tool. Purchase the Omni-Verse Rod.',
        icon: '🌌',
        category: 'progression',
        secret: false
    },
    singularity_seeker: {
        name: 'Singularity Seeker',
        desc: "You're fishing with a black hole. Purchase the Singularity Lure.",
        icon: '🕳️',
        category: 'progression',
        secret: false
    },

    // --- Skill & Mechanics ---
    flow_state: {
        name: 'Flow State',
        desc: 'You are one with the rhythm. Chain 20 successful manual catches in a row.',
        icon: '🌊',
        category: 'skill',
        secret: false
    },
    bot_buddy: {
        name: 'Bot Buddy',
        desc: 'Let the machine spirit take the wheel. Reach the auto-fishing combo cap.',
        icon: '🤖',
        category: 'skill',
        secret: false
    },
    heavy_lifter: {
        name: 'Heavy Lifter',
        desc: "Don't skip arm day! Reel in a single fish weighing over 500 kg.",
        icon: '💪',
        category: 'skill',
        secret: false
    },
    one_that_got_away: {
        name: 'The One That Got Away',
        desc: 'Experience true heartbreak. Lose a Legendary or Mythic fish because it was too heavy.',
        icon: '💔',
        category: 'skill',
        secret: false
    },
    storm_chaser: {
        name: 'Storm Chaser',
        desc: 'Brave the elements! Catch a fish during a Thunderstorm or Gale Force weather.',
        icon: '⛈️',
        category: 'skill',
        secret: false
    },
    weather_god: {
        name: 'Weather God',
        desc: 'You control the skies. Have 5 purchased weather effects active simultaneously.',
        icon: '🌈',
        category: 'skill',
        secret: false
    },

    // --- Biome & Lore ---
    glitch_matrix: {
        name: 'Glitch in the Matrix',
        desc: 'Catch The Glitch King or The Blue Screen in the Vaporwave Vista.',
        icon: '👾',
        category: 'biome',
        secret: false,
        fish: ['The Glitch King', 'The Blue Screen']
    },
    sugar_rush: {
        name: 'Sugar Rush',
        desc: 'Sweet victory! Catch The Confectioner or the Grand Gateau on the Confection Coast.',
        icon: '🍰',
        category: 'biome',
        secret: false,
        fish: ['The Confectioner', 'Grand Gateau']
    },
    paper_cut: {
        name: 'Paper Cut',
        desc: 'Find a story waiting to be written. Catch The Blank Page in Origami Archipelago.',
        icon: '📄',
        category: 'biome',
        secret: false,
        fish: ['The Blank Page']
    },
    time_traveler: {
        name: 'Time Traveler',
        desc: 'The beginning is the end. Catch The Ouroboros in the Chrono-River.',
        icon: '⏳',
        category: 'biome',
        secret: false,
        fish: ['The Ouroboros']
    },
    void_stare: {
        name: 'Void Stare',
        desc: 'You gazed into the abyss, and you caught it. Land The Big Bang in the Aetherial Void.',
        icon: '🌀',
        category: 'biome',
        secret: false,
        fish: ['The Big Bang']
    },
    local_legend: {
        name: 'Local Legend',
        desc: 'You really know your way around. Use up 50 Biome Amulets total.',
        icon: '🗺️',
        category: 'biome',
        secret: false
    },

    // --- Secret & Fun ---
    fish_404: {
        name: '404 Fish Not Found',
        desc: '[Description Missing] ...Wait, you actually caught The 404?',
        icon: '❓',
        category: 'secret',
        secret: true,
        fish: ['The 404']
    },
    night_owl: {
        name: 'Night Owl',
        desc: 'The bioluminescence looks better in the dark. Catch a fish in the Midnight Ocean between 12-4 AM.',
        icon: '🦉',
        category: 'secret',
        secret: true
    },
    frozen_assets: {
        name: 'Frozen Assets',
        desc: 'Freshness guaranteed. Catch a fish with the Cryo-Preserved buff during a Flash Blizzard.',
        icon: '🧊',
        category: 'secret',
        secret: true
    },
    welcome_back: {
        name: 'Welcome Back, Kotter',
        desc: 'We missed you! Return to the game after being away for more than 24 hours.',
        icon: '👋',
        category: 'secret',
        secret: true
    }
};

deepFreeze(ACHIEVEMENTS);
