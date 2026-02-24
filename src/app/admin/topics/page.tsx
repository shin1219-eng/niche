import { redirect } from "next/navigation";

export default function AdminTopicsRedirectPage() {
  redirect("/admin/dashboard");
}
