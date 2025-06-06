import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/providers";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "../components/navbar";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Equinox",
  description: "Equinox is a agency for web development.",
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
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
