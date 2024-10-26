import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Resource, ResourcesState } from '@/app/sys/add/types';
import axios from 'axios';
import { ChangeRecord } from '@/app/sys/add/types';

interface SyncPayload {
  action: 'add' | 'edit' | 'delete' | 'updateList' | 'sync';
  uuid?: string;
  data?: Resource | ResourcesState | any; // 使用更具体的类型替换 'any'
}

const GITHUB_API_URL = 'https://api.github.com/repos//你的仓库/contents/变更记录.json';

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
    syncChanges: builder.mutation<ChangeRecord[], ChangeRecord[]>({
      query: (records) => ({
        url: GITHUB_API_URL,
        method: 'PUT',
        body: records,
      }),
    }),
  }),
});

export const { useSyncWithGithubMutation } = githubApi;

export const syncChanges = async (records: ChangeRecord[]) => {
  const content = JSON.stringify(records, null, 2);
  const response = await axios.put(GITHUB_API_URL, {
    message: '同步变更记录',
    content: btoa(content),
  }, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
