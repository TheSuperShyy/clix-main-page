import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cookies } from "../data/content";

// Cookie-consent banner — a small dark glass card that rises from the bottom
// start corner (right in RTL) on the first visit. Non-modal (role="region",
// never steals focus); the choice persists in localStorage plus a first-party
// `clix_consent` cookie so future analytics/scripts can read it, and the
// banner never returns once answered. Glass recipe matches the navbar/footer
// (hairline white/10 border + blur), with a heavier ink tint so the text keeps
// contrast over whatever section happens to be behind it.

const STORAGE_KEY = "clix-cookie-consent";
type Choice = "accepted" | "declined";

function storedChoice(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // storage blocked (private mode) — show the banner each visit
  }
}

// Shared press/hover feedback (same spring as the navbar pills).
const pillMotion = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.96 },
  transition: { type: "spring", stiffness: 420, damping: 26 },
} as const;

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (storedChoice()) return;
    // Short delay so the banner doesn't compete with the hero's landing beat.
    const t = window.setTimeout(() => setVisible(true), 1600);
    return () => window.clearTimeout(t);
  }, []);

  const choose = (choice: Choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
      document.cookie = `clix_consent=${choice}; max-age=${60 * 60 * 24 * 180}; path=/; SameSite=Lax`;
    } catch {
      // storage blocked — still dismiss for this session
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          key="cookie-consent"
          role="region"
          aria-label={cookies.ariaLabel}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          // z-40: above the page, below the navbar/menu (z-50). Hidden while
          // the hero loading veil plays, same trick as the navbar.
          className="fixed bottom-4 start-4 end-4 z-40 font-apple sm:bottom-6 sm:start-6 sm:end-auto sm:w-[400px] [.hero-veil_&]:pointer-events-none [.hero-veil_&]:invisible [.hero-veil_&]:opacity-0"
        >
          <div className="rounded-[18px] border border-white/10 bg-ink/85 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <p className="text-[15px] font-bold text-on-ink">{cookies.title}</p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed font-light text-on-ink/70">
              {cookies.body}{" "}
              <a
                href={cookies.policy.href}
                className="whitespace-nowrap text-on-ink/90 underline underline-offset-4 transition-colors hover:text-on-ink"
              >
                {cookies.policy.label}
              </a>
            </p>
            <div className="mt-4 flex items-center gap-2">
              <motion.button
                {...pillMotion}
                onClick={() => choose("accepted")}
                className="btn-fill h-11 grow rounded-[10px] px-5 text-[14px] font-bold sm:grow-0"
              >
                {cookies.accept}
              </motion.button>
              <motion.button
                {...pillMotion}
                onClick={() => choose("declined")}
                className="h-11 rounded-[10px] px-4 text-[14px] font-medium text-on-ink/60 transition-colors hover:bg-white/[0.06] hover:text-on-ink"
              >
                {cookies.decline}
              </motion.button>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
