import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { services, servicesChat } from "../data/content";
import { EASE_OUT } from "../lib/motion";

/**
 * Services — the sticky-header + glass-cards band (ref: "SERVICES · Tailored
 * for every financial need."). A start-side header column (eyebrow → headline
 * → subcopy) that stays `position: sticky` while a 50%-wide column of tall
 * frosted-glass cards scrolls past it. Each card: title pinned top, body
 * pinned bottom, decorative art behind.
 *
 * Ref spec (clone CSS): section pt 200px / pb 60px (100px mobile), content
 * max-width 1440px, header sticky top 120px (eyebrow↔title gap 40px, title↔
 * subcopy 12px; headline max-w 400px, subcopy max-w 600px) · cards col 50%,
 * gap 24px · card: `#ffffff0f` fill + backdrop-blur(30px), 8px radius, 32px
 * padding (20px mobile), heights 400/450/300/400 (300/250 mobile). Like the
 * ref, the band is TRANSPARENT over the site's fixed WebGL scene
 * (<SceneBackdrop>) — the arc-slicing beat STARTS (seq 0.235 anchor) exactly
 * as this section lands, so the ribbed wave visible here is the live sequence.
 *
 * Per-card anatomy mirrors the ref exactly (its art PNGs are copyrighted, so
 * each vignette is REDRAWN procedurally in our palette):
 *  1. `tiles`  — frosted tile grid on the end side, one tile lit (mint ring +
 *     "+") with a cursor arrow at its corner; title top / body bottom.
 *  2. `prompt` — big pill prompt-bar UI anchored bottom-center (small pill
 *     above it); TEXT AT TOP (title + body together, ref gap 8px).
 *  3. `flow`   — n8n-style workflow canvas (user request, 2026-07-07): dotted
 *     node-canvas backdrop, trigger → AI step → branch to two outputs, dashes
 *     streaming along the connectors; title top / body bottom.
 *  4. `chat`   — WhatsApp-style conversation mock (user mock, 2026-07-07):
 *     inbound lead bubble → bot booking reply → mint "saved to CRM" status;
 *     title top / body bottom.
 *
 * Static section — no scroll reveal (the ref has none; sticky is pure CSS),
 * matching Solutions/Partners/Features/KeyFeatures. Two exceptions, both
 * motion-meaning and gated on prefers-reduced-motion: the chat card's bubbles
 * pop in sequentially (messages arriving) and the flow card's nodes pop in
 * flow-order while connector dashes stream (data moving through the pipeline).
 */

type ArtVariant = "tiles" | "prompt" | "none" | "flow" | "chat";

/** Cursor pointer glyph (ref card 1: the "click" arrow at the lit tile's
    corner). Default Lucide pointer aims up-start; flipped where placed so it
    aims INTO the tile. */
function CursorGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"
        fill="#101321"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Decorative in-card art (behind/beside the text) — ref vignettes redrawn. */
function ServiceCardArt({ variant }: { variant: ArtVariant }) {
  if (variant === "none") return null;
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[8px]">
      {variant === "tiles" && (
        <div className="absolute -end-10 top-1/2 grid -translate-y-1/2 grid-cols-3 gap-3 opacity-80 max-sm:scale-75">
          {Array.from({ length: 9 }, (_, i) =>
            i === 4 ? (
              // Lit tile — mint ring, inner outline, "+" glyph, cursor at its
              // bottom-end corner pointing into it (ref: saas-vector cursor).
              <span
                key={i}
                className="relative grid size-16 place-items-center rounded-[14px] border border-mint/50 bg-white/[0.08] shadow-[0_0_44px_rgba(165,237,238,0.25)] sm:size-20"
              >
                <span className="absolute inset-1.5 rounded-[10px] border border-mint/30" />
                <span className="text-[20px] font-light leading-none text-mint/70">+</span>
                <CursorGlyph className="absolute -bottom-2.5 -end-2.5 size-5 -scale-x-100" />
              </span>
            ) : (
              <span
                key={i}
                className="size-16 rounded-[14px] border border-white/10 bg-white/[0.03] sm:size-20"
              />
            ),
          )}
        </div>
      )}

      {variant === "prompt" && (
        // Ref card 2 (group.png): an app-WINDOW mock anchored bottom-center —
        // window-chrome dots → pill row → glowing dark prompt bar → ghost list
        // rows ("+" circles + text bars), clipped by the card's bottom edge.
        <div className="absolute inset-x-0 -bottom-11 mx-auto w-[86%] sm:w-[72%]">
          <div className="rounded-t-[18px] border border-b-0 border-white/[0.14] px-4 pt-4 sm:px-6 sm:pt-5">
            {/* Window dots. */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 rounded-full bg-white/20" />
              ))}
            </div>

            {/* Pill row — small filled pill + a faint line beside it. */}
            <div className="mt-4 flex items-center gap-5 sm:mt-5">
              <span className="flex h-9 w-28 items-center rounded-full bg-white/[0.1] px-4 ring-1 ring-white/10 sm:h-10 sm:w-32">
                <span className="h-[5px] w-full rounded-full bg-white/30" />
              </span>
              <span className="h-[5px] w-16 rounded-full bg-white/[0.12]" />
            </div>

            {/* Glowing prompt bar — near-black pill, white halo, text line at
                start, white send-button at the end. */}
            <div className="mt-4 flex h-12 items-center justify-between gap-4 rounded-full bg-[#05060c] ps-5 pe-1.5 ring-1 ring-white/45 shadow-[0_0_36px_rgba(255,255,255,0.16)] sm:mt-5 sm:h-14">
              <span className="h-[5px] w-1/2 rounded-full bg-mint/30" />
              <span className="grid h-9 w-24 shrink-0 place-items-center rounded-full bg-white sm:h-10 sm:w-28">
                <span className="h-[4px] w-10 rounded-full bg-ink/70" />
              </span>
            </div>

            {/* Ghost list rows — "+" circle + stacked bars + end bar; fade
                down and clip at the card edge (ref). */}
            <div className="mt-5 flex flex-col gap-4 sm:mt-6">
              {[0.7, 0.45].map((o) => (
                <div key={o} className="flex items-center gap-3.5" style={{ opacity: o }}>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/[0.09] text-[15px] font-light leading-none text-fg/50 sm:size-9">
                    +
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="h-[5px] w-24 rounded-full bg-white/25 sm:w-28" />
                    <span className="h-[5px] w-16 rounded-full bg-white/[0.12]" />
                  </span>
                  <span className="ms-auto h-[5px] w-14 rounded-full bg-white/[0.12] sm:w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {variant === "flow" && (
        // Card 3 (user request): n8n-style workflow strip centered between
        // the title and body — trigger fires, AI processes, two outputs.
        <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 sm:inset-x-8">
          <FlowVignette />
        </div>
      )}

      {variant === "chat" && (
        // Card 4 (user mock): WhatsApp-style exchange centered between the
        // title and body — lead writes in, the bot books, CRM logs it.
        // (Mobile sits at 47% — the 2-line title above is taller than the
        // status line below, so dead-center reads bottom-heavy there.)
        <div className="absolute inset-x-5 top-[47%] -translate-y-1/2 sm:inset-x-8 sm:top-1/2">
          <ChatVignette />
        </div>
      )}
    </div>
  );
}

/** n8n-style workflow mini-canvas (user request, 2026-07-07): a dotted node
    canvas with a trigger node firing into an AI step that branches to two
    outputs (send + save). Flow runs in the reading direction — the site is
    RTL-only, so connector paths are drawn entry-on-the-right → exit-on-the-
    left and the dash stream animates toward each path's end. Nodes pop in
    in flow order on first view; both effects skip under reduced motion. */
function FlowVignette() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  // Run the infinite dash stream only while the card is on screen — framer
  // keeps repeat:Infinity tweens ticking off-screen, and these SVG-stroke
  // repaints through the card glass measurably drag the whole page's FPS.
  const inView = useInView(rootRef, { amount: 0.15 });
  const run = !reduce && inView;
  const nodeIn = reduce
    ? undefined
    : {
        initial: { opacity: 0, scale: 0.85 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, amount: 0.8 },
      };
  const pop = (d: number) =>
    reduce ? undefined : { duration: 0.35, ease: EASE_OUT, delay: d };
  // Marching dashes = data streaming through the pipeline. −20 = two dash
  // periods (4+6), so each infinite cycle loops seamlessly.
  const dash = run
    ? {
        animate: { strokeDashoffset: -20 },
        transition: { duration: 1.6, ease: "linear" as const, repeat: Infinity },
      }
    : {};
  const node =
    "relative grid shrink-0 place-items-center rounded-[12px] bg-white/[0.07] ring-1 ring-white/[0.12]";
  const successDot = (
    <span className="absolute -top-1 -end-1 size-2 rounded-full bg-mint/90 shadow-[0_0_8px_rgba(165,237,238,0.7)]" />
  );

  return (
    <div ref={rootRef} className="relative flex items-center justify-center">
      {/* Dotted node-canvas backdrop (the n8n editor grid), faded at the edges. */}
      <div
        aria-hidden
        className="absolute -inset-x-6 -inset-y-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.13) 1px, transparent 1.5px)",
          backgroundSize: "14px 14px",
          maskImage:
            "radial-gradient(ellipse 62% 75% at 50% 50%, black, transparent 78%)",
        }}
      />

      {/* Trigger node — lightning, mint-lit like card 1's active tile. */}
      <motion.span
        {...nodeIn}
        transition={pop(0)}
        className={`${node} size-12 text-mint/85 ring-mint/40 shadow-[0_0_36px_rgba(165,237,238,0.22)] sm:size-14`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="size-5 sm:size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinejoin="round"
        >
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </motion.span>

      {/* Connector: trigger → AI step. */}
      <motion.svg
        {...nodeIn}
        transition={pop(0.15)}
        viewBox="0 0 36 12"
        aria-hidden
        className="w-7 shrink-0 sm:w-9"
      >
        <motion.path
          d="M36 6H0"
          {...dash}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={1.5}
          strokeDasharray="4 6"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* AI step — spark asterisk (the model doing the work). */}
      <motion.span
        {...nodeIn}
        transition={pop(0.25)}
        className={`${node} size-12 text-fg/85 sm:size-14`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="size-5 sm:size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        >
          <path d="M12 5v14M6 8.5l12 7M18 8.5l-12 7" />
        </svg>
      </motion.span>

      {/* Branch connector: AI step → the two outputs. */}
      <motion.svg
        {...nodeIn}
        transition={pop(0.4)}
        viewBox="0 0 56 96"
        preserveAspectRatio="none"
        aria-hidden
        className="h-20 w-9 shrink-0 sm:h-24 sm:w-12"
      >
        <motion.path
          d="M56 48C38 48 30 20 0 20"
          {...dash}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={1.5}
          strokeDasharray="4 6"
          strokeLinecap="round"
        />
        <motion.path
          d="M56 48C38 48 30 76 0 76"
          {...dash}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={1.5}
          strokeDasharray="4 6"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Output nodes — send + save, each with a mint "ran OK" dot. */}
      <div className="flex h-20 shrink-0 flex-col justify-between sm:h-24">
        <motion.span
          {...nodeIn}
          transition={pop(0.5)}
          className={`${node} size-9 text-fg/75 sm:size-10`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="size-4 sm:size-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m22 2-7 20-4-9-9-4 20-7z" />
            <path d="M22 2 11 13" />
          </svg>
          {successDot}
        </motion.span>
        <motion.span
          {...nodeIn}
          transition={pop(0.6)}
          className={`${node} size-9 text-fg/75 sm:size-10`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="size-4 sm:size-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v14a8 3 0 0 0 16 0V5" />
            <path d="M4 12a8 3 0 0 0 16 0" />
          </svg>
          {successDot}
        </motion.span>
      </div>
    </div>
  );
}

/** WhatsApp-style conversation mock (user mock, 2026-07-07). RTL chat
    convention: the INBOUND lead bubble hangs at the reading start (right),
    the bot's reply at the end (left) with a ✓, and a mint dot + "saved to
    CRM automatically" status under the reply. Bubbles pop in in message
    order on first view (motion-meaning); skipped under reduced motion. */
function ChatVignette() {
  const reduce = useReducedMotion();
  const bubbleIn = reduce
    ? undefined
    : {
        initial: { opacity: 0, y: 10, scale: 0.95 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, amount: 0.8 },
      };
  const delay = (d: number) =>
    reduce ? undefined : { duration: 0.4, ease: EASE_OUT, delay: d };

  return (
    <div className="flex flex-col gap-2 text-[13px] font-light leading-none tracking-[-0.01em] sm:gap-2.5 sm:text-[15px]">
      {/* Inbound lead — start side (right in RTL). */}
      <motion.span
        {...bubbleIn}
        transition={delay(0)}
        className="self-start rounded-[14px] rounded-ss-[5px] bg-white/[0.1] px-4 py-3 text-fg ring-1 ring-white/10 sm:px-5 sm:py-3.5"
      >
        {servicesChat.inbound}
      </motion.span>

      {/* Bot reply — end side, checkmark leading (booking confirmed). */}
      <motion.span
        {...bubbleIn}
        transition={delay(0.5)}
        className="flex items-center gap-2 self-end rounded-[14px] rounded-ee-[5px] bg-white/[0.07] px-4 py-3 text-fg/95 ring-1 ring-white/10 sm:px-5 sm:py-3.5"
      >
        <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 shrink-0 sm:size-4">
          <path
            d="M2.5 8.5 6 12l7.5-8"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {servicesChat.reply}
      </motion.span>

      {/* CRM status — mint dot + caption under the reply. */}
      <motion.span
        {...bubbleIn}
        transition={delay(1)}
        className="flex items-center gap-1.5 self-end pe-1 text-[11px] text-mint/80 sm:text-[12px]"
      >
        <span className="size-1.5 rounded-full bg-mint/80 shadow-[0_0_8px_rgba(165,237,238,0.6)]" />
        {servicesChat.status}
      </motion.span>
    </div>
  );
}

// Per-card heights, ref rhythm 400/450/300/400 (300/300/250/300 mobile).
const CARD_SIZES = [
  "h-[300px] md:h-[400px]",
  "h-[300px] md:h-[450px]",
  "h-[250px] md:h-[300px]",
  "h-[300px] md:h-[400px]",
] as const;

export function Services() {
  return (
    // Transparent over the page-wide fixed scene (ref behavior) — the
    // arc-slicing beat is anchored to this section's top.
    <section id="services" className="relative pt-24 pb-14 sm:pt-48 sm:pb-16">
      <div className="container-x relative z-[1] flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-6">
        {/* Header column — sticks while the cards scroll past (ref: sticky top 120px). */}
        <div className="flex flex-col items-center gap-6 text-center sm:gap-10 md:sticky md:top-[120px] md:w-[45%] md:items-start md:text-start">
          <p className="eyebrow text-fg/80">{services.eyebrow}</p>
          <div className="flex flex-col items-center gap-3 md:items-start">
            <h2 className="max-w-[400px] font-medium leading-[1.1] tracking-[-0.03em] text-fg text-[clamp(2.25rem,3.6vw,3rem)]">
              {services.title}
            </h2>
            <p className="max-w-[600px] text-[18px] font-light leading-snug tracking-[-0.03em] text-fg/85 sm:text-[20px]">
              {services.subcopy}
            </p>
          </div>
        </div>

        {/* Cards column — tall frosted-glass panels. Default anatomy: title
            top / body bottom (justify-between). The `prompt` card instead
            groups title+body at the TOP (ref gap 8px), art below. */}
        <div className="flex w-full flex-col gap-6 md:w-1/2">
          {services.items.map((item, i) => {
            const textTop = item.art === "prompt";
            const heading = (
              <h3 className="relative z-[1] max-w-[75%] font-medium leading-[1.15] tracking-[-0.03em] text-fg text-[clamp(1.5rem,2.5vw,2.25rem)]">
                {item.title}
              </h3>
            );
            const body = (
              <p className="relative z-[1] max-w-[520px] text-[16px] font-light leading-snug tracking-[-0.02em] text-fg/85 sm:text-[18px]">
                {item.body}
              </p>
            );
            return (
              <article
                key={item.title}
                className={`relative flex flex-col overflow-hidden rounded-[8px] bg-white/[0.06] p-5 ring-1 ring-white/[0.06] backdrop-blur-[30px] sm:p-8 ${
                  textTop ? "justify-start" : "justify-between gap-6"
                } ${CARD_SIZES[i]}`}
              >
                <ServiceCardArt variant={item.art} />
                {textTop ? (
                  <div className="flex flex-col gap-2">
                    {heading}
                    {body}
                  </div>
                ) : (
                  <>
                    {heading}
                    {body}
                  </>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
