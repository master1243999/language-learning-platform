// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context";  // 导入我们刚创建的Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "语言学习平台",
  description: "在线语言学习平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <AppProvider>  {/* 用AppProvider包裹children */}
          {children}
        </AppProvider>
      </body>
    </html>
  );
}