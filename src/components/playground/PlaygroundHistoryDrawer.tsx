import { X } from "@phosphor-icons/react";
import { PLAYGROUND_HISTORY } from "../../data/mockPlayground";

export function PlaygroundHistoryDrawer({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (prompt: string) => void;
}) {
  if (!open) return null;

  return (
    <div className="playground-history-root">
      <button type="button" className="playground-history-backdrop" aria-label="Close history" onClick={onClose} />
      <aside className="playground-history-drawer" aria-label="Session history">
        <div className="playground-history-head">
          <h2>History</h2>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X size={16} weight="bold" />
          </button>
        </div>
        <ul className="playground-history-list">
          {PLAYGROUND_HISTORY.map((session) => (
            <li key={session.id}>
              <button
                type="button"
                className="playground-history-item"
                onClick={() => {
                  onSelect(session.prompt);
                  onClose();
                }}
              >
                <span className="playground-history-label">{session.label}</span>
                <span className="playground-history-time">{session.time}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
