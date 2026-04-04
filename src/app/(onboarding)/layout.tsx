import "@/styles/globals.css";
import { ReduxProvider } from "@/components/providers/redux-provider";

/** Profile-based redirects must not use a stale RSC cache vs middleware. */
export const dynamic = "force-dynamic";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      {children}
    </ReduxProvider>
  );
}
