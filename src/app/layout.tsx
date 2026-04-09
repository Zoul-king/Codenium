import localFont from "next/font/local";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const poppins = localFont({
  src: [
    { path: "../../public/fonts/poppins/poppins-300.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/poppins/poppins-400.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/poppins/poppins-500.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/poppins/poppins-600.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/poppins/poppins-700.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/poppins/poppins-800.ttf", weight: "800", style: "normal" }
  ],
  display: "swap",
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "AxolotlCode",
  description: "Sitio corporativo de AxolotlCode construido con Next.js, React, TypeScript y Tailwind CSS."
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="bg-white text-body-color antialiased">{children}</body>
    </html>
  );
}
