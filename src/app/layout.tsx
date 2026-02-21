import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NICHE! CMS",
  description: "ニッチ発見と記事制作を一気通貫で回すCMS"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
