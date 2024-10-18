import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchList as fetchListAPI } from '@/lib/api';

interface SourceLink {
  link: string;
  psw: string;
  size: string;
}

interface ListItem {
  uuid: string;
  name: string;
  category: string;
  images: string[];
  tags: string[];
  source_links: Record<string, SourceLink>;
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
}

interface ListData {
  recommend: ListItem[];
  hot: ListItem[];
  latest: ListItem[];
  top: ListItem[];
  carousel: [];
}

interface ListState {
  data: ListData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ListState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchList = createAsyncThunk('list/fetchList', async () => {
  const response = await fetchListAPI();
  return response;
});

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    clearListCache: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchList.fulfilled, (state, action: PayloadAction<ListData>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '获取列表数据失败';
      });
  },
});

export const { clearListCache } = listSlice.actions;
export default listSlice.reducer;
