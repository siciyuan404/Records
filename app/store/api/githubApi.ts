import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Resource, ResourcesState } from '@/app/sys/add/types';

interface SyncPayload {
  action: 'add' | 'edit' | 'delete' | 'updateList' | 'sync';
  uuid?: string;
  data?: Resource | ResourcesState | any; // 使用更具体的类型替换 'any'
}

export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/github' }), // 根据您的GitHub API端点调整baseUrl
  endpoints: (builder) => ({
    syncWithGithub: builder.mutation<{ success: boolean; message: string }, SyncPayload>({
      query: (payload) => ({
        url: 'sync',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useSyncWithGithubMutation } = githubApi;
