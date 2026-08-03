import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Statement from "./components/Statement.jsx";
import Projects from "./components/Projects.jsx";
import Experience from "./components/Experience.jsx";
import Skills from "./components/Skills.jsx";
import GitHubSection from "./components/GitHubSection.jsx";
import Education from "./components/Education.jsx";
import FAQ from "./components/FAQ.jsx";
import Footer from "./components/Footer.jsx";
import { useScrollRefresh } from "./lib/scroll.js";

export default function App() {
  useScrollRefresh();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Experience />
        <Projects />
        <Skills />
        <GitHubSection />
        <Education />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
