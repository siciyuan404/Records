'use client';

import React, { Suspense } from 'react';

const ResourceListPage = () => {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">资源列表</h1>
        {/* 在这里添加资源列表内容 */}
      </div>
    </Suspense>
  );
};

export default ResourceListPage;
