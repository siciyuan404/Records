"use client"

import { Suspense } from 'react';
import MainContent from './MainContent';

export default function Home() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <MainContent />
    </Suspense>
  );
}
