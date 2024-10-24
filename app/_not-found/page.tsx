'use client';

import React, { Suspense } from 'react';
import NotFoundContent from './NotFoundContent';

const NotFoundPage = () => {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      {/* 使用 useSearchParams 的部分 */}
      <NotFoundContent />
    </Suspense>
  );
};

export default NotFoundPage;
