'use client'


import Header from '@/app/components/Header';
import TabComponent from '@/app/components/TabComponent/TabComponent';
import ApiExecutor from '@/app/components/Executor/ApiExecutor';



export default function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <div>
      <ApiExecutor />
      <Header />
      <TabComponent />
      {children}
    </div>
  );
}