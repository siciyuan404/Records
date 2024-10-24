import { useEffect,Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

export function LoadingProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      null
    </Suspense>
  )
}