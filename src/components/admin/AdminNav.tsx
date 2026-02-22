"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "ダッシュボード" },
  { href: "/admin/topics", label: "ネタ収集" },
  { href: "/admin/articles", label: "記事作成" },
  { href: "/articles", label: "記事一覧" }
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span>NICHE! CMS</span>
        <span className="badge">管理画面</span>
      </div>
      <div className="nav-links">
        {links.map((link) => (
          <Link
            key={link.href}
            className={`nav-link${pathname === link.href ? " active" : ""}`}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
