'use client';

import React, { Suspense } from 'react';
import LoadingAnimation from '@/app/components/LoadingAnimation/LoadingAnimation';

const HotListPage = () => {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">热门列表</h1>
        {/* 在这里添加热门列表内容 */}
      </div>
    </Suspense>
  );
};

export default HotListPage;
