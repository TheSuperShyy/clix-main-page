import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/index.css";
import { LegalPage } from "./LegalPage";
import { LEGAL_DOCS, type LegalKey } from "./content";

// Shared entry for the three legal pages. Each page's HTML sets
// data-page="privacy|terms|accessibility" on the mount node; we render that doc.
const mount = document.getElementById("legal-root")!;
const key = mount.dataset.page as LegalKey;
const doc = LEGAL_DOCS[key];

if (!doc) {
  throw new Error(`Legal page: unknown data-page="${mount.dataset.page}"`);
}

createRoot(mount).render(
  <StrictMode>
    <LegalPage doc={doc} />
  </StrictMode>,
);
