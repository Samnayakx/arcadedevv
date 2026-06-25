import { AnimatePresence, motion } from "framer-motion";
import {
  CaretLeft,
  ChartLineUp,
  MagnifyingGlass,
  MagicWand,
  PlugsConnected,
  SquaresFour,
  Wrench,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useCommandPalette } from "../../context/CommandPaletteContext";
import { getMockProject } from "../../data/mockProject";
import type { Screen, TabId } from "../../types";

type CommandItem = {
  id: string;
  label: string;
  meta?: string;
  keywords?: string[];
  icon: Icon;
  run: () => void;
};

type CommandSection = {
  title: string;
  meta?: string;
  items: CommandItem[];
};

function matchesQuery(item: CommandItem, query: string) {
  if (!query) return true;
  const haystack = [item.label, item.meta, ...(item.keywords ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function CommandPalette() {
  const { open, closePalette } = useCommandPalette();
  const {
    maturity,
    setScreen,
    setActiveTab,
    openAgent,
  } = useApp();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const project = getMockProject(maturity);

  const sections: CommandSection[] = useMemo(() => {
    const goTab = (tab: TabId) => {
      setScreen("active");
      setActiveTab(tab);
      closePalette();
    };

    const goScreen = (screen: Screen) => {
      setScreen(screen);
      closePalette();
    };

    const base: CommandSection[] = [
      {
        title: "Navigate",
        items: [
          {
            id: "control-center",
            label: "Dashboard",
            meta: "Home",
            keywords: ["dashboard", "home", "operations"],
            icon: SquaresFour,
            run: () => goTab("dashboard"),
          },
          {
            id: "agents",
            label: "Agents",
            meta: "Build",
            keywords: ["flows", "agent flows"],
            icon: PlugsConnected,
            run: () => goTab("flows"),
          },
          {
            id: "tools",
            label: "Tool catalog",
            meta: "Tool Catalog",
            keywords: ["tool catalog", "integrations", "connect"],
            icon: Wrench,
            run: () => goScreen("tool-catalog"),
          },
          {
            id: "playground",
            label: "Playground",
            meta: "Build",
            icon: MagicWand,
            run: () => goScreen("playground"),
          },
          {
            id: "runs",
            label: "Runs",
            meta: "Observe",
            keywords: ["logs", "executions"],
            icon: ChartLineUp,
            run: () => goTab("runs"),
          },
        ],
      },
      {
        title: "Actions",
        items: [
          {
            id: "create-agent",
            label: "Create an agent flow",
            meta: "Onboarding",
            keywords: ["new agent", "setup", "get started"],
            icon: PlugsConnected,
            run: () => goScreen("get-started"),
          },
        ],
      },
    ];

    if (project.flows.length > 0) {
      base.push({
        title: "Agents",
        meta: `${project.flows.length} available`,
        items: project.flows.slice(0, 6).map((flow) => ({
          id: `agent-${flow.id}`,
          label: flow.name,
          meta: flow.type,
          keywords: [flow.id, ...flow.tools],
          icon: PlugsConnected,
          run: () => {
            openAgent(flow.id);
            closePalette();
          },
        })),
      });
    }

    return base;
  }, [project.flows, setScreen, setActiveTab, openAgent, closePalette]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSections = useMemo(
    () =>
      sections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => matchesQuery(item, normalizedQuery)),
        }))
        .filter((section) => section.items.length > 0),
    [sections, normalizedQuery],
  );

  const flatItems = useMemo(
    () => filteredSections.flatMap((section) => section.items),
    [filteredSections],
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [normalizedQuery]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePalette();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((index) => (index + 1) % Math.max(flatItems.length, 1));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((index) =>
          index === 0 ? Math.max(flatItems.length - 1, 0) : index - 1,
        );
      }

      if (event.key === "Enter" && flatItems[selectedIndex]) {
        event.preventDefault();
        flatItems[selectedIndex].run();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, flatItems, selectedIndex, closePalette]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex, filteredSections]);

  let runningIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="command-palette-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <button
            type="button"
            className="command-palette-backdrop"
            aria-label="Close command palette"
            onClick={closePalette}
          />

          <motion.div
            className="command-palette"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="command-palette-input-row">
              <button type="button" className="command-palette-back" onClick={closePalette}>
                <CaretLeft size={16} weight="bold" />
              </button>
              <MagnifyingGlass size={16} className="command-palette-search-icon" />
              <input
                ref={inputRef}
                type="search"
                className="command-palette-input"
                placeholder="Search agents, tools, and actions..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="command-palette-results" ref={listRef}>
              {flatItems.length === 0 ? (
                <p className="command-palette-empty">No results for &ldquo;{query}&rdquo;</p>
              ) : (
                filteredSections.map((section) => (
                  <section key={section.title} className="command-palette-section">
                    <div className="command-palette-section-head">
                      <span>{section.title}</span>
                      {section.meta && <span>{section.meta}</span>}
                    </div>
                    <ul className="command-palette-list">
                      {section.items.map((item) => {
                        runningIndex += 1;
                        const active = runningIndex === selectedIndex;
                        const IconComponent = item.icon;

                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              className="command-palette-item"
                              data-active={active ? "true" : undefined}
                              onMouseEnter={() => setSelectedIndex(runningIndex)}
                              onClick={() => item.run()}
                            >
                              <span className="command-palette-item-icon">
                                <IconComponent size={16} weight="regular" />
                              </span>
                              <span className="command-palette-item-label">{item.label}</span>
                              {item.meta && (
                                <span className="command-palette-item-meta">{item.meta}</span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
