import Link from "next/link";
import PublicNav from "@/components/site/PublicNav";
import Footer from "@/components/site/Footer";

const editorialThemes = [
  "生肉を触るたびに手を洗うストレス",
  "狭い玄関で靴をしまう地味な面倒",
  "洗面台の水はねを毎日拭く手間",
  "作業机の配線が散らかる小さな怒り"
];

const latestFeatures = [
  "名もなき面倒を解消する、台所の一点突破ツール",
  "毎朝の片付けを30秒縮める、玄関まわりの専用品",
  "持ち運び前提で作られた、出張向け整理ギア",
  "狭小スペースでも機能する、収納の逆転アイデア",
  "ニッチ製品を選ぶときに見るべき比較軸の作り方",
  "レビューの不満文から「刺さる用途」を見抜く手順"
];

const magazineCategories = [
  "キッチンの面倒",
  "片付けの工数削減",
  "狭い家の最適化",
  "移動と持ち運び",
  "手作業の代替ツール",
  "小規模メーカー特集"
];

export default function HomePage() {
  return (
    <div>
      <PublicNav />
      <section className="hero-large">
        <div className="hero-content">
          <p className="editorial-kicker">NICHE MAGAZINE</p>
          <h1 className="hero-title">妥協していた面倒を、専用品で片付ける。</h1>
          <p className="hero-sub">
            ニッチな課題を、ニッチな道具で解決する。探せばあるのに届いていない製品を、
            マガジンとして編集して届けます。
          </p>
          <div className="hero-search">
            <input placeholder="例: シンク 水はね 防止" />
            <button type="button">テーマを探す</button>
          </div>
        </div>
      </section>

      <main>
        <div className="container">
          <section className="section-grid" style={{ marginTop: 24 }}>
            <div>
              <div className="section-title">
                <div>
                  <h3>今週の編集テーマ</h3>
                  <p>検索されにくいが、確実に困っている課題を先に拾う。</p>
                </div>
              </div>
              <div className="feature-grid">
                {editorialThemes.map((item) => (
                  <div key={item} className="feature-card">
                    {item}
                  </div>
                ))}
              </div>

              <section className="card" style={{ marginTop: 24 }}>
                <div className="section-title">
                  <div>
                    <h3>最新の特集</h3>
                    <p>ニッチな現象とペインを起点にした読み物。</p>
                  </div>
                  <Link className="btn btn-ghost" href="/articles">
                    記事一覧へ
                  </Link>
                </div>
                <div className="list-grid">
                  {latestFeatures.map((item) => (
                    <div key={item} className="list-item">
                      <div className="list-thumb" />
                      <div>
                        <strong>{item}</strong>
                        <p>比較表・用途・注意点を短く整理。</p>
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
                {magazineCategories.map((item, index) => (
                  <div key={item} className="category-item">
                    <span className="category-icon">{index + 1}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <blockquote className="quote-block">
                量産型のおすすめではなく、状況に刺さる一点突破を届ける。
              </blockquote>
            </aside>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
