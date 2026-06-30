import { useLenis } from "./hooks/useLenis";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ValueProp } from "./components/ValueProp";

// Work / Services / CTA / Footer are parked (still on disk) while the page is
// rebuilt section-by-section to the on.energy reference. Re-add here to revive.
export default function App() {
  useLenis();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ValueProp />
      </main>
    </>
  );
}
