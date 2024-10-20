'use client';

import { useSearchParams } from 'next/navigation';
import ExternalLinkRedirect from '../components/ExternalLinkRedirect';
import { Suspense } from 'react';

export default function ExternalRedirectPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  if (!url) {
    return <div>无效的URL</div>;
  }

  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ExternalLinkRedirect href={url} />
    </Suspense>
  );
}
