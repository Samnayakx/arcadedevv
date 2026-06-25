import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import { CommandPaletteProvider } from "./context/CommandPaletteContext";
import { CommandPalette } from "./components/chrome/CommandPalette";
import "./styles/global.css";
import "./styles/typography.css";
import "./styles/layout.css";
import "./styles/components.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <CommandPaletteProvider>
        <App />
        <CommandPalette />
      </CommandPaletteProvider>
    </AppProvider>
  </StrictMode>,
);
