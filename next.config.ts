import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/faq", destination: "/faqs", permanent: false }];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", port: "" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**", port: "" },
    ],
  },
};

export default nextConfig;
