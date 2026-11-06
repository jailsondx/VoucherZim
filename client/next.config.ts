import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera em .next/standalone uma versao enxuta para producao (usada pelo instalar.bat)
  output: "standalone",
  allowedDevOrigins: ["10.3.0.2"],
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
