// components/SmoothScrollProvider.tsx
"use client";

import { ReactNode } from "react";
import { useLenis } from "@/hooks/useLenis";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export const SmoothScrollProvider = ({
  children,
}: SmoothScrollProviderProps) => {
  useLenis();

  return <>{children}</>;
};
