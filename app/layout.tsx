import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "拍摄前信息与偏好问卷",
  description: "用于收集拍摄者基本信息、视觉偏好、参考内容与拍摄授权。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
