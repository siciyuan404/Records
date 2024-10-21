'use client'


import Header from '@/app/components/Header';
import TabComponent from '@/app/components/TabComponent/TabComponent';
import Footer from '@/app/components/Footer/Footer';



export default function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <div>
      <Header />
      <TabComponent />
      {children}
      <Footer />
    </div>
  );
}