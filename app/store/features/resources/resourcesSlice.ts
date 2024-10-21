import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Resource } from '@/app/sys/add/types';
import { fetchResources } from '@/lib/api';

interface Tab {
  path: string;
  title: string;
}

export interface ResourcesState {
  data: Record<string, Resource>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  tabs: Tab[];
  cache: Record<string, any>; // 添加这一行
}

const initialState: ResourcesState = {
  data: {},
  status: 'idle',
  error: null,
  tabs: [],
  cache: {}, // 添加这一行
};

export const fetchResourcesAsync = createAsyncThunk(
  'resources/fetchResources',
  async (_, { rejectWithValue }) => {
    console.log('Fetching new data...');
    try {
      const resources = await fetchResources();
      console.log('New data fetched:', resources);
      return resources;
    } catch (error) {
      console.error('Error fetching resources:', error);
      return rejectWithValue((error as Error).message);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { resources: ResourcesState };
      console.log('fetchResourcesAsync condition check. Current state:', state.resources);
      // 如果正在加载或已经成功加载，则不执行
      if (state.resources.status === 'loading' || state.resources.status === 'succeeded') {
        console.log('Skipping fetchResourcesAsync due to current state');
        return false;
      }
      return true;
    },
  }
);

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<Tab>) => {
      if (!state.tabs.find(tab => tab.path === action.payload.path)) {
        state.tabs.push(action.payload);
      }
    },
    removeTab: (state, action: PayloadAction<string>) => {
      state.tabs = state.tabs.filter(tab => tab.path !== action.payload);
    },
    clearCache: (state, action: PayloadAction<string>) => {
      // 检查 action.payload 是否存在于 cache 中
      if (action.payload in state.cache) {
        delete state.cache[action.payload];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResourcesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchResourcesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // 直接使用返回的数据，因为它已经是正确的格式
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchResourcesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { addTab, removeTab, clearCache } = resourcesSlice.actions;
export default resourcesSlice.reducer;
