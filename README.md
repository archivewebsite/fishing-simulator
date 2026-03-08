# 🎣 Fish It! Enhanced Edition

**Fish It!** is a feature-rich, browser-based fishing simulation RPG built entirely with vanilla JavaScript — no frameworks, no build tools, no external dependencies. It combines a skill-based reflex minigame with deep idle progression mechanics, all rendered through a responsive pastel aesthetic powered by the **Manrope** (body) and **Sora** (headings and buttons) typefaces and CSS custom properties. Players travel across 20 unique biomes, adapt to 24 dynamic weather conditions, and upgrade their arsenal across 12 rods and 11 baits in pursuit of the ultimate *Mythic* tier catch.

---

## ✨ Key Features

### 🎮 Core Gameplay

* **Skill-Based Catching:** Every cast triggers a reflex-based minigame where a moving indicator bounces across a track. Players must time their click to land the indicator inside a colored target zone. Rarer fish produce smaller zones and faster indicators, making them genuinely harder to catch.
* **Six-Tier Rarity System:** Fish are divided into **Common**, **Uncommon**, **Rare**, **Epic**, **Legendary**, and **Mythic** tiers. Catch rates are determined by a weighted RNG roll that factors in the combined Luck stat from your equipped rod, bait, active amulet, and any weather modifiers currently in play.
* **Rod Capacity Mechanic:** Each rod has a maximum weight capacity. If a hooked fish exceeds that limit, the line snaps and the fish escapes — regardless of minigame performance. This creates a natural gear gate that rewards strategic upgrades.
* **Dynamic Context Messages:** The game generates varied, non-repeating status messages for reeling, critical catches, and fish escapes. Each message pool is tier-aware: a Mythic escape reads very differently from a Common one. Critical catch labels rotate through 20 unique phrases with distinct colors, keeping every session fresh.
* **Fishing Zone:** The central play area that switches between three modes — **idle** (waiting), **manual** (active cast), and **auto** (automated fishing). Each mode tracks its own live stats panel showing total catches, fish stored, XP banked, and the current combo bonus.

### 🤖 Automation & Idle Play

* **Auto-Fishing:** Toggle a fully automated fishing bot that cycles through casting, hooking, and reeling on randomized cooldowns (1–3 seconds). Auto-fishing uses a Web Worker timer system that continues firing reliably even when the browser tab is in the background, so idle progression is never throttled. The auto-fish combo is capped at 10× (compared to 20× in manual mode) to preserve the incentive for active play.
* **Offline Progression:** When auto-fishing is enabled and the player closes the browser, the game simulates all missed fishing cycles upon return. The elapsed time is divided by the average cycle duration, and each simulated cycle rolls rarity, weight, capacity checks, combo bonuses, amulet consumption, and XP — exactly mirroring live auto-fish logic.
* **Smart Inventory Management:** The inventory holds up to 5,000 fish. When the cap is reached, the game automatically sells all Common through Legendary fish and keeps only Mythic catches. If individual catches arrive while the inventory is full, they are instantly auto-sold for their coin value with a log notification.

### 🌍 World & Environment

* **20 Unique Biomes:** The game world spans a wide range of fantastical environments, each with its own color palette, lore description, and exclusive fish species roster. Locations range from the serene *Mistvale Lake* and rugged *Stone Rapids* through exotic realms like the *Neon Bayou*, *Chrono-River*, and *Aetherial Void*, all the way to the creative *Confection Coast*, *Origami Archipelago*, and *Silk-Thread Stream*.
* **24 Dynamic Weather Patterns:** Weather changes automatically on a timer through a weighted probability system, and each pattern applies its own Luck multiplier, difficulty modifier, and a chance for fish buffs that increase sell value:
  * **Standard (6):** Clear Skies, Light Rain, Thunderstorm, Dense Fog, Heatwave, Gale Force.
  * **Exotic (7):** Rare phenomena like **Locust Plague** (+40% Luck feeding frenzy), **Sakura Drift** (calmer waters, +30% Luck), **Flash Blizzard** (−20% Luck but guaranteed Cryo-Preserved +60% Value), **Acid Downpour** (small chance for Mutated +150% Value), and **Tectonic Shift** (+50% Luck, erratic fish).
  * **Atmospheric (7):** **Golden Hour**, **Crimson Tide**, **Ashfall**, **Diamond Dust**, **Monsoon**, **Autumn Drift**, and the extremely rare **Swamp Haze** (neutral Luck but a tiny chance for Ancient fish at +200% Value).
  * **Extreme (4):** High-risk, high-reward conditions — **Deep Freeze** (+50% Luck, +80% Value, very hard), **Disco Fever** (+150% Luck, attracts rare variants), **Blood Moon** (+80% Luck, +66% Value), and the ultra-rare **Galactic Alignment** (+250% Luck, +120% Value).
* **Purchasable Weather Stacking:** Players can buy weather effects from the shop and run up to 5 simultaneously alongside the natural weather cycle, stacking their Luck bonuses additively.

### 💰 Progression & Economy

* **12 Fishing Rods:** A full upgrade path from the free *Bamboo Pole* (15 kg capacity) through mid-game rods like the *Carbon Striker* and *Titanium Alloy*, up to endgame powerhouses like the *Chrono-Spinner* (25,000 kg capacity) and the ultimate *Omni-Verse Rod* (100,000 kg capacity, 800 Luck).
* **11 Bait Types:** Each bait adds a flat Luck bonus. The progression runs from the humble *Worm* (+1 Luck) through *Flux Jelly*, *Magic Paste*, and *Void Essence* up to the endgame *Singularity Lure* (+200 Luck).
* **20 Biome-Specific Amulets:** Purchasable consumable items that provide a Luck bonus while fishing in their matching biome. Each successful catch consumes one charge, and the amulet deactivates when its stock is depleted.
* **Combo System:** Consecutive successful catches build a combo multiplier, adding +10% value per combo level. The bonus is calculated from the streak count *before* the current catch, so the first catch in a new streak receives no bonus. Manual fishing caps at 20× combo (+200% value) while auto-fishing caps at 10× (+100% value). Missed catches or escaped fish instantly reset the combo.
* **XP & Leveling:** Every catch awards rarity-scaled XP. Level thresholds follow a quadratic curve (`level × 1000 + level² × 100`), ensuring a satisfying early-game pace that gradually slows into endgame.
* **21 Achievements:** Four categories of milestones — *Progression & Economy*, *Skill & Mechanics*, *Biome & Lore*, and *Secret & Fun* — with hidden achievements that only reveal their descriptions once unlocked. Achievement toasts slide in from the right when earned.
* **Persistent Saves:** The built-in save system writes game state to `localStorage` with checksum validation to guard against corruption. Saves are triggered automatically after every catch and on manual button press, and can be fully reset from the header.
* **Anti-Exploit Protections:** All static data objects (rods, baits, rarity tables, locations, weather, fish databases, amulets, achievements) are deeply frozen with `Object.freeze()` and `deepFreeze()` to prevent console-based tampering. Rate limiting on casts and catches prevents loop-based speedhacks.

---

## 🛠️ Technical Architecture

### Stack

* **HTML5** — Semantic markup with a single-page layout. Every interactive element has a unique ID for clean DOM queries.
* **CSS3** — A custom design system built on CSS custom properties (`:root` variables), `Grid` and `Flexbox` layouts, `backdrop-filter` glassmorphism effects, and CSS `@keyframes` animations for floating text, progress bars, and weather transitions. Typography is set in [Manrope](https://fonts.google.com/specimen/Manrope) and [Sora](https://fonts.google.com/specimen/Sora) via Google Fonts.
* **JavaScript (ES6+)** — Fully object-oriented with modular class-based architecture wrapped in an IIFE for clean encapsulation. Zero external dependencies.

### Codebase Overview

The project is organized into a clean separation of **data**, **systems**, and **engine** layers:

| Layer | Responsibility |
|---|---|
| `js/data/` | Static game data: rarity tiers, rods, baits, weather definitions, locations, amulets, weather shop config, and achievement definitions. All data is frozen at load time. |
| `js/data/biomes/` | Individual fish roster files for each of the 20 biomes. Each file defines a `FISH_<BIOME>` constant that is assembled into the global `FISH_DB` object by `fish-db.js`. |
| `js/systems/` | Runtime subsystems: `UI` (rendering, status updates, floating text, fishing zone mode switching), `Shop` (tabbed modal — weather, amulets, rods, baits), `Inventory` (catch log table, sell logic), `SaveSystem` (localStorage persistence with checksum and data validation), and `AchievementManager` (event-driven unlock checks, toast notifications, modal rendering). |
| `js/engine.js` | The core `Game` class wrapped in an IIFE: state management, weather cycling, cast/rarity/minigame logic, combo system, fishing mode state machine, dynamic message generation, centralized fish storage with auto-sell overflow, auto-fish lifecycle, offline catch simulation, and Web Worker timer integration. Exposes a `GameAPI` object on `window` for HTML button handlers. |
| `js/timer-worker.js` | A lightweight Web Worker script for `setTimeout` that fires reliably in background tabs (not throttled by the browser). The engine inlines this as a Blob for `file://` compatibility. |

---

## 📂 Project Structure

```text
v3/
├── index.html                        # Entry point — DOM layout and script loading order
├── styles.css                        # Full design system, responsive layout, and animations
├── LICENSE                           # MIT License
├── README.md                         # This file
│
└── js/
    ├── engine.js                     # Core Game class (IIFE) — all runtime logic
    ├── timer-worker.js               # Web Worker for background-safe timers
    │
    ├── data/
    │   ├── rarity.js                 # Six rarity tiers and their stat multipliers
    │   ├── rods.js                   # 12 fishing rods (cost, luck, capacity, speed)
    │   ├── baits.js                  # 11 bait types (cost, luck bonus)
    │   ├── weather.js                # 24 weather patterns and deepFreeze utility
    │   ├── locations.js              # 20 biome definitions (name, lore, color palette)
    │   ├── amulets.js                # 20 per-biome amulets (cost, luck bonus, description)
    │   ├── weather-shop.js           # Weather shop pricing formula and purchase limit (5)
    │   ├── achievements.js           # 21 achievements across 4 categories
    │   ├── fish-db.js                # Global FISH_DB assembler
    │   │
    │   └── biomes/                   # Per-biome fish rosters (20 files)
    │       ├── mistvale.js
    │       ├── stone_rapids.js
    │       ├── volcanic.js
    │       ├── emerald.js
    │       ├── midnight.js
    │       ├── crystalline_abyss.js
    │       ├── skyhollow_reaches.js
    │       ├── resonant_depths.js
    │       ├── mycelial_depths.js
    │       ├── sunken_citadel.js
    │       ├── glacial_spire.js
    │       ├── chrono_river.js
    │       ├── neon_bayou.js
    │       ├── gearwork_grotto.js
    │       ├── aetherial_void.js
    │       ├── confection_coast.js
    │       ├── origami_archipelago.js
    │       ├── vaporwave_vista.js
    │       ├── prism_light_pools.js
    │       └── silk_thread_stream.js
    │
    └── systems/
        ├── ui.js                     # UI rendering — stats, fishing zone modes, floating text
        ├── shop.js                   # Tabbed shop modal — buy rods, baits, weather, amulets
        ├── inventory.js              # Catch log table and sell-all functionality
        ├── save.js                   # localStorage persistence with checksum and validation
        └── achievements.js           # Event-driven achievement tracking and toast notifications
```

---

## 🚀 Getting Started

### Prerequisites

All you need is a modern web browser — no Node.js, no package manager, no build step. The entire game runs from static files.

### Running Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/prezvious/fishing-simulator.git
   cd fishing-simulator
   ```

2. **Open the game:**
   Open `index.html` in any modern web browser (Chrome, Firefox, Edge, or Safari). You can double-click the file or drag it into a browser window.

3. **Start fishing!**

> **Note:** The game works perfectly when opened directly from the filesystem (`file://` protocol). The Web Worker timer is inlined as a Blob URL, so there are no cross-origin issues even without a local server.

### Optional: Local Development Server

If you prefer to serve the files over HTTP (for example, to avoid any `file://` edge cases in older browsers), you can use any simple static server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx, no install needed)
npx -y serve .
```

Then open `http://localhost:8000` in your browser.

---

## 🕹️ How to Play

1. **Cast Your Line** — Click the **"Cast Line"** button. The game rolls for a fish rarity based on your total Luck (the sum of your rod's Luck, bait's Luck, any active amulet bonus, all multiplied by the current weather modifier).

2. **Play the Minigame** — When a fish bites, an indicator bar starts bouncing across the screen. Click **"REEL NOW!"** while the indicator is inside the green target zone to land the catch. Rarer fish have faster indicators, smaller target zones, and weather can further alter difficulty.

3. **Watch Your Rod Capacity** — If the fish's weight exceeds your rod's maximum capacity, it will snap the line and escape no matter how good your timing is. Upgrade your rod to handle heavier catches.

4. **Build Combos** — Consecutive successful catches increase your combo multiplier, boosting the coin value of every subsequent catch. Missing a fish or having one escape resets the combo to zero. The results panel shows your live combo bonus percentage.

5. **Explore Biomes** — Use the **Expeditions** modal to travel to different biomes. Each location has its own unique pool of fish species across all six rarity tiers, along with a distinct visual theme.

6. **Upgrade Your Gear** — Open the **Shop** to invest your coins in better rods (more Luck and weight capacity), stronger baits (more Luck), weather effects (stackable Luck bonuses with timed duration), and biome amulets (consumable Luck boosts).

7. **Enable the Fishing Zone** — Toggle the **Fishing Zone** button to enable auto-fishing. The bot will cast, hook, and reel automatically on a loop, tracking its results in a dedicated panel. It runs reliably in background tabs and simulates catches while you are away.

8. **Manage Your Inventory** — Open the **Inventory** modal to review your stored fish or sell them all at once. The game automatically sells Common through Legendary fish when you hit the 5,000-fish cap, preserving only your Mythic catches.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `C` | Cast line / Reel now |
| `A` | Toggle Fishing Zone (auto-fish) |
| `I` | Open Inventory |
| `O` | Open Shop |
| `H` | Open Achievements |
| `S` | Save game |
| `Esc` | Close any open modal |
| `1`–`4` | Switch Shop tabs |
| `Alt+1`–`Alt+9` | Click visible header/action buttons by position |

---

## ☁️ Supabase Cloud Save (JSONB)

This project now includes a Supabase-ready migration:

- [supabase/migrations/20260308_create_game_saves.sql](supabase/migrations/20260308_create_game_saves.sql)

It creates `public.game_saves` with:

- `user_id` (PK, references `auth.users`)
- `save_data` (`jsonb`) to store full `this.state`
- `save_version` and `checksum`
- `created_at` / `updated_at` (auto-updated by trigger)
- RLS policies so users can only access their own row

`SaveSystem` also includes conversion helpers:

- `toSupabaseRow()` for writing save data
- `applySupabaseRow(row)` for loading and validating cloud data

Example write (after user signs in):

```js
const row = game.saveSystem.toSupabaseRow();
await supabase
  .from('game_saves')
  .upsert({ user_id: user.id, ...row }, { onConflict: 'user_id' });
```

Example read:

```js
const { data } = await supabase
  .from('game_saves')
  .select('user_id, save_data, save_version, checksum')
  .eq('user_id', user.id)
  .single();

if (data) {
  game.saveSystem.applySupabaseRow(data);
  game.ui.renderAll();
}
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Copyright © 2026 Maximus Erick.
