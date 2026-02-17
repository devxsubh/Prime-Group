import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://primegroupmatrimony.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/privacy",
    "/terms",
    "/refund",
    "/community-guidelines",
    "/discover",
    "/blog",
    "/faqs",
    "/contact-us",
    "/favorites",
    "/gallary",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : ("weekly" as const),
    priority: path === "" ? 1 : 0.8,
  }));

  return staticRoutes;
}
