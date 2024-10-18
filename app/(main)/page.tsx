"use client"

import { useEffect } from 'react';
import styles from './page.module.css';
import RecommendCard from '@/app/(main)/componets/RecommendCard/RecommendCard';
import { fetchList } from '@/app/store/features/list/listSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store/store';
import CarouselCard from '@/app/(main)/componets/CarouselCard/CarouselCard';



export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.list);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchList());
    }
  }, [dispatch, status]);
  return (
    <div className={styles.grid}>
      <RecommendCard title="推荐资源" type="recommend" />
      <CarouselCard title="轮播图"/>
    </div>
  );
}
