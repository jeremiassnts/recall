import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@recall/types"],
  output: "standalone",
};

export default nextConfig;
