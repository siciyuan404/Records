import './globals.css';
import { Inter } from 'next/font/google'  // 这是谷歌字体
import { Providers } from './components/Providers';
import ApiExecutor from './components/Executor/ApiExecutor';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin Backend',
  description: 'A powerful admin backend system',
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
          <ApiExecutor>{children}</ApiExecutor>
        </Providers>
      </body>
    </html>
  )
}
