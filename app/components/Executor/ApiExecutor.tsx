'use client'

import { useEffect } from 'react';
import { useGetResourcesQuery } from '@/app/store/api/resourcesApi';
// import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
// import { fetchResourcesAsync } from '@/app/store/features/resources/resourcesSlice';
// import { fetchCategoriesAsync } from '@/app/store/features/categories/categoriesSlice';
// import { fetchList } from '@/app/store/features/list/listSlice';


export default function ClientWrapper() {
  const { data, error, isLoading } = useGetResourcesQuery();

  useEffect(() => {
    if (data) {
      console.log('Resources data:', data);
    }
    if (error) {
      console.error('Error fetching resources:', error);
    }
  }, [data, error]);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>加载资源时出错</div>;
  }

  return null;
}
