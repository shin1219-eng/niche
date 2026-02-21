import Link from "next/link";
import PublicNav from "@/components/site/PublicNav";

export default function HomePage() {
  return (
    <div>
      <PublicNav />
      <main>
        <div className="container">
          <section className="hero">
            <div>
              <span className="badge">NICHE!</span>
              <h1>埋もれてるけど刺さる日本のニッチを、比較と編集で届ける。</h1>
              <p>
                公式情報や一次情報をベースに、用途別に迷わない比較を提供します。
                記事一覧から最新のニッチをチェックしてください。
              </p>
            </div>
            <div className="inline-actions">
              <Link className="btn btn-primary" href="/articles">
                記事一覧を見る
              </Link>
              <Link className="btn btn-ghost" href="/admin/topics">
                管理画面へ
              </Link>
            </div>
          </section>
          <section className="grid grid-2" style={{ marginTop: 24 }}>
            {[
              {
                title: "用途別の比較",
                desc: "刺さる条件と比較軸を明示し、選ぶ基準を短時間で共有します。"
              },
              {
                title: "最新ニッチの発掘",
                desc: "楽天/Yahoo中心のデータ収集で、埋もれた商品やサービスを拾います。"
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
    </div>
  );
}
