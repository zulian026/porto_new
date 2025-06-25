"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [activeSection, setActiveSection] = useState("");

  const navItems = [
    { name: "Home", href: "#hero", section: "hero" },
    { name: "About", href: "#about", section: "about" },
    { name: "Projects", href: "#projects", section: "projects" },
    { name: "Skills", href: "#skills", section: "skills" },
    { name: "Contact", href: "#contact", section: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) =>
        document.getElementById(item.section)
      );
      const scrollPosition = window.scrollY + 200; // Offset untuk trigger lebih awal

      // Cari section yang sedang aktif
      let currentSection = "";
      sections.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;

          if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
          ) {
            currentSection = navItems[index].section;
          }
        }
      });

      // Jika berada di paling atas, set sebagai hero
      if (window.scrollY < 100) {
        currentSection = "hero";
      }

      setActiveSection(currentSection);
    };

    // Set initial active section
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, href, section) => {
    e.preventDefault();
    const element = document.getElementById(section);
    if (element) {
      const headerHeight = 80; // Tinggi header untuk offset diperkecil
      const elementPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 ">
      <nav className="flex items-center justify-between rounded-full px-3 py-1.5">
        {/* Logo - Updated colors */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero", "hero")}
          className="flex items-center space-x-2 text-white font-medium text-base hover:scale-105 transition-transform duration-300 hover:text-cyan-400"
        >
          <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-black font-bold text-xs">P</span>
          </div>
          <span>Portfolio</span>
        </a>

        {/* Navigation Menu - Updated colors */}
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-4 py-2 space-x-1 text-xs text-white shadow-xl">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href, item.section)}
              className={`px-3 py-1 rounded-full font-medium transition-all duration-300 relative overflow-hidden group ${
                activeSection === item.section
                  ? "bg-white/10 text-cyan-400 border border-white/20"
                  : "hover:bg-white/10 text-gray-400 hover:text-cyan-400"
              }`}
            >
              {/* Hover effect background */}
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

              {/* Text content */}
              <span className="relative z-10">
                {activeSection === item.section ? "• " : ""}
                {item.name}
              </span>
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle - Updated colors */}
        <div className="md:hidden">
          <button className="text-gray-400 hover:text-cyan-400 p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* CTA Button - Updated colors */}
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, "#contact", "contact")}
          className="hidden sm:inline-flex items-center bg-cyan-500 hover:bg-pink-500 text-black font-medium px-4 py-1.5 rounded-full hover:scale-105 transition-all duration-300 text-xs shadow-lg hover:shadow-cyan-500/25 group"
        >
          <span className="relative z-10">Let's Talk</span>
          <svg
            className="ml-1.5 w-3 h-3 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      </nav>
    </header>
  );
}