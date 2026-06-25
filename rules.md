# Arcade Project Home — Development Rules

## Product rules

1. **Home is operational, not inventory.** Never default Project Home to a 7,000-tool catalog.
2. **Activation = first authorized tool call.** Every onboarding path ends at trace + Project Home.
3. **Skip is allowed.** Skipping lands on guided empty Project Home, not a dead dashboard.
4. **One mock source.** All tables, node map, and Needs Attention read from `mockProject.ts`.
5. **Consistency.** A blocked Slack run appears in Runs, Policies, Audit, and Needs Attention.

## UI rules

1. **Phosphor icons only** — use `Icon` primitive or documented sizes (`--icon-xs` … `--icon-lg`).
2. **Design tokens only** — CSS variables from `global.css`, `typography.css`, `layout.css`; no hardcoded hex in components.
3. **Buttons** — prefer `Btn` primitive; variants: `primary` | `secondary` | `ghost` | `link` | `icon`.
4. **Status is color + icon** — `StatusBadge` maps to semantic tokens per `design.md`.
5. **Empty states never fake data** — states 1/2 show copy + CTAs, not populated tables.
6. **Spacing** — use `--space-*` scale; card heads use `--card-pad-x` / `--card-pad-y`.
7. **Zero radius** — all containers flat; exceptions documented in `design.md` (tool pills, KPI pixels).
8. **Trace drawer** opens from run actions and trace previews.

## Arcade grounding

1. Tool actions use `Toolkit.Action` naming (e.g. `GitHub.CreateIssue`).
2. Auth is **tool-level OAuth** — Arcade manages flow, refresh, secure storage ([docs](https://docs.arcade.dev)).
3. MCP Gateway is a **distinct flow** from Build Agent — goal → tools → config → client → test.
4. Policies reference **Contextual Access** — human confirmation, block, redact.
5. Audit rows include: actor · agent · tool · on behalf of · system · result · trace.
6. Usage reflects Arcade free plan allocations.

## Code rules

1. **TypeScript strict** — no `any`.
2. **Components in folders:** `chrome/`, `primitives/`, `flows/`, `home/`, `pages/`.
3. **Screen state in AppContext** — `get-started | build | gateway | sandbox | empty | active | playground | tool-catalog | agent-detail`.
4. **No localStorage** in v1 — React state only.
5. **API swap** replaces `mockProject` import only; component interfaces unchanged.
6. **Respect `prefers-reduced-motion`** via `useReducedMotion`.

## File ownership

| File | Updates when |
|------|----------------|
| `prd.md` | Scope or feature changes |
| `design.md` | Tokens, layout, components |
| `rules.md` | Conventions |
| `timeline.md` | Milestones completed |
| `src/styles/global.css` | Color, spacing, layout tokens |
| `src/styles/typography.css` | Type scale |
| `src/styles/layout.css` | Layout utilities |
