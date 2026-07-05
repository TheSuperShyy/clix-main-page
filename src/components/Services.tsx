import { services } from "../data/content";

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
 *  3. `none`   — bare glass; title top / body bottom.
 *  4. `nodes`  — faint branching node diagram on the end side; title top /
 *     body bottom.
 *
 * Static section — no scroll reveal (the ref has none; sticky is pure CSS),
 * matching Solutions/Partners/Features/KeyFeatures.
 */

type ArtVariant = "tiles" | "prompt" | "none" | "nodes";

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

      {variant === "nodes" && (
        // Ref card 4: circuit-trace node diagram spanning the WHOLE card —
        // side nodes bleed off the edges, "+" hub dead center behind the text.
        <div className="absolute inset-0">
          <NodesDiagram className="h-full w-full" />
        </div>
      )}
    </div>
  );
}

/** Circuit-trace node network (ref frame.png). Geometry transcribed from the
    ref crop and PRE-MIRRORED for RTL (ref: text top-left, diagram weighted
    right → ours: text top-start/right, diagram weighted end/left): small
    portrait nodes (one clipped off the end edge), rounded-elbow traces, and
    vertical traces running off the top/bottom edges on the text side, all
    converging on a raised "+" hub. */
function NodesDiagram({ className = "" }: { className?: string }) {
  const stroke = "rgba(255,255,255,0.12)";
  const box = "rgba(255,255,255,0.04)";
  // Portrait side nodes 88×100 r22: end-top / end-mid (clipped) / end-bottom
  // / start-mid.
  const nodes: Array<[number, number]> = [
    [62, 128],
    [-34, 208],
    [62, 302],
    [495, 210],
  ];
  const traces = [
    // End-top node → elbow down → into the hub's end side (upper).
    "M150 178 H206 Q230 178 230 202 V216 Q230 240 254 240 H268",
    // End-mid (clipped) node → straight into the hub.
    "M54 258 H268",
    // End-bottom node → elbow up → hub end side (lower).
    "M150 352 H206 Q230 352 230 328 V304 Q230 280 254 280 H268",
    // Start-mid node → straight into the hub.
    "M368 258 H495",
    // Vertical from the top edge → bends into the hub's start side (upper).
    "M452 30 V190 Q452 214 428 214 H368",
    // Vertical from the bottom edge → bends into the hub's start side (lower).
    "M430 470 V330 Q430 306 406 306 H368",
    // Short stubs tying the corner nodes to the top/bottom edges (ref).
    "M106 30 V128",
    "M106 402 V470",
  ];
  return (
    <svg viewBox="0 0 860 500" preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      {traces.map((d) => (
        <path key={d} d={d} fill="none" stroke={stroke} strokeWidth={1.5} />
      ))}
      {nodes.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={88} height={100} rx={22} fill={box} stroke={stroke} strokeWidth={1.5} />
      ))}
      {/* Hub — raised double-ring tile with the ref's rounded "+". */}
      <rect x={260} y={197} width={116} height={126} rx={30} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" />
      <rect x={268} y={205} width={100} height={110} rx={26} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
      <rect x={278} y={215} width={80} height={90} rx={20} fill="none" stroke="rgba(255,255,255,0.1)" />
      <path
        d="M318 240v40M298 260h40"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={7}
        strokeLinecap="round"
      />
    </svg>
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
