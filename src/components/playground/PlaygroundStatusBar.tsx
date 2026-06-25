import { useApp } from "../../context/AppContext";
import { PLAYGROUND_STATUS } from "../../data/mockPlayground";

export function PlaygroundStatusBar({ compact }: { compact?: boolean }) {
  const { setScreen, setActiveTab } = useApp();

  const openConnections = () => {
    setScreen("active");
    setActiveTab("auth");
  };

  const openPolicies = () => {
    setScreen("active");
    setActiveTab("policies");
  };

  if (compact) {
    return (
      <div className="playground-status-inline" role="status">
        <button type="button" className="playground-status-link warn" onClick={openConnections}>
          {PLAYGROUND_STATUS.toolsNeedAuth} need auth
        </button>
        <span className="playground-status-sep" aria-hidden />
        <button type="button" className="playground-status-link" onClick={openPolicies}>
          {PLAYGROUND_STATUS.policiesActive} policies
        </button>
        <span className="playground-status-sep" aria-hidden />
        <span className="playground-status-env">{PLAYGROUND_STATUS.environment}</span>
      </div>
    );
  }

  return (
    <div className="playground-status-bar" role="status">
      <button type="button" className="playground-status-chip playground-status-chip-warn" onClick={openConnections}>
        {PLAYGROUND_STATUS.toolsNeedAuth} tools need auth
      </button>
      <button type="button" className="playground-status-chip" onClick={openPolicies}>
        {PLAYGROUND_STATUS.policiesActive} policies active
      </button>
      <span className="playground-status-chip playground-status-chip-env">
        {PLAYGROUND_STATUS.environment}
      </span>
    </div>
  );
}
