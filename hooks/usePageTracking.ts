'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = searchParams?.toString()
        ? `${pathname}?${searchParams}`
        : pathname;
        
      // 发送页面浏览事件到 GA
      window.gtag('config', 'G-LSHMB96X28', {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);
}