import { features } from "../data/content";

/**
 * Features — clone of the reference's FEATURES section: a solid dark band
 * (the first non-floating section after the hero's scene region) with a
 * centered eyebrow → big statement headline → short subcopy header, then a
 * row of three glass cards, each holding a rendered globe image above a
 * title + one-line description.
 *
 * Ref card spec (clone CSS): `#ffffff0f` fill · 8px radius · 20px padding ·
 * 24px gap · image 400px tall (200px mobile), 8px radius, object-cover ·
 * 24px title / 16px desc, 8px apart. Grid gap 24px.
 *
 * The globe art is a PROCEDURAL placeholder (layered CSS gradients in the
 * hero scene's navy/sky-rim language — no reference assets); swap each
 * <FeatureArt> for a real render/webp later. Static section — no scroll
 * reveal, matching Solutions/Partners.
 */

/** Placeholder card art — a rim-lit sphere composed from CSS gradients.
    Three framings so the row doesn't repeat: a horizon globe rising from the
    bottom, a floating centered orb, and an oversized close-up. */
function FeatureArt({ variant }: { variant: "horizon" | "orb" | "closeup" }) {
  // Shared paint: dark navy body + sky rim (same hues as the hero canvas).
  const body =
    "radial-gradient(circle at 38% 30%, #0d1846 0%, #060d28 55%, #03071c 100%)";
  const sphere = (rim: string) => ({
    backgroundImage: `${rim}, ${body}`,
  });

  return (
    <div
      aria-hidden
      className="relative h-[220px] w-full overflow-hidden rounded-[8px] bg-[#04081f] sm:h-[400px]"
    >
      {/* Ambient indigo wash behind the sphere. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 90% at 50% 110%, rgba(30,42,110,0.5), transparent 65%)",
        }}
      />

      {variant === "horizon" && (
        <>
          {/* Globe cresting the bottom edge, lit along its top arc. */}
          <div
            className="absolute start-1/2 top-[52%] aspect-square w-[135%] -translate-x-1/2 rounded-full rtl:translate-x-1/2"
            style={sphere(
              "radial-gradient(90% 45% at 50% -6%, rgba(150,205,240,0.55), rgba(110,170,225,0.12) 45%, transparent 70%)",
            )}
          />
          {/* Faint orbital arc above the horizon. */}
          <div className="absolute start-1/2 top-[38%] aspect-square w-[160%] -translate-x-1/2 rounded-full border border-sky/15 rtl:translate-x-1/2" />
        </>
      )}

      {variant === "orb" && (
        <>
          {/* Centered glass orb, rim light on the lower crescent. */}
          <div
            className="absolute start-1/2 top-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full rtl:translate-x-1/2 sm:w-[58%]"
            style={sphere(
              "radial-gradient(75% 75% at 62% 92%, rgba(150,205,240,0.5), rgba(110,170,225,0.1) 48%, transparent 72%)",
            )}
          />
          {/* Halo ring around the orb. */}
          <div className="absolute start-1/2 top-1/2 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky/12 rtl:translate-x-1/2 sm:w-[76%]" />
          <span className="absolute start-[22%] top-[26%] size-1 rounded-full bg-sky/60" />
          <span className="absolute end-[18%] bottom-[30%] size-1.5 rounded-full bg-mint/40" />
        </>
      )}

      {variant === "closeup" && (
        <>
          {/* Oversized sphere pushing in from the top corner (camera close-up). */}
          <div
            className="absolute -top-[42%] start-[18%] aspect-square w-[150%] rounded-full"
            style={sphere(
              "radial-gradient(60% 60% at 28% 96%, rgba(150,205,240,0.55), rgba(110,170,225,0.12) 46%, transparent 70%)",
            )}
          />
          {/* Latitude rings hinting at the reference's ridged close-up ball. */}
          <div className="absolute -top-[52%] start-[13%] aspect-square w-[160%] rounded-full border border-sky/12" />
          <div className="absolute -top-[62%] start-[8%] aspect-square w-[170%] rounded-full border border-sky/[0.07]" />
        </>
      )}

      {/* Corner vignette so every framing sinks into the card. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 40%, transparent 45%, rgba(2,4,14,0.55) 100%)",
        }}
      />
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative bg-[#03021b] py-24 sm:py-32">
      <div className="container-x">
        {/* Centered header (ref: eyebrow → statement headline → light subcopy). */}
        <p className="eyebrow text-center text-fg/80">{features.eyebrow}</p>

        <h2
          aria-label={features.title}
          className="mx-auto mt-8 max-w-3xl text-center font-medium leading-[1.12] tracking-[-0.03em] text-fg text-[clamp(2rem,3.6vw,3.5rem)] sm:mt-10"
        >
          {features.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-center font-light leading-snug tracking-[-0.02em] text-fg/85 text-[clamp(1.05rem,1.4vw,1.25rem)]">
          {features.subcopy}
        </p>

        {/* Three glass cards — image → title → one-liner (ref spec). */}
        <div className="mt-12 grid gap-5 sm:mt-16 sm:gap-6 md:grid-cols-3">
          {features.items.map((item) => (
            <article
              key={item.title}
              className="flex flex-col gap-6 rounded-[8px] bg-white/[0.06] p-5"
            >
              <FeatureArt variant={item.art} />
              <div className="flex flex-col gap-2 pb-1">
                <h3 className="text-[1.4rem] text-fg">{item.title}</h3>
                <p className="text-[16px] text-fg/70">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
