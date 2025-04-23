'use client';

import { Suspense } from 'react';
import MainContent from './MainContent';
import LoadingAnimation from '@/app/components/LoadingAnimation/LoadingAnimation';
import { usePageTracking } from '@/hooks/usePageTracking';

export default function Home() {
  usePageTracking();

  return (
    <Suspense fallback={<LoadingAnimation />}>
      <MainContent />
    </Suspense>
  );
}
