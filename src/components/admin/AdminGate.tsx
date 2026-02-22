"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { adminEmailsLabel, isAdminEmail } from "@/lib/adminAuth";

type GateStatus = "loading" | "allowed" | "denied" | "missing";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<GateStatus>("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setStatus("missing");
      return;
    }

    let active = true;

    const check = async () => {
      const { data } = await client.auth.getSession();
      if (!active) return;
      const sessionEmail = data.session?.user?.email ?? null;
      setEmail(sessionEmail);
      if (!sessionEmail) {
        router.replace("/admin/login");
        return;
      }
      if (!isAdminEmail(sessionEmail)) {
        setStatus("denied");
        await client.auth.signOut();
        router.replace("/admin/login?denied=1");
        return;
      }
      setStatus("allowed");
    };

    check();
    const { data: subscription } = client.auth.onAuthStateChange(() => {
      check();
    });

    return () => {
      active = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [router]);

  if (status === "allowed") return <>{children}</>;

  return (
    <section className="card">
      <div className="section-title">
        <div>
          <h2>管理者認証</h2>
          <p>ログイン状態を確認しています。</p>
        </div>
        <span className="badge">メールログイン</span>
      </div>
      {status === "missing" ? (
        <div className="notice">
          Supabase設定が見つかりません。環境変数を設定してください。
        </div>
      ) : (
        <div className="notice">
          許可メール: {adminEmailsLabel}
          {email ? ` / 現在: ${email}` : ""}
        </div>
      )}
    </section>
  );
}
