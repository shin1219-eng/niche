"use client";

import Link from "next/link";

export default function PublicNav() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link href="/">NICHE!</Link>
      </div>
      <div className="nav-actions">
        <Link className="nav-link" href="/articles">
          記事一覧
        </Link>
        <Link className="nav-link" href="/admin/login">
          ログイン
        </Link>
      </div>
    </nav>
  );
}
