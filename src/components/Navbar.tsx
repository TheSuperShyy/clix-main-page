import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { brand, industries, nav } from "../data/content";
import { ScrollTrigger, useGSAP } from "../lib/gsap";
import { getLenis } from "../hooks/useLenis";
import { ClixMark } from "./ui/ClixMark";
import { IndustryGlyph } from "./ui/IndustryGlyph";

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

/** Chevron-down for the תעשיות tab / mobile group (rotates 180° when open). */
function Caret({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Industry glyphs for the תעשיות dropdown tiles — crisp Lucide icon set
    (2px stroke, rounded joins) for a modern, consistent look. */
function Wordmark({ className = "", href = "#top" }: { className?: string; href?: string }) {
  return (
    <a
      href={href}
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
function NavTab({ item, href }: { item: (typeof nav.items)[number]; href: string }) {
  return (
    <motion.a
      {...pillMotion}
      href={href}
      className="flex h-11 items-center rounded-md px-5 text-[16px] font-medium text-on-ink/90 transition-colors duration-300 hover:bg-white/[0.06] hover:text-on-ink"
    >
      {item.label}
    </motion.a>
  );
}

/** The "תעשיות" tab — a NavTab-styled trigger that reveals a dark icon-tile
    dropdown (ref: client mock). Opens on hover for pointer users and toggles on
    click for keyboard/touch; closes on Escape, outside-click, or mouse-leave. */
function IndustriesTab() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <motion.button
        {...pillMotion}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-11 items-center gap-1.5 rounded-md px-5 text-[16px] font-medium text-on-ink/90 transition-colors duration-300 hover:bg-white/[0.06] hover:text-on-ink"
      >
        {industries.label}
        <Caret className={`size-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          // pt-3 (not margin) bridges the gap so the hover area is continuous.
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute end-0 top-full z-50 origin-top pt-3"
            role="menu"
          >
            <div className="w-[24rem] rounded-[20px] border border-white/10 bg-[#0c0f1d]/95 p-3 shadow-[0_40px_90px_-24px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
              <p className="px-3 pb-3 pt-2 text-[12px] text-white/40">{industries.heading}</p>
              <ul className="flex flex-col gap-0.5">
                {industries.items.map((it) => (
                  <li key={it.title}>
                    <a
                      href={it.href}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3.5 rounded-[14px] p-2.5 transition-colors duration-200 hover:bg-white/[0.06]"
                    >
                      {/* Dark glass icon tile — translucent white-tint that blends
                          into the navy panel; hairline edge, soft top sheen, and a
                          blue glow + brighter icon on hover. */}
                      <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-[13px] bg-[linear-gradient(150deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.03)_100%)] ring-1 ring-inset ring-white/10 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.14)] transition-all duration-200 group-hover:ring-white/20 group-hover:shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.2),0_7px_22px_-6px_rgba(96,156,244,0.45)]">
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_55%)]"
                        />
                        <IndustryGlyph name={it.icon} className="relative size-5 text-[#a9cdf7] transition-colors duration-200 group-hover:text-white" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-medium leading-tight text-white">{it.title}</span>
                        <span className="mt-0.5 block text-[13px] leading-tight text-white/50">{it.desc}</span>
                      </span>
                      <NavArrow className="ms-auto size-4 shrink-0 text-white/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mx-2 my-1 h-px bg-white/[0.06]" />
              <a
                href={industries.all.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-[14px] px-3.5 py-2.5 text-[14px] font-medium text-[#7db0f0] transition-colors hover:bg-white/[0.06]"
              >
                {industries.all.label}
                <NavArrow className="size-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  "#training",
  "#contact",
];

export function Navbar({ variant = "home" }: { variant?: "home" | "page" }) {
  const [open, setOpen] = useState(false);
  // Mobile "תעשיות" accordion open state (inside the white menu sheet).
  const [indOpen, setIndOpen] = useState(false);
  // Is the navbar currently over one of the dark sections? On the standalone
  // sub-pages (variant "page") the whole page is dark, so start (and stay) true.
  const [onDark, setOnDark] = useState(variant === "page");
  const darkFlags = useRef<Record<string, boolean>>({});
  const reduced = useReducedMotion();

  // Sub-pages don't have the home page's sections, so in-page `#anchor` links
  // (nav tabs, CTA, wordmark) must point back at the home page (`/#solutions`).
  const page = variant === "page";
  const resolve = (href: string) => (page && href.startsWith("#") ? `/${href}` : href);
  const homeHref = page ? "/" : "#top";

  // "בואו נדבר" (Get Started) now SCROLLS down to the footer/contact band rather
  // than opening the contact popup. On the home page the resolved href is the
  // same-page "#contact" → smooth-scroll to it (Lenis when active, else native).
  // On sub-pages it resolves to "/#contact", so we let the browser navigate home
  // and land on the footer. Calling preventDefault() also makes <ContactModal>'s
  // click interceptor skip this click (it bails on defaultPrevented) — no popup.
  const scrollToContact = (e: ReactMouseEvent) => {
    const href = resolve(nav.cta.href);
    if (!href.startsWith("#")) return; // sub-page → navigate to /#contact
    const el = document.getElementById(href.slice(1));
    if (!el) return;
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: "smooth" });
  };

  useGSAP(() => {
    // Sub-pages have none of the tracked sections — skip the observers entirely
    // (onDark is already pinned true above for the dark sub-page treatment).
    if (page) return;
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
        <Wordmark href={homeHref} className="text-[1.9rem] text-on-ink sm:text-[2.1rem]" />

        {/* Desktop nav group — one glass bar (text links) with the dark CTA pill
            attached at its end (ref: nav container + Get Started button). */}
        <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] p-1.5 ps-5 backdrop-blur-md md:flex">
          <nav className="flex items-center gap-0.5">
            {nav.items.map((item) => (
              <NavTab key={item.href} item={item} href={resolve(item.href)} />
            ))}
            <IndustriesTab />
          </nav>

          {/* Dark CTA pill with a white circular arrow badge — end (left in RTL). */}
          <motion.a
            {...pillMotion}
            href={resolve(nav.cta.href)}
            onClick={scrollToContact}
            className="btn-fill inline-flex h-14 items-center gap-3 rounded-md ps-6 pe-2.5 text-[16px] font-bold"
          >
            {nav.cta.label}
            <span className="grid size-9 place-items-center rounded-full border border-current">
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
                  <Wordmark href={homeHref} className="text-[1.9rem] text-ink" />
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
                      href={resolve(item.href)}
                      onClick={() => setOpen(false)}
                      className="py-3 text-start text-[15px] font-medium text-ink/70 transition-colors hover:text-ink"
                    >
                      {item.label}
                    </a>
                  ))}

                  {/* Industries — expandable group mirroring the desktop dropdown. */}
                  <button
                    type="button"
                    onClick={() => setIndOpen((v) => !v)}
                    aria-expanded={indOpen}
                    className="flex items-center justify-between py-3 text-start text-[15px] font-medium text-ink/70 transition-colors hover:text-ink"
                  >
                    {industries.label}
                    <Caret className={`size-4 transition-transform duration-300 ${indOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {indOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        {industries.items.map((it) => (
                          <li key={it.title}>
                            <a
                              href={it.href}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 py-2.5"
                            >
                              <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-[linear-gradient(150deg,rgba(20,30,60,0.9)_0%,rgba(12,18,40,0.9)_100%)] text-white ring-1 ring-inset ring-white/12 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.14)]">
                                <span
                                  aria-hidden
                                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_55%)]"
                                />
                                <IndustryGlyph name={it.icon} className="relative size-[19px] text-[#a9cdf7]" />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-[14px] font-medium leading-tight text-ink">{it.title}</span>
                                <span className="mt-0.5 block text-[12px] leading-tight text-ink/55">{it.desc}</span>
                              </span>
                            </a>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </nav>

                {/* Get Started CTA — dark rounded button + white arrow badge. */}
                <a
                  href={resolve(nav.cta.href)}
                  onClick={(e) => {
                    setOpen(false);
                    scrollToContact(e);
                  }}
                  className="group btn-fill-onlight mt-3 inline-flex h-12 items-center gap-2.5 rounded-[10px] ps-5 pe-2.5 text-[14px] font-bold"
                >
                  {nav.cta.label}
                  <span className="grid size-7 place-items-center rounded-full border border-current transition-transform duration-200 group-hover:-translate-x-0.5">
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
