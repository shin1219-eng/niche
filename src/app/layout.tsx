import "./globals.css";
import type { Metadata } from "next";
import { M_PLUS_1p, Zen_Old_Mincho } from "next/font/google";

const headingFont = Zen_Old_Mincho({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700"]
});

const bodyFont = M_PLUS_1p({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: "NICHE! Magazine CMS",
  description: "ニッチ特化のマガジン運用を支える、下書きとアーカイブ中心のCMS"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
