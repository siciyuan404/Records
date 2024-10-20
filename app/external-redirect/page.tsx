'use client';

import { useState, useEffect } from 'react';
import ExternalLinkRedirect from '../components/ExternalLinkRedirect';

export default function ExternalRedirectPage() {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlParam = searchParams.get('url');
    setUrl(urlParam);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (!url) {
    return <div>无效的URL</div>;
  }

  return <ExternalLinkRedirect href={url} />;
}
