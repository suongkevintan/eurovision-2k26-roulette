import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Agentation } from "agentation";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "700"],
  preload: false
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  preload: false
});

export const metadata: Metadata = {
  title: "Eurovision Roulette",
  description: "Tirage culinaire Eurovision 2026 pour un dîner synchronisé."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
