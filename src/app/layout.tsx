import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_JP, Montserrat, Shippori_Mincho } from "next/font/google";

const sansFont = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const minchoFont = Shippori_Mincho({
  variable: "--font-mincho",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const displayFont = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
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
      <body className={`${sansFont.variable} ${minchoFont.variable} ${displayFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
