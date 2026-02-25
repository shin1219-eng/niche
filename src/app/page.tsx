import Link from "next/link";
import PublicNav from "@/components/site/PublicNav";
import Footer from "@/components/site/Footer";

const editorialThemes = [
  { title: "生肉を触るたびに手を洗うストレス", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80", tag: "KITCHEN" },
  { title: "狭い玄関で靴をしまう地味な面倒", img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80", tag: "STORAGE" },
  { title: "洗面台の水はねを毎日拭く手間", img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80", tag: "WASHROOM" },
  { title: "作業机の配線が散らかる小さな怒り", img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80", tag: "WORKSPACE" },
  { title: "出張向け、極小ラゲッジの最適解", img: "https://images.unsplash.com/photo-1542382156909-9ec371e2c140?auto=format&fit=crop&w=800&q=80", tag: "TRAVEL" },
  { title: "名もなき面倒を消す、一点突破ツール", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", tag: "GADGET" }
];

const latestFeatures = [
  { title: "毎朝の片付けを30秒縮める、玄関まわりの専用品", desc: "比較表・用途・注意点を短く整理", img: "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=600&q=80" },
  { title: "持ち運び前提で作られた、出張向け整理ギア", desc: "極小サイズに詰め込まれた機能美", img: "https://images.unsplash.com/photo-1553641217-10114b099fc3?auto=format&fit=crop&w=600&q=80" },
  { title: "狭小スペースでも機能する、収納の逆転アイデア", desc: "空間を縦に使うためのツール群", img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80" }
];

const magazineCategories = [
  { name: "キッチンの面倒", count: "142" },
  { name: "片付けの工数削減", count: "89" },
  { name: "狭い家の最適化", count: "216" },
  { name: "移動と持ち運び", count: "54" },
  { name: "手作業の代替ツール", count: "112" },
  { name: "小規模メーカー特集", count: "33" }
];

export default function HomePage() {
  return (
    <div>
      <PublicNav />

      {/* Editorial Hero */}
      <section className="hero-editorial">
        <div className="container">
          <div className="hero-grid">
            <div>
              <span className="hero-kicker">Issue 04 / Discovery</span>
              <h1 className="hero-title">妥協していた<br />面倒を、<br />専用品で片付ける。</h1>
              <p className="hero-sub">
                ニッチな課題を、ニッチな道具で解決する。探せばあるのに届いていない製品を、マガジンとして再編集。<br />
                名もなきストレスを消し去る、一点突破の体験を。
              </p>

              <div style={{ marginTop: '40px' }}>
                <Link href="/articles" className="btn btn-primary">
                  最新の特集を読む
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
              </div>
            </div>

            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1542382156909-9ec371e2c140?auto=format&fit=crop&w=1200&q=80"
                alt="Editorial Cover"
              />
              <div className="article-tag" style={{ top: 'auto', bottom: '12px', right: '12px', left: 'auto', fontSize: '1.2rem', padding: '8px 16px' }}>
                NICHE EDITION
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Excitement Marquee */}
      <div className="marquee-container">
        <div className="marquee-content font-display">
          <span className="marquee-item">Find your niche</span>
          <span className="marquee-item">Eliminate the stress</span>
          <span className="marquee-item">Curated tools</span>
          <span className="marquee-item">Editorial Selection</span>
          <span className="marquee-item">Unisex & Premium</span>
          <span className="marquee-item">Find your niche</span>
          <span className="marquee-item">Eliminate the stress</span>
          <span className="marquee-item">Curated tools</span>
          <span className="marquee-item">Editorial Selection</span>
          <span className="marquee-item">Unisex & Premium</span>
        </div>
      </div>

      <main>
        <div className="container">

          <div className="editorial-section" style={{ paddingTop: '60px' }}>
            <div className="section-header">
              <div>
                <h2 className="section-title">Weekly Focus</h2>
                <p className="section-subtitle">今週の編集テーマ：検索されない確実なペイン</p>
              </div>
              <Link href="/themes" className="btn">すべてのテーマ</Link>
            </div>

            <div className="feature-grid">
              {editorialThemes.map((item, i) => (
                <div key={i} className="article-card">
                  <div className="article-thumb">
                    <span className="article-tag">{item.tag}</span>
                    <img src={item.img} alt={item.title} loading="lazy" />
                  </div>
                  <div>
                    <div className="article-meta">
                      <span>No.{String(i + 1).padStart(2, '0')}</span>
                      <span>5 MIN READ</span>
                    </div>
                    <h3 className="article-title">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="editorial-section list-layout">
            <div>
              <div className="section-header">
                <div>
                  <h2 className="section-title">Latest Fixes</h2>
                  <p className="section-subtitle">ニッチな現象とペインを起点にした読み物</p>
                </div>
              </div>

              <div className="list-stack">
                {latestFeatures.map((item, i) => (
                  <div key={i} className="list-item">
                    <div className="list-item-thumb">
                      <img src={item.img} alt={item.title} loading="lazy" />
                    </div>
                    <div className="list-item-content">
                      <div className="article-meta" style={{ marginBottom: '8px' }}>
                        <span>FEATURE</span>
                        <span style={{ color: 'var(--accent)' }}>NEW</span>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="sidebar">
              <div className="sidebar-block">
                <h3 className="sidebar-title">Categories</h3>
                <div className="category-list">
                  {magazineCategories.map((item, index) => (
                    <div key={item.name} className="category-item">
                      <span>{item.name}</span>
                      <span className="category-count font-display">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar-block">
                <h3 className="sidebar-title">Editor's Note</h3>
                <div style={{ padding: '24px', background: 'var(--ink)', color: 'var(--panel)', fontSize: '0.95rem', lineHeight: '1.8' }}>
                  <p style={{ color: 'var(--line)', marginBottom: '16px' }}>
                    「量産型のおすすめではなく、状況に刺さる一点突破を届ける。」
                  </p>
                  <p style={{ color: 'var(--muted)' }}>
                    NICHE! は日々の生活に潜む名もなき面倒に光を当て、それを解決する美しい道具だけを厳選してアーカイブするマガジンです。
                  </p>
                </div>
              </div>
            </aside>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
