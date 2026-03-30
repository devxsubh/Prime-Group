import type { DiscoverCardData } from "@/lib/discover";

/**
 * Static showcase profiles for the landing hero only (no backend fetch).
 * Images live under `public/profiles/` and are served as `/profiles/...`.
 */
export const LANDING_FEATURED_PROFILES: DiscoverCardData[] = [
  {
    id: "landing-sample-1",
    name: "Ananya",
    age: 27,
    location: "Hyderabad, India",
    profession: "Physician",
    education: "MBBS · MD",
    imageUrl: "/profiles/image1.png",
    ctaHref: "/discover",
  },
  {
    id: "landing-sample-2",
    name: "Rohan",
    age: 30,
    location: "Mumbai, India",
    profession: "Product Lead",
    education: "MBA · IIT",
    imageUrl: "/profiles/image3.png",
    ctaHref: "/discover",
  },
  {
    id: "landing-sample-3",
    name: "Meera",
    age: 26,
    location: "Bengaluru, India",
    profession: "Architect",
    education: "B.Arch",
    imageUrl: "/profiles/image4.png",
    ctaHref: "/discover",
  },
  {
    id: "landing-sample-4",
    name: "Arjun",
    age: 29,
    location: "Delhi NCR, India",
    profession: "Chartered Accountant",
    education: "CA · B.Com",
    imageUrl: "/profiles/image.png",
    ctaHref: "/discover",
  },
];
