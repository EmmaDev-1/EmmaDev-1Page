# EmmaDev — Portfolio

Personal portfolio of **Emmanuel**, a FrontEnd Engineer building mobile apps with Flutter and Dart.

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
│   ├── motion/              Reveal, Stagger, LineReveal, MotionProvider
│   └── ui/                  Icon, Section, ProjectMedia, PersonJsonLd
├── features/                One directory per page section, plus navigation
├── content/                 Typed content + Zod schemas
├── lib/                     motion.ts (DS motion vocabulary), hooks, brand
└── styles/                  Tokens, Tailwind theme bridge, globals
```

### Motion

`lib/motion.ts` is the single translation of the design system's motion tokens
into values Motion can animate — durations, easing curves, the 120ms stagger step
and the blur-out reveal. Components compose from it rather than inventing timings,
which is what keeps a page this animated from drifting into a dozen private rhythms.

Reduced motion is handled in two places, both needed: `MotionConfig reducedMotion="user"`
covers Motion's inline/WAAPI animations, and the media query in `globals.css` covers the
design system's own CSS hovers and continuous loops.

### Navigation

Three coordinated affordances rather than one bar — `TopBar` (where you can go,
transparent over the hero and glass past it), `SectionRail` (where you are, wide
screens only) and `ScrollProgress`. Below 768px all three give way to a
full-screen `MobileMenu`.

### What this costs

Every section is now a Client Component. Scroll-linked animation needs the element's own
scroll progress, which only exists in the browser, so the previous build's "sections never
ship as JavaScript" no longer holds. Measured on the built page: **~278 KB of JavaScript
transferred (gzip)**, against roughly 100 KB of Next.js baseline before this work.

The content itself is still resolved and inlined at build time — the page is fully static,
every route prerendered — and the media budget stays well under a page load's worth (~15 MB
across all eleven projects). The trade was made
deliberately in exchange for the motion; if it ever needs unwinding, the seam is
`components/motion/`, and the sections would go back to Server Components by dropping
scroll-linked values for CSS-only reveals.

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
explaining why:

1. `tokens/fonts.css` is not vendored at all — it loads both faces from the Google CDN. `next/font`
   self-hosts them instead, and `globals.css` re-binds `--font-core` / `--font-mono`.
2. **Icons.** The DS ships three PNGs and two unicode glyphs, and its README asks to consult the
   author before adding a library, warning that Lucide "would immediately look borrowed". That
   question was put to him and he chose Lucide. `components/ui/Icon.tsx` keeps it from sprawling:
   an explicit allowlist, and a 1.5 stroke on 20px so it sits with the type rather than shouting
   over it. Social marks stay as the DS's own PNGs.
3. **Compositions.** `NavBar`, `NavPanel` and `ProjectRow` are no longer consumed — each fixes a
   layout and its own entrance, which a scroll-linked composition cannot take part in. Their visual
   grammar is reproduced exactly from the same tokens; `NavLink`, `TagChip`, `Button`,
   `SectionHeading`, `BlobPortrait`, `ResumePreview`, `GradientText`, `MediaCarousel`, `NavToggle`
   and `CursorTrail` are still the real components. All of them stay exported, since `ds:sync`
   requires every manifest component to be present and reachable.
4. **The cursor trail only mounts where it has something to follow.** Its own guard asks for
   `(hover: hover) and (pointer: fine)`, which a phone or tablet with a Bluetooth mouse or a stylus
   answers yes to — and Android's "Desktop site" mode can report `hover: hover` outright — so on a
   phone thirteen dots chased a finger they could not see and got in the way. `SiteChrome` decides
   whether to render it at all, adding a `min-width: 768px` clause (`PRECISE_POINTER_QUERY` in
   `lib/brand.ts`, in step with `--breakpoint-nav`). Gating the mount rather than patching the
   component keeps the vendored file byte-identical, and the media query is watched, not read once,
   so plugging in a mouse or resizing the window is honoured mid-session.

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

Three later projects — Colorinfinity, Ditto Kids and Ditto Kids Dashboard — added two MP4 sources
and four screenshots, bringing the current total to **~15 MB** across all eleven projects.

**The browser tab icon** is generated from the same About Me photo (`aboutMe/EmmaDevAnimated2.jpeg`)
as the portrait, but cropped much tighter around the head — a favicon is read at 16–48px, where the
portrait's own framing is mostly white background. It lands at `src/app/icon.png` rather than
`public/`, which is Next's file convention for the tab icon: the App Router serves any
`icon.(png|svg|ico)` placed at the app root automatically, no metadata wiring needed.

**MP4 sources need one more step than a GIF does.** `sharp` decodes GIF frames directly but cannot
open a video container at all, so the pipeline extracts frame 0 through `ffmpeg` first and reads
_that_ — an ordinary PNG — for both the source dimensions and the poster image. This generalises
cleanly to either source type rather than special-casing one of them.

**Every video job pins its output to 30fps**, GIF or MP4 alike. `ditto-kids.mp4` surfaced why:
screen recorders can write variable-frame-rate footage with a nonsense nominal rate in the
container header — this one reported 96.83 fps with its `tbr` equal to its own 90000 timebase,
meaning ffmpeg had no real frame interval to infer at all. Converting that to a constant frame rate
without pinning one made ffmpeg try to hit the bogus declared rate by duplicating frames to fill the
gaps — confirmed by reproduction before the fix landed: 108,863 frames encoded to cover 1.2 seconds
of timeline, and climbing. An explicit `-r 30` fixes it at the source for any future import, and
costs the original six nothing — none of them approach 30fps natively.

Masters stay in `assets/source/` and are never served. Output lands in `public/` and is committed,
so deploys need no ffmpeg. Videos use `preload="none"` and only start once an `IntersectionObserver`
says they are on screen — scrolling past a project costs nothing.

---

## Known content notes

**Experience**, **About Me** and the **CV** are sourced from `Emmanuel_Aguilar_CV.pdf`. The
original eight projects' copy is still the author's wording from the old site, verbatim.

**Colorinfinity, Ditto Kids and Ditto Kids Dashboard** are newer projects the author described in
his own words — what each product does and who it is for, not a polished description. Their prose
in `src/content/projects.ts` is a rewrite of that description for clarity, not new information he
did not supply; he reviewed and can amend it at any time. He supplied their stacks separately, so
unlike most of the original eight all three carry chips.

Two labels in those stacks are corrected rather than verbatim: `RevenueCat` and `Subscriptions`,
given as "RevenewCat" and "suscriptions". That is not a departure from the rule below — the CV's
quirks are the author's deliberate wording in a document he wrote, while these were typos in a chat
message, and a misspelt tool name reads to anyone who knows the tool as not knowing it.

These were left as found because they are the author's own words, not refactor targets. Each is a
one-line change in `src/content/` if wanted:

- Typos carried over from the old site's project copy: `riquierd` (×2), `objetive` (×2), `theire`,
  `educacion`, `an simulation`, `ideal created`.
- Technology labels keep their source casing on purpose, in both the projects and the CV's own
  skills list: `Postgre SQL`, `Boostrap`, `FireBase`, `Javascript`, `Key Managment`, `MicrosoftSQL`.
- Six of the eleven projects have no technology chips, because their descriptions name no
  technologies and none were supplied — inventing a stack would be a fabrication.
- The CV also lists Bineo (Banorte), Dyshez and Habitan-t, which the Projects section does not yet
  show. Adding them needs screenshots or recordings, the same as the three added here.
- `profile.role` and the hero line both read `FrontEnd Engineer` — the author's chosen positioning.
  It is deliberately neither the degree (`Software Engineering`, on `profile.education`) nor the CV's
  per-role job title (`Flutter Developer`, on each Experience entry).
- The author's **email is published** in the footer and in the JSON-LD, at his request. It was
  previously kept out of the markup to avoid scrapers, but that was buying very little: the CV the
  site serves for download prints the same address, so it was already public. His **phone number
  stays out** — it is only in the PDF, and nothing on the page needs it.

---

## Deployment

Built for **Vercel** — every route prerenders, but `next/image` optimisation still wants a runtime
optimiser.

`vercel.json` pins the framework preset, install command and build command. That matters here
because the Vercel project predates this rewrite: it was created when the repo was a static
`index.html`, so its dashboard settings describe that site. `vercel.json` takes precedence over the
dashboard, so the correct build is committed rather than remembered.

`.vercelignore` keeps ~100 MB of media masters, the e2e suite and the design-system tooling out of
the build context. None of it is read by `next build` — verified by building with those directories
removed.

### The site's origin

Absolute URLs — canonical, Open Graph, sitemap, robots, JSON-LD — all come from `src/lib/site.ts`,
which resolves in this order:

1. **`NEXT_PUBLIC_SITE_URL`** — set this once a custom domain exists; it wins over everything.
2. **`VERCEL_PROJECT_PRODUCTION_URL`** — injected by Vercel, stable across deployments. Preview
   builds get the production domain, which is what a canonical URL should point at. Requires
   "Automatically expose System Environment Variables" to stay enabled (it is, by default).
3. **`http://localhost:3000`** — for `pnpm dev` and tests.

There is deliberately no hardcoded production fallback. The previous one guessed
`emmadev.vercel.app`; that domain is somebody else's portfolio, so with the env var absent every
canonical URL and sitemap entry pointed at a stranger's site. A wrong constant is worse than none —
it fails silently and looks right.

This build is live. `main` fast-forwarded onto the rewrite and Vercel's GitHub integration
deployed it — production serves the Next.js site, not the old `index.html`. Verified against
`emma-dev.vercel.app`: all five routes return 200, and the canonical URL, sitemap and OG image all
resolve to that host through `VERCEL_PROJECT_PRODUCTION_URL`, with no `NEXT_PUBLIC_SITE_URL` set.

### What still has to be done in the Vercel dashboard

Not settable from the repo:

- **Custom domain**, if one is wanted. Add it, then set `NEXT_PUBLIC_SITE_URL` to match — until
  then every absolute URL correctly points at the `.vercel.app` host.
