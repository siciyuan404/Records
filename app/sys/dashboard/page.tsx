'use client';

import React, { Suspense } from 'react';

const DashboardPage = () => {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">仪表盘</h1>
      </div>
    </Suspense>
  );
};

export default DashboardPage;
