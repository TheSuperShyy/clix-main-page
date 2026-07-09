import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/index.css";
import { IndustryPage } from "./IndustryPage";
import { industries } from "../data/content";
import { AccessibilityWidget } from "../components/AccessibilityWidget";

// Shared entry for the six per-sector pages. Each page's HTML sets
// data-industry="realestate|finance|health|ecommerce|logistics|education" on
// the mount node; we render that sector.
const mount = document.getElementById("industry-root")!;
const id = mount.dataset.industry;
const item = industries.items.find((i) => i.id === id);

if (!item) {
  throw new Error(`Industry page: unknown data-industry="${id}"`);
}

createRoot(mount).render(
  <StrictMode>
    <IndustryPage item={item} />
    <AccessibilityWidget />
  </StrictMode>,
);
