import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google'  // 这是谷歌字体
import { Providers } from './components/Providers';
import { Toaster } from "@/components/ui/toaster"
import 'nprogress/nprogress.css'
import ClientLayout from './ClientLayout';  // 添加这行
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '资源桶',
  description: '资源桶 - 您的资源管理平台',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          #nprogress .bar {
            background: #000000; /* 黑色进度条 */
            height: 3px; /* 保持进度条高度不变 */
          }
          #nprogress .peg {
            box-shadow: 0 0 10px #000000, 0 0 5px #000000; /* 黑色阴影效果 */
          }
        `}</style>
      </head>
      <body>
        <Providers>
          <ClientLayout>
            <Toaster />
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
