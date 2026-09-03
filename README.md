# EmmaDev — Portfolio

Personal portfolio of **Emmanuel**, a software engineer working mainly in Flutter/Dart mobile
development and Java/C# business systems.

Built on **Next.js 16** (App Router) with **Tailwind CSS 4**, rendered against the
[EmmaDev Design System](https://claude.ai/design/p/f8aaf116-77f9-48b3-94f6-67f289ec2f1e).

---

## Getting started

```bash
pnpm install
pnpm dev
```

The app runs at <http://localhost:3000>.

### Commands

| Command                     | What it does                                              |
| --------------------------- | --------------------------------------------------------- |
| `pnpm dev`                  | Dev server (Turbopack)                                    |
| `pnpm build` / `pnpm start` | Production build and server                               |
| `pnpm typecheck`            | `tsc --noEmit`, strict                                    |
| `pnpm lint`                 | oxlint (correctness) + ESLint (Next rules)                |
| `pnpm lint:adherence`       | **Design-system adherence** — see below                   |
| `pnpm ds:sync`              | Design-system drift check                                 |
| `pnpm test`                 | Unit and component tests (Vitest)                         |
| `pnpm test:e2e`             | End-to-end tests (Playwright, against a production build) |
| `pnpm media:build`          | Re-encode the source media (see below)                    |
| `pnpm verify`               | Everything CI runs, in one command                        |

---

## Architecture

```
src/
├── app/                     Routing, metadata, OG image, sitemap, robots
├── components/
│   ├── design-system/       VENDORED — do not hand-edit
│   │   └── index.ts         The only sanctioned import path
│   └── ui/                  App-level components
├── features/                One directory per page section
├── content/                 Typed content + Zod schemas
├── lib/                     Hooks and constants
└── styles/                  Tokens, Tailwind theme bridge, globals
```

**Sections are Server Components.** Only the design system, the site chrome and the experience
rail cross into the browser; the content itself never ships as JavaScript.

### The design system is vendored, not forked

`src/components/design-system/` is a byte-for-byte copy of the upstream Claude Design project.
Two mechanisms keep it honest:

- **`pnpm ds:sync`** asserts that every token in `.design-system/manifest.json` is declared in the
  vendored CSS, that every component is present and exported from the barrel, and that every
  theme-relevant token is bridged into Tailwind. It found a missing token on its first run.
- **`pnpm lint:adherence`** applies the design system's own rules: no raw hex colours, no raw `px`,
  no fonts outside the two the system provides, no deep imports past the barrel, and per-component
  prop contracts.

Deviations from upstream are applied as **props**, never as edits — the vendored components spread
`...style` last, so overriding is possible without touching the file. Each one carries a comment
explaining why. There are currently two, both worth pushing back upstream:

1. `NavPanel` is given `height: 100dvh` (upstream is `100%`, which hides the footer on mobile
   browsers with retracting toolbars).
2. `tokens/fonts.css` is not vendored at all — it loads both faces from the Google CDN. `next/font`
   self-hosts them instead, and `globals.css` re-binds `--font-core` / `--font-mono`.

Values that genuinely cannot use a token — the `theme-color` meta tag, the Satori-rendered OG
image, an `IntersectionObserver` rootMargin — live in `src/lib/brand.ts`, the one file the
adherence lint exempts.

### Content

All copy lives in `src/content/` and is validated by Zod at import time, which on a statically
rendered page means build time. A malformed entry fails `next build` rather than reaching
production.

The author's copy is preserved verbatim, spelling quirks included — the design system is explicit
that the voice is not to be rewritten. See `Known content notes` below.

---

## Media pipeline

The source site shipped **94 MB** of assets: six screen-recording GIFs between 7 MB and 36 MB, all
loaded eagerly. `pnpm media:build` re-encodes them:

|                   | Before            | After                    |
| ----------------- | ----------------- | ------------------------ |
| Screen recordings | GIF, 7–36 MB each | MP4 + WebM + WebP poster |
| Screenshots       | PNG, up to 328 KB | WebP, ≤1600px            |
| **Total**         | **95.7 MB**       | **9.2 MB** (−90.4%)      |

`Pokedex.gif` alone went from 35 MB to 3.3 MB.

Masters stay in `assets/source/` and are never served. Output lands in `public/` and is committed,
so deploys need no ffmpeg. Videos use `preload="none"` and only start once an `IntersectionObserver`
says they are on screen — scrolling past a project costs nothing.

---

## Known content notes

These were left as found because they are the author's own words, not refactor targets. Each is a
one-line change in `src/content/` if wanted:

- Typos carried over from the source: `riquierd` (×2), `objetive` (×2), `theire`, `educacion`,
  `an simulation`, `ideal created`, `responsable`.
- Technology labels keep their source casing on purpose: `Postgre SQL`, `Boostrap`, `FireBase`,
  `Javascript`.
- The **Personal** experience card repeats Grupo Indigo's full 17-chip technology list verbatim, as
  the source did.
- Five of the eight projects have no technology chips, because their descriptions name no
  technologies and inventing a stack would be a fabrication.
- No dates on the experience cards — the source carried none.

---

## Deployment

The app is a fully static export target but is built for **Vercel**, because `next/image`
optimisation needs a runtime optimiser. Set `NEXT_PUBLIC_SITE_URL` to the production origin so the
canonical URL, sitemap and OG tags resolve correctly.
