import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eurovision Roulette",
  description: "Tirage culinaire Eurovision 2026 pour un diner synchronise."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
