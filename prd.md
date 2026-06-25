# Arcade Project Home — Frontend PRD (v1.1)

**Owner:** Sambit Nayak  
**Scope:** Frontend (React) for the redesigned Arcade onboarding + Project Home dashboard  
**Status:** Built (prototype)  
**Stack:** React + Phosphor icons, CSS tokens, Framer Motion, mock data (API-swappable)  
**References:** [docs.arcade.dev](https://docs.arcade.dev)

---

## 1. Product summary

Arcade is the MCP runtime that handles user authentication, authorization, policy enforcement, and tool execution for production agents. The current dashboard exposes raw infrastructure (≈8,000 tools, servers, OAuth apps, secrets). This redesign replaces that with a **project control room**.

**Product thesis:**
> Arcade's dashboard should not be a catalog of infrastructure. It should be a control room showing which agent flows exist, the tools they depend on, who authorized them, what policy applied, and what they actually did.

---

## 2. Goals & non-goals

**Goals:** Intent routing · skippable onboarding · 5 maturity states · runtime-grounded tables · mock data swappable to API.

**Non-goals:** Real backend · draggable canvas (v1) · Evaluations tab · full billing.

---

## 3. Screen map

1. Get Started → 2A Build / 2B Gateway / 2C Sandbox → 3 Project Home

---

## 4. Get Started

Three cards: Build agent · MCP Gateway · Sandbox. Explore dashboard first → empty Project Home.

---

## 5–7. Flows

- **Build Agent:** 8 steps, live trace on step 8
- **MCP Gateway:** 8 distinct steps, gateway trace panel
- **Sandbox:** 6 steps, fastest activation path

---

## 8. Project Home

Top 50%: summary · flow map · health cards · needs attention  
Bottom 50%: flow filter · 8 tabs · table

---

## 9. State machine

empty → flow_no_auth → first_run → active

---

## 10. Tables

Flows · Runs · Tool Calls · Users · Auth · Policies · Audit · Usage

---

## 11. Trace drawer

Per-step chain from Run rows. Retry on failed runs.

---

## 12–13. Monitoring & seed cases

5 seed cases in `src/data/mockProject.ts` — success, policy block, missing auth, upstream error, gateway unused.

---

## 14. Design tokens

See `design.md`

---

## 15. Components

GetStarted · FlowShell · BuildAgentFlow · GatewayFlow · SandboxFlow · ProjectHome · dashboard parts · DataTable · TraceDrawer

---

## 16. Routing

`screen`: get-started | build | gateway | sandbox | empty | active  
`maturity`: empty | flow_no_auth | first_run | active

---

## 17–18. Phasing & metrics

Phase 1 prototype complete. Metrics: first authorized tool call rate, time to first trace, flow readiness, sandbox-to-deploy, blocked-action recovery.
