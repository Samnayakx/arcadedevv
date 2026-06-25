# Arcade Project Home — Development Rules

## Product rules

1. **Home is operational, not inventory.** Never default Project Home to a 7,000-tool catalog.
2. **Activation = first authorized tool call.** Every onboarding path ends at trace + Project Home.
3. **Skip is allowed.** Skipping lands on guided empty Project Home, not a dead dashboard.
4. **One mock source.** All tables, node map, and Needs Attention read from `mockProject.ts`.
5. **Consistency.** A blocked Slack run appears in Runs, Policies, Audit, and Needs Attention.

## UI rules

1. **Phosphor icons only** — no Lucide or other icon sets.
2. **Design tokens only** — use CSS variables from `tokens.css`, no hardcoded one-offs.
3. **Status is color + icon** — every status maps to token + Phosphor icon per `design.md`.
4. **Empty states never fake data** — states 1/2 show copy + CTAs, not populated tables.
5. **Flow filter scopes tabs** — selecting a flow filters Runs, Tool Calls, Users, Auth, Policies, Audit.
6. **Health cards are clickable** — route to matching tab.
7. **Trace drawer** opens from Run row Action column only.

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
3. **Screen state in AppContext** — `get-started | build | gateway | sandbox | empty | active`.
4. **No localStorage** in v1 — React state only.
5. **API swap** replaces `mockProject` import only; component interfaces unchanged.
6. **Respect `prefers-reduced-motion`** via `useReducedMotion`.

## File ownership

| File | Updates when |
|------|----------------|
| `prd.md` | Scope or feature changes |
| `design.md` | Tokens, layout, animation |
| `rules.md` | Conventions |
| `timeline.md` | Milestones completed |
