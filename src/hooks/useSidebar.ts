import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

const MOBILE_MAX = 767;
const TABLET_MAX = 1099;
const SIDEBAR_WIDTH_KEY = "arcade-sidebar-width";
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;
const DEFAULT_WIDTH = 240;

export type SidebarViewport = "mobile" | "tablet" | "desktop";

function getViewport(): SidebarViewport {
  const width = window.innerWidth;
  if (width <= MOBILE_MAX) return "mobile";
  if (width <= TABLET_MAX) return "tablet";
  return "desktop";
}

function readStoredWidth(): number {
  const stored = localStorage.getItem(SIDEBAR_WIDTH_KEY);
  if (!stored) return DEFAULT_WIDTH;
  const parsed = Number.parseInt(stored, 10);
  if (Number.isNaN(parsed)) return DEFAULT_WIDTH;
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, parsed));
}

export function useSidebar() {
  const [viewport, setViewport] = useState<SidebarViewport>(getViewport);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(readStoredWidth);
  const [isResizing, setIsResizing] = useState(false);
  const widthRef = useRef(width);

  widthRef.current = width;

  useEffect(() => {
    const onResize = () => {
      const next = getViewport();
      setViewport(next);
      if (next === "desktop") setOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (open && viewport !== "desktop") {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
    return undefined;
  }, [open, viewport]);

  useEffect(() => {
    if (!isResizing) return undefined;

    const onMove = (event: MouseEvent) => {
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, event.clientX));
      setWidth(next);
    };

    const onUp = () => {
      setIsResizing(false);
      localStorage.setItem(SIDEBAR_WIDTH_KEY, String(widthRef.current));
      document.body.classList.remove("sidebar-resizing");
    };

    document.body.classList.add("sidebar-resizing");
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.classList.remove("sidebar-resizing");
    };
  }, [isResizing]);

  const toggle = useCallback(() => {
    if (viewport === "desktop") {
      setCollapsed((value) => !value);
      return;
    }

    setOpen((value) => !value);
  }, [viewport]);

  const close = useCallback(() => setOpen(false), []);

  const startResize = useCallback(
    (event: ReactMouseEvent) => {
      if (viewport !== "desktop" || collapsed) return;
      event.preventDefault();
      setIsResizing(true);
    },
    [viewport, collapsed],
  );

  const isCompact = viewport === "desktop" && collapsed;

  const isOverlay = open && viewport !== "desktop";
  const canResize = viewport === "desktop" && !collapsed;

  return {
    viewport,
    open,
    collapsed,
    width,
    isResizing,
    isCompact,
    isOverlay,
    canResize,
    toggle,
    close,
    startResize,
  };
}
