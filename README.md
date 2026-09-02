# Umar Farooq — Portfolio

A single-page portfolio built around one idea: a data core at the centre, with
the site's story running outward from it — technology → data → AI → business →
operations → projects → future.

React 18 · TypeScript · Vite · Tailwind CSS · Three.js · React Three Fiber ·
drei · Framer Motion · GSAP · lucide-react.

---

## 1. Folder structure

```
portfolio/
├── index.html                  Title, meta description, font links
├── package.json
├── vite.config.ts              Build config + manual chunking
├── tailwind.config.js          Colour, type and motion tokens
├── tsconfig.json / .app.json / .node.json
├── .env.example                Contact endpoint variable
├── public/
│   ├── favicon.svg
│   └── images/                 ← put project screenshots here
└── src/
    ├── main.tsx
    ├── App.tsx                 Section order + loading state
    ├── index.css               Tailwind layers, .glass, .grain, tokens
    ├── vite-env.d.ts
    ├── components/
    │   ├── LoadingScreen.tsx
    │   ├── Navbar.tsx
    │   ├── Hero.tsx
    │   ├── About.tsx           My Journey timeline (GSAP ScrollTrigger)
    │   ├── Experience.tsx      Role card + operations map
    │   ├── Skills.tsx          Skill ecosystem with linked highlighting
    │   ├── Projects.tsx        Tilting project cards
    │   ├── Education.tsx
    │   ├── WhatIBring.tsx
    │   ├── Contact.tsx
    │   ├── Footer.tsx
    │   ├── 3d/
    │   │   ├── HeroScene.tsx     Canvas, lights, camera rig, tiering
    │   │   ├── DataCore.tsx      Core, rings, orbiting labels
    │   │   ├── NetworkNodes.tsx  Data nodes + connection lines
    │   │   ├── Particles.tsx     Drifting point field
    │   │   └── SceneFallback.tsx CSS fallback (no WebGL / still loading)
    │   ├── visuals/
    │   │   ├── DetectionVisual.tsx  Deepfake pipeline animation
    │   │   └── RailwayVisual.tsx    Train → sensor → control → gate
    │   └── ui/
    │       ├── Reveal.tsx           Reveal, WordReveal, SectionHeading
    │       └── MagneticButton.tsx
    ├── data/
    │   ├── personal.ts         Name, contact, socials, hero copy, journey
    │   ├── experience.ts       Role, responsibilities, operations map
    │   ├── skills.ts           Skill clusters and their links
    │   ├── projects.ts         Both projects + pipeline stages
    │   └── education.ts        Education entries + "What I bring"
    ├── services/
    │   └── contactService.ts   The only file that talks to a backend
    └── hooks/
        ├── useDeviceTier.ts    high / low / none capability detection
        ├── useSection.ts       Active section, smooth scroll, scroll lock
        └── useCountUp.ts       Viewport-triggered number counting
```

## 2. Install and run

```bash
npm install      # once
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the built site locally
npm run lint     # type-check only
```

Node 18+ required.

## 3. Where to edit your information

| What | File |
| --- | --- |
| Name, initials, location, email, phone, hero copy, orbit labels | `src/data/personal.ts` |
| The "My Journey" timeline (2019 → 2027) | `src/data/personal.ts` → `journey` |
| Job, responsibilities, operations map nodes | `src/data/experience.ts` |
| Skills, their descriptions and links | `src/data/skills.ts` |
| Projects | `src/data/projects.ts` |
| Education, "What I bring" cards | `src/data/education.ts` |
| Page title, meta description | `index.html` |

Nothing personal is hard-coded inside components.

## 4. GitHub and LinkedIn links

In `src/data/personal.ts`:

```ts
socials: {
  linkedin: 'https://linkedin.com/in/your-handle',
  github: 'https://github.com/your-username',
},
```

They currently sit at `'#'`. Anything left as `'#'` renders as a clearly marked
placeholder rather than a dead link — in the contact list, the footer and the
project buttons. Per-project links live on each project in
`src/data/projects.ts` (`github`, `demo`).

## 5. Project images

Drop files into `public/images/`, then set the path in `src/data/projects.ts`:

```ts
image: '/images/deepfake.jpg',
```

Leave `image: ''` to keep the built-in interactive visual, which is usually the
stronger option — it animates and it does not need a screenshot to exist.

## 6. How the 3D system works

- **`HeroScene.tsx`** owns the `<Canvas>`: lights, a damped camera rig, device
  tiering and the render loop. It is loaded with `React.lazy`, so Three.js sits
  in its own chunk and the page paints before it arrives.
- **`DataCore.tsx`** is the object itself — an emissive core, a wireframe shell,
  orbit rings, and the five floating labels (`DATA`, `AI`, `SQL`, `ANALYTICS`,
  `OPERATIONS`), which are real 3D children so they move with the scene.
- **`NetworkNodes.tsx`** places nodes on a Fibonacci sphere and wires nearby
  ones together into a single line geometry — one draw call for every
  connection.
- **Interaction:** pointer movement rotates the core with damping; page scroll
  is read from a ref (`useScrollProgressRef`) so scrolling pushes the core back
  without triggering a single React re-render.
- **Performance:** `useDeviceTier()` returns `high`, `low` or `none`. Low tier
  (touch, narrow screen, ≤4 cores, ≤4 GB, or reduced-motion) halves the node
  count, drops to 220 particles, removes the second ring and caps DPR at 1.2.
  `none` (no WebGL) renders `SceneFallback`. The render loop also stops
  completely once the hero leaves the viewport.
- Pointer events are sourced from `document.body` because the canvas layer is
  `pointer-events: none` — that keeps the hero buttons clickable while the core
  still follows the cursor.

## 7. Connecting a backend later

Components never call `fetch` — they call `sendMessage()` from
`src/services/contactService.ts`. With no endpoint set, the form validates and
confirms without sending (demo mode).

To go live, create `.env.local`:

```
VITE_CONTACT_ENDPOINT=https://your-endpoint.example.com/contact
```

Anything accepting a JSON `POST` works: Formspree, a serverless function, your
own API. The payload is:

```json
{ "name": "...", "email": "...", "message": "...", "sentAt": "ISO-8601" }
```

If you need a different shape or headers, change them in that one file — no
component edits.

## 8. Deployment

The build output is a static `dist/` folder.

**Vercel** — import the repo, framework preset Vite, build `npm run build`,
output `dist`. Add `VITE_CONTACT_ENDPOINT` under project settings if used.

**Netlify** — build `npm run build`, publish `dist`.

**GitHub Pages** — set `base: '/repo-name/'` in `vite.config.ts`, then push
`dist` via an action or `gh-pages`.

Environment variables must be prefixed `VITE_` to reach the browser.

## 9. Accessibility and motion

Keyboard focus is visible throughout, the mobile menu closes on Escape, the
operations map and skill chips respond to focus as well as hover, and every
animation is disabled when the operating system requests reduced motion —
including the 3D scene, which drops to its simplified tier.
