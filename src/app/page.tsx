import Link from "next/link";
import PublicNav from "@/components/site/PublicNav";
import Footer from "@/components/site/Footer";

export default function HomePage() {
  return (
    <div>
      <PublicNav />
      <section className="hero-large">
        <div className="hero-content">
          <h1 className="hero-title">知らなかった「面白い」に出会う場所</h1>
          <p className="hero-sub">
            普段なら出会わないような世界中のニッチを集めました。
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
                  "静音で暮らす",
                  "省スペース生活",
                  "持ち運び最優先",
                  "片付けの時短"
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
                  "掃除",
                  "キッチン",
                  "収納",
                  "片付け",
                  "ガジェット",
                  "旅行ガイドサービス",
                  "会社"
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
      <Footer />
    </div>
  );
}
