'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import LoadingAnimation from '../components/LoadingAnimation/LoadingAnimation';

// 动态导入非关键组件，实现代码分割
const CarouselCard = dynamic(
  () => import('./components/CarouselCard/CarouselCard'),
  { 
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: true 
  }
);

const RecommendCard = dynamic(
  () => import('./components/RecommendCard/RecommendCard'),
  { 
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: false 
  }
);

const LatestResourceCard = dynamic(
  () => import('./components/LatestResourceCard/LatestResourceCard'),
  { 
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: false 
  }
);

const HotCard = dynamic(
  () => import('./components/HotCard/HotCard'),
  { 
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: false 
  }
);

const RevenueRankingCard = dynamic(
  () => import('./components/RevenueRankingCard/RevenueRankingCard'),
  { 
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: false 
  }
);

const HeatmapCard = dynamic(
  () => import('./components/HeatmapCard/HeatmapCard'),
  { 
    loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: false 
  }
);

const ResourceList = dynamic(
  () => import('../components/ResourceList/ResourceList'),
  { 
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: false 
  }
);

function MainContentInner() {
  const searchParams = useSearchParams();
  
  return (
    <div>
      <div className={styles.grid}>
        <CarouselCard title="轮播图" />
        <RecommendCard title="推荐资源" type="recommend" />
        <LatestResourceCard title="最新资源" />
        <HotCard title="热门资源" />
        <RevenueRankingCard title="收入排行榜" />
        <HeatmapCard />
      </div>
      <ResourceList />
    </div>
  );
}

export default function MainContent() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <MainContentInner />
    </Suspense>
  );
}
