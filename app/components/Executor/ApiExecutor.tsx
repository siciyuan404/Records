'use client'

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchResourcesAsync } from '@/app/store/features/resources/resourcesSlice';
import { fetchCategoriesAsync } from '@/app/store/features/categories/categoriesSlice';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const resourcesStatus = useAppSelector(state => state.resources.status);
  const categoriesStatus = useAppSelector(state => state.categories.status);

  useEffect(() => {
    if (resourcesStatus === 'idle') {
      dispatch(fetchResourcesAsync());
    }
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategoriesAsync());
    }
  }, [dispatch, resourcesStatus, categoriesStatus]);

  return <>{children}</>;
}
