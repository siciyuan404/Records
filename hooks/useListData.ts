'use client';

/**
 * @deprecated 请直接使用 RTK Query hooks (useGetListItemsQuery) 替代
 * 此 Hook 已废弃，将在后续版本中删除
 * @see app/store/api/listApi.ts
 * @example
 * // 旧用法
 * const { recommend, hot, latest, top, carousel } = useListData();
 * // 新用法
 * const { data } = useGetListItemsQuery();
 * const { recommend = [], hot = [], latest = [], top = [], carousel = [] } = data || {};
 */

import { useGetListItemsQuery } from '@/app/store/api/listApi';

interface UseListDataOptions {
  type?: 'recommend' | 'hot' | 'latest' | 'top' | 'carousel';
  page?: number;
  pageSize?: number;
}

interface ListItem {
  uuid: string;
  name: string;
  category: string;
  images: string[];
  tags: string[];
  source_links: Record<string, {
    link: string;
    psw: string;
    size: string;
  }>;
  uploaded: number;
  update_time: number;
  introduction: string;
  resource_information: Record<string, string>;
  link: string;
  rating: number;
  comments: number;
  download_count: number;
  download_limit: number;
  other_information: Record<string, unknown>;
  score?: number;
}

interface ListResponse {
  recommend: ListItem[];
  hot: ListItem[];
  latest: ListItem[];
  top: ListItem[];
  carousel: string[];
}

interface UseListDataReturn {
  data: ListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  carousel: string[];
  recommend: ListItem[];
  hot: ListItem[];
  latest: ListItem[];
  top: ListItem[];
}

export function useListData(options: UseListDataOptions = {}): UseListDataReturn {
  const { type, page = 0, pageSize = 20 } = options;
  
  const { data, isLoading, isError, error, refetch } = useGetListItemsQuery(undefined);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    carousel: data?.carousel || [],
    recommend: data?.recommend || [],
    hot: data?.hot || [],
    latest: data?.latest || [],
    top: data?.top || [],
  };
}
