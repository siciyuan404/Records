// createApi用于创建一个API服务，简化了与后端的交互，提供了自动生成的hooks来进行数据请求和状态管理。
// fetchBaseQuery是一个基本的查询函数，用于简化HTTP请求的构建，支持基本的GET、POST等请求方式，并可以配置基础URL和其他选项。
import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { Resource } from '@/app/sys/add/types';

export const resourcesApi = createApi({
  reducerPath: 'resourcesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }), // 设置基础URL
  tagTypes: ['Resource'],
  endpoints: (builder) => ({
    getResources: builder.query<Record<string, Resource>, void>({
      query: () => 'resources',
      providesTags: ['Resource'],
    }),
    getResourceById: builder.query<Resource, string>({
      query: (id) => `resources/${id}`,
      providesTags: (result, error, id) => [{ type: 'Resource', id }],
    }),
    addResource: builder.mutation<Resource, Partial<Resource> & { id: string }>({
      query: ({ id, ...resource }) => ({
        url: `resources/${id}`,
        method: 'POST',
        body: resource,
      }),
      invalidatesTags: ['Resource'],
    }),
    updateResource: builder.mutation<Resource, Partial<Resource> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `resources/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Resource', id }],
    }),
    deleteResource: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `resources/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Resource', id }],
    }),
  }),
});

export const {
  useGetResourcesQuery,
  useGetResourceByIdQuery,
  useAddResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} = resourcesApi;
