import "@/styles/globals.css";
import { ReduxProvider } from "@/components/providers/redux-provider";

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
