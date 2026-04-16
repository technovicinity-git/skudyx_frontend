"use client";

import "./globals.css";
import { Instrument_Sans } from "next/font/google";
import { LanguageProvider } from "@/components/frontend/language-context";
import "leaflet/dist/leaflet.css";
// import Script from "next/script";
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

// New client component for app shell
// Place this in the same file for now
// language-context and useLanguage are only used here
import { useLanguage } from "@/components/frontend/language-context";
import QueryProvider from "@/lib/Provider/queryProvider";
import { ToastProvider } from "@/lib/Provider/toastProvider";
function AppShell({ children }) {
  const { lang, dir } = useLanguage();
  return (
    <div lang={lang} dir={dir}>
      <main>{children}</main>
    </div>
  );
}

// RootLayout remains a server component
export default function RootLayout({ children }) {
  return (
    <html className={instrumentSans.variable}>
      <body>
        <ToastProvider>
          <QueryProvider>
            <LanguageProvider>
              <AppShell>{children}</AppShell>
            </LanguageProvider>
          </QueryProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
