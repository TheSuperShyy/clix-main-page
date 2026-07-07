import { useRef, type RefObject } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { benefits } from "../data/content";

/**
 * Process — the sticky-header + wide-cards band. Formerly the ref BENEFITS
 * stat block; repurposed (user call, 2026-07-07) into the 4 build steps
 * clients go through: CRM dashboard → automations → landing page → closing
 * leads. The ref skeleton is retained: start-side sticky header column,
 * 50%-wide column of wide frosted-glass cards, 8px radius, big value top /
 * copy bottom — but all four cards are glass now (the inverted white card 1
 * was dropped so the step sequence reads uniform), the stat value became the
 * step number, and each card carries a decorative vignette on its end side.
 * Section id stays "benefits" so scene depth + any anchors are unaffected.
 *
 * Motion exception to the static-band convention: each vignette LOOPS
 * seamlessly (aria-hidden, transforms/opacity only):
 *   01 CRM dashboard — app bar + side rail + KPI cards + gridline chart with
 *      breathing bars, a flowing sparkline and a live mint dot (sized up as
 *      the hero vignette)
 *   02 automations   — n8n-style canvas: trigger → filter → AI node forking
 *      into three outputs, dashes + data pulses streaming along the
 *      connectors, plus a one-time whileInView build-up (nodes pop in,
 *      connectors wipe open, in flow order)
 *   03 landing page  — full page mock (chrome, nav, hero, card row) with a
 *      cursor that clicks the CTA (press + ripple) and a sheen sweep
 *   04 closing leads — pipeline header + progress bar filling as three lead
 *      rows get checked off one by one, then everything resets together
 * Every loop starts and ends on the same frame (no visible snap), and all of
 * them are gated behind useReducedMotion — reduced-motion users see each
 * vignette's static end-state (dashboard idle, pipeline fully closed).
 */

/**
 * Loop gate for the vignettes. framer keeps `repeat: Infinity` tweens ticking
 * even when the element is scrolled far off-screen, and these loops repaint
 * SVG strokes through the cards' backdrop blur — measured at ~2× frame cost
 * page-wide (Services idle 28fps → 60 with loops off on the Intel iGPU).
 * `run` is true only while the vignette's card is actually in view (and never
 * under reduced motion): gate every infinite `animate` on it. `reduce` keeps
 * gating the one-time reveals + static-end-state choices as before.
 */
function useLoopGate(ref: RefObject<Element | null>) {
  const reduce = useReducedMotion() ?? false;
  const inView = useInView(ref, { amount: 0.15 });
  return { reduce, run: !reduce && inView };
}

export function Benefits() {
  const vignettes = [
    <CrmVignette key="crm" />,
    <AutomationVignette key="flow" />,
    <SiteVignette key="site" />,
    <LeadsVignette key="leads" />,
  ];

  return (
    // Transparent over the page-wide fixed scene (ref behavior).
    <section id="benefits" className="relative pt-14 pb-24 sm:pt-16 sm:pb-48">
      <div className="container-x relative z-[1] flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-6">
        {/* Header column — sticks while the step cards scroll past. */}
        <div className="flex flex-col items-center gap-6 text-center sm:gap-10 md:sticky md:top-[120px] md:w-[40%] md:items-start md:text-start">
          <p className="eyebrow text-fg/80">{benefits.eyebrow}</p>
          <h2 className="max-w-[600px] font-medium leading-[1.15] tracking-[-0.03em] text-fg text-[clamp(2.25rem,3.6vw,3rem)]">
            {benefits.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        {/* Step cards — number top / title+body bottom, vignette on the end side. */}
        <div className="flex w-full flex-col gap-6 md:w-1/2">
          {benefits.steps.map((step, i) => (
            <article
              key={step.num}
              className="relative h-[240px] overflow-hidden rounded-[8px] bg-white/[0.06] ring-1 ring-white/[0.06] backdrop-blur-[30px] sm:h-[250px]"
            >
              <div className="relative z-[1] flex h-full w-[56%] flex-col justify-between p-5 sm:p-8">
                <p className="font-medium leading-none tracking-[-0.03em] text-fg text-[clamp(2.5rem,5vw,3.5rem)]">
                  {step.num}
                </p>
                <div>
                  <h3 className="text-[17px] font-medium leading-snug tracking-[-0.02em] text-fg sm:text-[20px]">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] font-light leading-snug text-fg/70 sm:text-[15px]">
                    {step.desc}
                  </p>
                </div>
              </div>
              {/* Decorative looping vignette, centered in the card's end half
                  (card 02's slot is a touch wider — its 6-node canvas runs
                  larger than the framed mocks). */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 end-3 flex w-[40%] items-center justify-center ${
                  i === 1 ? "sm:end-6 sm:w-[44%]" : "sm:end-8"
                }`}
              >
                {vignettes[i]}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Step 01 — mini CRM app: app bar (logo, live dot, avatar), side nav rail
    with an active item, two KPI stat cards, and a gridlined chart where the
    bars breathe on phase-offset loops (scaleY only) under a mint sparkline
    whose dashes flow in the reading direction (offset −20 = two dash
    periods, inherently seamless). Sized up vs the other vignettes (user
    call) so the dashboard reads as the card's hero element. */
function CrmVignette() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { run } = useLoopGate(rootRef);
  // [height class, scaleY keyframes, phase offset s] — offsets desync the bars.
  const bars = [
    ["h-4 sm:h-5", [1, 0.55, 1], 0],
    ["h-6 sm:h-8", [0.6, 1, 0.6], 0.4],
    ["h-5 sm:h-6", [1, 0.6, 1], 0.8],
    ["h-8 sm:h-11", [0.55, 1, 0.55], 0.2],
    ["h-6 sm:h-8", [1, 0.5, 1], 0.6],
    ["h-9 sm:h-12", [0.6, 1, 0.6], 1],
  ] as const;

  return (
    <div
      ref={rootRef}
      className="w-[140px] overflow-hidden rounded-[10px] bg-white/[0.05] ring-1 ring-white/[0.12] sm:w-[210px]"
    >
      {/* App bar — logo mark + title, live-data dot + user avatar. */}
      <div className="flex items-center justify-between border-b border-white/10 px-2 py-1.5 sm:px-3 sm:py-2">
        <span className="flex items-center gap-1 sm:gap-1.5">
          <span className="size-2 rounded-[3px] bg-brand/85 sm:size-2.5" />
          <span className="h-1 w-6 rounded-full bg-white/25 sm:h-1.5 sm:w-10" />
        </span>
        <span className="flex items-center gap-1.5 sm:gap-2">
          <motion.span
            className="size-1.5 rounded-full bg-mint shadow-[0_0_6px_rgba(165,237,238,0.8)] sm:size-2"
            animate={run ? { opacity: [1, 0.3, 1] } : undefined}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
          />
          <span className="size-2.5 rounded-full bg-gradient-to-br from-sky/50 to-sky/20 ring-1 ring-white/20 sm:size-3.5" />
        </span>
      </div>
      <div className="flex">
        {/* Side nav rail (inline-start), one active item. */}
        <div className="flex flex-col gap-1.5 border-e border-white/10 p-1.5 pt-2 sm:gap-2 sm:p-2 sm:pt-2.5">
          <span className="size-2 rounded-[2px] bg-mint/75 shadow-[0_0_6px_rgba(165,237,238,0.35)] sm:size-3" />
          <span className="size-2 rounded-[2px] bg-white/[0.15] sm:size-3" />
          <span className="size-2 rounded-[2px] bg-white/[0.15] sm:size-3" />
          <span className="size-2 rounded-[2px] bg-white/[0.15] sm:size-3" />
        </div>
        {/* Main pane — KPI cards + chart. */}
        <div className="flex-1 p-2 sm:p-3">
          <div className="flex gap-1.5 sm:gap-2">
            {[0, 1].map((i) => (
              <span
                key={i}
                className="flex-1 rounded-[4px] bg-white/[0.06] p-1.5 ring-1 ring-white/[0.08] sm:p-2"
              >
                <span className="block h-1 w-5 rounded-full bg-white/[0.16] sm:w-7" />
                <span className="mt-1 flex items-center gap-1 sm:mt-1.5">
                  <span className="h-1.5 w-6 rounded-full bg-white/40 sm:h-2 sm:w-9" />
                  <span
                    className={`h-1 w-2.5 rounded-full sm:w-3 ${
                      i === 0 ? "bg-mint/70" : "bg-sky/60"
                    }`}
                  />
                </span>
              </span>
            ))}
          </div>
          {/* Chart — hairline gridlines, breathing bars, flowing sparkline. */}
          <div className="relative mt-2 h-12 sm:mt-2.5 sm:h-16">
            <span className="absolute inset-x-0 top-0 border-t border-white/[0.07]" />
            <span className="absolute inset-x-0 top-1/3 border-t border-white/[0.07]" />
            <span className="absolute inset-x-0 top-2/3 border-t border-white/[0.07]" />
            <div className="absolute inset-0 flex items-end gap-1 sm:gap-1.5">
              {bars.map(([h, kf, d], i) => (
                <motion.span
                  key={i}
                  className={`${h} w-full origin-bottom rounded-t-[2px] ${
                    i === bars.length - 1 ? "bg-mint/75" : "bg-sky/40"
                  }`}
                  animate={run ? { scaleY: [...kf] } : undefined}
                  transition={{
                    duration: 2.6,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: d,
                  }}
                />
              ))}
            </div>
            {/* Sparkline drawn end→start so dashes stream right → left (RTL). */}
            <svg
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              aria-hidden
              className="absolute inset-0 h-full w-full"
            >
              <motion.path
                d="M100 30 L82 22 L70 26 L54 14 L38 20 L20 8 L0 13"
                fill="none"
                stroke="rgba(165,237,238,0.75)"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
                strokeDasharray="4 6"
                strokeLinecap="round"
                animate={run ? { strokeDashoffset: -20 } : undefined}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Step 02 — n8n-style workflow canvas: trigger ⚡ → filter → AI ✳ that FORKS
    into three outputs (send + database + sheet), on a faded dotted grid.
    Nodes have connection ports and name-tag bars like real n8n; dashes stream
    toward the flow's end (RTL: right → left) with mint data pulses traveling
    the straight connectors. On top of the seamless loops there's a ONE-TIME
    whileInView build-up: nodes pop in and connectors wipe open in flow order
    (variants staggered by hand-tuned delays), like the workflow assembling
    itself. Skipped entirely under reduced motion — the finished canvas
    renders directly. */
function AutomationVignette() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { reduce, run } = useLoopGate(rootRef);
  const dash = run
    ? {
        animate: { strokeDashoffset: -20 },
        transition: {
          duration: 1.6,
          ease: "linear" as const,
          repeat: Infinity,
        },
      }
    : {};
  const node =
    "relative grid shrink-0 place-items-center rounded-[10px] bg-white/[0.07] ring-1 ring-white/[0.12]";
  // n8n-ish name tag under a node (absolute — doesn't shift the row).
  const tag = (
    <span className="absolute -bottom-2.5 inset-x-0 mx-auto h-1 w-6 rounded-full bg-white/[0.16] sm:-bottom-4 sm:h-1.5 sm:w-9" />
  );
  const port = (side: "start" | "end") => (
    <span
      className={`absolute top-1/2 -mt-0.5 size-1 rounded-full bg-white/40 sm:-mt-[3px] sm:size-1.5 ${
        side === "end" ? "-end-[3px] sm:-end-1" : "-start-[3px] sm:-start-1"
      }`}
    />
  );
  // Build-up reveal variants — d staggers elements in flow order.
  const pop = (d: number): Variants => ({
    hidden: { opacity: 0, scale: 0.4 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { delay: d, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
    },
  });
  // origin-right = the flow-start side of a connector in this RTL layout.
  const wipe = (d: number): Variants => ({
    hidden: { opacity: 0, scaleX: 0 },
    show: {
      opacity: 1,
      scaleX: 1,
      transition: { delay: d, duration: 0.35, ease: "easeOut" },
    },
  });
  // Straight connector with a traveling data pulse; pulseDelay = loop phase
  // offset, revealDelay = position in the one-time build-up.
  const connector = (pulseDelay = 0, revealDelay = 0) => (
    <motion.span variants={wipe(revealDelay)} className="flex shrink-0 origin-right">
      <svg viewBox="0 0 24 12" aria-hidden className="w-3 sm:w-8">
        <motion.path
          d="M24 6H0"
          {...dash}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={1.5}
          strokeDasharray="4 6"
          strokeLinecap="round"
        />
        {run && (
          <motion.circle
            r={1.8}
            cx={24}
            cy={6}
            fill="#a5edee"
            animate={{ x: [0, -3.6, -20.4, -24], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.6,
              times: [0, 0.15, 0.85, 1],
              ease: "linear",
              repeat: Infinity,
              delay: pulseDelay,
            }}
          />
        )}
      </svg>
    </motion.span>
  );
  const outputIcon =
    "size-2 sm:size-4";

  return (
    <motion.div
      ref={rootRef}
      className="relative flex items-center"
      {...(reduce
        ? {}
        : {
            initial: "hidden" as const,
            whileInView: "show" as const,
            viewport: { once: true, amount: 0.4 },
          })}
    >
      {/* Dotted node-canvas backdrop, faded at the edges. */}
      <div
        aria-hidden
        className="absolute -inset-x-4 -inset-y-7 sm:-inset-x-6"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.13) 1px, transparent 1.5px)",
          backgroundSize: "14px 14px",
          maskImage:
            "radial-gradient(ellipse 62% 70% at 50% 50%, black, transparent 78%)",
        }}
      />
      {/* Trigger — lightning, mint-lit. */}
      <motion.span
        variants={pop(0)}
        className={`${node} size-7 text-mint/85 ring-mint/40 shadow-[0_0_28px_rgba(165,237,238,0.22)] sm:size-13`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="size-3 sm:size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinejoin="round"
        >
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        {port("end")}
        {tag}
      </motion.span>
      {connector(0, 0.18)}
      {/* Filter step — narrows the triggered data down. */}
      <motion.span
        variants={pop(0.32)}
        className={`${node} size-7 text-fg/80 sm:size-13`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="size-3 sm:size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinejoin="round"
        >
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
        </svg>
        {port("start")}
        {port("end")}
        {tag}
      </motion.span>
      {connector(0.8, 0.5)}
      {/* AI step — spark asterisk, pulsing while it "works" (inner span, so
          the pulse doesn't fight the reveal's scale). */}
      <motion.span variants={pop(0.64)} className="flex shrink-0">
        <motion.span
          className={`${node} size-7 text-fg/85 sm:size-13`}
          animate={run ? { scale: [1, 1.07, 1] } : undefined}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="size-3 sm:size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
          >
            <path d="M12 5v14M6 8.5l12 7M18 8.5l-12 7" />
          </svg>
          {port("start")}
          {port("end")}
          {tag}
        </motion.span>
      </motion.span>
      {/* Fork — the AI output splits to the three output nodes. viewBox y
          coords 10/38/66 = the output column's node centers (size-5 + gap-2 =
          20+8 rhythm; scales uniformly to the sm sizes: size-9 + gap-3.5 →
          h-[136px]), preserveAspectRatio none keeps that mapping exact. */}
      <motion.span variants={wipe(0.82)} className="flex shrink-0 origin-right">
        <svg
          viewBox="0 0 24 76"
          preserveAspectRatio="none"
          aria-hidden
          className="h-[76px] w-4 sm:h-[136px] sm:w-7"
        >
          {["M24 38C16 38 16 10 8 10H0", "M24 38H0", "M24 38C16 38 16 66 8 66H0"].map(
            (d) => (
              <motion.path
                key={d}
                d={d}
                {...dash}
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
                strokeDasharray="4 6"
                strokeLinecap="round"
              />
            ),
          )}
        </svg>
      </motion.span>
      {/* Outputs — send (with a blinking "ran OK" dot), database, sheet. */}
      <div className="flex flex-col gap-2 sm:gap-3.5">
        <motion.span
          variants={pop(1)}
          className={`${node} size-5 text-fg/75 sm:size-9`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className={outputIcon}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m22 2-7 20-4-9-9-4 20-7z" />
            <path d="M22 2 11 13" />
          </svg>
          <motion.span
            className="absolute -top-0.5 -end-0.5 size-1 rounded-full bg-mint/90 shadow-[0_0_8px_rgba(165,237,238,0.7)] sm:-top-1 sm:-end-1 sm:size-2"
            animate={run ? { opacity: [1, 0.35, 1] } : undefined}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
          />
        </motion.span>
        <motion.span
          variants={pop(1.12)}
          className={`${node} size-5 text-fg/70 sm:size-9`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className={outputIcon}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <ellipse cx="12" cy="6" rx="7" ry="3" />
            <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
            <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
          </svg>
        </motion.span>
        <motion.span
          variants={pop(1.24)}
          className={`${node} size-5 text-fg/70 sm:size-9`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className={outputIcon}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <path d="M4 10.5h16M10.5 5v14" />
          </svg>
        </motion.span>
      </div>
    </motion.div>
  );
}

/** Step 03 — full landing-page mock in a browser frame, sized to match the
    CRM panel: chrome dots + address bar (mint "https" dot), site nav (logo +
    menu + nav pill), a CENTERED hero — eyebrow, two headline lines, subline,
    CTA pair (solid orange + ghost) — where a cursor flies in and CLICKS the
    orange CTA (press dip + ripple ring, all on one shared keyframe clock so
    they stay in sync), a hero "screenshot" media block, a partner-logo strip,
    a 3-card feature row, and a soft sheen sweeping in the reading direction
    (RTL: right → left). Cursor/ripple/sheen enter and exit at opacity 0 /
    outside the clipped frame, so every loop restarts invisibly. */
function SiteVignette() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { run } = useLoopGate(rootRef);
  const T = 5; // shared loop clock, seconds

  return (
    <div
      ref={rootRef}
      className="relative w-[140px] overflow-hidden rounded-[10px] bg-white/[0.05] ring-1 ring-white/[0.12] sm:w-[210px]"
    >
      {/* Browser chrome — window dots + address bar with a secure dot. */}
      <div className="flex items-center gap-1 border-b border-white/10 px-2 py-1.5 sm:px-2.5">
        <span className="size-1.5 rounded-full bg-white/25" />
        <span className="size-1.5 rounded-full bg-white/[0.15]" />
        <span className="size-1.5 rounded-full bg-white/[0.15]" />
        <span className="ms-1 flex h-2 flex-1 items-center gap-1 rounded-full bg-white/[0.08] px-1 sm:h-2.5">
          <span className="size-0.5 rounded-full bg-mint/70 sm:size-1" />
          <span className="h-0.5 w-6 rounded-full bg-white/[0.14] sm:w-9" />
        </span>
      </div>
      {/* Site nav — logo + wordmark, menu items + nav CTA pill. */}
      <div className="flex items-center justify-between border-b border-white/[0.07] px-2.5 py-1.5 sm:px-3 sm:py-2">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-brand/85" />
          <span className="h-1 w-4 rounded-full bg-white/25 sm:w-5" />
        </span>
        <span className="flex items-center gap-1 sm:gap-1.5">
          <span className="h-1 w-2.5 rounded-full bg-white/20 sm:w-3" />
          <span className="h-1 w-2.5 rounded-full bg-white/20 sm:w-3" />
          <span className="h-1 w-2.5 rounded-full bg-white/[0.12] sm:w-3" />
          <span className="ms-0.5 h-2.5 w-5 rounded-full bg-white/[0.14] ring-1 ring-white/[0.14] sm:h-3 sm:w-6" />
        </span>
      </div>
      {/* Hero — centered eyebrow, headline, subline, CTA pair + cursor click loop. */}
      <div className="flex flex-col items-center px-2.5 pt-2.5 sm:px-3 sm:pt-3">
        <span className="block h-1 w-7 rounded-full bg-mint/45 sm:w-9" />
        <span className="mt-1.5 block h-2 w-4/5 rounded-full bg-white/35 sm:h-2.5" />
        <span className="mt-1 block h-2 w-3/5 rounded-full bg-white/35 sm:h-2.5" />
        <span className="mt-1.5 block h-1 w-1/2 rounded-full bg-white/[0.14]" />
        <span className="relative mt-2 flex items-center gap-1.5">
          <span className="relative flex">
            <motion.span
              className="block h-4 w-10 rounded-full bg-brand/90 sm:h-[18px] sm:w-12"
              animate={run ? { scale: [1, 1, 0.9, 1.06, 1, 1] } : undefined}
              transition={{
                duration: T,
                times: [0, 0.34, 0.4, 0.48, 0.58, 1],
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            {run && (
              /* Click ripple. */
              <motion.span
                className="absolute inset-0 rounded-full ring-2 ring-brand/60"
                animate={{
                  opacity: [0, 0, 0.8, 0, 0, 0],
                  scale: [0.6, 0.6, 0.8, 1.7, 1.7, 0.6],
                }}
                transition={{
                  duration: T,
                  times: [0, 0.38, 0.42, 0.6, 0.99, 1],
                  ease: "easeOut",
                  repeat: Infinity,
                }}
              />
            )}
          </span>
          {/* Ghost secondary CTA. */}
          <span className="h-4 w-8 rounded-full ring-1 ring-white/25 sm:h-[18px] sm:w-10" />
          {run && (
            /* Cursor — rests below-start, flies to the CTA, dips to click. */
            <motion.svg
              viewBox="0 0 24 24"
              aria-hidden
              className="absolute start-5 top-1.5 z-[1] size-3.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
              animate={{
                x: [-22, -22, 0, 0, 0, -22],
                y: [16, 16, 0, 0, 0, 16],
                scale: [1, 1, 1, 0.85, 1, 1],
                opacity: [0, 0.95, 0.95, 0.95, 0.95, 0],
              }}
              transition={{
                duration: T,
                times: [0, 0.14, 0.34, 0.42, 0.62, 1],
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <path
                d="M5.5 3.2 12.6 19.5 14.5 12.8 21.2 11 5.5 3.2z"
                fill="#fff"
                stroke="rgba(0,0,0,0.45)"
                strokeWidth={1}
              />
            </motion.svg>
          )}
        </span>
      </div>
      {/* Hero media block — the product "screenshot" under the CTAs. */}
      <div className="px-2.5 pt-2.5 sm:px-3">
        <span className="relative block h-8 overflow-hidden rounded-[5px] bg-gradient-to-br from-sky/25 via-white/[0.06] to-mint/[0.15] ring-1 ring-white/[0.1] sm:h-11">
          <span className="absolute start-1.5 top-1.5 block h-1 w-8 rounded-full bg-white/30 sm:w-10" />
          <span className="absolute start-1.5 top-3 block h-1 w-5 rounded-full bg-white/[0.16] sm:top-3.5 sm:w-7" />
          <span className="absolute bottom-1.5 end-1.5 block h-2.5 w-6 rounded-[3px] bg-white/[0.1] sm:h-3.5 sm:w-9" />
        </span>
      </div>
      {/* Partner-logo strip. */}
      <div className="flex items-center justify-center gap-2 pt-2 sm:gap-2.5">
        <span className="h-1 w-3.5 rounded-full bg-white/[0.13] sm:w-4" />
        <span className="h-1 w-3.5 rounded-full bg-white/[0.13] sm:w-4" />
        <span className="h-1 w-3.5 rounded-full bg-white/[0.13] sm:w-4" />
        <span className="h-1 w-3.5 rounded-full bg-white/[0.13] sm:w-4" />
      </div>
      {/* Below the fold — 3-card feature row. */}
      <div className="flex gap-1.5 px-2.5 pb-2.5 pt-2 sm:px-3 sm:pb-3">
        {[
          "from-sky/30 to-sky/10",
          "from-mint/25 to-mint/[0.06]",
          "from-brand/30 to-brand/10",
        ].map((g, i) => (
          <span
            key={i}
            className="flex-1 rounded-[4px] bg-white/[0.05] p-1 ring-1 ring-white/[0.08]"
          >
            <span
              className={`block h-4 rounded-[2px] bg-gradient-to-br ${g} sm:h-5`}
            />
            <span className="mt-1 block h-1 w-3/4 rounded-full bg-white/20" />
          </span>
        ))}
      </div>
      {/* Sheen sweep — negative x = toward inline-end in RTL. */}
      <motion.span
        className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        style={{ insetInlineStart: -48 }}
        animate={run ? { x: [0, -280] } : undefined}
        transition={{
          duration: 2.4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1.4,
        }}
      />
    </div>
  );
}

/** Step 04 — mini pipeline: header (title + mint counter chip) and a progress
    bar that fills a third per closed lead, over three lead rows (avatar,
    name + detail lines). Each row's gray "open" pill crossfades into a mint
    check while the row glows — all on the same 4.8s clock, so the progress
    bar, checks and glows stay in sync; everything resets together at 85–100%
    of the loop. Under reduced motion the static end-state renders: progress
    full, every lead checked. */
function LeadsVignette() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { run } = useLoopGate(rootRef);
  const T = 4.8; // full loop, seconds
  const rows = [
    { w: "w-10 sm:w-12", sub: "w-6 sm:w-8", tIn: 0.1 },
    { w: "w-8 sm:w-10", sub: "w-5 sm:w-6", tIn: 0.3 },
    { w: "w-11 sm:w-14", sub: "w-7 sm:w-9", tIn: 0.5 },
  ];

  return (
    <div ref={rootRef} className="w-[136px] sm:w-[170px]">
      {/* Pipeline header — title + counter chip. */}
      <div className="mb-1.5 flex items-center justify-between sm:mb-2">
        <span className="h-1.5 w-9 rounded-full bg-white/25" />
        <span className="flex items-center gap-1 rounded-full bg-mint/[0.12] px-1.5 py-0.5 ring-1 ring-mint/30">
          <span className="size-1 rounded-full bg-mint/80" />
          <span className="h-1 w-3.5 rounded-full bg-mint/60" />
        </span>
      </div>
      {/* Progress — fills a third per closed lead. origin-right = the bar's
          inline-start in this RTL layout, so it grows in reading direction. */}
      <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/10">
        <motion.span
          className="block h-full w-full origin-right rounded-full bg-mint/70"
          animate={
            run
              ? { scaleX: [0, 0, 0.333, 0.333, 0.667, 0.667, 1, 1, 0] }
              : undefined
          }
          transition={{
            duration: T,
            times: [0, 0.1, 0.15, 0.3, 0.35, 0.5, 0.55, 0.85, 1],
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {rows.map(({ w, sub, tIn }, i) => {
          const times = [0, tIn, tIn + 0.05, 0.85, 0.93, 1];
          return (
            <div
              key={i}
              className="relative flex items-center gap-2 rounded-[8px] bg-white/[0.05] px-2 py-1.5 ring-1 ring-white/[0.10] sm:px-2.5"
            >
              {/* Closed-glow overlay, synced with the check. */}
              {run && (
                <motion.span
                  className="absolute inset-0 rounded-[8px] bg-mint/[0.05] ring-1 ring-mint/25"
                  animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
                  transition={{
                    duration: T,
                    times,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
              )}
              <span className="size-5 shrink-0 rounded-full bg-gradient-to-br from-sky/45 to-sky/15 ring-1 ring-white/20" />
              <span className="flex min-w-0 flex-col gap-1">
                <span className={`h-1.5 ${w} rounded-full bg-white/30`} />
                <span className={`h-1 ${sub} rounded-full bg-white/[0.14]`} />
              </span>
              {/* Status — gray "open" pill crossfades into the mint check. */}
              <span className="relative ms-auto grid h-4 w-6 shrink-0 place-items-center">
                {run && (
                  <motion.span
                    className="col-start-1 row-start-1 flex h-3 w-6 items-center justify-center gap-0.5 rounded-full bg-white/[0.10] ring-1 ring-white/[0.14]"
                    animate={{ opacity: [1, 1, 0, 0, 1, 1] }}
                    transition={{
                      duration: T,
                      times,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  >
                    <span className="size-0.5 rounded-full bg-white/50" />
                    <span className="size-0.5 rounded-full bg-white/50" />
                    <span className="size-0.5 rounded-full bg-white/50" />
                  </motion.span>
                )}
                <motion.span
                  className="col-start-1 row-start-1 grid size-4 place-items-center rounded-full bg-mint/90 text-ink"
                  animate={
                    run
                      ? {
                          opacity: [0, 0, 1, 1, 0, 0],
                          scale: [0.4, 0.4, 1, 1, 0.8, 0.4],
                        }
                      : undefined
                  }
                  transition={{
                    duration: T,
                    times,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="size-2.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                </motion.span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
