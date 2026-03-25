// LAYOUT PRINCIPAL
// Ce fichier enveloppe TOUTES les pages de l'app
// Il contient la barre de navigation, le footer, et les métadonnées SEO

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

// Force le rendu dynamique pour toutes les pages (app SaaS avec auth)
export const dynamic = "force-dynamic";

// Métadonnées SEO — apparaissent dans Google et les onglets du navigateur
export const metadata: Metadata = {
  title: "RestoSocial — Posts réseaux sociaux pour restaurants par IA",
  description:
    "Générez des posts Instagram, Facebook et plus pour votre restaurant grâce à l'intelligence artificielle. Attirez plus de clients en 30 secondes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#111111] min-h-screen flex flex-col`}>
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
