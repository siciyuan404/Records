'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag: (
      command: 'config',
      targetId: string,
      config?: {
        page_path?: string;
        [key: string]: any;
      }
    ) => void;
    dataLayer: any[];
  }
}

export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      console.warn('Google Analytics ID 未配置');
      return;
    }

    if (pathname && typeof window.gtag === 'function') {
      const url = searchParams?.toString()
        ? `${pathname}?${searchParams}`
        : pathname;
        
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);
}