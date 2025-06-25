"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const floatingRefs = useRef<HTMLDivElement[]>([]);
  const socialRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide elements
      const elementsToAnimate = [
        badgeRef.current,
        titleRef.current,
        subtitleRef.current,
        socialRef.current,
        scrollIndicatorRef.current,
      ].filter(Boolean); // Remove null/undefined elements

      gsap.set(elementsToAnimate, {
        opacity: 0,
        y: 50,
      });

      gsap.set(floatingRefs.current.filter(Boolean), {
        opacity: 0,
        scale: 0,
      });

      // Create timeline for initial animations
      const tl = gsap.timeline({ delay: 0.3 });

      // Badge animation
      if (badgeRef.current) {
        tl.to(badgeRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        });
      }

      // Title animation with split effect
      if (titleRef.current) {
        tl.to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.4"
        );
      }

      // Subtitle animation
      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        );
      }

      // Social links animation
      if (socialRef.current) {
        tl.to(
          socialRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        );
      }

      // Scroll indicator animation
      if (scrollIndicatorRef.current) {
        tl.to(
          scrollIndicatorRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3"
        );
      }

      // Floating elements animation
      floatingRefs.current.forEach((el, index) => {
        if (el) {
          gsap.to(el, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.8 + index * 0.1,
            ease: "back.out(1.7)",
          });

          // Continuous floating animation
          gsap.to(el, {
            y: -20,
            duration: 2 + index * 0.3,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.2,
          });

          // Rotation animation
          gsap.to(el, {
            rotation: 360,
            duration: 8 + index * 2,
            ease: "none",
            repeat: -1,
          });
        }
      });

      // Parallax effect for hero content
      if (heroRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            // Content parallax
            if (contentRef.current) {
              gsap.to(contentRef.current, {
                y: progress * 100,
                opacity: 1 - progress * 0.8,
                duration: 0.3,
                overwrite: true,
              });
            }

            // Floating elements parallax
            floatingRefs.current.forEach((el, index) => {
              if (el) {
                gsap.to(el, {
                  y: progress * (50 + index * 20),
                  opacity: 1 - progress,
                  duration: 0.3,
                  overwrite: "auto",
                });
              }
            });
          },
        });
      }

      // Social links hover animations
      const socialLinks = socialRef.current?.querySelectorAll("a");
      const cleanupFunctions: (() => void)[] = [];

      socialLinks?.forEach((link) => {
        const handleMouseEnter = () => {
          gsap.to(link, {
            scale: 1.1,
            rotate: 5,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(link, {
            scale: 1,
            rotate: 0,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        };

        link.addEventListener("mouseenter", handleMouseEnter);
        link.addEventListener("mouseleave", handleMouseLeave);

        cleanupFunctions.push(() => {
          link.removeEventListener("mouseenter", handleMouseEnter);
          link.removeEventListener("mouseleave", handleMouseLeave);
        });
      });

      // Enhanced scroll indicator animation
      const scrollDot =
        scrollIndicatorRef.current?.querySelector(".scroll-dot");
      if (scrollDot) {
        gsap.to(scrollDot, {
          y: 15,
          duration: 1.5,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // Text reveal animation for title
      const titleText = titleRef.current?.querySelector(".gradient-text");
      if (titleText) {
        gsap.fromTo(
          titleText,
          {
            backgroundPosition: "200% center",
          },
          {
            backgroundPosition: "0% center",
            duration: 2,
            ease: "power2.out",
            delay: 1,
          }
        );
      }

      // Return cleanup function for social links
      return () => {
        cleanupFunctions.forEach((cleanup) => cleanup());
      };
    });

    // Cleanup function
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const addToFloatingRefs = (el: HTMLDivElement | null) => {
    if (el && !floatingRefs.current.includes(el)) {
      floatingRefs.current.push(el);
    }
  };

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/zulian-alhisyam",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/zulian-alhisyam",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      url: "https://twitter.com/zulian_alhisyam",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "https://instagram.com/zulian.alhisyam",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen text-white overflow-hidden flex items-center justify-center px-6 md:px-16 pt-24 pb-12"
    >
      {/* Enhanced Floating Elements - Updated colors */}
      <div
        ref={addToFloatingRefs}
        className="absolute top-20 left-20 w-3 h-3 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full shadow-lg blur-[0.5px]"
      />
      <div
        ref={addToFloatingRefs}
        className="absolute top-40 right-32 w-2 h-2 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full shadow-lg blur-[0.3px]"
      />
      <div
        ref={addToFloatingRefs}
        className="absolute bottom-32 left-16 w-2.5 h-2.5 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full shadow-lg blur-[0.4px]"
      />
      <div
        ref={addToFloatingRefs}
        className="absolute top-1/2 right-20 w-1.5 h-1.5 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-full shadow-lg blur-[0.2px]"
      />
      <div
        ref={addToFloatingRefs}
        className="absolute bottom-20 right-1/4 w-2 h-2 bg-gradient-to-r from-pink-300 to-pink-400 rounded-full shadow-lg blur-[0.3px]"
      />

      {/* Main Content - Centered */}
      <div
        ref={contentRef}
        className="z-10 max-w-5xl text-center space-y-8 text-base md:text-lg"
      >
        {/* Badge - Updated colors */}
        <div ref={badgeRef} className="mb-6">
          <span className="inline-flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-sm text-gray-400 font-medium shadow-lg">
            <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse shadow-sm"></span>
            Available for work
          </span>
        </div>

        {/* Main Heading - Updated colors */}
        <div className="space-y-6">
          <h1
            ref={titleRef}
            className="text-4xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-2xl"
          >
            Crafting Digital
            <span
              className="gradient-text text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-cyan-500 block"
              style={{
                backgroundSize: "200% 100%",
                backgroundPosition: "200% center",
              }}
            >
              Experiences
            </span>
          </h1>
        </div>

        {/* Subtitle - Updated colors */}
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-4xl mx-auto font-light"
        >
          Hi, I'm{" "}
          <span className="text-cyan-400 font-semibold">Zulian Alhisyam</span> —
          a passionate full-stack developer who transforms innovative ideas into
          elegant, functional digital solutions. I specialize in modern web
          technologies and love creating seamless user experiences that make a
          difference.
        </p>

        {/* Social Media Links - Updated colors */}
        <div ref={socialRef} className="flex justify-center space-x-6 pt-1">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg"
              aria-label={social.name}
            >
              <div className="text-gray-400 group-hover:text-cyan-400 transition-colors duration-300">
                {social.icon}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
