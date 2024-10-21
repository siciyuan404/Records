'use client'

import { useEffect } from 'react';
import { useGetResourcesQuery } from '@/app/store/api/resourcesApi';
import { useGetCategoriesQuery } from '@/app/store/api/categoriesApi';
import { useGetListItemsQuery } from '@/app/store/api/listApi';

export default function ApiExecutor() {
  const { 
    data: resourcesData, 
    error: resourcesError, 
    isLoading: isResourcesLoading 
  } = useGetResourcesQuery();

  const { 
    data: categoriesData, 
    error: categoriesError, 
    isLoading: isCategoriesLoading 
  } = useGetCategoriesQuery();

  const { 
    data: listData, 
    error: listError, 
    isLoading: isListLoading 
  } = useGetListItemsQuery();

  useEffect(() => {
    if (resourcesData) {
      console.log('Resources data:', resourcesData);
    }
    if (categoriesData) {
      console.log('Categories data:', categoriesData);
    }
    if (listData) {
      console.log('List data:', listData);
    }
  }, [resourcesData, categoriesData, listData]);

  useEffect(() => {
    if (resourcesError) {
      console.error('Error fetching resources:', resourcesError);
    }
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
    }
    if (listError) {
      console.error('Error fetching list:', listError);
    }
  }, [resourcesError, categoriesError, listError]);

  if (isResourcesLoading || isCategoriesLoading || isListLoading) {
    return <div>加载中...</div>;
  }

  if (resourcesError || categoriesError || listError) {
    return <div>加载数据时出错</div>;
  }

  // 如果所有数据都已加载成功,可以在这里进行进一步的处理或渲染
  return null;
}
