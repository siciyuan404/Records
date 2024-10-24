'use client';

import React, { Suspense } from 'react';
import LoadingAnimation from '@/app/components/LoadingAnimation/LoadingAnimation';

const DashboardPage = () => {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">仪表盘</h1>
      </div>
    </Suspense>
  );
};

export default DashboardPage;
