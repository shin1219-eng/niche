"use client";

import { usePathname } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import AdminGate from "@/components/admin/AdminGate";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith("/admin/login");

  return (
    <div>
      {!isLogin && <AdminNav />}
      <main>
        <div className="container">{isLogin ? children : <AdminGate>{children}</AdminGate>}</div>
      </main>
    </div>
  );
}
