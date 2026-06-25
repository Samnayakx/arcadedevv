import { motion } from "framer-motion";
import {
  ArrowRight,
  CaretLeft,
  CaretRight,
  CheckCircle,
  CircleNotch,
  Key,
  Lightning,
  ShieldCheck,
  UserCheck,
} from "@phosphor-icons/react";
import clsx from "clsx";
import type { ReactNode } from "react";
import {
  EXECUTION_PIPELINE,
  type ExecutionAuth,
  type VisibilityStageDef,
} from "../../data/mockPlayground";
import type {
  PlaygroundRun,
  VisibilityPhase,
  VisibilityStageState,
  VisibilityStageStatus,
} from "../../hooks/usePlaygroundSession";
import { Btn } from "../primitives/Btn";

const stageIconMap = {
  user: UserCheck,
  key: Key,
  bolt: Lightning,
  shield: ShieldCheck,
  check: CheckCircle,
};

function StageIndicator({
  status,
  def,
}: {
  status: VisibilityStageStatus;
  def: VisibilityStageDef;
}) {
  if (status === "done") {
    return <CheckCircle size={16} weight="fill" color="var(--text-muted)" />;
  }
  if (status === "waiting") {
    return <Key size={16} weight="fill" color="var(--text)" />;
  }
  if (status === "active") {
    return (
      <motion.span
        className="vis-stage-spinner"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
        aria-hidden
      >
        <CircleNotch size={16} weight="bold" color="var(--text-dim)" />
      </motion.span>
    );
  }
  const Icon = stageIconMap[def.icon];
  return <Icon size={14} color="var(--text-muted)" />;
}

function StagesList({
  items,
  authNode,
}: {
  items: { status: VisibilityStageStatus; def: VisibilityStageDef }[];
  authNode?: ReactNode;
}) {
  return (
    <ol className="vis-stages">
      {items.map((item, index) => {
        const isWaitingAuth = item.def.id === "authorization" && item.status === "waiting";
        return (
          <li
            key={item.def.id}
            className={clsx(
              "vis-stage",
              `vis-stage-${item.status}`,
              index === items.length - 1 && "vis-stage-last",
            )}
          >
            <div className="vis-stage-rail">
              <span className="vis-stage-indicator">
                <StageIndicator status={item.status} def={item.def} />
              </span>
            </div>
            <div className="vis-stage-body">
              <span className="vis-stage-title">
                {index + 1}. {item.def.title}
              </span>
              {item.status === "done" && (
                <span className="vis-stage-sub vis-stage-sub-done">{item.def.doneLabel}</span>
              )}
              {(item.status === "active" || item.status === "waiting") && (
                <span className="vis-stage-sub vis-stage-sub-running">{item.def.runningLabel}</span>
              )}
              {isWaitingAuth && authNode}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function AuthGateCard({
  toolAction,
  auth,
  onContinue,
}: {
  toolAction: string | null;
  auth: ExecutionAuth;
  onContinue: () => void;
}) {
  return (
    <motion.div
      className="vis-auth-card"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      {toolAction && <p className="vis-auth-tool mono">{toolAction}</p>}

      <dl className="vis-auth-meta">
        <div className="vis-auth-row">
          <dt>Status</dt>
          <dd className="vis-auth-status">Waiting for authorization</dd>
        </div>
        <div className="vis-auth-row">
          <dt>User</dt>
          <dd>{auth.user}</dd>
        </div>
      </dl>

      <div className="vis-auth-scopes">
        <span className="vis-auth-scopes-label">Required scopes</span>
        <ul>
          {auth.scopes.map((scope) => (
            <li key={scope} className="mono">
              {scope}
            </li>
          ))}
        </ul>
      </div>

      <div className="vis-auth-next">
        <span className="vis-auth-next-label">Next step</span>
        <Btn variant="primary" size="sm" className="vis-auth-continue" onClick={onContinue}>
          Continue to {auth.provider}
          <ArrowRight size={14} weight="bold" aria-hidden />
        </Btn>
      </div>
    </motion.div>
  );
}

const COMPLETED_ITEMS = EXECUTION_PIPELINE.map((def) => ({
  status: "done" as VisibilityStageStatus,
  def,
}));

function CompletedRun({
  run,
  number,
  expanded,
  onSelect,
}: {
  run: PlaygroundRun;
  number: number;
  expanded: boolean;
  onSelect: () => void;
}) {
  if (!expanded) {
    return (
      <button type="button" className="vis-run vis-run-collapsed" onClick={onSelect}>
        <span className="vis-run-num">{number}</span>
        <span className="vis-run-tool mono">{run.toolAction}</span>
        <span className="vis-run-dot" aria-hidden />
        <span className="vis-run-meta">
          {run.toolCalls.length} tool{run.toolCalls.length === 1 ? "" : "s"}
        </span>
      </button>
    );
  }

  return (
    <div className="vis-run vis-run-expanded">
      <div className="vis-run-head">
        <span className="vis-run-num vis-run-num-active">{number}</span>
        <span className="vis-run-tool mono">{run.toolAction}</span>
        {run.source === "onboarding" && <span className="vis-run-tag">from onboarding</span>}
      </div>
      <p className="vis-run-prompt">{run.prompt}</p>
      <StagesList items={COMPLETED_ITEMS} />
      <div className="vis-run-result">
        <CheckCircle size={14} weight="fill" color="var(--text-muted)" aria-hidden />
        <span>{run.result}</span>
      </div>
    </div>
  );
}

export function PlaygroundVisibilityPanel({
  phase,
  liveStages,
  liveToolAction,
  liveAuth,
  onContinueAuth,
  runs,
  selectedRunId,
  onSelectRun,
  goalTitle,
  actingUser,
  environment,
}: {
  phase: VisibilityPhase;
  liveStages: VisibilityStageState[];
  liveToolAction: string | null;
  liveAuth: ExecutionAuth | null;
  onContinueAuth: () => void;
  runs: PlaygroundRun[];
  selectedRunId: string | null;
  onSelectRun: (id: string) => void;
  goalTitle: string | null;
  actingUser: string;
  environment: string;
}) {
  const isLive = phase === "running" || phase === "waiting_auth";

  const statusLabel =
    phase === "waiting_auth"
      ? "Action needed"
      : isLive
        ? "Running"
        : runs.length > 0
          ? "Complete"
          : "Idle";

  const rawIdx = runs.findIndex((r) => r.id === selectedRunId);
  const selectedIdx = rawIdx < 0 ? runs.length - 1 : rawIdx;
  const liveItems = liveStages.map((stage, index) => ({
    status: stage.status,
    def: EXECUTION_PIPELINE[index],
  }));

  return (
    <aside className="playground-trace-panel playground-visibility-panel" aria-label="Execution visibility">
      <div className="playground-trace-panel-head vis-head">
        <span className="playground-trace-panel-label">Execution visibility</span>
        <span className={clsx("vis-phase-pill", `vis-phase-${phase}`)}>{statusLabel}</span>
      </div>

      <div className="vis-context-strip">
        <span className="vis-context-env">{environment}</span>
        <span className="vis-context-sep" aria-hidden />
        <span className="vis-context-user">acting as {actingUser}</span>
      </div>

      {!isLive && runs.length > 0 && (
        <div className="vis-locator">
          <button
            type="button"
            className="vis-locator-btn"
            aria-label="Previous run"
            disabled={selectedIdx <= 0}
            onClick={() => onSelectRun(runs[selectedIdx - 1].id)}
          >
            <CaretLeft size={13} weight="bold" />
          </button>
          <span className="vis-locator-label">
            Run {selectedIdx + 1} of {runs.length}
          </span>
          <button
            type="button"
            className="vis-locator-btn"
            aria-label="Next run"
            disabled={selectedIdx >= runs.length - 1}
            onClick={() => onSelectRun(runs[selectedIdx + 1].id)}
          >
            <CaretRight size={13} weight="bold" />
          </button>
        </div>
      )}

      {isLive ? (
        <>
          {liveToolAction && <p className="vis-active-tool mono">{liveToolAction}</p>}
          <StagesList
            items={liveItems}
            authNode={
              liveAuth ? (
                <AuthGateCard
                  toolAction={liveToolAction}
                  auth={liveAuth}
                  onContinue={onContinueAuth}
                />
              ) : undefined
            }
          />
        </>
      ) : runs.length > 0 ? (
        <div className="vis-run-list">
          {runs
            .map((run, index) => ({ run, number: index + 1 }))
            .reverse()
            .map(({ run, number }) => (
              <CompletedRun
                key={run.id}
                run={run}
                number={number}
                expanded={number - 1 === selectedIdx}
                onSelect={() => onSelectRun(run.id)}
              />
            ))}
        </div>
      ) : (
        <p className="vis-idle-hint">
          {goalTitle
            ? `Ask the agent to act on “${goalTitle}” — I’ll show authorize → scope-check → execute for every call.`
            : "Run a prompt to watch Arcade authorize, scope-check, and execute the tool call step by step."}
        </p>
      )}
    </aside>
  );
}
