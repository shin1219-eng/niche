"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PublicNav from "@/components/site/PublicNav";
import Footer from "@/components/site/Footer";
import { supabase } from "@/lib/supabaseClient";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/articles";
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        router.replace(nextPath);
      }
    });
  }, [router, nextPath]);

  const handleSubmit = async () => {
    if (!supabase) {
      setError("Supabase設定が見つかりません。環境変数を確認してください。");
      return;
    }
    setBusy(true);
    setError(null);
    if (mode === "signin") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (signInError) {
        setError("ログインに失敗しました。メールとパスワードを確認してください。");
        setBusy(false);
        return;
      }
      router.replace(nextPath);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });
    if (signUpError) {
      setError("登録に失敗しました。別のメールかパスワードを試してください。");
      setBusy(false);
      return;
    }
    router.replace(nextPath);
  };

  return (
    <div>
      <PublicNav />
      <main>
        <div className="container">
          <section className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
            <div className="section-title">
              <div>
                <h2>{mode === "signin" ? "ログイン" : "新規登録"}</h2>
                <p>ブックマーク機能を使いたい人だけログインすればOKです。</p>
              </div>
              <span className="badge">Reader</span>
            </div>
            {error && <div className="notice">{error}</div>}
            <div className="grid" style={{ gap: 12 }}>
              <div>
                <label>メールアドレス</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
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
              <button className="btn btn-primary" type="button" onClick={handleSubmit} disabled={busy}>
                {busy ? "処理中..." : mode === "signin" ? "ログイン" : "登録する"}
              </button>
            </div>
            <div className="notice" style={{ marginTop: 12 }}>
              {mode === "signin" ? (
                <>
                  はじめての方は
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => setMode("signup")}
                    style={{ marginLeft: 8 }}
                  >
                    新規登録
                  </button>
                </>
              ) : (
                <>
                  すでにアカウントがある場合は
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => setMode("signin")}
                    style={{ marginLeft: 8 }}
                  >
                    ログインへ戻る
                  </button>
                </>
              )}
            </div>
            <div className="notice">
              <Link className="nav-link" href="/articles">
                ログインせずに記事一覧へ戻る
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
