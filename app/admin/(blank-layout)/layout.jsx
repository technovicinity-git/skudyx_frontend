"use client";

import "../../globals.css";

import Sidebar from "@/components/admin/dashboard/Sidebar";
import Header from "@/components/admin/dashboard/Header";
import { SidebarProvider } from "@/components/common/SidebarContext";

// RootLayout remains a server component
export default function RootLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar basePath="admin" />
        <main className="flex-1 flex flex-col min-h-screen">
          <Header />
          <div className="flex-1 bg-gray-100">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
