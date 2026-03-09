import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/components/providers/AuthProvider";
import StoreProvider from "@/redux/StoreProvider";
import ScrollToTop from "@/components/ui/ScrollToTop";
import TxPollerMount from "@/components/providers/TxPollerMount";
import GlobalTxToast from "@/components/ui/GlobalTxToast";
import PremiumDialog from "@/components/ui/PremiumDialog";
import FloatingChat from "@/components/ui/FloatingChat";
import ReservationChatSidebar from "@/components/ui/ReservationChatSidebar";
import FavoritesMount from "@/components/providers/FavoritesMount";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aether - Decentralized Vacation Rentals",
  description: "Experience the art of living on the Stacks blockchain. Secured by Bitcoin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${cormorantGaramond.variable} ${inter.variable} font-serif antialiased`}>
        <StoreProvider>
          <AuthProvider>
            <TxPollerMount />
            <GlobalTxToast />
            <PremiumDialog />
            <FavoritesMount />
            <FloatingChat />
            <ReservationChatSidebar />
            {children}
            <ScrollToTop />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
