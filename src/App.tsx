import { useLenis } from "./hooks/useLenis";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Integrations } from "./components/Integrations";
import { ZoomReveal } from "./components/ZoomReveal";
import { Services } from "./components/Services";
import { VoiceAI } from "./components/VoiceAI";

// Flow: Hero → Integrations (tools, white) → ZoomReveal → Services (white) →
// VoiceAI (scroll-scrub "voice waveform assembles" reveal — expands service 01).
// Parked on disk (re-add to revive): ManagedAI, Stack, Testimonials,
// WebMobile, Work, Methodology, Training, CTA, Footer.
export default function App() {
  useLenis();

  return (
    // Continuous full-bleed page — the floating-card gutters were removed so
    // sections flow directly into one another as one surface (on.energy style).
    <div className="bg-ink">
      <Navbar />
      <main>
        <Hero />
        <Integrations />
        <ZoomReveal />
        <Services />
        <VoiceAI />
      </main>
    </div>
  );
}
