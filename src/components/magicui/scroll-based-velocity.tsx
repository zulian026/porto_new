"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { 
  Code, 
  Palette, 
  Smartphone, 
  Database, 
  Globe, 
  Zap,
  Heart,
  Star,
  Coffee,
  Rocket
} from "lucide-react";

import { cn } from "@/lib/utils";

interface VelocityScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultVelocity?: number;
  className?: string;
  numRows?: number;
  icons?: React.ReactNode[];
}

interface ParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  baseVelocity: number;
}

export const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function ParallaxText({
  children,
  baseVelocity = 100,
  ...props
}: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 500,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const [repetitions, setRepetitions] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateRepetitions = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = textRef.current.offsetWidth;
        const newRepetitions = Math.ceil(containerWidth / textWidth) + 2;
        setRepetitions(newRepetitions);
      }
    };

    calculateRepetitions();

    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [children]);

  const x = useTransform(baseX, (v) => `${wrap(-100 / repetitions, 0, v)}%`);

  const directionFactor = React.useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000) * 0.3;

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get() * 0.5;

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden whitespace-nowrap relative"
      {...props}
    >
      {/* Left shadow gradient */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black via-black/50 to-transparent dark:from-black dark:via-black/50 z-10 pointer-events-none" />
      
      {/* Right shadow gradient */}
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black via-black/50 to-transparent dark:from-black dark:via-black/50 z-10 pointer-events-none" />
      
      <motion.div className="inline-flex items-center gap-6" style={{ x }}>
        {Array.from({ length: repetitions }).map((_, i) => (
          <div key={i} ref={i === 0 ? textRef : null} className="inline-flex items-center gap-6">
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function VelocityScroll({
  defaultVelocity = 5,
  numRows = 1,
  className,
  icons,
  ...props
}: VelocityScrollProps) {
  // Default icons jika tidak disediakan
  const defaultIcons = [
    <Code key="code" className="w-8 h-8" />,
    <Palette key="palette" className="w-8 h-8" />,
    <Smartphone key="smartphone" className="w-8 h-8" />,
    <Database key="database" className="w-8 h-8" />,
    <Globe key="globe" className="w-8 h-8" />,
    <Zap key="zap" className="w-8 h-8" />,
    <Heart key="heart" className="w-8 h-8" />,
    <Star key="star" className="w-8 h-8" />,
    <Coffee key="coffee" className="w-8 h-8" />,
    <Rocket key="rocket" className="w-8 h-8" />
  ];

  const iconElements = icons || defaultIcons;

  const iconContent = iconElements.map((icon, index) => (
    <div
      key={index}
      className="flex items-center justify-center p-4 border-2 border-gray-300/30 dark:border-gray-600/30 rounded-xl bg-white/5 dark:bg-black/5 backdrop-blur-sm hover:border-blue-500/50 opacity-60 hover:opacity-80 transition-all duration-300"
    >
      {icon}
    </div>
  ));

  return (
    <div
      className={cn(
        "relative w-full py-8",
        className,
      )}
      {...props}
    >
      {Array.from({ length: numRows }).map((_, i) => (
        <ParallaxText
          key={i}
          baseVelocity={defaultVelocity * (i % 2 === 0 ? 1 : -1)}
        >
          {iconContent}
        </ParallaxText>
      ))}
    </div>
  );
}