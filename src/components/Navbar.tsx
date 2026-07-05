import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { brand, contact, nav } from "../data/content";
import { ScrollTrigger, useGSAP } from "../lib/gsap";

/** Small forward arrow for the CTA badge — points to the RTL "forward" (left). */
function NavArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M14 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a
      href="#top"
      aria-label={brand.full}
      className={`font-apple font-black uppercase leading-none tracking-tight transition-opacity hover:opacity-70 ${className}`}
    >
      {brand.name}
    </a>
  );
}

// Subtle press/hover feedback shared by the nav items, CTA + menu (ui-ux-pro-max: scale-feedback).
const pillMotion = {
  whileHover: { scale: 1.015 },
  whileTap: { scale: 0.96 },
  transition: { type: "spring", stiffness: 420, damping: 26 },
} as const;

/** Chevron-down — the dropdown affordance on nav tabs that have a submenu. */
function Caret({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** A segmented glass nav tab. If the item has a `menu`, it gets a caret and a
    dropdown panel that opens on hover/focus (on.energy-style submenus). */
function NavTab({ item }: { item: (typeof nav.items)[number] }) {
  const [open, setOpen] = useState(false);
  const menu = "menu" in item ? item.menu : undefined;

  // Plain text links inside the shared glass bar (ref: one nav container, not
  // per-item pills). The whole site is dark, so both treatments read light.
  const tabClass =
    "group flex h-11 items-center gap-1.5 rounded-md px-5 text-[16px] font-medium text-on-ink/70 transition-colors duration-300 hover:bg-white/[0.06] hover:text-on-ink";
  const panelClass =
    "absolute inset-x-0 top-full z-50 mt-2 flex min-w-[220px] flex-col gap-1 rounded-[12px] border border-white/10 bg-[#0b1020]/95 p-1.5 backdrop-blur-md shadow-[0_24px_50px_-24px_rgba(0,0,0,0.8)]";
  const rowClass =
    "rounded-[8px] px-3.5 py-2 text-sm text-on-ink/75 transition-colors hover:bg-white/[0.06] hover:text-on-ink";

  return (
    <div
      className="relative"
      onMouseEnter={() => menu && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => menu && setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <motion.a
        {...pillMotion}
        href={item.href}
        className={tabClass}
        aria-haspopup={menu ? "menu" : undefined}
        aria-expanded={menu ? open : undefined}
      >
        <span>{item.label}</span>
        {menu && (
          <Caret
            className={`ms-auto size-4 opacity-60 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </motion.a>

      {menu && (
        <AnimatePresence>
          {open && (
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className={panelClass}
            >
              {menu.map((sub) => (
                <a key={sub.label} href={sub.href} role="menuitem" className={rowClass}>
                  {sub.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

// Full-bleed DARK bands where the bar must stay light. With the old light
// sections removed, the page is currently all-dark (hero scene region +
// Solutions); new clone sections join this list only if they're dark bands.
const DARK_SECTIONS = [
  "#hero-inside",
  "#solutions",
  "#features",
  "#key-features",
  "#services",
  "#benefits",
  "#testimonials",
  "#pricing",
  "#contact",
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  // Is the navbar currently over one of the dark sections?
  const [onDark, setOnDark] = useState(false);
  const darkFlags = useRef<Record<string, boolean>>({});
  const reduced = useReducedMotion();

  useGSAP(() => {
    // Over any dark section → keep the glass tabs light (don't switch to the
    // dark-on-light treatment). Track each, then OR them together.
    const darkSTs = DARK_SECTIONS.map((sel) =>
      ScrollTrigger.create({
        trigger: sel,
        start: "top top+=72",
        end: "bottom top+=72",
        onToggle: (self) => {
          darkFlags.current[sel] = self.isActive;
          setOnDark(Object.values(darkFlags.current).some(Boolean));
        },
      }),
    );
    return () => {
      darkSTs.forEach((st) => st.kill());
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Tabs/menu use the dark (on-light-body) treatment everywhere except over
  // the dark bands — the white hero sheet at the top included.
  const darkNav = !onDark;

  // Mobile menu tile — same glass treatment, square.
  const menuTile = `ms-auto grid size-9 shrink-0 place-items-center rounded-[6px] backdrop-blur-md transition-colors duration-300 md:hidden ${
    darkNav ? "bg-ink text-on-ink hover:bg-ink-2" : "bg-on-ink/[0.12] text-on-ink hover:bg-on-ink/20"
  }`;

  return (
    // `.hero-veil` (on <html>, managed by Hero.tsx) = the loading sequence is
    // playing: the page shows ONLY the white sheet + logo hole, so the whole
    // bar hides and fades back in when the auto-flight lands "inside" the
    // hero (or the user takes over the scroll). `invisible` (not just
    // opacity-0) so the hidden bar also leaves the a11y tree / tab order;
    // visibility flips instantly on reveal while the opacity still fades.
    <header className="fixed inset-x-0 top-0 z-50 py-4 transition-opacity duration-500 sm:py-5 [.hero-veil_&]:invisible [.hero-veil_&]:pointer-events-none [.hero-veil_&]:opacity-0">
      <motion.div
        initial={reduced ? false : { y: -22, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="container-x flex items-center justify-between gap-3 font-apple"
      >
        {/* Wordmark — start (right in RTL) */}
        <Wordmark className="text-[1.6rem] text-on-ink" />

        {/* Desktop nav group — one glass bar (text links) with the dark CTA pill
            attached at its end (ref: nav container + Get Started button). */}
        <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] p-1.5 ps-5 backdrop-blur-md md:flex">
          <nav className="flex items-center gap-0.5">
            {nav.items.map((item) => (
              <NavTab key={item.href} item={item} />
            ))}
          </nav>

          {/* Dark CTA pill with a white circular arrow badge — end (left in RTL). */}
          <motion.a
            {...pillMotion}
            href={nav.cta.href}
            className="inline-flex h-14 items-center gap-3 rounded-md bg-ink ps-6 pe-2.5 text-[16px] font-bold text-on-ink ring-1 ring-white/10 transition-colors hover:bg-ink-2"
          >
            {nav.cta.label}
            <span className="grid size-9 place-items-center rounded-full bg-on-ink text-ink">
              <NavArrow className="size-5" />
            </span>
          </motion.a>
        </div>

        {/* Mobile — menu tile that opens the full-screen overlay */}
        <motion.button
          {...pillMotion}
          onClick={() => setOpen(true)}
          aria-label={nav.menuLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={menuTile}
        >
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-on-ink" />
            <span className="size-2 rounded-full bg-on-ink" />
          </span>
        </motion.button>
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
                {/* Close button mirrors the tab anatomy: label + trailing circle. */}
                <motion.button
                  {...pillMotion}
                  onClick={() => setOpen(false)}
                  aria-label="סגרו תפריט"
                  className="group inline-flex items-center gap-4 rounded-full bg-on-ink/10 py-2.5 pe-2.5 ps-7 text-on-ink transition-colors hover:bg-on-ink/15"
                >
                  <span className="text-lg font-semibold tracking-tight">סגירה</span>
                  <span className="grid size-12 place-items-center rounded-full bg-on-ink/15 text-3xl leading-none transition-colors group-hover:bg-on-ink/25">
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
