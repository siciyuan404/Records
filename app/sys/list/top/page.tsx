'use client';

import React, { Suspense } from 'react';

const TopListPage: React.FC = () => {
  return (
    <Suspense fallback={<div>加载中...</div>}>

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">置顶列表</h1>
        {/* 在这里添加置顶列表内容 */}
      </div>
    </Suspense>
  );
};

export default TopListPage;
