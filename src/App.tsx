import { useLenis } from "./hooks/useLenis";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Integrations } from "./components/Integrations";
import { ZoomReveal } from "./components/ZoomReveal";

// Flow: Hero → Integrations (tools, clean white) → ZoomReveal.
// Parked on disk (re-add to revive): ManagedAI, VoiceAI, Stack, Services,
// Testimonials, WebMobile, Work, Methodology, Training, CTA, Footer.
export default function App() {
  useLenis();

  return (
    // Consistent page backdrop — every section is a rounded card floating on this
    // refined dark gutter (see each section's `bg-ink p-2 sm:p-2.5` frame).
    <div className="bg-ink">
      <Navbar />
      <main>
        <Hero />
        <Integrations />
        <ZoomReveal />
      </main>
    </div>
  );
}
