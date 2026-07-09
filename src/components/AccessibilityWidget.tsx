import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { a11y } from "../data/content";

/**
 * AccessibilityWidget — the floating נגישות tool, expected on Israeli sites.
 * A single fixed button opens a panel of assistive controls; choices persist in
 * localStorage and apply on every page (the widget is mounted in each entry).
 *
 * How each control is applied (and why):
 *  - Text size → `zoom` on <html> (inline). The site sizes most text in px, so
 *    rem scaling wouldn't touch it; `zoom` scales everything. A resize event is
 *    dispatched after each change so GSAP ScrollTrigger re-measures its pins.
 *  - Grayscale / contrast / invert → a fixed `backdrop-filter` OVERLAY, not a
 *    `filter` on <html>: a filter on the root would become the containing block
 *    for the fixed WebGL scene and detach it. The overlay filters everything
 *    behind it without touching layout or fixed positioning.
 *  - Highlight links / readable font / big cursor / stop motion → CSS classes on
 *    <html> (see index.css). Stop motion also pauses any <video>.
 *
 * a11y (ui-ux-pro-max): the toggle is a real <button> with aria-expanded; the
 * panel is role="dialog" aria-modal with ESC + outside-click close, focus moved
 * in on open and restored on close, and 44px+ targets. Motion (framer-motion) is
 * gated on prefers-reduced-motion.
 */

const STORAGE_KEY = "clix-a11y";
const FONT_STEPS = [1, 1.1, 1.2, 1.3] as const; // zoom multipliers (100–130%)

type A11yState = {
  fontStep: number; // index into FONT_STEPS
  contrast: boolean;
  invert: boolean;
  grayscale: boolean;
  links: boolean;
  readable: boolean;
  bigCursor: boolean;
  stopMotion: boolean;
};

const DEFAULTS: A11yState = {
  fontStep: 0,
  contrast: false,
  invert: false,
  grayscale: false,
  links: false,
  readable: false,
  bigCursor: false,
  stopMotion: false,
};

function loadState(): A11yState {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<A11yState>) };
  } catch {
    return DEFAULTS;
  }
}

/** Universal-access glyph (person, arms out) for the launcher. */
function AccessIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="4" r="2" fill="currentColor" />
      <path
        d="M5 8.5c2 .8 4.5 1.1 7 1.1s5-.3 7-1.1M12 9.6V15m0 0l-2.6 5.4M12 15l2.6 5.4"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small glyphs for the toggle chips. */
function ToggleGlyph({ name, className = "" }: { name: string; className?: string }) {
  const stroke = (d: string) => (
    <path d={d} stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
  );
  const map: Record<string, ReactNode> = {
    contrast: <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth={1.7} fill="none" />,
    invert: (
      <>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth={1.7} fill="none" />
        <path d="M12 3.5v17a8.5 8.5 0 000-17z" fill="currentColor" />
      </>
    ),
    grayscale: (
      <>
        {stroke("M12 3a9 9 0 000 18z")}
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.7} fill="none" />
      </>
    ),
    links: stroke("M10 14a4 4 0 005.66 0l2.5-2.5a4 4 0 10-5.66-5.66L11.5 7.3M14 10a4 4 0 00-5.66 0l-2.5 2.5a4 4 0 105.66 5.66L12.5 16.7"),
    readable: stroke("M6 20V6a2 2 0 012-2h8M8 4v16M5 20h6m2-6h6m-3-3v6"),
    bigCursor: stroke("M5 3l6 17 2.3-6.7L20 11z"),
    stopMotion: stroke("M9 6v12M15 6v12"),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      {map[name]}
    </svg>
  );
}

export function AccessibilityWidget() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(loadState);

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = a11y;

  // Apply the whole state to the document + persist, whenever it changes.
  useLayoutEffect(() => {
    const root = document.documentElement;

    // Text size via zoom (scales the site's px text too). Nudge ScrollTrigger.
    const zoom = FONT_STEPS[state.fontStep] ?? 1;
    root.style.zoom = zoom === 1 ? "" : String(zoom);

    root.classList.toggle("a11y-links", state.links);
    root.classList.toggle("a11y-readable", state.readable);
    root.classList.toggle("a11y-cursor", state.bigCursor);
    root.classList.toggle("a11y-stop-motion", state.stopMotion);

    // Stop motion: also pause any playing videos (the WebGL scene aside).
    if (state.stopMotion) {
      document.querySelectorAll("video").forEach((v) => {
        try {
          v.pause();
        } catch {
          /* ignore */
        }
      });
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }

    // Let pinned/scrubbed GSAP sections re-measure against the new zoom.
    window.dispatchEvent(new Event("resize"));
  }, [state]);

  // Open lifecycle: ESC + outside-click close, move focus in, restore on close.
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button, a, input")?.focus();
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      prevFocus?.focus?.();
    };
  }, [open]);

  const toggle = (key: keyof A11yState) => setState((s) => ({ ...s, [key]: !s[key] }));

  const stepFont = (dir: 1 | -1) =>
    setState((s) => ({
      ...s,
      fontStep: Math.min(FONT_STEPS.length - 1, Math.max(0, s.fontStep + dir)),
    }));

  const resetAll = () => setState(DEFAULTS);

  // Compose the backdrop-filter for the visual modes (grayscale/contrast/invert).
  const filters: string[] = [];
  if (state.grayscale) filters.push("grayscale(1)");
  if (state.contrast) filters.push("contrast(1.4)");
  if (state.invert) filters.push("invert(1) hue-rotate(180deg)");
  const filterStr = filters.join(" ");

  // Toggle chips config (keyed to the copy + a glyph).
  const chips: { key: keyof A11yState; label: string; glyph: string }[] = [
    { key: "contrast", label: t.toggles.contrast, glyph: "contrast" },
    { key: "invert", label: t.toggles.invert, glyph: "invert" },
    { key: "grayscale", label: t.toggles.grayscale, glyph: "grayscale" },
    { key: "links", label: t.toggles.links, glyph: "links" },
    { key: "readable", label: t.toggles.readable, glyph: "readable" },
    { key: "bigCursor", label: t.toggles.bigCursor, glyph: "bigCursor" },
    { key: "stopMotion", label: t.toggles.stopMotion, glyph: "stopMotion" },
  ];

  const fontPct = Math.round((FONT_STEPS[state.fontStep] ?? 1) * 100);

  return (
    <>
      {/* Visual-mode overlay — filters everything behind it without breaking the
          fixed scene / layout. Only mounted when a visual mode is active. */}
      {filterStr && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[9998]"
          style={{ backdropFilter: filterStr, WebkitBackdropFilter: filterStr }}
        />
      )}

      {/* Launcher button */}
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.buttonLabel}
        aria-expanded={open}
        whileHover={reduced ? undefined : { scale: 1.06 }}
        whileTap={reduced ? undefined : { scale: 0.94 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
        className="fixed bottom-5 end-5 z-[9999] grid size-13 place-items-center rounded-full border border-white/15 bg-[#33353c]/85 text-fg shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-colors hover:bg-[#3d4048]/90 sm:size-14"
      >
        <AccessIcon className="size-7 sm:size-[30px]" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.buttonLabel}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-[5.5rem] end-5 z-[9999] max-h-[min(70vh,560px)] w-[calc(100vw-2.5rem)] max-w-[330px] overflow-y-auto overscroll-contain rounded-[22px] border border-white/12 bg-[#33353c]/90 p-4 shadow-[0_40px_100px_-24px_rgba(0,0,0,0.85)] backdrop-blur-2xl font-apple sm:bottom-24"
          >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-full bg-white/10 text-fg">
                  <AccessIcon className="size-5" />
                </span>
                <div>
                  <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-fg">{t.title}</h2>
                  <p className="text-[12px] font-light text-fg/55">{t.intro}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="-me-1 grid size-8 shrink-0 place-items-center rounded-full text-fg/50 transition-colors hover:bg-white/10 hover:text-fg"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Text size stepper */}
            <div className="mb-3 flex items-center justify-between gap-3 rounded-[14px] border border-white/10 bg-white/[0.04] px-3 py-2.5">
              <span className="text-[13.5px] font-medium text-fg/85">{t.fontSize.label}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => stepFont(-1)}
                  disabled={state.fontStep === 0}
                  aria-label={t.fontSize.decrease}
                  className="grid size-8 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-fg transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
                    <path d="M5 12h14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                  </svg>
                </button>
                <span className="w-11 text-center text-[12.5px] font-semibold tabular-nums text-fg/80">{fontPct}%</span>
                <button
                  type="button"
                  onClick={() => stepFont(1)}
                  disabled={state.fontStep === FONT_STEPS.length - 1}
                  aria-label={t.fontSize.increase}
                  className="grid size-8 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-fg transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Toggle chips */}
            <div className="grid grid-cols-2 gap-2">
              {chips.map((chip) => {
                const active = state[chip.key] as boolean;
                return (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => toggle(chip.key)}
                    aria-pressed={active}
                    className={`flex min-h-[52px] items-center gap-2 rounded-[14px] border px-3 py-2 text-start text-[12.5px] font-medium leading-tight transition-colors ${
                      active
                        ? "border-white/70 bg-white/15 text-fg"
                        : "border-white/10 bg-white/[0.035] text-fg/70 hover:bg-white/[0.07]"
                    }`}
                  >
                    <ToggleGlyph name={chip.glyph} className="size-[18px] shrink-0" />
                    <span className="min-w-0">{chip.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Reset + statement */}
            <button
              type="button"
              onClick={resetAll}
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] text-[13.5px] font-semibold text-fg transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
                <path
                  d="M4 4v5h5M20 20v-5h-5M19 9a7.5 7.5 0 00-13-3.5L4 9m16 6a7.5 7.5 0 01-13 3.5L4 15"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t.reset}
            </button>
            <a
              href={t.statement.href}
              className="mt-2 block rounded-full py-2 text-center text-[13px] font-light text-fg/60 underline decoration-fg/30 underline-offset-2 transition-colors hover:text-fg hover:decoration-fg"
            >
              {t.statement.label}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
