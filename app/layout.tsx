import './globals.css';
import { Inter } from 'next/font/google'  // 这是谷歌字体
import { Providers } from './components/Providers';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '404资源桶',
  description: '404资源桶-综合网盘聚合开源资源站',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  )
}
