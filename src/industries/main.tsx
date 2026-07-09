import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/index.css";
import { IndustriesPage } from "./IndustriesPage";
import { AccessibilityWidget } from "../components/AccessibilityWidget";

createRoot(document.getElementById("industries-root")!).render(
  <StrictMode>
    <IndustriesPage />
    <AccessibilityWidget />
  </StrictMode>,
);
