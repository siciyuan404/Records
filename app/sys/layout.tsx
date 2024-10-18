"use client"

import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Header from './components/Header'  // 新增导入

export default function SysLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-grow overflow-hidden">
        <Header />
        <main className="flex-grow p-10 overflow-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}