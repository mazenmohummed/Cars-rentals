import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { HeadBar } from "@/components/Main/HeadBar";
import Footer from "@/components/Main/Footer";
import { Providers } from "./Providers";
import { Toaster } from "react-hot-toast";
import Script from 'next/script'

// 1. All fonts set to 'swap' to ensure text is visible immediately
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-montserrat",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Added swap here
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Added swap here
});

export const metadata: Metadata = {
  title: "Cars",
  description: "Premium car rentals and logistics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      {/* 2. Added all font variables to the body */}
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${montserrat.variable} antialiased min-h-screen bg-background overflow-x-hidden`}>
        <Providers>
          <div className="mx-auto w-full md:w-[90%] lg:w-5/6 flex flex-col min-h-screen">
            <HeadBar />
            <main className="flex-grow">
              {children}
            </main>
            <Toaster position="top-center" />
          </div>
          <Footer />
        </Providers>

        {/* 3. Scripts moved to the end of body for better performance */}
        {/* Replace YOUR_ID with your actual ID or remove if not using Gtag yet */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}