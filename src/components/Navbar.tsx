import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { brand, nav } from "../data/content";
import { ScrollTrigger, useGSAP } from "../lib/gsap";
import { ClixMark } from "./ui/ClixMark";

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

/** Close (×) glyph for the mobile menu card. */
function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a
      href="#top"
      aria-label={brand.full}
      className={`inline-flex items-center gap-[0.4em] font-brand font-medium uppercase leading-none transition-opacity hover:opacity-70 ${className}`}
    >
      {/* Logomark + wordmark lockup — mark sits at the reading start (right in
          RTL), CLIX to its inline-end. currentColor: white on the dark bar,
          dark in the white mobile menu. */}
      <ClixMark className="h-[1.1em] w-auto shrink-0" />
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

/** A plain text link inside the shared glass bar (ref navbar: Solutions ·
    Features · Services · Pricing — no dropdowns, near-white labels). */
function NavTab({ item }: { item: (typeof nav.items)[number] }) {
  return (
    <motion.a
      {...pillMotion}
      href={item.href}
      className="flex h-11 items-center rounded-md px-5 text-[16px] font-medium text-on-ink/90 transition-colors duration-300 hover:bg-white/[0.06] hover:text-on-ink"
    >
      {item.label}
    </motion.a>
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
  "#training",
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

  // Mobile menu tile — rounded-square hamburger button (ref: dark tile, three
  // lines). size-11 = 44px, meeting the 44×44 min touch target (was 36px).
  const menuTile = `ms-auto grid size-11 shrink-0 place-items-center rounded-[12px] backdrop-blur-md transition-colors duration-300 md:hidden ${
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
        {/* Wordmark — start (right in RTL). Sized up per client call (2026-07-08);
            the ClixMark scales with it (h-[1.1em]). */}
        <Wordmark className="text-[1.9rem] text-on-ink sm:text-[2.1rem]" />

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
          {/* Hamburger — three hairline bars (ref navbar icon). */}
          <span aria-hidden className="flex flex-col items-center justify-center gap-[5px]">
            <span className="h-[2px] w-[19px] rounded-full bg-current" />
            <span className="h-[2px] w-[19px] rounded-full bg-current" />
            <span className="h-[2px] w-[19px] rounded-full bg-current" />
          </span>
        </motion.button>
      </motion.div>

      {/* Mobile menu — a WHITE dropdown card at the top (ref): dark wordmark +
          black close tile, a start-aligned link list and the Get Started CTA,
          over a dimmed tap-to-close backdrop that shows the page beneath. */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Dimmed, tap-to-close backdrop. */}
            <button
              aria-label="סגירת תפריט"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            />

            {/* White sheet — aligned to the bar, drops from the top. */}
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="container-x relative pt-4 font-apple"
            >
              <div className="rounded-[18px] bg-white p-5 shadow-[0_30px_70px_-24px_rgba(0,0,0,0.55)]">
                {/* Header — wordmark (start) + close tile (end), mirroring the bar. */}
                <div className="flex items-center justify-between gap-4">
                  <Wordmark className="text-[1.9rem] text-ink" />
                  <motion.button
                    {...pillMotion}
                    onClick={() => setOpen(false)}
                    aria-label="סגירת תפריט"
                    className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-ink text-white transition-colors hover:bg-ink-2"
                  >
                    <CloseIcon className="size-5" />
                  </motion.button>
                </div>

                {/* Links — start-aligned, dark. */}
                <nav className="mt-4 flex flex-col">
                  {nav.items.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="py-3 text-start text-[15px] font-medium text-ink/70 transition-colors hover:text-ink"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                {/* Get Started CTA — dark rounded button + white arrow badge. */}
                <a
                  href={nav.cta.href}
                  onClick={() => setOpen(false)}
                  className="group mt-3 inline-flex h-12 items-center gap-2.5 rounded-[10px] bg-ink ps-5 pe-2.5 text-[14px] font-bold text-white transition-colors hover:bg-ink-2"
                >
                  {nav.cta.label}
                  <span className="grid size-7 place-items-center rounded-full bg-white text-ink transition-transform duration-200 group-hover:-translate-x-0.5">
                    <NavArrow className="size-4" />
                  </span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
