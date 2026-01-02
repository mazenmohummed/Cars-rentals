import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeadBar } from "@/components/Main/HeadBar";
import Footer from "@/components/Main/Footer";
import { Providers } from "./Providers";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cars",
  description: "Car rentals company",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background overflow-x-hidden`}>
        <Providers>
          {/* Removed justify-center from the wrapper as mx-auto does the work */}
          <div className="mx-auto w-full md:w-5/6 lg:w-5/6 xl:w-5/6 flex flex-col min-h-screen">
            <HeadBar />
            <main className="flex-grow">
              {children}
            </main>
            <Toaster position="top-center" />
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}