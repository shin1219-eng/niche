import { redirect } from "next/navigation";

export default function AdminArticlesRedirectPage() {
  redirect("/admin/drafts");
}
