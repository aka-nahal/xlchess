# XLChess Hero Section

A recreation of the [xlchess.com](https://xlchess.com) homepage hero with
improvements on top, built for the Stage 2 Full-Stack Web Developer assessment.

**Live demo:** https://xlchess.lonedetective.moe

**Approach:** Option 2. The existing hero is recreated faithfully, then extended.

![XLChess hero preview](./docs/preview-desktop.png)

## Overview

The hero keeps the elements that define the live site: the deep navy gradient,
the indigo and violet accents, the gradient headline, and the chessboard panel
on the right. On top of that recreation:

- Two classic games replay move by move (the Evergreen Game, 1852, and the
  Opera Game, 1858) with square highlighting, a gliding piece animation, a live
  move ticker, playback controls (pause, restart, 1x/2x speed), and a switcher
  to cycle between games.
- A second tab holds a mate-in-one puzzle. The visitor clicks a piece, then its
  destination. Wrong moves flash red; the winning move plays a solve animation
  and shows a short explanation.
- Animation is used with restraint: a word-by-word headline reveal, ghost
  pieces drifting in the background (the original site has these too), stats
  that count up on view, a resting 3D tilt on the board card, and a shine sweep
  on the primary CTA. Every effect uses only transform and opacity, and all of
  it is disabled under `prefers-reduced-motion`.
- Production details include a branded loading screen, an error boundary whose
  fallback surfaces the error message, fail-fast validation of bundled data, a
  skip-to-content link that actually moves focus, unit tests, and CI.

## Setup and installation instructions

Requires Node.js 20+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Run the unit test suite (10 tests)
npm test

# 4. Type-check and create a production build (outputs ./dist)
npm run build

# 5. Preview the production build locally
npm run preview
```

### Deployment

`npm run build` emits a fully static `./dist` folder. The demo runs on Vercel
(Add New, then Project, then import the repo; Vite is auto-detected with build
command `npm run build` and output directory `dist`), but any static host works
the same way. No server runtime is required, and since the page uses only
in-page anchors, no SPA rewrite rule is needed.

### Continuous integration

`.github/workflows/ci.yml` runs the test suite, type-checking, and the
production build on every push and pull request.

## Technologies and libraries used

| Technology                    | Role       | Why                                                                          |
| ----------------------------- | ---------- | ---------------------------------------------------------------------------- |
| Vite 7                        | Build tool | Matches the original site's stack. Fast dev server, small static output.     |
| React 19 + TypeScript         | UI         | Component architecture with strict types across data and props.              |
| Tailwind CSS 3                | Styling    | Design tokens sampled from the live site sit in one config file.             |
| Framer Motion 12              | Animation  | Declarative entrance and stagger animation; handles reduced motion natively. |
| Vitest 4                      | Testing    | Unit tests for board coordinate math and bundled-data integrity.             |
| GitHub Actions                | CI         | Tests, type-check, and build on every push.                                  |
| python-chess (build-time)     | Data       | Game and puzzle positions are generated from real PGN and verified by the engine before being bundled as JSON. Nothing is hand-typed and no chess engine ships to the browser. |

## Design decisions

- Option 2 rather than a redesign. The site is the company's own product with
  an established brand. Matching it accurately and then improving it shows
  better judgement than replacing a working identity.
- Design tokens come from the source. The colors (`#050B1D`, `#6366f1`,
  `#8b5cf6`, `#c084fc`), the Inter typeface, and the gradient headline were
  sampled from the live site's compiled CSS, so the recreation is accurate
  rather than approximate.
- The board got the most engineering attention because it is the most
  memorable part of the original hero: engine-verified move data, a gliding
  piece animation, playback controls, a game switcher, and a reduced-motion
  fallback that shows the final position without autoplay.
- The puzzle tab exists for retention. A hero's job is to convert visitors,
  and a visitor who has made a move on the board is more engaged than one who
  watched an animation.
- Positions are precomputed at build time instead of running a chess engine in
  the browser. The client renders frames, which keeps the animation
  deterministic and the bundle small.
- Each game's replay is remounted with a React `key`, so a stale move index
  can never point into a different game's position list. A defensive clamp
  backs this up. That exact bug shipped once during development; the fix and
  the reasoning are documented in the code.
- The card's 3D tilt is static under the pointer, on purpose. Two earlier
  versions (a pointer-tracking tilt, then a flatten-on-hover) were rejected
  because a transform that reacts to the pointer moves the click targets while
  the user is aiming at them, and `transform-style: preserve-3d` turned out to
  corrupt browser hit-testing. The card flattens only on keyboard focus. The
  full reasoning is preserved in comments in `TiltCard.tsx` and `index.css`.

## Assumptions made

- The Evergreen Game matches the game shown on the live site; the Opera Game
  was added as a second classic. Any PGN can be converted into the same JSON
  shape and dropped into `src/data/`.
- Copy and stat figures (10M+ games, 180+ countries) are placeholder marketing
  numbers, not audited metrics.
- Only the hero is in scope, so nav links and CTAs point to in-page anchors
  rather than real routes.
- The puzzle is a curated one-move challenge, not a full chess engine. It
  accepts exactly the winning move by design.

## Trade-offs considered

- No analytics. Measurement belongs on the real production page, but it was
  left out of this component demo to keep it dependency-free and clean of
  third-party scripts. The natural hook points are the CTA click handlers and
  the board control handlers.
- Framer Motion adds roughly 30 KB gzipped, but it replaces a lot of
  hand-written animation code and handles reduced motion for free. Where
  determinism mattered more (the piece flight), plain CSS is used instead.
- Static output, no SSR. This fits a fully static hero. If the page later
  needs per-request data or dynamic OG images, it can move to an SSR setup.
- The puzzle accepts a single winning move rather than validating all legal
  moves. This keeps a chess engine out of the bundle while still giving the
  visitor real interaction. The data-accessor pattern makes swapping in
  chess.js straightforward later.
- Pieces are Unicode glyphs rather than SVG sets: zero asset weight and crisp
  at every size, at the cost of minor font differences across platforms.

## What I would improve if given additional time

- Drag-and-drop play with legal-move validation (chess.js) and a rotating
  daily puzzle.
- Playwright end-to-end tests in CI covering tab switching, puzzle solving,
  and switching games mid-replay. Several bugs found during development were
  state-transition bugs that only end-to-end testing catches.
- Analytics wired to the existing hook points once a measurement plan exists.
- A generated Open Graph image per deployment and richer social cards.
- Internationalisation and a reduced-data mode.
- Real routes for the CTAs once the surrounding application exists.

## Project structure

```
src/
  components/
    Header.tsx         # sticky nav + brand mark
    Hero.tsx           # headline, copy, CTAs, stats (staged entrance)
    BoardPanel.tsx     # tabbed card: replay / puzzle, owns game selection
    BoardGrid.tsx      # shared presentational 8x8 board (optionally interactive)
    ReplayBoard.tsx    # classic-game replay + playback controls
    PuzzleBoard.tsx    # mate-in-one interaction (select piece -> destination)
    TiltCard.tsx       # resting 3D tilt (static under pointer, by design)
    FloatingPieces.tsx # decorative drifting background pieces
    CountUpStat.tsx    # stat that counts up when scrolled into view
    LoadingScreen.tsx  # branded first-paint splash
    ErrorBoundary.tsx  # branded crash fallback that surfaces the error message
  data/
    games.ts           # both classics, shared fail-fast validation
    evergreen.json     # Evergreen Game positions (from real PGN)
    opera.json         # Opera Game positions (from real PGN)
    puzzle.json        # engine-verified mate-in-one position
    puzzle.ts          # typed accessor with fail-fast validation
  __tests__/
    board.test.ts      # coordinate math + data-integrity tests (10 tests)
  App.tsx              # skip link, layout shell
  main.tsx             # entry, error boundary wiring
  index.css            # Tailwind layers, gradient bg, motion keyframes, a11y utilities
```
