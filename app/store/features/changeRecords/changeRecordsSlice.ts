import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/app/store/store';

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
        throw new Error('编辑操作必包含 uuid 和 data 字段');
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
      if (!record.data) {
        throw new Error('批量操作必须包含 data 字段');
      }
      // if (!record.data || !Array.isArray(record.data)) {
      //   throw new Error('批量操作必须包含数组类型的 data 字段');
      // }
      return {
        type: '批量操作',
        description: `批量处理 ${record.data.length} 条记录`,
        data: record.data
      };

    default:
      return {
        type: '未知操作',
        description: `未知的操作类型: ${record.action}`
      };
  }
};

// 修改同步方法
// 这个函数用于将变更记录同步到 GitHub 仓库
// 通过调用 GitHub API 将数据更新到指定的文件中
// 参数说明:
// - owner: GitHub 仓库所有者
// - repo: GitHub 仓库名称 
// - path: 要更新的文件路径
// - content: 文件内容
// - sha: 文件的 SHA 值,用于版本控制
export const syncToGithub = createAsyncThunk(
  'changeRecords/syncToGithub',
  async (_, { getState }) => {
    // 发送 POST 请求到 GitHub API
    const response = await fetch('/api/github', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateFile',
        owner: process.env.NEXT_PUBLIC_GITHUB_OWNER, // GitHub 仓库所有者
        repo: process.env.NEXT_PUBLIC_GITHUB_REPO,   // GitHub 仓库名称
        path: 'path/to/your/file',  // 要更新的文件路径
        content: 'your content',     // 文件内容
        sha: 'file-sha'             // 文件的 SHA 值
      })
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error('Failed to sync with GitHub');
    }

    // 返回响应数据
    return await response.json();
  }
);

const fetchFileSha = async (owner: string, repo: string, path: string): Promise<string> => {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('获取文件 SHA 失败');
  }

  const data = await response.json();
  return data.sha;
};

export const syncToGithub2 = createAsyncThunk(
  'changeRecords/syncToGithub2',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    console.log('state:', state.changeRecords.records);


    // 逐一处理变更记录
    const processedChanges = state.changeRecords.records.map(record => processChangeRecord(record));
    processedChanges.forEach(change => {
      console.log('change:', change);
    });
    // 整理同步内容
    // const content = processedChanges.map(change => change.description).join('\n');
    // console.log('content:', content);
    
    // try {
    //   // 获取文件的最新 SHA
    //   const fileSha = await fetchFileSha(
    //     process.env.NEXT_PUBLIC_GITHUB_OWNER!,
    //     process.env.NEXT_PUBLIC_GITHUB_REPO!,
    //     'path/to/your/file'
    //   );

    //   // 发送统一请求到 GitHub
    //   const response = await fetch('/api/github/updateFile', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       owner: process.env.NEXT_PUBLIC_GITHUB_OWNER, // GitHub 仓库所有者
    //       repo: process.env.NEXT_PUBLIC_GITHUB_REPO,   // GitHub 仓库名称
    //       path: 'path/to/your/file',                    // 要更新的文件路径
    //       content: btoa(content),                       // 文件内容进行Base64编码
    //       sha: fileSha                                  // 文件的 SHA 值
    //     })
    //   });
      
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.error || 'GitHub 同步失败');
    //   }
      
    //   const data = await response.json();
    //   console.log('GitHub 同步成功:', data);
      
    //   // 同步成功后，清空变更记录
    //   dispatch(clearChangeRecords());
      
    // } catch (error) {
    //   console.error('GitHub 同步错误:', error);
    //   throw error;
    // }
  }
);



export default changeRecordsSlice.reducer;
