"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

const RESTRICTED_ROUTES = [
  "/profile",
  "/discover",
  "/settings",
  "/favorites",
  "/checkout"
];

export function ConditionalFooter() {
  const pathname = usePathname();
  const isRestricted = RESTRICTED_ROUTES.some((route) => pathname?.startsWith(route));

  if (isRestricted) return null;
  return <Footer />;
}
