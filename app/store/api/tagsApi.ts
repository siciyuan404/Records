import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Tag {
  id: string;
  name: string;
  // 添加其他标签相关的属性
}

export const tagsApi = createApi({
  reducerPath: 'tagsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // 根据您的API端点调整baseUrl
  endpoints: (builder) => ({
    getTags: builder.query<Record<string, Tag>, void>({
      query: () => 'tags',
      // API直接返回对象,无需转换
      transformResponse: (response: Record<string, Tag>) => response,
    }),
    addTag: builder.mutation<Tag, Partial<Tag>>({
      query: (newTag) => ({
        url: 'tags',
        method: 'POST',
        body: newTag,
      }),
    }),
    updateTag: builder.mutation<Tag, Partial<Tag> & Pick<Tag, 'id'>>({
      query: (updatedTag) => ({
        url: `tags/${updatedTag.id}`,
        method: 'PUT',
        body: updatedTag,
      }),
    }),
    deleteTag: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `tags/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetTagsQuery,
  useAddTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagsApi;
