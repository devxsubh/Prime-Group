import "@/styles/globals.css";
import Image from "next/image";
import MainNav from "@/components/navbar/main-nav";
import { FavoritesProvider } from "@/context/favorites-context";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FavoritesProvider>
      <main className="relative min-h-screen w-full">
        <div className="absolute size-full">
          <Image src="https://www.adorama.com/alc/wp-content/uploads/2021/07/Photography-for-Beginners.jpg" alt="background" fill className="size-full object-cover" />
        </div>
        {/* Beautiful Memory — two energies meeting (soft radial overlays) */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background: `
              radial-gradient(circle at 30% 50%, rgba(20,35,59,0.05) 0%, transparent 60%),
              radial-gradient(circle at 70% 50%, rgba(20,35,59,0.05) 0%, transparent 60%)
            `,
          }}
        />
        <MainNav />
        <div className="relative min-h-screen">
          {children}
        </div>
      </main>
    </FavoritesProvider>
  );
}
