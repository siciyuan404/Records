import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

// 首先定义 ChangeRecord 类型
export interface ChangeRecord {
  action: 'add' | 'edit' | 'delete' | 'bulk';
  uuid?: string;  // 对于 add/edit/delete 操作需要
  data?: any;     // 对于 add/edit/bulk 操作需要
}

interface ChangeRecordsState {
  records: ChangeRecord[];
  syncStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedRecords: number[]; // 用于批量操作的选中记录索引
}

const initialState: ChangeRecordsState = {
  records: [],
  syncStatus: 'idle',
  error: null,
  selectedRecords: [],
};

const changeRecordsSlice = createSlice({
  name: 'changeRecords',
  initialState,
  reducers: {
    // 添加变更记录
    addChangeRecord: (state, action: PayloadAction<ChangeRecord>) => {
      state.records.push(action.payload);
    },
    // 删除变更记录
    deleteChangeRecord: (state, action: PayloadAction<number>) => {
      state.records.splice(action.payload, 1);
    },
    // 移动变更记录的位置
    moveChangeRecord: (state, action: PayloadAction<{ index: number; direction: 'up' | 'down' }>) => {
      const { index, direction } = action.payload;
      
      // 如果方向是向上移动，且当前索引大于0（不是第一个元素）
      if (direction === 'up' && index > 0) {
        // 交换当前元素和它上面的元素
        [state.records[index - 1], state.records[index]] = [state.records[index], state.records[index - 1]];
      } 
      // 如果方向是向下移动，且当前索引小于数组最后一个元素的索引
      else if (direction === 'down' && index < state.records.length - 1) {
        // 交换当前元素和它下面的元素
        [state.records[index], state.records[index + 1]] = [state.records[index + 1], state.records[index]];
      }
      // 如果不满足上述条件（例如，已经是第一个或最后一个元素），则不进行任何操作
    },
    // 清空所有变更记录
    clearChangeRecords: (state) => {
      state.records = [];
    },
    // 编辑变更记录
    editChangeRecord: (
      state,
      action: PayloadAction<{ index: number; updatedRecord: Partial<ChangeRecord> }>
    ) => {
      const { index, updatedRecord } = action.payload;
      state.records[index] = { ...state.records[index], ...updatedRecord };
    },
    // 切换变更记录的选中状态
    toggleRecordSelection: (state, action: PayloadAction<number>) => {
      const index = state.selectedRecords.indexOf(action.payload);
      if (index === -1) {
        state.selectedRecords.push(action.payload);
      } else {
        state.selectedRecords.splice(index, 1);
      }
    },
    // 删除选中的变更记录
    deleteSelectedRecords: (state) => {
      // 从大到小排序，以避免删除时索引变化的问题
      const sortedIndices = [...state.selectedRecords].sort((a, b) => b - a);
      sortedIndices.forEach(index => {
        state.records.splice(index, 1);
      });
      state.selectedRecords = [];
    },
    // 设置同步状态
    setSyncStatus: (
      state,
      action: PayloadAction<{ status: 'idle' | 'loading' | 'succeeded' | 'failed'; error?: string }>
    ) => {
      state.syncStatus = action.payload.status;
      state.error = action.payload.error || null;
    },
  },
});

export const {
  addChangeRecord,
  deleteChangeRecord,
  moveChangeRecord,
  clearChangeRecords,
  editChangeRecord,
  toggleRecordSelection,
  deleteSelectedRecords,
  setSyncStatus,
} = changeRecordsSlice.actions;

// 添加新的工具函数
export const processChangeRecord = (record: ChangeRecord) => {
  switch (record.action) {
    case 'add':
      if (!record.data) {
        throw new Error('添加操作必须包含 data 字段');
      }
      return {
        type: '添加',
        description: `添加新记录: ${JSON.stringify(record.data).slice(0, 50)}...`,
        data: record.data
      };

    case 'edit':
      if (!record.uuid || !record.data) {
        throw new Error('编辑操作必���包含 uuid 和 data 字段');
      }
      return {
        type: '编辑',
        description: `编辑记录 ${record.uuid}: ${JSON.stringify(record.data).slice(0, 50)}...`,
        uuid: record.uuid,
        data: record.data
      };

    case 'delete':
      if (!record.uuid) {
        throw new Error('删除操作必须包含 uuid 字段');
      }
      return {
        type: '删除',
        description: `删除记录: ${record.uuid}`,
        uuid: record.uuid
      };

    case 'bulk':
      if (!record.data || !Array.isArray(record.data)) {
        throw new Error('批量操作必须包含数组类型的 data 字段');
      }
      return {
        type: '批量操作',
        description: `批量处理 ${record.data.length} 条记录`,
        data: record.data
      };

    default:
      throw new Error('未知的操作类型');
  }
};

// 修改同步方法
export const syncToGithub = createAsyncThunk(
  'changeRecords/syncToGithub',
  async (_, { getState }) => {
    const response = await fetch('/api/github', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateFile',
        owner: process.env.NEXT_PUBLIC_GITHUB_OWNER,
        repo: process.env.NEXT_PUBLIC_GITHUB_REPO,
        path: 'path/to/your/file',
        content: 'your content',
        sha: 'file-sha'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to sync with GitHub');
    }

    return await response.json();
  }
);




export default changeRecordsSlice.reducer;
