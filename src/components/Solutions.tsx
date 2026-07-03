import { motion } from "motion/react";
import { solutions } from "../data/content";

/**
 * Solutions — clone of the reference's SOLUTIONS section: a floating
 * GLASSMORPHISM panel riding over the hero's scrubbed scene.
 *
 * Rendered INSIDE the Hero's scene region (as its child), between two
 * scene-visible spacers — so the sticky canvas is genuinely behind AND below
 * the panel, and the backdrop-blur samples the live "video" (ref behaviour:
 * the bg video shows in the gaps between sections).
 *
 * Reference anatomy (LTR) → RTL mirror:
 *  • Rounded glass sheet, generously inset from the page edges (~6vw sides).
 *  • SOLUTIONS eyebrow → two-line headline + CTA pair (ROUNDED-RECT buttons,
 *    not pills — white rect w/ circular arrow badge + flat grey rect) on the
 *    START side; short paragraph on the END side.
 *  • A dense dark dashboard mock (sidebar · KPI chart · quick panel · table ·
 *    donut) with a faded teaser row clipped at ITS base, and a thin glass
 *    strip of panel visible beneath it.
 *
 * The dashboard is procedural placeholder UI — Hebrew strings live in
 * content.ts (`solutions.dashboard`), charts are inline SVG.
 */

const d = solutions.dashboard;

export function Solutions() {
  return (
    <section id="solutions" className="relative">
      <div className="relative mx-4 overflow-hidden rounded-[14px] border border-white/10 bg-[#0d1430]/45 shadow-[0_60px_120px_-60px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:mx-10 lg:mx-24">
        {/* Soft top sheen so the glass reads as a lit surface. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.05] to-transparent"
        />

        <div className="relative px-5 pt-6 sm:px-8 sm:pt-7 lg:px-12 lg:pt-8">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow text-fg/80"
          >
            {solutions.eyebrow}
          </motion.p>

          {/* Headline + CTAs (start) · paragraph (end, baseline-aligned). */}
          <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl"
            >
              <h2
                aria-label={solutions.title}
                className="font-medium leading-[1.12] tracking-[-0.03em] text-fg text-[clamp(1.85rem,2.9vw,3.15rem)]"
              >
                {solutions.titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>

              {/* Ref: unlike the hero pills, the Solutions CTAs are ROUNDED
                  RECTANGLES — white rect w/ circular arrow badge + flat grey
                  rect (no border). */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {solutions.ctas.map((c) =>
                  c.primary ? (
                    <a
                      key={c.href}
                      href={c.href}
                      className="group inline-flex h-11 items-center gap-2.5 rounded-[12px] bg-white ps-5 pe-2 text-[14px] font-bold text-ink transition-colors hover:bg-white/90"
                    >
                      {c.label}
                      <span className="grid size-7 place-items-center rounded-full bg-ink text-white transition-transform duration-200 group-hover:-translate-x-0.5">
                        <ArrowIcon />
                      </span>
                    </a>
                  ) : (
                    <a
                      key={c.href}
                      href={c.href}
                      className="inline-flex h-11 items-center rounded-[12px] bg-white/[0.16] px-5 text-[14px] font-bold text-fg backdrop-blur-sm transition-colors hover:bg-white/25"
                    >
                      {c.label}
                    </a>
                  ),
                )}
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md text-[clamp(0.95rem,1vw,1.125rem)] leading-normal text-fg/90 lg:pb-1"
            >
              {solutions.body}
            </motion.p>
          </div>
        </div>

        {/* Dashboard mock — its own rounded edge, with a thin glass strip of
            panel visible beneath it (ref). */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-7 px-4 pb-4 sm:px-6 sm:pb-5 lg:mt-8 lg:px-8 lg:pb-6"
        >
          <DashboardMock />
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────── Dashboard mock ────────────────────────── */

function DashboardMock() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-white/10 bg-[#08090f]/95 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
      <div className="flex">
        {/* Sidebar — START (RTL right; ref LTR left), full height. */}
        <aside className="hidden w-[180px] shrink-0 flex-col justify-between border-e border-white/[0.06] p-3 lg:flex">
          <nav className="flex flex-col gap-1">
            {d.nav.map((item) => (
              <span
                key={item.label}
                className={`flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[12px] ${
                  item.active
                    ? "border border-white/[0.08] bg-white/[0.05] text-fg"
                    : "text-fg/50"
                }`}
              >
                <SidebarGlyph active={item.active} />
                {item.label}
                {"badge" in item && item.badge && (
                  <span className="ms-auto rounded-md bg-white/[0.08] px-1.5 py-0.5 text-[9px] text-fg/60">
                    {item.badge}
                  </span>
                )}
              </span>
            ))}
          </nav>
          <div className="flex flex-col gap-0.5">
            {d.navSecondary.map((label) => (
              <span key={label} className="flex h-8 items-center gap-2.5 px-2.5 text-[12px] text-fg/35">
                <span aria-hidden className="size-3 rounded-full bg-white/10" />
                {label}
              </span>
            ))}
            <span className="mt-2 flex h-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 text-[11px] text-fg/50">
              {d.unlock}
            </span>
          </div>
        </aside>

        {/* Main column: header bar + content grid. */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-4 py-3">
            <div>
              <div className="text-[10px] text-fg/40">{d.breadcrumb}</div>
              <div className="mt-0.5 text-[15px] font-medium text-fg">{d.title}</div>
            </div>
            <div className="flex items-center gap-3">
              <BellIcon className="size-4 text-fg/50" />
              <div className="hidden h-8 w-40 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-[12px] text-fg/35 sm:flex lg:w-48">
                <SearchIcon className="size-3" />
                {d.searchPlaceholder}
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-3 xl:grid-cols-[1fr_250px]">
            {/* Center: KPI chart + channels table. */}
            <div className="flex min-w-0 flex-col gap-3">
              <KpiCard />
              <ChannelsCard />
            </div>
            {/* End column: quick glance + repartition donut. */}
            <div className="flex flex-col gap-3">
              <QuickCard />
              <RepartitionCard />
            </div>
          </div>

          {/* Faded teaser row, clipped at the dashboard base (ref: next cards peeking). */}
          <div aria-hidden className="-mb-8 grid grid-cols-3 gap-3 px-3 opacity-45">
            {d.ghostRow.map((label) => (
              <div
                key={label}
                className="h-20 rounded-t-xl border border-b-0 border-white/[0.07] bg-white/[0.02] p-3.5 text-[13px] text-fg/60"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard() {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[12px] text-fg/50">{d.kpi.label}</span>
        <span className="flex items-center gap-0.5">
          {d.kpi.ranges.map((r, i) => (
            <span
              key={r}
              className={`grid h-6 place-items-center rounded-full px-2.5 text-[10px] ${
                i === d.kpi.ranges.length - 1
                  ? "bg-white font-semibold text-ink"
                  : "text-fg/45"
              }`}
            >
              {r}
            </span>
          ))}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="nums text-2xl font-medium text-fg">{d.kpi.value}</span>
        <span className="nums text-[12px] text-emerald-400">{d.kpi.delta}</span>
      </div>
      <AreaChart className="mt-3 h-24 w-full sm:h-32" />
    </div>
  );
}

/** Rising area chart — inline SVG, LTR so "up and to the right" reads as growth. */
function AreaChart({ className = "" }: { className?: string }) {
  const line =
    "M0 112 L36 102 L70 107 L104 92 L142 98 L180 84 L220 90 L258 74 L298 82 L338 63 L378 71 L420 54 L458 61 L500 39 L544 47 L600 20";
  return (
    <svg
      viewBox="0 0 600 140"
      preserveAspectRatio="none"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id="sol-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.14)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      {/* Dotted vertical grid. */}
      {[100, 200, 300, 400, 500].map((x) => (
        <line
          key={x}
          x1={x}
          y1="0"
          x2={x}
          y2="140"
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="2 5"
        />
      ))}
      <path d={`${line} L600 140 L0 140 Z`} fill="url(#sol-area)" />
      <path d={line} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.6" />
    </svg>
  );
}

function ChannelsCard() {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
      <div className="text-[14px] font-medium text-fg">{d.channels.title}</div>
      <div className="mt-3 grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-y-0 text-[11px]">
        {d.channels.cols.map((c) => (
          <span key={c} className="pb-2 text-fg/40">
            {c}
          </span>
        ))}
        {d.channels.rows.map((row) => (
          <RowCells key={row.name} row={row} />
        ))}
      </div>
    </div>
  );
}

function RowCells({ row }: { row: (typeof d.channels.rows)[number] }) {
  const cell = "flex items-center border-t border-white/[0.05] py-2.5";
  return (
    <>
      <span className={`${cell} gap-2 text-fg`}>
        <span aria-hidden className="size-4 rounded-full bg-gradient-to-br from-white/25 to-white/5" />
        {row.name}
      </span>
      <span className={`${cell} nums text-fg/70`}>{row.calls}</span>
      <span className={`${cell} nums text-fg/70`}>{row.conv}</span>
      <span className={`${cell} nums ${row.up ? "text-emerald-400" : "text-red-400/80"}`}>
        {row.delta}
      </span>
    </>
  );
}

function QuickCard() {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
      <div className="text-[14px] font-medium text-fg">{d.quick.title}</div>
      <div className="relative mt-3 flex flex-col gap-1.5">
        {d.quick.rows.map((row) => (
          <div
            key={row.label}
            className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2.5"
          >
            <div className="nums text-lg text-fg">{row.value}</div>
            <div className="mt-0.5 text-[11px] text-fg/45">{row.label}</div>
          </div>
        ))}
        {/* Swap-style badge between the rows (ref: the ⇅ circle). */}
        <span
          aria-hidden
          className="absolute start-1/2 top-1/2 grid size-7 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full border border-white/10 bg-[#14151c] text-fg/70"
        >
          <SwapIcon className="size-3" />
        </span>
      </div>
      <span className="mt-2.5 grid h-9 place-items-center rounded-lg bg-white/[0.06] text-[12px] font-medium text-fg/80">
        {d.quick.cta}
      </span>
    </div>
  );
}

function RepartitionCard() {
  // Donut segments (percent of 100) — monochrome like the reference.
  const segs = [
    { v: 62, color: "rgba(255,255,255,0.8)" },
    { v: 25, color: "rgba(255,255,255,0.35)" },
    { v: 13, color: "rgba(255,255,255,0.12)" },
  ];
  let offset = 0;
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
      <div className="text-[14px] font-medium text-fg">{d.repartition.title}</div>
      <svg viewBox="0 0 120 120" aria-hidden className="mx-auto mt-3 size-32 -rotate-90">
        {segs.map((s, i) => {
          const el = (
            <circle
              key={i}
              cx="60"
              cy="60"
              r="42"
              fill="none"
              stroke={s.color}
              strokeWidth="26"
              pathLength={100}
              strokeDasharray={`${s.v - 1.5} ${100 - s.v + 1.5}`}
              strokeDashoffset={-offset}
            />
          );
          offset += s.v;
          return el;
        })}
      </svg>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {d.repartition.legend.map((label, i) => (
          <span key={label} className="flex items-center gap-1.5 text-[10px] text-fg/50">
            <span aria-hidden className="size-2 rounded-full" style={{ background: segs[i].color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────── Small glyphs ────────────────────────── */

/** Small arrow inside the CTA badge — points to the RTL "forward" (left). */
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-3.5">
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

function SidebarGlyph({ active = false }: { active?: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid size-3.5 shrink-0 grid-cols-2 gap-[2px] ${active ? "opacity-90" : "opacity-40"}`}
    >
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="rounded-[2px] bg-white" />
      ))}
    </span>
  );
}

function BellIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden className={className}>
      <path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.3 20a2 2 0 0 0 3.4 0" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function SwapIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden className={className}>
      <path d="M8 4v13m0 0-3-3m3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 20V7m0 0-3 3m3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
