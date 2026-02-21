"use client";

import Link from "next/link";

export default function PublicNav() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-icon">★</span>
        <div>
          <Link href="/">NICHE!</Link>
          <div className="nav-tagline">商品比較サービス</div>
        </div>
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
