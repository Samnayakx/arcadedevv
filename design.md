# Arcade Project Home — Design System

Visual language matches **Vercel + Cloudflare** references: pure black canvas, zinc borders, white primary buttons, blue accents, dot-grid wizard backgrounds, horizontal binding pills.

Grounded in [Arcade.dev](https://arcade.dev) product copy and runtime concepts.

---

## Design tokens

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#000000` | Canvas (pure black) |
| `--panel` | `#0A0A0A` | Cards |
| `--panel2` | `#111111` | Hover, secondary surfaces |
| `--surface` | `#0B0B0B` | Metrics cards (Cloudflare) |
| `--input` | `#000000` | Form inputs |
| `--line` | `#27272A` | Borders (zinc-800) |
| `--line-subtle` | `#1F1F1F` | Dividers |
| `--line-strong` | `#3F3F46` | Hover borders |
| `--text` | `#FFFFFF` | Primary |
| `--text-dim` | `#A1A1AA` | Secondary (zinc-400) |
| `--text-faint` | `#71717A` | Tertiary (zinc-500) |
| `--accent` | `#0070F3` | Vercel blue — links, Pro badge |
| `--accent-bright` | `#2563EB` | Cloudflare binding pill |
| `--success` | `#22C55E` | Healthy / success only |
| `--warning` | `#F59E0B` | Auth / policy attention |
| `--error` | `#EF4444` | Failed / blocked (Cloudflare) |
| `--info` | `#3B82F6` | Active tab underline |

**Typography:** Inter · JetBrains Mono (traces, code)  
**Radius:** 6px · 8px · 12px · 16px  
**Icons:** Phosphor

---

## Button hierarchy

| Variant | Style | Use |
|---------|-------|-----|
| `primary` | White bg, black text | Continue, Create, Go to Project Home (Vercel) |
| `accent` | Blue `#0070F3` bg, white text | Deploy, Simulate test (Cloudflare) |
| `secondary` | Dark bg, gray border | Cancel, secondary actions |
| `ghost` | Transparent | Back |

---

## Key patterns

- **Get Started:** Vercel card grid, white text CTAs with arrow
- **FlowShell:** Cloudflare dot-grid + centered wizard card + vertical stepper (filled white dot = active)
- **Agent Flow Map:** Cloudflare Connected Bindings — horizontal charcoal pills + blue action pill
- **Trace drawer:** Build log — black bg, mono timestamps in gray
- **Project Home tabs:** Cloudflare metrics — blue underline on active tab
- **Health cards:** Cloudflare KPI strip on `#0B0B0B` surfaces

---

## Status colors (semantic only)

Healthy/success → green · Auth/policy → amber · Failed → red · Waiting → blue

Never use green as primary brand CTA.
