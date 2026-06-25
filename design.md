# Arcade Project Home — Design System

Visual language: **pure black canvas**, **line-based partitions** (no rounded cards), **lime accent** for primary CTAs, semantic colors for status only. Grounded in [Arcade.dev](https://arcade.dev) runtime concepts.

**Token sources:** `src/styles/global.css` · `src/styles/typography.css` · `src/styles/layout.css`

---

## Design tokens

### Surfaces & lines

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#000000` | Page canvas |
| `--panel` | `#0a0a0a` | Cards, panels |
| `--panel2` | `#0f0f0f` | Hover, secondary surfaces |
| `--input` | `#050505` | Form fields |
| `--line` | `rgba(255,255,255,0.08)` | Default borders |
| `--line-subtle` | `rgba(255,255,255,0.05)` | Dividers |
| `--line-strong` | `rgba(255,255,255,0.16)` | Hover/focus borders |

### Text

| Token | Use |
|-------|-----|
| `--text` | Primary copy |
| `--text-dim` | Secondary body |
| `--text-faint` | Labels, meta |
| `--text-muted` | Disabled hints |

### Brand & semantic

| Token | Use |
|-------|-----|
| `--accent` / `--accent-bright` | **Primary CTA only** (lime `#c6ff00`) |
| `--success` | Healthy runs, success badges |
| `--warning` | Auth blocks, policy attention |
| `--error` | Failed runs, critical issues |

Never use semantic green/amber/red for primary navigation CTAs.

### Radius

All `--radius-*` tokens are **0**. Layout uses borders, not rounded containers.

**Documented exceptions:** tool/trace pills (`border-radius: 999px`), KPI pixel cells.

---

## Spacing scale (`--space-1` … `--space-7`)

| Token | px | Use |
|-------|-----|-----|
| `--space-1` | 4 | Tight inline gaps |
| `--space-2` | 8 | Chip/icon gaps, stack-sm |
| `--space-3` | 12 | Card head padding-y, form gaps |
| `--space-4` | 16 | Card padding-x, inner sections |
| `--space-5` | 20 | Section margin (`--section-gap`) |
| `--space-6` | 24 | Page padding (`--content-pad-x`) |
| `--space-7` | 32 | Large section breaks |

### Layout aliases

- `--card-pad-x` / `--card-pad-y` — dashboard card headers
- `--section-gap` — between dashboard sections
- `--content-max-width: 1280px`

---

## Typography hierarchy

| Role | Token / class | Example |
|------|----------------|---------|
| Page title | `--text-title-lg` | Dashboard `h1` |
| Card title | `--text-title-sm` + heading weight | `.dashboard-card-head h3` |
| Section body | `--text-body-sm` | Card descriptions |
| Meta / table | `--text-caption` | Timestamps, counts |
| Label | `.field-label` / `.text-overline` | Uppercase faint labels |
| Code / tools | `--mono` + `--text-caption` | Tool actions, traces |

Utility classes live in `typography.css` (`.text-title-lg`, `.text-overline`, etc.).

---

## Button hierarchy

Use `Btn` primitive or `.btn` + variant classes.

| Variant | Style | Use |
|---------|-------|-----|
| `primary` | Lime fill, black text | Main CTA (Create, Execute, Deploy) |
| `secondary` | Transparent + line border | Cancel, secondary actions |
| `ghost` | Transparent, no border | Back, low-emphasis nav |
| `link` | Underline text | Table row actions |
| `icon` | 32×32 icon-only | Toolbar, top bar |

Sizes: `btn-sm` · `btn-md` (default) · `btn-lg`

### Interactive states

- **Hover:** `border-color: var(--line-strong)` or `background: var(--panel2)`
- **Active/selected:** `.is-active` — border or accent underline
- **Disabled:** `opacity: 0.4`, `cursor: default`
- **Focus:** `outline: 1px solid var(--line-strong)`

---

## Icons & logos

| Size | px | Context |
|------|-----|---------|
| `xs` | 12 | Carets, compact table actions |
| `sm` | 14 | Nav, card actions, default inline |
| `md` | 16 | Toolbar, command palette |
| `lg` | 18 | Sidebar toggle, top bar |

**Phosphor only.** Weights: `regular` default · `bold` CTAs/carets · `fill` active nav + status badges.

**BrandLogo:** `sm` (12) tables · `md` (14) lists · `lg` (16) headers.

---

## Layout patterns

- **Page shell:** max-width 1280px, horizontal pad `--content-pad-x`
- **Dashboard card:** `.dashboard-card` — panel bg, `1px` border, flat corners
- **Card head:** flex row, title + meta, bottom border `--line-subtle`
- **Section stack:** `.dashboard-section` with `--section-gap` margin
- **Dot grid:** `.dot-grid-bg` on wizard/playground canvases

---

## Key surfaces

- **Get Started:** intent path cards, lime CTA on recommended path
- **Playground:** flat column dividers, trace in thread
- **Tool Catalog:** sidebar filters + line-partitioned rows
- **Project Home:** summary + trace map + agents + ops tabs
- **Trace drawer:** mono timestamps, step chain

---

## Status colors (semantic only)

| State | Token | Icon |
|-------|-------|------|
| Healthy / success | `--success` | CheckCircle |
| Auth / policy | `--warning` | Key / ShieldWarning |
| Failed / degraded | `--error` | Warning |

Use `StatusBadge` primitive — do not invent new status colors inline.
