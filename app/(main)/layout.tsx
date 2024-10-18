'use client'


import Header from '@/app/components/Header';
import TabComponent from '@/app/components/TabComponent/TabComponent';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <TabComponent />
      {children}
    </div>
  );
}