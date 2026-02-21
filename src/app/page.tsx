import Link from "next/link";
import PublicNav from "@/components/site/PublicNav";

export default function HomePage() {
  return (
    <div>
      <PublicNav />
      <section className="hero-large">
        <div className="hero-content">
          <h1 className="hero-title">ベストなニッチを、迷わず選ぶ。</h1>
          <p className="hero-sub">
            公式データと比較軸で、あなたの条件に刺さる商品・サービスを紹介します。
          </p>
          <div className="hero-search">
            <input placeholder="何を探していますか？" />
            <button type="button">検索</button>
          </div>
        </div>
      </section>
      <main>
        <div className="container">
          <section className="section-grid" style={{ marginTop: 24 }}>
            <div>
              <div className="section-title">
                <div>
                  <h3>あなたの新生活をサポート</h3>
                  <p>よく読まれるテーマを集めました。</p>
                </div>
              </div>
              <div className="feature-grid">
                {[
                  "出産・育児準備",
                  "猫のお迎え準備",
                  "料理初心者の味方",
                  "引越し直後の整理"
                ].map((item) => (
                  <div key={item} className="feature-card">
                    {item}
                  </div>
                ))}
              </div>
              <section className="card" style={{ marginTop: 24 }}>
                <div className="section-title">
                  <div>
                    <h3>編集部が選ぶおすすめ</h3>
                    <p>比較検証済みの定番カテゴリ。</p>
                  </div>
                  <Link className="btn btn-ghost" href="/articles">
                    一覧を見る
                  </Link>
                </div>
                <div className="list-grid">
                  {[
                    "静音ミニ掃除機",
                    "省スペース収納ボックス",
                    "ミニ加湿器",
                    "旅行用圧縮ポーチ",
                    "調理が楽な包丁",
                    "コンパクト空気清浄機"
                  ].map((item) => (
                    <div key={item} className="list-item">
                      <div className="list-thumb" />
                      <div>
                        <strong>{item}</strong>
                        <p>用途別に比較して迷いを減らします。</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <aside>
              <div className="section-title">
                <h3>カテゴリ</h3>
              </div>
              <div className="category-list">
                {[
                  "家電",
                  "パソコン・周辺機器",
                  "コスメ・化粧品",
                  "ビューティー・ヘルス",
                  "生活雑貨",
                  "キッチン用品",
                  "格安SIM",
                  "インターネット回線"
                ].map((item, index) => (
                  <div key={item} className="category-item">
                    <span className="category-icon">{index + 1}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}
