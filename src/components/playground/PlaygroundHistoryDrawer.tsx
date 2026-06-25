import { X } from "@phosphor-icons/react";
import type { StoredSession } from "../../hooks/usePlaygroundSession";

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

export function PlaygroundHistoryDrawer({
  open,
  onClose,
  sessions,
  onRestore,
}: {
  open: boolean;
  onClose: () => void;
  sessions: StoredSession[];
  onRestore: (id: string) => void;
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

        {sessions.length === 0 ? (
          <p className="playground-history-empty">
            No saved sessions yet. Start a new session and it will appear here for the
            rest of your visit.
          </p>
        ) : (
          <ul className="playground-history-list">
            {sessions.map((session) => (
              <li key={session.id}>
                <button
                  type="button"
                  className="playground-history-item"
                  onClick={() => {
                    onRestore(session.id);
                    onClose();
                  }}
                >
                  <span className="playground-history-label">{session.label}</span>
                  <span className="playground-history-time">
                    {relativeTime(session.createdAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
