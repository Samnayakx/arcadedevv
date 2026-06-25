# Arcade Project Home Prototype

React prototype for the redesigned Arcade onboarding + Project Home dashboard, grounded in [Arcade.dev](https://arcade.dev) MCP runtime concepts.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 — starts on **Get Started**.

## Deploy to Vercel

This project is a static Vite SPA configured for [Vercel](https://vercel.com).

**Option A — GitHub (recommended)**

1. Push this repo to GitHub.
2. Import the repository in the [Vercel dashboard](https://vercel.com/new).
3. Vercel auto-detects Vite. Confirm:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install`
4. Deploy. Client-side routes are handled via `vercel.json` rewrites.

**Option B — Vercel CLI**

```bash
npm i -g vercel
vercel
```

**Local production preview**

```bash
npm run build
npm run preview
```

## Screens

| Screen | Route (state) | Description |
|--------|---------------|-------------|
| Get Started | `get-started` | 3 intent cards + explore link |
| Build Agent | `build` | 8-step wizard with live trace |
| MCP Gateway | `gateway` | 8-step gateway setup |
| Sandbox | `sandbox` | 6-step safe tool call |
| Project Home | `empty` / `active` | Dashboard with 5 maturity states |

## Demo controls

On **Project Home**, use the **Demo state** dropdown to switch:
- Empty · Needs auth · First run · Active

## Docs

- `prd.md` — Product requirements
- `design.md` — Design tokens & layout
- `rules.md` — Development conventions
- `timeline.md` — Build progress

## Stack

- React 19 + TypeScript + Vite
- Framer Motion (animations)
- Phosphor Icons
- Mock data in `src/data/mockProject.ts` (API-swappable)

## Arcade references

- Tool-level OAuth authorization
- MCP Gateways for AI clients (Cursor, Claude, VS Code)
- Contextual Access / policy enforcement
- Audit traces for every tool execution
- SDK: `@arcadeai/arcade`
