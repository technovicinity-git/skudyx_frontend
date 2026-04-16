"use client";

import { LanguageProvider } from "@/components/frontend/language-context";
import { useLanguage } from "@/components/frontend/language-context";

function AppShell({ children }) {
  const { lang, dir } = useLanguage();
  return (
    <div lang={lang} dir={dir}>
      {/* <LoginAdminHeader /> */}

      {/* <div className="w-full min-h-20"></div> */}

      <main>{children}</main>
    </div>
  );
}

// RootLayout remains a server component
export default function RootLayout({ children }) {
  return (
    <LanguageProvider>
      <AppShell>{children}</AppShell>
    </LanguageProvider>
  );
}
