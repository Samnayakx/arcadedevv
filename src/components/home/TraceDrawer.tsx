import { AnimatePresence, motion } from "framer-motion";
import { Copy, DownloadSimple, X } from "@phosphor-icons/react";
import clsx from "clsx";
import { useApp } from "../../context/AppContext";
import { getMockProject } from "../../data/mockProject";

export function TraceDrawer() {
  const { traceOpen, closeTrace, selectedRunId, maturity } = useApp();
  const project = getMockProject(maturity);
  const run = project.runs.find((r) => r.id === selectedRunId);

  return (
    <AnimatePresence>
      {traceOpen && run && (
        <>
          <motion.div
            className="trace-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeTrace}
          />
          <motion.aside
            className="trace-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <header className="trace-drawer-header">
              <div>
                <h3>Trace</h3>
                <p className="mono">{run.name}</p>
              </div>
              <div className="trace-drawer-actions">
                <button type="button" aria-label="Download"><DownloadSimple size={18} /></button>
                <button type="button" aria-label="Copy"><Copy size={18} /></button>
                <button type="button" aria-label="Close" onClick={closeTrace}><X size={18} /></button>
              </div>
            </header>

            <div className="trace-log">
              {run.traceSteps.map((step, i) => (
                <motion.div
                  key={step.time}
                  className={clsx("trace-line", `trace-${step.status}`)}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <span className="mono trace-time">{step.time}</span>
                  <span>{step.message}</span>
                </motion.div>
              ))}
            </div>

            <footer className="trace-drawer-footer">
              <button type="button" className="btn btn-secondary">View full trace</button>
              {run.status === "failed" && (
                <button type="button" className="btn btn-primary">Retry</button>
              )}
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
