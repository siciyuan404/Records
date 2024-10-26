import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const iconsApi = createApi({
  reducerPath: 'iconsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getIcons: builder.query<string[], void>({
      query: () => 'icons',
    }),
  }),
});

export const { useGetIconsQuery } = iconsApi;
