import { useLenis } from "./hooks/useLenis";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Work } from "./components/Work";
import { Services } from "./components/Services";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function App() {
  useLenis();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Work />
        <Services />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
