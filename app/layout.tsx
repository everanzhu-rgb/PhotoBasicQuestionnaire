import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Before We Meet · 拍摄前风格与灵感问卷",
  description: "在光影与作品之间，记录您期待被拍摄的方式。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111510",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head><link rel="preload" as="image" href="/portfolio/05-black-veil-sky.jpg" /></head>
      <body>{children}</body>
    </html>
  );
}
