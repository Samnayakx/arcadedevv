import { useApp } from "../../context/AppContext";

export function PlaygroundDeployCTA({
  prompt,
  onRunAgain,
}: {
  prompt: string;
  onRunAgain: () => void;
}) {
  const { deployFromPlayground } = useApp();

  return (
    <div className="playground-deploy-cta">
      <p className="playground-deploy-cta-text">Workflow succeeded — deploy as a reusable agent?</p>
      <div className="playground-deploy-cta-actions">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => deployFromPlayground(prompt)}
        >
          Create Agent Flow
        </button>
        <button type="button" className="playground-deploy-cta-ghost" onClick={onRunAgain}>
          Run again
        </button>
      </div>
    </div>
  );
}
