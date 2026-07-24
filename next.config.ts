import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow HMR when developing through the Tailscale network address. */
  allowedDevOrigins: ["100.88.184.2"],
};

export default nextConfig;
