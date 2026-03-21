'use client';

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
}

// Import your modular sections
import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import About from "./components/about";
import Skills from "./components/skills";
import Projects from "./components/projects";
import Contact from "./components/contact";
import Footer from "./components/footer";
import Preloader from "./components/preloader";

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);

  // Global Custom Cursor Logic


  return (
    <main className="relative min-h-screen bg-[#060608] text-[#F5F0E8] selection:bg-[#00E5FF]/30 overflow-x-hidden font-sans">

      {/* ELITE GLOBAL CUSTOM CURSOR */}
      {/* It sits on top of everything (z-[9999]) and uses mix-blend-difference for that premium inverted look */}

      <Preloader />

      {/* PORTFOLIO ARCHITECTURE */}
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />

    </main>
  );
}