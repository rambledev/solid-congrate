'use client';

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import ToasterContext from "@/context/ToastContext";



import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function SiteProviders({ children }: { children: React.ReactNode }) {
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
