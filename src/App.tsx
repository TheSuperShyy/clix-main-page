import { useLenis } from "./hooks/useLenis";
import { Navbar } from "./components/Navbar";
import { SceneBackdrop } from "./components/SceneBackdrop";
import { Hero } from "./components/Hero";
import { Solutions } from "./components/Solutions";
import { Partners } from "./components/Partners";
import { Features } from "./components/Features";
import { KeyFeatures } from "./components/KeyFeatures";
import { Services } from "./components/Services";
import { Benefits } from "./components/Benefits";
import { Testimonials } from "./components/Testimonials";
import { Training } from "./components/Training";
import { Closing } from "./components/Closing";

// Flow (AI Finance clone, built section by section): Hero → Solutions →
// Partners → Features → Key Features → Services → Benefits → Testimonials →
// Pricing → Closing (CTA + footer). That's the full reference order — done.
// The old on.energy sections below were removed from the page while the clone
// proceeds down the reference. Parked on disk (re-add to revive): Integrations,
// ZoomReveal, VoiceAI, ManagedAI, Stack, WebMobile,
// Work, Methodology, Training, CTA, Footer. (Services + Testimonials were
// rebuilt for the clone — the old versions are gone; CTA + Footer were
// superseded by Closing but still park on disk.)
export default function App() {
  useLenis();

  return (
    // Continuous full-bleed page — the floating-card gutters were removed so
    // sections flow directly into one another as one surface (on.energy style).
    <div className="bg-ink">
      {/* Fixed WebGL scene under the whole page — sections with a solid bg
          cover it; Hero / Solutions / Partners / Benefits / Closing let it
          show (ref behavior). */}
      <SceneBackdrop />
      <Navbar />
      <main className="relative z-10">
        {/* Solutions + Partners float INSIDE the hero's scene region — the
            glass panels ride over the sticky scrubbed scene, with beats of
            pure visible scene between them (ref: the video shows in the gaps). */}
        <Hero>
          <Solutions />
          <div aria-hidden className="h-[16vh] sm:h-[20vh]" />
          <Partners />
        </Hero>
        {/* First solid section after the scene region — ends the see-through
            stretch with its own dark band (ref: FEATURES). */}
        <Features />
        {/* Numbered 01–03 deep-dive rows (ref: Key Features). */}
        <KeyFeatures />
        {/* Sticky header + scrolling glass service cards (ref: SERVICES). */}
        <Services />
        {/* Sticky header + stat cards, first inverted white (ref: BENEFITS). */}
        <Benefits />
        {/* Centered header + 3 quote columns (ref: TESTIMONIALS). */}
        <Testimonials />
        {/* Lectures & workshops — copy block + autoplaying stage clip. This
            REPLACED the placeholder Pricing band (client call); Pricing.tsx
            stays parked on disk — re-import to restore. */}
        <Training />
        {/* Full-viewport closing CTA + footer, id="contact" (ref: last band). */}
        <Closing />
      </main>
    </div>
  );
}
