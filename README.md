# VESPER — Fall of the Spire

A desktop-browser mecha combat slice built with Three.js and Vite. All models, material textures, rain, and effects are generated locally; no downloaded model assets are needed. Google Fonts is optional and has local fallbacks.

## Run

- `npm install`
- `npm run dev`
- Open the localhost address printed by Vite.
- `npm run build` creates the production build in `dist`.

## Controls

WASD moves, hold click or F to fire, Space dashes while moving, Q fires overdrive, Escape pauses. Sound is opt-in using the top-right button. The rifle automatically locks on to Acheron; this is an evasion and heat-management encounter, not free aiming. Leave the orange strike circle before impact. The second phase increases strike radius and speed. Overdrive recharges in 12 seconds.

## Scope

One arena, one playable frame, and one boss with two attack phases. Procedural beveled/extruded armor, painted metal textures, scratches and markings, weather, pooled particles, bloom, tone mapping, shadows, title/pause/failure/victory interfaces. Wet reflections are inexpensive authored surface glints, not ray tracing. Desktop keyboard and mouse are required. This is a stylized procedural vertical slice, not production console-quality asset work.

## In-place visual and encounter update

- PMREM environment reflections, procedural roughness/bump detail and ceramic/carbon armor sections.
- One shadow-casting directional light, with 2048 high / 1024 medium shadow maps. Three.js 0.186 uses PCFShadowMap; its removed PCFSoftShadowMap constant falls back to this same filter.
- Three-slot distance-prioritized light pool for muzzle flashes, explosions and overloads. No point-light shadows.
- Instanced spark and smoke pools (two draws), reused shock ring, and brief impact slowdown.
- Defeating Acheron ends the mission automatically after its destruction animation. No extraction objective is required.
- Pause now freezes weather/effects as well as combat and works during introduction, destruction and extraction.
- High/Medium quality button controls pixel ratio and shadow allocation. Controls and the existing two-phase fight are retained.

Validation: `node --test systems.test.js` tests light reuse/expiry/prioritization and extraction dwell behavior; `npm run build` builds production assets.

