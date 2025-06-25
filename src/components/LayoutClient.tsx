"use client";

import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";

import Header from "./layout/Header";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Meteors } from "./magicui/meteors";

const inter = Inter({ subsets: ["latin"] });

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Cek jika sedang di halaman admin login
  const isAdminLogin = pathname.startsWith("/admin");

  return (
    <body
      className={`${inter.className} relative overflow-x-hidden ${
        isAdminLogin ? "bg-gray-50 text-black" : "bg-black text-white"
      }`}
    >
      {!isAdminLogin && (
        <>
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/swirl.svg')] bg-no-repeat bg-cover opacity-3 mix-blend-screen pointer-events-none" />
          </div>
        </>
      )}

      <div className="min-h-screen flex flex-col">
        {!isAdminLogin && <Header />}
        <main className="flex-grow">
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </main>
      </div>

      {!isAdminLogin && <Meteors />}
    </body>
  );
}
