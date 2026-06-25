import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CaretDown } from "@phosphor-icons/react";
import clsx from "clsx";
import { ArcadeLogo } from "../components/chrome/ArcadeLogo";
import { useApp } from "../context/AppContext";
import { fadeUp } from "../app/motion";

type SetupStep = "workspace" | "project";

const REGIONS = ["United States", "Europe", "Asia Pacific"] as const;
const ENVIRONMENTS = ["Sandbox", "Production"] as const;
const ACCESS_DOMAIN = "example.com";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function WorkspaceSetup() {
  const { completeWorkspaceSetup, setOrganizationName, setProjectName, exploreDashboard } =
    useApp();

  const [step, setStep] = useState<SetupStep>("workspace");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("United States");
  const [domainAccess, setDomainAccess] = useState(true);

  const [project, setProject] = useState("");
  const [environment, setEnvironment] = useState<(typeof ENVIRONMENTS)[number]>("Sandbox");

  const effectiveSlug = useMemo(
    () => (slugEdited ? slug : slugify(name)),
    [slug, slugEdited, name],
  );

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  };

  const workspaceValid = name.trim().length > 0 && effectiveSlug.length > 0;
  const projectValid = project.trim().length > 0;

  const handleCreateWorkspace = () => {
    if (!workspaceValid) return;
    setOrganizationName(name.trim());
    setStep("project");
  };

  const handleCreateProject = () => {
    if (!projectValid) return;
    setProjectName(project.trim());
    completeWorkspaceSetup();
  };

  return (
    <div className="ws-page">
      <header className="ws-topbar">
        <ArcadeLogo />
      </header>

      <main className="ws-main">
        <AnimatePresence mode="wait">
          {step === "workspace" ? (
            <motion.section key="workspace" className="ws-card" {...fadeUp}>
              <div className="ws-head">
                <h1>Create a workspace</h1>
                <p>Move work forward across teams and agents.</p>
              </div>

              <div className="ws-field">
                <label className="field-label" htmlFor="ws-name">
                  Name
                </label>
                <input
                  id="ws-name"
                  className="input"
                  type="text"
                  placeholder="Acme"
                  value={name}
                  autoFocus
                  onChange={(event) => handleNameChange(event.target.value)}
                />
              </div>

              <div className="ws-field">
                <label className="field-label" htmlFor="ws-url">
                  URL
                </label>
                <div className="ws-url-group">
                  <span className="ws-url-prefix mono">arcade.dev/</span>
                  <input
                    id="ws-url"
                    className="ws-url-input mono"
                    type="text"
                    placeholder="acme"
                    value={effectiveSlug}
                    onChange={(event) => {
                      setSlugEdited(true);
                      setSlug(slugify(event.target.value));
                    }}
                  />
                </div>
              </div>

              <div className="ws-field">
                <label className="field-label" htmlFor="ws-region">
                  Region
                </label>
                <div className="ws-select-wrap">
                  <select
                    id="ws-region"
                    className="ws-select"
                    value={region}
                    onChange={(event) =>
                      setRegion(event.target.value as (typeof REGIONS)[number])
                    }
                  >
                    {REGIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <CaretDown size={14} className="ws-select-caret" aria-hidden />
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={domainAccess}
                className="ws-toggle-row"
                onClick={() => setDomainAccess((prev) => !prev)}
              >
                <span className="ws-toggle-label">
                  Enable access for <strong>{ACCESS_DOMAIN}</strong>
                </span>
                <span className={clsx("ws-toggle", domainAccess && "ws-toggle-on")}>
                  <span className="ws-toggle-thumb" aria-hidden />
                </span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-lg ws-submit"
                disabled={!workspaceValid}
                onClick={handleCreateWorkspace}
              >
                Create workspace
                <ArrowRight size={16} weight="bold" aria-hidden />
              </button>

              <button type="button" className="ws-alt-link" onClick={exploreDashboard}>
                Skip onboarding
              </button>
            </motion.section>
          ) : (
            <motion.section key="project" className="ws-card" {...fadeUp}>
              <div className="ws-head">
                <h1>Create your first project</h1>
                <p>
                  Projects group agents, tools, and traces inside{" "}
                  <strong>{name.trim() || "your workspace"}</strong>.
                </p>
              </div>

              <div className="ws-field">
                <label className="field-label" htmlFor="ws-project">
                  Project name
                </label>
                <input
                  id="ws-project"
                  className="input"
                  type="text"
                  placeholder="Default project"
                  value={project}
                  autoFocus
                  onChange={(event) => setProject(event.target.value)}
                />
              </div>

              <div className="ws-field">
                <label className="field-label" htmlFor="ws-env">
                  Environment
                </label>
                <div className="ws-select-wrap">
                  <select
                    id="ws-env"
                    className="ws-select"
                    value={environment}
                    onChange={(event) =>
                      setEnvironment(event.target.value as (typeof ENVIRONMENTS)[number])
                    }
                  >
                    {ENVIRONMENTS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <CaretDown size={14} className="ws-select-caret" aria-hidden />
                </div>
                <p className="ws-field-hint">
                  Sandbox runs are safe to test. You can promote to production later.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg ws-submit"
                disabled={!projectValid}
                onClick={handleCreateProject}
              >
                Create project
                <ArrowRight size={16} weight="bold" aria-hidden />
              </button>

              <button
                type="button"
                className="ws-alt-link"
                onClick={() => setStep("workspace")}
              >
                Back to workspace
              </button>
            </motion.section>
          )}
        </AnimatePresence>

        <ol className="ws-steps" aria-label="Setup progress">
          <li className={clsx("ws-step-dot", step === "workspace" && "ws-step-dot-active")} />
          <li className={clsx("ws-step-dot", step === "project" && "ws-step-dot-active")} />
        </ol>
      </main>
    </div>
  );
}
