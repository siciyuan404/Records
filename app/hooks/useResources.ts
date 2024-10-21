import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResourcesAsync } from '@/app/store/features/resources/resourcesSlice';

export const useResources = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state: { resources: any }) => state.resources);

  useEffect(() => {
    if (status === 'idle') {
      // 使用类型断言来解决类型错误
      dispatch(fetchResourcesAsync() as any);
    }
  }, [dispatch, status]);

  return { data, status, error };
};
