'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ExternalLinkRedirect from '../components/ExternalLinkRedirect';
import LoadingAnimation from '@/app/components/LoadingAnimation/LoadingAnimation';

export default function ExternalRedirectContent() {
  const searchParams = useSearchParams();
  const url = searchParams?.get('url');

  if (!url) {
    return <div>无效的URL</div>;
  }

  <Suspense fallback={<LoadingAnimation />}>
    <ExternalLinkRedirect href={url} />
  </Suspense>;
}
