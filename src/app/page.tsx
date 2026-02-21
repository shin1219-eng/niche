import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div className="container">
        <section className="hero">
          <div>
            <span className="badge">NICHE! CMS</span>
            <h1>ニッチの収集から記事化までを一気通貫で回す</h1>
            <p>
              管理画面の中で「ネタ収集 → 記事生成 → 下書き移管」を完結させ、
              品質とスピードを両立させるための専用CMSです。
            </p>
          </div>
          <div className="inline-actions">
            <Link className="btn btn-primary" href="/admin/topics">
              管理画面へ
            </Link>
            <Link className="btn btn-ghost" href="/admin/articles">
              記事作成タブを見る
            </Link>
          </div>
        </section>
        <section className="grid grid-2" style={{ marginTop: 24 }}>
          {[
            {
              title: "ネタ収集タブ",
              desc: "カテゴリ・日付指定でAPI収集。必須カラムが埋まるまで記事化不可。"
            },
            {
              title: "記事作成タブ",
              desc: "テンプレ自動生成 → OK/編集 → 下書き移管までを一括で。"
            }
          ].map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
