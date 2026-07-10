# XLChess — Hero Section

A recreation-plus-improvement of the [xlchess.com](https://xlchess.com) homepage hero,
built for the Stage 2 full-stack technical assessment.

**Live demo:** _add your live URL here_
**Approach:** Option 2 — faithful recreation of the existing hero, with thoughtful,
production-minded improvements layered on top.

![XLChess hero preview](./docs/preview-desktop.png)

---

## What's inside

The hero recreates the key elements of the live site — the deep-navy gradient
canvas, the indigo/violet brand accent, the `Build the Future of Online Chess`
headline, the supporting copy, and the signature right-hand panel: a chessboard
that **replays classic games** — "The Evergreen Game" (Anderssen vs Dufresne,
1852) and "The Opera Game" (Morphy vs Allies, 1858) — move by move, with square
highlighting, a live move ticker, and a switcher to cycle between classics.

Beyond the recreation:

- **A playable puzzle** — the board card has two tabs: *Watch a classic* (the
  Evergreen Game replay) and *Solve a puzzle* (a mate-in-one the visitor solves
  by clicking a piece and its destination, with wrong-move feedback and an
  explanation on success). A hero's underlying job is engagement — this turns a
  passive visitor into a player within seconds.
- **Interactive replay controls** — pause/resume, restart, and 1x/2x speed on the
  replay tab.
- **A designed motion system** — word-by-word headline reveal, ghost chess pieces
  drifting in the background (an homage to the original site), pieces that glide
  from square to square on every replay move and on the puzzle's winning move
  (a same-frame CSS animation driven by custom properties), stats that count
  up on view, a static resting 3D tilt on the board card
  that straightens on keyboard focus (deliberately static under the pointer —
  see the note in `TiltCard.tsx` and `index.css` about moving targets and
  `preserve-3d` hit-testing), a shine sweep on
  the primary CTA, and a scroll cue. Every effect is transform/opacity only and
  fully disabled under `prefers-reduced-motion`.
- **Branded loading screen** on first paint (fades out in under a second).
- **Error handling** — a top-level React error boundary renders a branded
  fallback with a reload action instead of a white screen, and the bundled game
  data is validated at load so corrupt data fails fast with a clear message.
- **Accessibility** — semantic landmarks, `aria` labels on the board and its
  controls, `aria-live` move announcements, visible keyboard focus rings, and
  full `prefers-reduced-motion` support (autoplay is disabled; the board shows
  its final position).
- **Performance** — fully static output, autoplay pauses while the tab is
  hidden, fonts preconnected, ~116 KB gzipped total.
- **Tests + CI** — a Vitest suite covers the board coordinate math and validates
  the integrity of both bundled datasets; a GitHub Actions workflow runs tests,
  type-checking, and the production build on every push.
- **Social sharing** — Open Graph and Twitter card tags with a branded share
  image, plus a skip-to-content link for keyboard users.

---

## Tech stack

| Concern        | Choice                          | Why                                                                |
| -------------- | ------------------------------- | ------------------------------------------------------------------ |
| Build tool     | **Vite 7**                      | Matches the original site's stack; fast dev server, tiny output.   |
| Framework      | **React 19 + TypeScript**       | Component architecture + strict type safety.                        |
| Styling        | **Tailwind CSS**                | Design tokens sampled from the live site live in one config.        |
| Animation      | **Framer Motion**               | Declarative animation; respects reduced-motion out of the box.      |
| Game accuracy  | **python-chess** (build-time)   | Game and puzzle positions generated and verified from real PGN.     |
| Testing        | **Vitest + GitHub Actions**     | Unit tests for board math and data integrity, run in CI.            |

## Getting started

Requires **Node.js 20+**.

```bash
# 1. Install
npm install

# 2. Run the dev server (http://localhost:5173)
npm run dev

# 3. Type-check + production build
npm run build

# 4. Run the test suite
npm test

# 5. Preview the production build locally
npm run preview
```

### Deployment

`npm run build` emits a static `./dist` folder, so the app deploys anywhere.
The demo is deployed on **Vercel**:

1. Push this repository to GitHub (public).
2. In Vercel: **Add New → Project**, import the repo — Vite is auto-detected
   (build command `npm run build`, output directory `dist`).
3. Deploy and submit the generated URL.

Any other static host (Netlify, Cloudflare Pages, or a self-managed nginx)
works identically; no server runtime is required.

---

## Project structure

```
src/
  components/
    Header.tsx         # sticky nav + brand mark
    Hero.tsx           # headline, copy, CTAs, stats (staged entrance)
    BoardPanel.tsx     # tabbed card: replay / puzzle
    TiltCard.tsx       # resting 3D tilt that flattens on hover/focus
    FloatingPieces.tsx # decorative drifting background pieces
    CountUpStat.tsx    # stat that counts up when scrolled into view
    BoardGrid.tsx      # shared presentational 8x8 board (optionally interactive)
    ReplayBoard.tsx    # Evergreen Game replay + playback controls
    PuzzleBoard.tsx    # mate-in-one interaction (select piece -> destination)
    LoadingScreen.tsx  # branded first-paint splash
    ErrorBoundary.tsx  # branded crash fallback with reload
  data/
    games.ts           # both classics, shared fail-fast validation
    evergreen.json     # Evergreen Game positions (from real PGN)
    opera.json         # Opera Game positions (from real PGN)
    evergreen.ts       # re-export kept for import stability
    puzzle.json        # engine-verified mate-in-one position
    puzzle.ts          # typed accessor with fail-fast validation
  App.tsx
  main.tsx
  index.css            # Tailwind layers, gradient bg, a11y utilities
```

The board never runs a chess engine in the browser: the 47-ply game is converted
to a list of 8×8 positions at build time, so the client just renders frames. This
keeps the bundle small and the animation deterministic.

---

## Design decisions

- **Option 2, not 3.** The site is the company's own product with an established
  brand. Recreating it faithfully and improving it respectfully demonstrates more
  judgement than discarding a working identity for a redesign.
- **Tokens sampled from the source.** Colors (`#050B1D`, `#6366f1`, `#8b5cf6`,
  `#c084fc`), Inter, and the gradient headline are taken from the live CSS so the
  recreation is accurate rather than approximate.
- **The board is the centrepiece.** The most memorable part of the original hero
  is the live game, so it received the most engineering care: accuracy, move
  highlighting, playback controls, reduced-motion fallback, hidden-tab pause.
- **Retention thinking.** A hero's underlying job is acquisition and engagement.
  The replay controls invite a first interaction, the primary CTA is singular and
  unambiguous, and the stats row provides social proof.
- **Motion with restraint.** Entrance animations are subtle and fully disabled for
  users who prefer reduced motion.

## Assumptions

- The Evergreen Game matches the game shown on the live site; any PGN can be
  swapped into `evergreen.json` via the generation script approach.
- Copy and stat figures (10M+ games, etc.) are representative placeholders for a
  marketing hero, not audited numbers.
- Nav links point to in-page anchors since only the hero was in scope.

## Trade-offs

- **No analytics.** Measurement (e.g. GA4 on CTA clicks and board interactions)
  belongs on the real production page, but was deliberately left out of this
  component demo to keep it dependency-free and privacy-clean. The obvious hook
  points are the CTA `onClick`s and the board control handlers.
- **Framer Motion** adds a few KB but replaces a lot of hand-written animation
  code and gives reduced-motion handling for free — worthwhile for a marketing page.
- **Static output** (no SSR) fits a fully static hero; if the page later needs
  per-request data or dynamic OG images, it can move to an SSR-capable setup.
- The puzzle accepts **only the single winning move** rather than running full
  legal-move validation — a deliberate scope cut that keeps the bundle free of a
  chess engine while still delivering real interaction. The data accessor pattern
  makes swapping in a full engine (e.g. chess.js) straightforward later.

## What I'd improve with more time

- Full **drag-and-drop play** with legal-move validation (chess.js) and a
  rotating daily puzzle.
- **Playwright** visual/accessibility smoke tests in CI, on top of the existing
  Vitest unit suite.
- **Analytics** wired to the CTA and board-control hook points, once a real
  measurement plan exists for the page.
- A generated **OG image** for richer social sharing.
- Real **i18n** and a reduced-data mode.
- Wire CTAs to real routes once the surrounding app exists.
