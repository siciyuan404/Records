'use client';

import React, { Suspense } from 'react';
import LoadingAnimation from '@/app/components/LoadingAnimation/LoadingAnimation';

const RecommendListPage = () => {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">推荐列表</h1>
        {/* 在这里添加推荐列表内容 */}
      </div>
    </Suspense>
  );
};

export default RecommendListPage;
