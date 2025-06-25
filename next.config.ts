import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Atau jika ingin lebih spesifik dengan hostname Anda:
    domains: [
      "kiujjnrenmlbwugaiucz.supabase.co", // ganti dengan hostname Supabase Anda
    ],
  },
};

export default nextConfig;
