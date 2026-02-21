"use client";

import Link from "next/link";

export default function PublicNav() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link href="/">NICHE!</Link>
        <span className="badge">公開サイト</span>
      </div>
      <div className="nav-search">
        <input className="input" placeholder="気になるニッチを検索" />
      </div>
      <div className="nav-actions">
        <Link className="nav-link" href="/articles">
          記事一覧
        </Link>
        <Link className="nav-link" href="/admin/topics">
          ログイン
        </Link>
      </div>
    </nav>
  );
}
