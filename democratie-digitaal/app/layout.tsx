import Header from "@/components/layout/Header";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Democratie Digitaal",
  description: "Een slimme stemhulp met kennistoetsing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${geistSans.variable} antialiased`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
