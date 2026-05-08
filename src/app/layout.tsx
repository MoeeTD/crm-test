import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "CRM",
  description: "Customer Relationship Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen antialiased">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8 bg-slate-50">{children}</main>
      </body>
    </html>
  );
}
