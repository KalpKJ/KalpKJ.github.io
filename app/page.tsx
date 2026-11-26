import { Hero } from "./components/Hero";
import { AboutMe } from "./components/AboutMe";
import { ProjectsIndex } from "./components/ProjectsIndex";
import { InterestsSection } from "./components/InterestsSection";
import { Contact } from "./components/Contact";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <AboutMe />
        <ProjectsIndex />
        <InterestsSection />
      </main>
      <Contact />
    </>
  );
}
