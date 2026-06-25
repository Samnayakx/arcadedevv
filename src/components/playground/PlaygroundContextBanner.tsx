import { X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const DISMISS_KEY = "playground-banner-dismissed";

export function PlaygroundContextBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      setDismissed(true);
    }
  }, []);

  if (dismissed) return null;

  return (
    <div className="playground-context-banner" role="note">
      <p>
        <strong>Playground</strong> lets you test tool calls before deploying agents.
      </p>
      <button
        type="button"
        className="playground-context-banner-dismiss"
        aria-label="Dismiss banner"
        onClick={() => {
          sessionStorage.setItem(DISMISS_KEY, "1");
          setDismissed(true);
        }}
      >
        <X size={14} weight="bold" />
      </button>
    </div>
  );
}
