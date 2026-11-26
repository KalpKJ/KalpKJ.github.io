import { Hero } from "./components/Hero";
import { AboutMe } from "./components/AboutMe";
import { ProjectsIndex } from "./components/ProjectsIndex";
import { Experience } from "./components/Experience";
import { InterestsSection } from "./components/InterestsSection";
import { Contact } from "./components/Contact";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <AboutMe />
        <ProjectsIndex />
        <Experience />
        <InterestsSection />
      </main>
      <Contact />
    </>
  );
}
