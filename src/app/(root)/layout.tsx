import "@/styles/globals.css";
import MainNav from "@/components/navbar/main-nav";
import { ConditionalFooter } from "@/components/footer/conditional-footer";
import { FavoritesProvider } from "@/context/favorites-context";
import { CreditsProvider } from "@/context/credits-context";
import { ReduxProvider } from "@/components/providers/redux-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <FavoritesProvider>
        <CreditsProvider>
          <MainNav />
          {children}
          <ConditionalFooter />
        </CreditsProvider>
      </FavoritesProvider>
    </ReduxProvider>
  );
}
