'use client';

import { useSearchParams } from 'next/navigation';
import ExternalLinkRedirect from '../components/ExternalLinkRedirect';

export default function ExternalRedirectContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  if (!url) {
    return <div>无效的URL</div>;
  }

  return <ExternalLinkRedirect href={url} />;
}
