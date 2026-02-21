export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">NICHE!</div>
            <p>
              ニッチな商品・サービスを比較と編集で届ける商品比較サービス。
            </p>
          </div>
          <div>
            <h4>運営情報</h4>
            <ul>
              <li>運営会社</li>
              <li>編集方針</li>
              <li>利用規約</li>
              <li>プライバシーポリシー</li>
            </ul>
          </div>
          <div>
            <h4>カテゴリ</h4>
            <ul>
              <li>家電</li>
              <li>キッチン用品</li>
              <li>生活雑貨</li>
              <li>ガジェット</li>
            </ul>
          </div>
          <div>
            <h4>お問い合わせ</h4>
            <ul>
              <li>掲載依頼</li>
              <li>問い合わせフォーム</li>
              <li>広告について</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© NICHE! All rights reserved.</div>
      </div>
    </footer>
  );
}
