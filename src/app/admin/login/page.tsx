"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [denied, setDenied] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const formatLoginError = (message?: string) => {
    if (!message) return "ログインに失敗しました。メールとパスワードを確認してください。";
    const lower = message.toLowerCase();
    if (lower.includes("invalid login credentials")) {
      return "ログイン情報が一致しません。メールとパスワードを確認してください。";
    }
    if (lower.includes("email not confirmed")) {
      return "メール未確認です。SupabaseのUsersでConfirmしてください。";
    }
    return `ログインに失敗しました: ${message}`;
  };

  useEffect(() => {
    if (!supabase) return;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setDenied(params.get("denied") === "1");
    }
    supabase.auth.getSession().then(({ data }) => {
      const sessionEmail = data.session?.user?.email ?? null;
      if (sessionEmail && isAdminEmail(sessionEmail)) {
        router.replace("/admin/dashboard");
      }
    });
  }, [router]);

  const handleLogin = async () => {
    if (!supabase) {
      setError("Supabase設定が見つかりません。環境変数を確認してください。");
      return;
    }
    setBusy(true);
    setError(null);
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (loginError) {
      setError(formatLoginError(loginError.message));
      setBusy(false);
      return;
    }
    const sessionEmail = data.user?.email ?? null;
    if (!isAdminEmail(sessionEmail)) {
      await supabase.auth.signOut();
      setError("このメールは管理者に許可されていません。");
      setBusy(false);
      return;
    }
    router.replace("/admin/dashboard");
  };

  return (
    <section className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
      <div className="section-title">
        <div>
          <h2>管理者ログイン</h2>
          <p>メールログインのみ対応しています。</p>
        </div>
        <span className="badge">Admin</span>
      </div>
      {denied && <div className="notice">管理者の許可がないメールです。</div>}
      {error && <div className="notice">{error}</div>}
      <div className="grid" style={{ gap: 12 }}>
        <div>
          <label>メールアドレス</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
          />
        </div>
        <div>
          <label>パスワード</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </div>
        <button className="btn btn-primary" type="button" onClick={handleLogin} disabled={busy}>
          {busy ? "ログイン中..." : "ログイン"}
        </button>
      </div>
    </section>
  );
}
