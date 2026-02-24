"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/adminAuth";

export default function PublicNav() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email ?? null);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link href="/">NICHE! MAGAZINE</Link>
      </div>
      <div className="nav-actions">
        <Link className="nav-link" href="/articles">
          記事一覧
        </Link>
        {email ? (
          <button className="nav-link" type="button" onClick={handleLogout}>
            ログアウト
          </button>
        ) : (
          <Link className="nav-link" href="/login">
            ログイン
          </Link>
        )}
        {email && (
          <Link className="nav-link" href="/mypage">
            マイページ
          </Link>
        )}
      </div>
    </nav>
  );
}
