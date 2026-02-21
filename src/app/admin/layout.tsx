import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminNav />
      <main>
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
