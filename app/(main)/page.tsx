"use client"

import styles from './page.module.css';
import RecommendCard from '@/app/(main)/componets/RecommendCard/RecommendCard';
import CarouselCard from '@/app/(main)/componets/CarouselCard/CarouselCard';
import ResourceList from '@/app/components/ResourceList/ResourceList';


export default function Home() {
  return (
    <div>
      <div className={styles.grid}>
        <RecommendCard title="推荐资源" type="recommend" />
        <CarouselCard title="轮播图" />

      </div>
      <ResourceList />
    </div>
  );
}
