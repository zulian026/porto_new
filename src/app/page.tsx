"use client";

import Hero from "@/components/section/Hero";
import About from "@/components/section/About";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import {
  Code2,
  Palette,
  Smartphone,
  Database,
  Globe,
  Zap,
  Heart,
  Star,
  Coffee,
  Rocket,
  Terminal,
  Figma,
} from "lucide-react";
import Projects from "@/components/section/Project";

export default function HomePage() {
  // Custom icons untuk skills/teknologi
  const techIcons = [
    <Code2 key="code2" className="w-8 h-8 text-blue-500" />,
    <Terminal key="terminal" className="w-8 h-8 text-green-500" />,
    <Palette key="palette" className="w-8 h-8 text-purple-500" />,
    <Figma key="figma" className="w-8 h-8 text-pink-500" />,
    <Smartphone key="smartphone" className="w-8 h-8 text-indigo-500" />,
    <Database key="database" className="w-8 h-8 text-orange-500" />,
    <Globe key="globe" className="w-8 h-8 text-cyan-500" />,
    <Zap key="zap" className="w-8 h-8 text-yellow-500" />,
  ];

  // Atau icons untuk passion/hobi
  const passionIcons = [
    <Heart key="heart" className="w-8 h-8 text-red-500" />,
    <Star key="star" className="w-8 h-8 text-yellow-400" />,
    <Coffee key="coffee" className="w-8 h-8 text-amber-600" />,
    <Rocket key="rocket" className="w-8 h-8 text-blue-600" />,
  ];

  return (
    <>
      <Hero />

      {/* Tech Skills Section */}
      <VelocityScroll icons={techIcons} defaultVelocity={3} className="my-16" />

      <About />
    <Projects/>
      {/* <Projects />
       <Skills />
       <Contact />  */}
    </>
  );
}
