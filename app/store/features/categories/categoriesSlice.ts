import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategories } from '@/lib/api';

// 定义分类数据的接口
interface CategoryData {
  icon: string;
  link: string;
  items?: Record<string, CategoryData>;
}

// 定义分类状态的接口
interface CategoriesState {
  data: Record<string, CategoryData>; // 存储分类数据
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // 加载状态
  error: string | null; // 错误信息
}

// 初始状态
const initialState: CategoriesState = {
  data: {},
  status: 'idle',
  error: null,
};

// 创建异步action
export const fetchCategoriesAsync = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const categories = await fetchCategories();
      return categories;
    } catch (error) {
      return rejectWithValue('获取分类失败');
    }
  }
);

// 创建分类切片
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // 设置加载状态
    setCategoriesLoading: (state) => {
      state.status = 'loading';
    },
    // 设置加载成功状态，并更新数据
    setCategoriesSuccess: (state, action: PayloadAction<Record<string, CategoryData>>) => {
      state.status = 'succeeded';
      state.data = action.payload;
      state.error = null;
    },
    // 设置加载失败状态，并记录错误信息
    setCategoriesError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// 导出 action 创建函数
export const { setCategoriesLoading, setCategoriesSuccess, setCategoriesError } = categoriesSlice.actions;
// 导出 reducer
export default categoriesSlice.reducer;