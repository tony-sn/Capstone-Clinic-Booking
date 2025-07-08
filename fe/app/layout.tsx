import type { Metadata } from "next";
import "./globals.css";
import {
  Plus_Jakarta_Sans as FontSans,
  Playfair_Display as Playfair,
} from "next/font/google";

import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import config from "@/config.json";
import { cn } from "@/lib/utils";

const playfair = Playfair({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: config.title,
  description:
    "A healthcare patient management System designed to streamline patient registration, appointment scheduling, and medical records management for healthcare providers.",
  icons: {
    icon: "/assets/icons/logo-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-dark-300 font-sans font-playfair antialiased",
          fontSans.variable,
          playfair.variable
        )}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
