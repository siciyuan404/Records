'use client';

import React, { Suspense } from 'react';

const RecommendListPage = () => {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">推荐列表</h1>
        {/* 在这里添加推荐列表内容 */}
      </div>
    </Suspense>
  );
};

export default RecommendListPage;
