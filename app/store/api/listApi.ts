import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 定义列表项的接口
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

// 创建 listApi
export const listApi = createApi({
  reducerPath: 'listApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['List'],
  endpoints: (builder) => ({
    // 获取所有列表项
    getListItems: builder.query<ListResponse, void>({
      query: () => 'list',
      providesTags: ['List'],
      extraOptions: {
        staleTime: 5 * 60 * 1000, // 5分钟内数据视为新鲜
      },
    }),

    // 获取单个列表项
    getListItem: builder.query<ListItem, string>({
      query: (uuid) => `list/${uuid}`,
      providesTags: (_result, _error, uuid) => [{ type: 'List', uuid }],
    }),

    // 添加新的列表项
    addListItem: builder.mutation<ListItem, Omit<ListItem, 'uuid'>>({
      query: (newItem) => ({
        url: 'list',
        method: 'POST',
        body: newItem,
      }),
      invalidatesTags: ['List'],
    }),

    // 更新列表项
    updateListItem: builder.mutation<ListItem, ListItem>({
      query: (updatedItem) => ({
        url: `list/${updatedItem.uuid}`,
        method: 'PUT',
        body: updatedItem,
      }),
      invalidatesTags: (_result, _error, { uuid }) => [{ type: 'List', uuid }],
    }),

    // 删除列表项
    deleteListItem: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `list/${uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, uuid) => [{ type: 'List', uuid }],
    }),
  }),
});

// 导出生成的 hooks
export const {
  useGetListItemsQuery,
  useGetListItemQuery,
  useAddListItemMutation,
  useUpdateListItemMutation,
  useDeleteListItemMutation,
} = listApi;
