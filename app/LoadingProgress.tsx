import { useEffect,Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import LoadingAnimation from '@/app/components/LoadingAnimation/LoadingAnimation';

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
    <Suspense fallback={<LoadingAnimation />}>
      null
    </Suspense>
  )
}