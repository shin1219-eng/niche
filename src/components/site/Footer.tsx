export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand"><span>NICHE!</span> EDITION</div>
            <p className="footer-desc">
              ニッチな課題に刺さる専用品を、編集で届けるマガジン。
            </p>
          </div>
          <div>
            <h4>Editorial</h4>
            <ul>
              <li>編集方針</li>
              <li>検証ルール</li>
              <li>掲載ポリシー</li>
              <li>問い合わせ</li>
            </ul>
          </div>
          <div>
            <h4>Topics</h4>
            <ul>
              <li>キッチンの面倒</li>
              <li>片付けの時短</li>
              <li>省スペース生活</li>
              <li>移動と携帯</li>
            </ul>
          </div>
          <div>
            <h4>For Brands</h4>
            <ul>
              <li>掲載依頼</li>
              <li>取材相談</li>
              <li>広告掲載</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© NICHE! All rights reserved.</div>
      </div>
    </footer>
  );
}
