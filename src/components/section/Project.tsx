// components/ProjectsSection.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types/project";
import { ExternalLink, Github, Star } from "lucide-react";

// Conditional GSAP imports
let gsap: any = null;
let ScrollTrigger: any = null;

// Dynamically import GSAP to avoid SSR issues
const initializeGSAP = async () => {
  if (typeof window !== "undefined" && !gsap) {
    try {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");

      gsap = gsapModule.gsap;
      ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);
    } catch (error) {
      console.warn("GSAP not available:", error);
    }
  }
};

// ScrollReveal fallback component
const ScrollRevealFallback = ({
  children,
  textClassName,
}: {
  children: React.ReactNode;
  textClassName: string;
}) => <div className={textClassName}>{children}</div>;

// Try to import ScrollReveal, fallback if not available
let ScrollReveal: any = ScrollRevealFallback;
try {
  ScrollReveal = require("../ScrollReveal").default;
} catch {
  // Use fallback
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "featured">("all");

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const floatingRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    fetchProjects();
    initializeGSAP();
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !gsap || !ScrollTrigger) return;

    const ctx = gsap.context(() => {
      // Check if elements exist before setting up animations
      const headerElement = headerRef.current;
      const filtersElement = filtersRef.current;
      const floatingElements = floatingRefs.current.filter((el) => el !== null);

      if (headerElement || filtersElement) {
        // Initial setup - hide elements
        const elementsToHide = [headerElement, filtersElement].filter(Boolean);
        if (elementsToHide.length > 0) {
          gsap.set(elementsToHide, {
            opacity: 0,
            y: 30,
          });
        }
      }

      if (floatingElements.length > 0) {
        gsap.set(floatingElements, {
          opacity: 0,
          scale: 0,
        });
      }

      // Scroll-triggered animations
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          // Animate header
          if (headerElement) {
            gsap.to(headerElement, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          }

          // Animate filters
          if (filtersElement) {
            gsap.to(filtersElement, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.2,
              ease: "power3.out",
            });
          }

          // Animate floating elements
          floatingElements.forEach((el, index) => {
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
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [loading, gsap, ScrollTrigger]); // Add gsap and ScrollTrigger as dependencies

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    filter === "all" ? true : project.featured
  );

  const addToFloatingRefs = (el: HTMLDivElement | null) => {
    if (el && !floatingRefs.current.includes(el)) {
      floatingRefs.current.push(el);
    }
  };

  // Clean up floating refs when component unmounts
  useEffect(() => {
    return () => {
      floatingRefs.current = [];
    };
  }, []);

  if (loading) {
    return (
      <section className="relative py-20 px-6 md:px-16 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-pink-400/50 mx-auto"></div>
            </div>
            <p className="mt-6 text-gray-400 font-light">
              Loading amazing projects...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-20 px-6 md:px-16 text-white overflow-hidden"
    >
      {/* Floating decorative elements */}
      <div
        ref={addToFloatingRefs}
        className="absolute top-20 left-10 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-40"
      ></div>
      <div
        ref={addToFloatingRefs}
        className="absolute top-40 right-16 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-50"
      ></div>
      <div
        ref={addToFloatingRefs}
        className="absolute bottom-40 left-20 w-3 h-3 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full opacity-60"
      ></div>
      <div
        ref={addToFloatingRefs}
        className="absolute bottom-20 right-10 w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-45"
      ></div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-white drop-shadow-2xl">
            My
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-cyan-500 ml-3">
              Projects
            </span>
          </h2>
          <div className="max-w-3xl mx-auto">
            Here are some of the projects I've worked on. Each project
            represents a unique challenge and learning experience in creating
            meaningful digital solutions.
          </div>
        </div>

        {/* Filter Buttons */}
        <div ref={filtersRef} className="flex justify-center mb-12">
          <div className="relative">
            {/* Background glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 via-pink-400/20 to-purple-400/20 rounded-2xl blur-xl"></div>

            <div className="relative bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-1">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filter === "all"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                All Projects ({projects.length})
              </button>
              <button
                onClick={() => setFilter("featured")}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filter === "featured"
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Featured ({projects.filter((p) => p.featured).length})
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <p className="text-gray-400 text-lg font-light">
                  {filter === "featured"
                    ? "No featured projects yet."
                    : "No projects available."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !gsap || !ScrollTrigger) return;

    const ctx = gsap.context(() => {
      const cardElement = cardRef.current;

      if (!cardElement) return;

      // Initial setup
      gsap.set(cardElement, {
        opacity: 0,
        y: 50,
        scale: 0.9,
      });

      // Scroll-triggered animation
      ScrollTrigger.create({
        trigger: cardElement,
        start: "top 85%",
        onEnter: () => {
          gsap.to(cardElement, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power3.out",
          });
        },
      });
    }, cardRef);

    return () => {
      ctx.revert();
    };
  }, [index, gsap, ScrollTrigger]); // Add gsap and ScrollTrigger as dependencies

  return (
    <div ref={cardRef} className="group relative">
      {/* Background glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 via-pink-400/20 to-purple-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 group-hover:transform group-hover:scale-[1.02]">
        {/* Project Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
          {project.image_url && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border border-pink-400/50"></div>
                  </div>
                </div>
              )}
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-white">
                    {project.title.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-gray-400 font-light">
                  No Image
                </span>
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1.5 rounded-full flex items-center text-xs font-bold shadow-lg">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </div>
            </div>
          )}
        </div>

        {/* Project Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-pink-400 transition-all duration-300">
            {project.title}
          </h3>

          <p className="text-gray-400 mb-4 line-clamp-3 font-light leading-relaxed">
            {project.description || "No description available."}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/30 backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-3 py-1 bg-white/10 text-gray-300 text-xs font-medium rounded-full border border-white/20">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {project.demo_url && (
              <Link
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-cyan-500/25 hover:transform hover:scale-105"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </Link>
            )}

            {project.github_url && (
              <Link
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  project.demo_url ? "flex-none" : "flex-1"
                } bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-gray-500/25 hover:transform hover:scale-105 border border-gray-600/50`}
              >
                <Github className="w-4 h-4 mr-2" />
                {project.demo_url ? "" : "View Code"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
