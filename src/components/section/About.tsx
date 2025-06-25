"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "../ScrollReveal";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const floatingRefs = useRef<HTMLDivElement[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);

  // State untuk menyimpan dimensi gambar
  const [imageDimensions, setImageDimensions] = useState({
    width: 320,
    height: 320,
    aspectRatio: 1,
  });

  // Fungsi untuk menangani load gambar dan mendapatkan dimensi asli
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    const aspectRatio = naturalWidth / naturalHeight;

    // Tentukan ukuran maksimum yang diinginkan
    const maxSize = 400;
    let displayWidth, displayHeight;

    if (naturalWidth > naturalHeight) {
      // Landscape
      displayWidth = Math.min(naturalWidth, maxSize);
      displayHeight = displayWidth / aspectRatio;
    } else {
      // Portrait atau square
      displayHeight = Math.min(naturalHeight, maxSize);
      displayWidth = displayHeight * aspectRatio;
    }

    setImageDimensions({
      width: displayWidth,
      height: displayHeight,
      aspectRatio,
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide elements
      gsap.set([headerRef.current, quoteRef.current], {
        opacity: 0,
        y: 30,
      });

      gsap.set(floatingRefs.current, {
        opacity: 0,
        scale: 0,
      });

      // Scroll-triggered animations
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          // Animate header
          gsap.to(headerRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          });

          // Animate quote section
          gsap.to(quoteRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power3.out",
          });

          // Animate floating elements
          floatingRefs.current.forEach((el, index) => {
            if (el) {
              gsap.to(el, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                delay: 0.4 + index * 0.1,
                ease: "back.out(1.7)",
              });

              // Continuous floating animation
              gsap.to(el, {
                y: -15,
                duration: 2.5 + index * 0.4,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
                delay: index * 0.3,
              });

              // Rotation animation
              gsap.to(el, {
                rotation: 360,
                duration: 10 + index * 2,
                ease: "none",
                repeat: -1,
              });
            }
          });
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  const addToFloatingRefs = (el: HTMLDivElement | null) => {
    if (el && !floatingRefs.current.includes(el)) {
      floatingRefs.current.push(el);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-6 md:px-16 text-white overflow-hidden"
      id="about"
    >
      <div className="max-w-7xl mx-auto">
        {/* About Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-white drop-shadow-2xl">
            ABout
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-cyan-500 ml-3">
              Me
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto font-light">
            Get to know more about my journey in creating meaningful digital
            solutions
          </p>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <div ref={quoteRef} className="relative order-2 lg:order-1">
            {/* Quote decoration */}
            <div className="absolute -top-4 -left-4 text-6xl font-serif leading-none text-cyan-400/30">
              "
            </div>

            <div className="relative z-10">
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={5}
                blurStrength={10}
                textClassName="text-white text-lg md:text-xl leading-relaxed"
              >
                I am a developer dedicated to creating digital experiences that
                are not only functional, but also meaningful. With experience in
                modern web technologies, I always strive to deliver innovative
                and user-friendly solutions. My passion lies in the small
                details that make a big difference in every project.
              </ScrollReveal>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-gray-400 font-medium text-base">
                  <span className="text-cyan-400">Full Stack Developer</span> •
                  Padang, Sumatera Barat
                </p>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 text-6xl font-serif leading-none rotate-180 text-pink-400/30">
              "
            </div>
          </div>

          {/* Right Side - Photo Section */}
          <div className="relative order-1 lg:order-2 flex justify-center items-center min-h-[400px]">
            {/* Floating decorative elements around photo */}
            <div
              ref={addToFloatingRefs}
              className="absolute top-10 left-10 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-40"
            ></div>
            <div
              ref={addToFloatingRefs}
              className="absolute top-20 right-16 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-50"
            ></div>
            <div
              ref={addToFloatingRefs}
              className="absolute bottom-20 left-20 w-3 h-3 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full opacity-60"
            ></div>
            <div
              ref={addToFloatingRefs}
              className="absolute bottom-10 right-10 w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-45"
            ></div>

            {/* Main Photo Container */}
            <div className="relative">
              {/* Background glow effects */}
              <div className="absolute -inset-8 bg-gradient-to-r from-cyan-400/20 via-pink-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/30 to-pink-400/30 rounded-full blur-xl"></div>

              {/* Photo container with dynamic sizing */}
              <div
                className="relative group"
                style={{
                  width: imageDimensions.width,
                  height: imageDimensions.height,
                }}
              >
                {/* Animated border */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-1 bg-gradient-to-r from-gray-900 to-black rounded-3xl"></div>

                {/* Photo container */}
                <div className="absolute inset-2 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  {/* Ganti path gambar di sini */}
                  <img
                    ref={imageRef}
                    src="zulian.jpg" // <-- GANTI DENGAN PATH GAMBAR ANDA
                    alt="Profile Photo"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onLoad={handleImageLoad}
                    onError={(e) => {
                      // Fallback jika gambar tidak ditemukan
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove(
                        "hidden"
                      );
                    }}
                  />

                  {/* Fallback placeholder (hidden by default) */}
                  <div className="hidden text-center text-gray-400">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Image not found</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Check your image path
                    </p>
                  </div>
                </div>

                {/* Hover overlay effect */}
                <div className="absolute inset-2 rounded-3xl bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Optional: Small floating tech icons around photo */}
              <div
                ref={addToFloatingRefs}
                className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white text-xs font-bold opacity-80"
              >
                JS
              </div>
              <div
                ref={addToFloatingRefs}
                className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-center text-white text-xs font-bold opacity-80"
              >
                ⚛️
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
