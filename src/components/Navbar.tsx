import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { brand, contact, nav } from "../data/content";

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a
      href="#top"
      aria-label={brand.full}
      className={`font-black lowercase leading-none tracking-tight transition-opacity hover:opacity-70 ${className}`}
    >
      {brand.name}
    </a>
  );
}

/** Lucide-style chat bubble — the icon tucked in the CTA pill's trailing circle. */
function ChatIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

// Subtle press/hover feedback shared by both pills (ui-ux-pro-max: scale-feedback).
const pillMotion = {
  whileHover: { scale: 1.015 },
  whileTap: { scale: 0.96 },
  transition: { type: "spring", stiffness: 420, damping: 26 },
} as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-4 sm:py-5">
      <motion.div
        initial={reduced ? false : { y: -22, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="container-x flex items-center gap-4 font-apple"
      >
        {/* Wordmark, top-right (start in RTL). Mobile uses a compact size; md+
            shows it at the headline's weight + size (the look set previously). */}
        <Wordmark className="text-2xl text-fg md:hidden" />
        <a
          href="#top"
          aria-label={brand.full}
          className="hidden font-apple text-h1 font-extrabold lowercase leading-none tracking-[0.15em] text-fg transition-opacity hover:opacity-70 md:block"
        >
          {brand.name}
        </a>

        <div className="ms-auto flex items-center gap-2.5">
          {/* Light CTA pill — "בואו נדבר" + white chat circle at the trailing edge.
              p-1.5 + ps-5 gives a symmetric 6px inset around the size-9 circle. */}
          <motion.a
            {...pillMotion}
            href={nav.cta.href}
            className="group hidden items-center gap-3.5 rounded-full bg-ink/[0.07] py-2 pe-2 ps-6 text-fg transition-colors hover:bg-ink/[0.12] sm:inline-flex"
          >
            <span className="text-base font-semibold tracking-tight">{nav.cta.label}</span>
            <span className="grid size-11 place-items-center rounded-full bg-surface-2 text-ink shadow-[0_1px_3px_rgba(18,18,16,0.16)] ring-1 ring-ink/5 transition-transform duration-300 group-hover:-rotate-12">
              <ChatIcon className="size-5" />
            </span>
          </motion.a>

          {/* Dark MENU pill — "תפריט" + the signature "••" dots in a trailing circle. */}
          <motion.button
            {...pillMotion}
            onClick={() => setOpen(true)}
            aria-label={nav.menuLabel}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="group inline-flex items-center gap-3.5 rounded-full bg-ink py-2 pe-2 ps-6 text-on-ink transition-colors hover:bg-ink-2"
          >
            <span className="text-base font-semibold tracking-tight">{nav.menuLabel}</span>
            <span className="grid size-11 place-items-center rounded-full bg-on-ink/10 transition-colors group-hover:bg-on-ink/15">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-on-ink" />
                <span className="size-2 rounded-full bg-on-ink" />
              </span>
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Full-screen ink menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink text-on-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="container-x flex h-full flex-col py-4 font-apple sm:py-5">
              <div className="flex items-center justify-between gap-4">
                <Wordmark className="text-[2rem] text-on-ink" />
                {/* Close button mirrors the pill anatomy: label + trailing circle. */}
                <motion.button
                  {...pillMotion}
                  onClick={() => setOpen(false)}
                  aria-label="סגרו תפריט"
                  className="group inline-flex items-center gap-3.5 rounded-full bg-on-ink/10 py-2 pe-2 ps-6 text-on-ink transition-colors hover:bg-on-ink/15"
                >
                  <span className="text-base font-semibold tracking-tight">סגירה</span>
                  <span className="grid size-11 place-items-center rounded-full bg-on-ink/15 text-2xl leading-none transition-colors group-hover:bg-on-ink/25">
                    ×
                  </span>
                </motion.button>
              </div>

              <nav className="flex flex-1 flex-col justify-center">
                <ul className="flex flex-col gap-2">
                  {nav.items.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="inline-block py-1 text-5xl font-black text-on-ink/70 transition-colors hover:text-on-ink sm:text-7xl"
                      >
                        {item.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="flex flex-col gap-2 border-t border-on-ink/15 pt-6 text-sm text-on-ink/60 sm:flex-row sm:items-center sm:justify-between">
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-on-ink">
                  {contact.email}
                </a>
                <span>{contact.locationLine}</span>
                <a href={contact.instagramUrl} className="transition-colors hover:text-on-ink">
                  {contact.instagramHandle}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
