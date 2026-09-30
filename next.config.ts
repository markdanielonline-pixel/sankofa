import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/model", destination: "/how-it-works", permanent: true },{ source: "/qa", destination: "/faq", permanent: true }];
  },
};

export default nextConfig;

