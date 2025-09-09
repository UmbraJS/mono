# Carbon

> Customizable open‑world, extraction roguelite, strategy card sim — pseudo‑medieval fantasy

Carbon is a Nuxt (Vue 3) game client and prototype for an open‑world, simulation‑driven card system. It blends Bazaar‑style drafting with CK3‑style world progression and persistence across runs. Battles are deterministic simulations that produce a timeline for client‑side replay and scrubbing.

## 🎮 Pitch

What if The Bazaar and Crusader Kings 3 had a highly customizable, extraction‑based roguelite baby.

- Genre: Customizable • Open world • Strategy • Extraction • Recursive roguelite • Card game
- Setting: Pseudo‑medieval fantasy

## 🧰 Tech stack

- Client/runtime: Vue 3, Nuxt 4 (compat), Pinia, VueUse, GSAP
- UI/Design system: Umbraco (UmbraJS‑powered tokens/components), Bifrost
- Nuxt modules: `@nuxt/eslint`, `@nuxt/image`, `@pinia/nuxt`, `@nuxt/icon`
- Server/Nitro: Nuxt server routes (Nitro preset vercel)
- Planned integrations: Convex (data/sim persistence), Better‑Auth (auth), Polar (funding/roadmap)

See `package.json` for exact versions and scripts.

## 🧠 Core concepts (domain model)

Carbon’s sim is built around a small set of composable primitives.

### ✴️ Effects — dynamic triggers of battle

Effects define what happens, to whom, and when, e.g. “When [trigger] happens, do [action] to [target]”. Examples:
- When this card activates, increase attack of all adjacent Aquatic cards by 10% for 3s.
- When any shield is gained by this card, add poison equal to 25% of its current shield to the opponent.
- At the start of battle, freeze all Mechanical cards on the opponent’s board for 4s.
- When this card is destroyed, trigger the cooldown of all sibling cards immediately.

### 🧬 Aspects — customization & scaling

Aspects are the essence/material of a card (steel, cotton, silver, light, hope…). They:
- Modify stat scaling (how upgrades “stick”) per stat
- Add conditional bonuses (if aspect present → bonus)
- Interact with effects (gates, multipliers)
- Gate crafting/proficiency progression

### 🃏 Cards

A card can be a character, item, building, technique, action, field, army, mount. Cards may have:
- Tags, cooldown (or be trigger‑only via effects)
- One or more aspects
- Level and proficiency (player proficiency gates effectiveness)
- Stats following BASH (see below)

### ♟️ Board

Two boards exist per battle (player and opponent). A board:
- Holds the deck (slots + cards) and acts as a central modifier/filter
- Applies board‑level effects (e.g., +5 damage to all outgoing damage)
- Tracks health, shield, morale (banter influences morale → buffs/debuffs)

### 🗺️ Field

A special card representing a location/terrain/building. Lives in a dedicated deck slot (preferred home field), grants effects/bonuses to either side, influences overworld events, and can be swapped in via mechanics like knock‑back.

### 👤 Character

A “thinking being” card. Can be played or slotted as player/party characters. Health pools and deck slots combine from slotted characters; health markers indicate which portion belongs to whom. Dropping below a marker disables that character’s effects/slots until healed above the marker.

### ⚔️ Army

A large‑group card occupying multiple slots; can host its own internal cards. Has its own health pool and a persistent counter representing troop size; portions of its pool are added as buffers to player health with markers. Losing markers reduces the counter; healing before battle ends preserves troops.

### 🐎 Mount

A mount slot affects world traversal (distance/terrain). High acquisition/proficiency cost — a strategic specialty choice.

### 🎲 Events/Interactions

Encounters can resolve as CRPG‑style interactions (dice + stats) or as full card battles. The same system can represent non‑combat challenges (dating, feasts) with reinterpreted bars and actions.

### 🧱 BASH system

- Banter: Buff/debuff pressure → morale; modifies crit and action effectiveness
- Attack: Destructive output
- Shield: Damage buffer that decays without upkeep
- Heal: Health recovery

Different cards weigh BASH differently; aspects influence returns. Proficiency (card vs. aspect) is tracked separately to enforce specialization.

## 🧪 Simulation engine

- Deterministic: Battles run server‑side quickly; RNG seeded for reproducibility
- Output: A compact timeline of events the client replays (pause/play/reverse/scrub/share)
- Performance: Determinism → stable/fast sims and robust replays

Client replay hints:
- Use GSAP or rAF to drive time; bind animations to timeline events
- Keep render and sim strictly separated (render is a pure projection of the timeline)

## 🏗️ Architecture overview

- Nuxt app (compat v4): see `nuxt.config.ts` (Nitro preset `vercel`, `@nuxt/image`, Pinia, icons)
- UI: Umbraco components and tokens; Bifrost utilities/components
- State: Pinia stores under `app/stores/`
- Pages: `app/pages` (`/`, `/match`, `/shop`, `/gift`, `/quest`)
- Components: boards (CardBoard, MatchBoard, PartyBoard, ShopBoard, QuestBoard, etc.), overlays, value bars, headers, modals
- Server API: `server/api/*` (currently `ping.ts`), future sim endpoints (Convex/Nitro)

## 📂 Project layout

```
apps/carbon
├─ app/
│  ├─ components/           # UI and game components (boards, overlays, bars, etc.)
│  ├─ composables/
│  ├─ data/
│  ├─ layouts/
│  ├─ pages/                # routes: index, match, shop, gift, quest
│  └─ stores/
├─ public/
├─ server/
│  └─ api/                  # Nitro server routes (e.g., ping.ts)
├─ types/
├─ utils/
├─ nuxt.config.ts
└─ package.json
```

## 🚀 Development

Prereqs: pnpm, Node 18+ recommended.

Common scripts (from `apps/carbon`):

```bash
pnpm run dev
pnpm run build
pnpm run preview
pnpm run lint
pnpm run lint:fix
pnpm run test
```

Monorepo notes:
- Ensure packages are built as needed (Umbraco/Bifrost). You can build the workspace from the repo root.
- Nuxt alias maps `umbraco` to `../../packages/umbraco` for local development.

Env:
- Copy `.env.example` → `.env` as needed; see `nuxt.config.ts` `runtimeConfig` for public vars.

## 🤝 Contributing

Where to start:
1) Add a new card/effect/aspect type
   - Define types in `types/` and reference them in stores/components
   - Prefer deterministic logic; isolate RNG and pass a seed
2) Extend the simulation
   - Add server endpoint to run sims (Nitro or Convex planned) returning a `BattleOutcome`
   - Keep event payloads minimal and serialisable
3) Improve replay UX
   - Map timeline events to GSAP timelines; add pause/scrub/speed controls

Coding guidelines:
- Keep rendering pure: derive all visuals from timeline/state; no hidden state in components
- Small, composable effects; targets/filters explicit
- Prefer typed contracts over free‑form objects (expand interfaces above as needed)

## 🗺️ Roadmap (high level)

- Server sim + persistence (Convex)
- Auth (Better‑Auth)
- Progression systems: settlements, regions, culture/religion/governance trees
- Card authoring pipeline (rarity/cost from BASH), image pack support
- Deterministic seeds → shareable replays
- Funding/roadmap via Polar

## 📄 License

MIT © Samuel M. Bednarz

---

Built with Nuxt, Vue, Umbraco, and UmbraJS.
