import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Skip Next internals, static assets (incl. fonts/images), and /auth/callback (session race on exchange).
    "/((?!_next|auth/callback|.*\\.(?:css|js|png|jpg|jpeg|gif|svg|ico|webp|avif|woff2?|ttf|otf|eot)).*)",
  ],
};
