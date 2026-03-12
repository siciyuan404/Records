/**
 * @deprecated 请使用 RTK Query hooks (useGetResourcesQuery) 替代
 * 此 Hook 已废弃，将在后续版本中删除
 * @see app/store/api/resourcesApi.ts
 * @example
 * // 旧用法
 * const { data, status, error } = useResources();
 * // 新用法
 * const { data, isLoading, isError, error } = useGetResourcesQuery();
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResourcesAsync } from '@/app/store/features/resources/resourcesSlice';

export const useResources = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state: { resources: any }) => state.resources);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchResourcesAsync() as any);
    }
  }, [dispatch, status]);

  return { data, status, error };
};
