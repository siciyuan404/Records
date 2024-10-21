import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

// 定义类别的接口
interface CategoryData {
  icon: string;
  link: string;
  items?: Record<string, CategoryData>;
}

// 创建 API slice
export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    getCategories: builder.query<Record<string, CategoryData>, void>({
      query: () => 'categories',
      providesTags: ['Categories'],
      transformResponse: (response: any) => {
        console.log('API response:', response);
        if (response && typeof response === 'object') {
          // 检查响应是否已经是正确的格式
          if (Object.values(response).every(value => 
            value !== null && typeof value === 'object' && 'icon' in value && 'link' in value
          )) {
            return response;
          }
          // 如果响应包含 categories 字段
          if (response.categories && typeof response.categories === 'object') {
            return response.categories;
          }
        }
        console.error('Unexpected API response format:', response);
        return {};
      },
      transformErrorResponse: (
        response: FetchBaseQueryError | undefined,
        meta,
        arg
      ) => {
        console.error('API error:', response);
        return response;
      },
    }),
  }),
});

// 导出生成的 hooks
export const {
  useGetCategoriesQuery,
} = categoriesApi;
