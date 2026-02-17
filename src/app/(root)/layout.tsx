import "@/styles/globals.css";
import MainNav from "@/components/navbar/main-nav";
import Footer from "@/components/footer/footer";
import { FavoritesProvider } from "@/context/favorites-context";
import { ReduxProvider } from "@/components/providers/redux-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <FavoritesProvider>
        <MainNav />
        {children}
        <Footer />
      </FavoritesProvider>
    </ReduxProvider>
  );
}
