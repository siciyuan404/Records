'use client';

import React, { Suspense } from 'react';
import NotFoundContent from './NotFoundContent';
import LoadingAnimation from '@/app/components/LoadingAnimation/LoadingAnimation';

const NotFoundPage = () => {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      {/* 使用 useSearchParams 的部分 */}
      <NotFoundContent />
    </Suspense>
  );
};

export default NotFoundPage;
