import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { brand, contact, nav } from "../data/content";
import { ScrollTrigger, useGSAP } from "../lib/gsap";

/** Brand logo tile — brand-blue square with the Clix mark masked into it
    (on.energy-style: a solid chip at the start of the bar). */
function LogoTile({ className = "" }: { className?: string }) {
  return (
    <a
      href="#top"
      aria-label={brand.full}
      className={`grid shrink-0 place-items-center rounded-[6px] bg-brand transition-colors duration-300 hover:bg-brand-600 ${className}`}
    >
      <span
        aria-hidden
        className="block h-[78%] w-[78%] bg-white"
        style={{
          WebkitMaskImage: "url(/clix-logo.svg)",
          maskImage: "url(/clix-logo.svg)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </a>
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
function NavTab({
  item,
  darkNav,
}: {
  item: (typeof nav.items)[number];
  darkNav: boolean;
}) {
  const [open, setOpen] = useState(false);
  const menu = "menu" in item ? item.menu : undefined;

  const tabClass = `group flex h-9 w-full items-center gap-2 rounded-[6px] px-4 text-start text-[14px] font-medium backdrop-blur-md transition-colors duration-300 ${
    darkNav
      ? "bg-ink/[0.05] text-fg hover:bg-ink/[0.09]"
      : "bg-on-ink/[0.08] text-on-ink/90 hover:bg-on-ink/[0.16]"
  }`;
  const panelClass = `absolute inset-x-0 top-full z-50 mt-1.5 flex flex-col gap-1 rounded-[8px] p-1.5 backdrop-blur-md ${
    darkNav
      ? "border border-ink/10 bg-surface-2 shadow-[0_20px_40px_-24px_rgba(18,18,16,0.4)]"
      : "border border-on-ink/10 bg-ink/80"
  }`;
  const rowClass = `rounded-[6px] px-3.5 py-2 text-sm transition-colors ${
    darkNav
      ? "text-muted hover:bg-ink/[0.05] hover:text-fg"
      : "text-on-ink/80 hover:bg-on-ink/10 hover:text-on-ink"
  }`;

  return (
    <div
      className="relative flex-1"
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

// Full-bleed dark sections (after the hero) where the bar must stay light.
const DARK_SECTIONS = ["#intro", "#reveal"];

export function Navbar() {
  const [open, setOpen] = useState(false);
  // Has the hero scrolled past the navbar?
  const [scrolled, setScrolled] = useState(false);
  // Is the navbar currently over one of the dark sections (#intro / #reveal)?
  const [onDark, setOnDark] = useState(false);
  const darkFlags = useRef<Record<string, boolean>>({});
  const reduced = useReducedMotion();

  useGSAP(() => {
    // Past the hero → the navbar is over the light body.
    const heroST = ScrollTrigger.create({
      trigger: "#top",
      start: "bottom top+=80",
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });
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
      heroST.kill();
      darkSTs.forEach((st) => st.kill());
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Tabs/menu use the dark (on-light-body) treatment only when NOT over the hero
  // and NOT over a dark section — both of those keep the light glass treatment.
  const darkNav = scrolled && !onDark;

  // Mobile menu tile — same glass treatment, square.
  const menuTile = `ms-auto grid size-9 shrink-0 place-items-center rounded-[6px] backdrop-blur-md transition-colors duration-300 md:hidden ${
    darkNav ? "bg-ink text-on-ink hover:bg-ink-2" : "bg-on-ink/[0.12] text-on-ink hover:bg-on-ink/20"
  }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-4 sm:py-5">
      <motion.div
        initial={reduced ? false : { y: -22, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="container-x flex items-center gap-2 font-apple sm:gap-2.5"
      >
        {/* Logo tile — start (right in RTL) */}
        <LogoTile className="size-9" />

        {/* Segmented glass nav — desktop, fills the width */}
        <nav className="hidden flex-1 items-center gap-1.5 md:flex">
          {nav.items.map((item) => (
            <NavTab key={item.href} item={item} darkNav={darkNav} />
          ))}
        </nav>

        {/* Solid accent CTA — desktop, end (left in RTL). Inverts to white over the band. */}
        <motion.a
          {...pillMotion}
          href={nav.cta.href}
          className="hidden h-9 shrink-0 items-center rounded-[6px] bg-brand px-5 text-[14px] font-bold text-white transition-colors duration-300 hover:bg-brand-600 md:inline-flex"
        >
          {nav.cta.label}
        </motion.a>

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
