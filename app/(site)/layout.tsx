'use client';

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../globals.css";
const inter = Inter({ subsets: ["latin"] });

import ToasterContext from "@/context/ToastContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider enableSystem={false} attribute="class" defaultTheme="light">
      <div className={`dark:bg-black ${inter.className}`}>
        <Lines />
        <Header />
        <ToasterContext />
        {children}
        <Footer />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  );
}
