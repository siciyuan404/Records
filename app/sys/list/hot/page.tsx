'use client';

import React, { Suspense } from 'react';

const HotListPage = () => {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">热门列表</h1>
        {/* 在这里添加热门列表内容 */}
      </div>
    </Suspense>
  );
};

export default HotListPage;
