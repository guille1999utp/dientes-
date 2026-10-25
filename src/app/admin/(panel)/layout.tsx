import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminNav, AdminNavView } from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: "Panel", robots: { index: false } };

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <Suspense fallback={<AdminNavView pathname="" />}>
        <AdminNav />
      </Suspense>
      <main className="min-w-0 flex-1 p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
