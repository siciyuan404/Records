'use client';

import { Suspense, useEffect, useState } from 'react';
import MainContent from './MainContent';
import LoadingAnimation from '@/app/components/LoadingAnimation/LoadingAnimation';
import { usePageTracking } from '@/hooks/usePageTracking';
import { useGetListItemsQuery } from '@/app/store/api/listApi';

function DataPrefetcher() {
  const [prefetched, setPrefetched] = useState(false);
  
  useGetListItemsQuery(undefined, {
    pollingInterval: 0,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!prefetched) {
      setPrefetched(true);
    }
  }, [prefetched]);

  return null;
}

export default function Home() {
  usePageTracking();

  return (
    <Suspense fallback={<LoadingAnimation />}>
      <DataPrefetcher />
      <MainContent />
    </Suspense>
  );
}
