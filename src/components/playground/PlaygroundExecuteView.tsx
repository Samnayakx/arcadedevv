import { Copy } from "@phosphor-icons/react";
import type { TraceScenario } from "../../data/mockPlayground";

export function PlaygroundExecuteView({
  scenario,
  lastPrompt,
}: {
  scenario: TraceScenario | null;
  lastPrompt: string;
}) {
  const snippet =
    scenario?.sdkSnippet ??
    `const result = await client.tools.execute({
  tool: "Gmail.Search",
  userId: "user_sambit",
  input: { query: "is:unread" },
});`;

  return (
    <div className="playground-execute-view">
      <div className="playground-execute-head">
        <h2>Run Agent</h2>
        <p>Equivalent SDK call for your last successful prompt</p>
      </div>

      {lastPrompt ? (
        <div className="playground-execute-prompt">
          <span className="playground-execute-label">Last prompt</span>
          <p>{lastPrompt}</p>
        </div>
      ) : (
        <p className="playground-execute-empty">
          Complete a test prompt first to see the agent execution code.
        </p>
      )}

      <div className="playground-execute-code">
        <div className="playground-execute-code-head">
          <span>TypeScript · Arcade SDK</span>
          <button type="button" aria-label="Copy code">
            <Copy size={16} />
          </button>
        </div>
        <pre className="mono">{snippet}</pre>
      </div>

      {scenario && (
        <div className="playground-execute-meta">
          <div>
            <span className="playground-execute-label">Tool</span>
            <span className="mono">{scenario.toolAction}</span>
          </div>
          <div>
            <span className="playground-execute-label">Environment</span>
            <span>Sandbox</span>
          </div>
        </div>
      )}
    </div>
  );
}
