# NEON TITAN — LAST ORBIT

A cinematic, procedural Three.js mecha campaign. An in-place expansion of Vesper: the original mech, arena, render pipeline, combat controls, and pooled effects remain the foundation.

## Run and validate

```sh
npm install
npm run dev
npm test
npm run build
```

Vite outputs the production site to `dist`. `vercel.json` configures Vercel. The existing public repository and Vercel project keep their original `vesper-fall-of-the-spire` names.

## Campaign

| Mission | Theme | Encounter |
| --- | --- | --- |
| 1. Rainline | Cyan transit platform | Warden; single warning strikes |
| 2. Ember Foundry | Warm furnace deck | Crucible; paired strikes |
| 3. Ghost Relay | Violet signal array | Echo then Revenant; line barrage |
| 4. Stormbreak | Blue orbital anchor | Tempest; five-point crossfire |
| 5. Last Orbit | Red crown platform | Herald then Acheron; faster crossfire |

Defeating the last hostile ends each mission after its destruction sequence. Results award scrap, ratings and unlocks; select Next Mission, Replay, Hangar, Level Select or Return to Title. No extraction step is required. Two-wave missions offer a 15-hull field repair between enemies.

Mission scores weight pace against par time (60%) and remaining hull (40%). Ratings are S/A/B/C. First clears pay the configured base scrap plus a rating bonus. Replays pay 35% base scrap plus the bonus. Best score, rating and time are retained independently.

The Arc Rifle is available immediately. Level 1 unlocks the Pulse Repeater, level 2 unlocks cooling/armor core modules, and level 3 unlocks the Ion Lance. Each weapon has three purchasable upgrades adding 20% base damage each. Upgrade prices are 150, 300 and 450 scrap. No external purchases.

## Controls

- **Keyboard/mouse:** WASD moves, Space dashes while moving, hold F or left click to fire, Q overdrives, Escape pauses, H opens the guide.
- **Assisted mode (default):** original automatic targeting. **Manual mode:** move mouse to place the reticle; aim assist enlarges the hit allowance, sensitivity and invert Y apply to reticle movement.
- **Standard gamepad:** left stick moves, right stick aims in Manual, RT fires, A/Cross dashes, RB/R1 overdrives, Start pauses, Y/Triangle opens guide. Menu focus uses D-pad up/down and A/Cross selects.
- **Touch:** direction pad, Fire, Dash and Overdrive buttons. Drag on the arena to aim in Manual mode. Multi-touch supports movement and firing together.

## Saves and options

Versioned browser localStorage keys `neon-titan-campaign-v1` and `neon-titan-options-v1`. Saves include scrap, completed missions, best records, equipped gear, upgrade ranks and recent rewarded run IDs. Continue starts the highest unlocked mission, not a mid-fight checkpoint. Saves belong to the current browser/origin; localhost and deployed-site saves are separate. No cloud sync.

New Game and Reset Progress require explicit confirmation. Reset keeps graphics/control options. Corrupt/unsupported saves are not silently overwritten; storage failures show a warning and allow session-only play.

Options control resolution scale, 2048/1024/off shadows, bloom, particle density, shake, reduced motion, volume/mute, aim sensitivity/assist/inversion and assisted/manual control. Reduced motion disables camera orbits, idle camera sway, shake and impact slowdown.

## Resource strategy

The menu reuses the base world and hero. `mission-scene.js` is a separate lazy-loaded chunk; the first deployment creates two instanced prop batches reused across all five mission themes. Only one enemy rig is active at a time. Mission transitions reset it rather than allocating new rigs, textures or lights. Five warning markers, a three-slot light pool, a 240-slot spark/smoke pool, one shock ring and one tracer are reused. HUD updates are throttled to 12.5 Hz. Dynamic event lights do not cast shadows; only the key directional light does. PCFShadowMap is used because the installed Three.js version removed PCFSoftShadowMap.

This remains a stylized procedural browser game rather than console production asset work. Wet reflections use surface glints and environment lighting; there is no ray tracing. Hardware gamepad and physical mobile performance require device testing.
