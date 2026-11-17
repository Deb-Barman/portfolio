import About from "@/components/sections/About";
import Ambient from "@/components/Ambient";
import Career from "@/components/sections/Career";
import Contact from "@/components/sections/Contact";
import Cursor from "@/components/Cursor";
import Hero from "@/components/sections/Hero";
import Loader from "@/components/Loader";
import Manifesto from "@/components/sections/Manifesto";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Skills from "@/components/sections/Skills";
import SmoothScroll from "@/components/SmoothScroll";
import SocialDock from "@/components/SocialDock";
import WhatIDo from "@/components/sections/WhatIDo";
import Work from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Loader />
      <SmoothScroll />
      <Ambient />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <SocialDock />
      <main id="main" className="page">
        <Hero />
        <About />
        <Manifesto />
        <WhatIDo />
        <Career />
        <Work />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
