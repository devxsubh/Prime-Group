"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import MobileNav from "./mobile-nav";
import ScrollProgress from "../ui/scroll-progress";
import { Heart, User, Settings, LogOut } from "lucide-react";
import { useFavorites } from "@/context/favorites-context";
import { useAuth } from "@/components/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 80;
const NAV_BG_OPAQUE = "rgba(10, 25, 47, 0.95)";


export default function MainNav() {
   const { favoritesCount } = useFavorites();
   const { user, signOut } = useAuth();
   const router = useRouter();
   const pathname = usePathname();
   const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
   const [scrolled, setScrolled] = useState(false);

   const isHome = pathname === "/";
   useEffect(() => {
     if (!isHome) return;
     const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
     onScroll(); // init
     window.addEventListener("scroll", onScroll, { passive: true });
     return () => window.removeEventListener("scroll", onScroll);
   }, [isHome]);

   const navLinkClass = (href: string) =>
     cn(
       "px-4 py-2 text-sm font-montserrat font-medium transition-colors rounded-lg duration-200",
       pathname === href
         ? "text-white bg-white/15"
         : "text-white/80 hover:text-white hover:bg-white/10"
     );

   // Load profile photo for avatar when signed in
   useEffect(() => {
     if (!user?.id) {
       setProfilePhotoUrl(null);
       return;
     }
     const supabase = createClient();
     (async () => {
       const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
       if (!profile?.id) return;
       const { data: photo } = await supabase
         .from("profile_photos")
         .select("photo_url, thumbnail_url")
         .eq("profile_id", profile.id)
         .eq("is_primary", true)
         .maybeSingle();
       const url = photo?.thumbnail_url || photo?.photo_url || null;
       setProfilePhotoUrl(url);
     })();
   }, [user?.id]);

  const headerTransparent = isHome && !scrolled;
  return (
    <>
      <div
        className={cn(
          "w-full border-b transition-all duration-300 z-[60]",
          isHome && "fixed top-0 left-0 right-0",
          !headerTransparent && "shadow-lg",
          !isHome && "sticky top-0 md:relative md:top-auto"
        )}
        style={{
          backgroundColor: headerTransparent ? "transparent" : NAV_BG_OPAQUE,
          borderColor: headerTransparent ? "transparent" : "rgba(226, 194, 133, 0.22)",
          backdropFilter: headerTransparent ? "none" : "blur(16px)",
        }}
      >
        <header className="z-50 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="relative flex h-16 items-center">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 min-w-[190px] sm:min-w-[230px] z-10">
              <MobileNav />
              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src="/img/home.png"
                  alt="Prime Group Logo"
                  priority
                  width={56}
                  height={56}
                  className="object-contain group-hover:scale-105 transition-transform duration-300 h-14 w-14"
                />
                <span className="hidden sm:block font-playfair text-lg sm:text-xl font-bold text-gold-gradient group-hover:opacity-80 transition-opacity">
                  Prime Group
                </span>
              </Link>
            </div>

            {/* Navigation Menu */}
            <NavigationMenu className="hidden md:flex absolute left-1/2 -translate-x-1/2">
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className={navLinkClass("/")}>Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/discover" className={navLinkClass("/discover")}>Discover</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/blog" className={navLinkClass("/blog")}>Blogs</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/faqs" className={navLinkClass("/faqs")}>FAQs</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/contact-us" className={navLinkClass("/contact-us")}>Contact</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right Actions */}
            <div className="flex items-center gap-3 ml-auto min-w-[190px] sm:min-w-[230px] justify-end z-10">
              {user ? (
                <>
                  <Link href="/favorites">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-10 w-10 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                      aria-label="Favorites"
                    >
                      <Heart className="h-5 w-5" />
                      {favoritesCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] rounded-full flex items-center justify-center text-xs font-bold px-1 bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 shadow-md">
                          {favoritesCount > 9 ? "9+" : favoritesCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="rounded-full ring-2 ring-white/30 hover:ring-white/50 focus:outline-none transition-all duration-200 p-0.5"
                        aria-label="Account menu"
                      >
                        <Avatar className="h-10 w-10 border border-white/30">
                          <AvatarImage src={profilePhotoUrl ?? undefined} alt="Profile" />
                          <AvatarFallback className="bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 text-white font-montserrat font-semibold">
                            {user.email?.charAt(0).toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      sideOffset={12}
                      className="w-56 p-3 rounded-xl font-montserrat shadow-2xl border border-white/10"
                      style={{ backgroundColor: "rgba(15, 25, 55, 0.95)", backdropFilter: "blur(16px)" }}
                    >
                      <div className="space-y-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                        <div className="my-2 h-px bg-white/10" />
                        <button
                          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
                          onClick={async () => {
                            await signOut();
                            router.push("/");
                            router.refresh();
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              ) : (
                !pathname?.startsWith("/sign-in") && !pathname?.startsWith("/sign-up") && (
                  <Link href="/sign-in">
                    <Button
                      className="rounded-full px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-montserrat font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 border-none"
                    >
                      Sign In
                    </Button>
                  </Link>
                )
              )}
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
