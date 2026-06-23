import path from "node:path";
import { config } from "dotenv";
import type { NextConfig } from "next";

// Muat .env dari root monorepo untuk pengembangan lokal.
// Di Vercel, env diisi lewat dashboard (file ini tidak ada → diabaikan).
config({ path: path.resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  transpilePackages: ["@desa/lib"],
  // Izinkan akses dev server dari perangkat lain di jaringan lokal (mis. HP).
  allowedDevOrigins: ["10.105.126.232", "*.local"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
