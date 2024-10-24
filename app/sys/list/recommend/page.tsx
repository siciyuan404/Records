import React from 'react';
import type {Viewport } from 'next';

export const metadata = {
  title: '推荐资源',
  description: '四次元资源桶 - 推荐资源列表',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RecommendListPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">推荐列表</h1>
      {/* 在这里添加推荐列表内容 */}
    </div>
  );
};

export default RecommendListPage;
