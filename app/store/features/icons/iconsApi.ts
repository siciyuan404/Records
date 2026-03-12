import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface IconsResponse {
  icons: string[]
  total: number
}

export interface IconsRequest {
  page: number
  pageSize: number
}

export const iconsApi = createApi({
  reducerPath: 'iconsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getIcons: builder.query<IconsResponse, IconsRequest>({
      query: ({ page, pageSize }) => `icons?page=${page}&pageSize=${pageSize}`,
    }),
    getAllIcons: builder.query<string[], void>({
      query: () => 'icons',
    }),
  }),
})

export const { useGetIconsQuery, useGetAllIconsQuery } = iconsApi
