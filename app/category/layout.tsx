'use client'


import Header from '@/app/components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}