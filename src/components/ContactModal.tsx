import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { contact, contactForm } from "../data/content";
import { closeContactModal, openContactModal, useContactModal } from "../lib/contactModal";
import { getLenis } from "../hooks/useLenis";

/**
 * ContactModal — the popup contact form that opens from every "בואו נדבר" /
 * "דברו איתנו" CTA. Mounted once at the app root.
 *
 * Two jobs:
 *  1. A site-wide click interceptor (document capture) turns every existing
 *     #contact link and the contact mailto into an open-the-form action — so no
 *     individual CTA had to change.
 *  2. Renders the mac-window styled form (name · phone · optional message · a
 *     required agreement checkbox linking to the legal pages · send), in the
 *     site's dark-glass language with the orange brand accent.
 *
 * Design: ui-ux-pro-max — visible labels (not placeholder-only), required
 * markers, one primary CTA, agreement gates submit, aria-live success, 44px+
 * targets. Motion (framer-motion): backdrop fade + panel spring, gated on
 * prefers-reduced-motion. Accessibility: role="dialog" aria-modal, ESC + backdrop
 * close, focus moved in on open and restored on close, a lightweight focus trap,
 * and background scroll frozen (body lock + Lenis .stop()).
 *
 * UI only — `onSubmit` just shows the success state; wire it to a real
 * endpoint (email / CRM / WhatsApp) later.
 */

const CONTACT_EMAIL = contact.email;

/** Field icons (end-aligned, RTL) — user / phone / chat. */
function FieldIcon({ name, className = "" }: { name: "user" | "phone" | "chat"; className?: string }) {
  const paths: Record<string, string> = {
    user: "M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z",
    phone:
      "M6.6 10.8a12 12 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11 11 0 003.4.55 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11 11 0 00.55 3.4 1 1 0 01-.24 1z",
    chat: "M4 4h16a1 1 0 011 1v10a1 1 0 01-1 1H9l-4 4v-4H4a1 1 0 01-1-1V5a1 1 0 011-1z",
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d={paths[name]} stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ContactModal() {
  const { isOpen } = useContactModal();
  const reduced = useReducedMotion();
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const f = contactForm;

  // Site-wide interceptor: every #contact link + the contact mailto opens the
  // form instead of navigating. Runs once for the whole app.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const isContact = href === "#contact" || href.startsWith(`mailto:${CONTACT_EMAIL}`);
      if (!isContact) return;
      e.preventDefault();
      openContactModal();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Open lifecycle: freeze background scroll, remember + move focus, wire ESC +
  // a small focus trap; restore everything on close.
  useEffect(() => {
    if (!isOpen) return;

    lastFocused.current = document.activeElement as HTMLElement | null;
    getLenis()?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the panel once it's painted.
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 60);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeContactModal();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      getLenis()?.start();
      lastFocused.current?.focus?.();
    };
  }, [isOpen]);

  // Reset the form a beat after it closes (so the reset isn't visible mid-exit).
  useEffect(() => {
    if (isOpen) return;
    const t = window.setTimeout(() => {
      setSent(false);
      setAgreed(false);
    }, 300);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    // UI only — swap for a real submit (email / CRM / WhatsApp) later.
    setSent(true);
  };

  const label = (text: string, opt?: string) => (
    <span className="mb-2 flex items-baseline gap-2">
      <span className="text-[15px] font-semibold tracking-[-0.01em] text-fg">{text}</span>
      {opt ? (
        <span className="text-[12.5px] font-light text-fg/45">{opt}</span>
      ) : (
        <span aria-hidden className="text-[13px] leading-none text-fg/40">
          *
        </span>
      )}
    </span>
  );

  // Frosted pill inputs — same recipe as the footer newsletter field (site
  // language). Single-line fields are full pills; the message area softens to a
  // rounded card so a multi-line box doesn't read as a stretched pill.
  const fieldWrap =
    "flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-5 transition-colors focus-within:border-white/25 focus-within:bg-white/[0.09]";
  const areaWrap =
    "flex items-start gap-3 rounded-[20px] border border-white/10 bg-white/[0.06] px-5 transition-colors focus-within:border-white/25 focus-within:bg-white/[0.09]";
  const inputBase =
    "min-w-0 flex-1 bg-transparent py-3 text-[15px] text-fg placeholder:text-fg/35 focus:outline-none";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-modal"
          role="dialog"
          aria-modal="true"
          aria-label={f.ariaLabel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overscroll-contain p-4 py-[max(1rem,5vh)] font-apple"
        >
          {/* Backdrop — gray frosted glass; click to dismiss. */}
          <button
            type="button"
            aria-label={f.closeLabel}
            onClick={closeContactModal}
            className="absolute inset-0 cursor-default bg-[#16213e]/45 backdrop-blur-md"
          />

          {/* Panel — mac-window card. */}
          <motion.div
            ref={panelRef}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-[22px] border border-white/12 bg-[#16213e]/80 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            {/* Hairline highlight along the top edge (matches the site's frosted cards). */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/25 to-transparent"
            />

            {/* Close — floating in the corner (chrome bar removed). */}
            <button
              type="button"
              onClick={closeContactModal}
              aria-label={f.closeLabel}
              className="absolute end-3 top-3 z-10 grid size-9 place-items-center rounded-full text-fg/50 transition-colors hover:bg-white/10 hover:text-fg"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>

            {/* Body */}
            <div className="px-5 py-6 sm:px-7 sm:py-7">
              {sent ? (
                // Success state.
                <div className="flex flex-col items-center gap-4 py-8 text-center" aria-live="polite">
                  <span className="grid size-14 place-items-center rounded-full bg-white/10 text-fg ring-1 ring-white/20">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-7">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-medium tracking-[-0.03em] text-fg">
                    {f.success.title}
                  </h2>
                  <p className="max-w-xs text-[15px] font-light leading-relaxed text-fg/70">{f.success.body}</p>
                  <button
                    type="button"
                    onClick={closeContactModal}
                    className="btn-fill mt-2 h-11 rounded-full px-6 text-[14px] font-bold"
                  >
                    {f.closeLabel}
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <div className="mb-5">
                    <p className="eyebrow text-fg/80">{f.eyebrow}</p>
                    <h2 className="mt-2 text-[clamp(1.4rem,4vw,1.85rem)] font-medium tracking-[-0.03em] text-fg">
                      {f.title}
                    </h2>
                    <p className="mt-1.5 text-[13.5px] font-light leading-relaxed text-fg/60">{f.intro}</p>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="cf-name" className="block">
                        {label(f.fields.name.label)}
                      </label>
                      <div className={fieldWrap}>
                        <input
                          ref={firstFieldRef}
                          id="cf-name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder={f.fields.name.placeholder}
                          className={inputBase}
                        />
                        <FieldIcon name="user" className="size-[18px] shrink-0 text-fg/35" />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="cf-phone" className="block">
                        {label(f.fields.phone.label)}
                      </label>
                      <div className={fieldWrap}>
                        <input
                          id="cf-phone"
                          name="phone"
                          type="tel"
                          required
                          inputMode="tel"
                          autoComplete="tel"
                          dir="ltr"
                          placeholder={f.fields.phone.placeholder}
                          className={`${inputBase} text-start`}
                        />
                        <FieldIcon name="phone" className="size-[18px] shrink-0 text-fg/35" />
                      </div>
                    </div>

                    {/* Message (optional) */}
                    <div>
                      <label htmlFor="cf-message" className="block">
                        {label(f.fields.message.label, f.fields.message.optional)}
                      </label>
                      <div className={areaWrap}>
                        <textarea
                          id="cf-message"
                          name="message"
                          rows={3}
                          placeholder={f.fields.message.placeholder}
                          className={`${inputBase} resize-none py-3`}
                        />
                        <FieldIcon name="chat" className="mt-3.5 size-[18px] shrink-0 text-fg/35" />
                      </div>
                    </div>
                  </div>

                  {/* Agreement checkbox */}
                  <label className="mt-5 flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      required
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-[6px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-white/40 ${
                        agreed ? "border-white bg-white text-ink" : "border-white/25 bg-white/[0.04] text-transparent"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" className={`size-3.5 transition-opacity ${agreed ? "opacity-100" : "opacity-0"}`}>
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-[13px] font-light leading-relaxed text-fg/70">
                      {f.agreement.before}
                      <a href={f.agreement.terms.href} target="_blank" rel="noopener noreferrer" className="font-normal text-fg underline decoration-fg/40 underline-offset-2 transition-colors hover:decoration-fg">
                        {f.agreement.terms.label}
                      </a>
                      {f.agreement.middle}
                      <a href={f.agreement.privacy.href} target="_blank" rel="noopener noreferrer" className="font-normal text-fg underline decoration-fg/40 underline-offset-2 transition-colors hover:decoration-fg">
                        {f.agreement.privacy.label}
                      </a>
                      {f.agreement.after}
                    </span>
                  </label>

                  {/* Submit — white pill + circular dark badge (the site's primary
                      CTA pattern: Hero / Navbar / footer "בואו נדבר"). */}
                  <button
                    type="submit"
                    disabled={!agreed}
                    className="group btn-fill mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-full text-[15px] font-bold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {f.submit}
                    <span className="grid size-8 place-items-center rounded-full border border-current transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-[18px]">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
