import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChangeRecord } from '@/app/sys/add/types';

// 这是一个 TypeScript 接口定义，名为 ChangeRecordsState。它描述了变更记录状态的结构。

interface ChangeRecordsState {
  records: ChangeRecord[]; // 这是一个 ChangeRecord 类型的数组，用于存储变更记录
}

const initialState: ChangeRecordsState = {
  records: [],
};

const changeRecordsSlice = createSlice({
  name: 'changeRecords',
  initialState,
  reducers: {
    addChangeRecord: (state, action: PayloadAction<ChangeRecord>) => {
      state.records.push(action.payload);
    },
    deleteChangeRecord: (state, action: PayloadAction<number>) => {
      state.records.splice(action.payload, 1);
    },
    moveChangeRecord: (state, action: PayloadAction<{ index: number; direction: 'up' | 'down' }>) => {
      // 这个 reducer 用于移动变更记录的位置
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
    clearChangeRecords: (state) => {
      state.records = [];
    },
  },
});

export const { addChangeRecord, deleteChangeRecord, moveChangeRecord, clearChangeRecords } = changeRecordsSlice.actions;

// 这是一个 thunk action creator，用于模拟同步到 GitHub 的操作
export const syncToGithub = () => async (dispatch: any) => {
  // 在这里实现同步到 GitHub 的逻辑
  console.log('Syncing to GitHub...');
  
  // 同步完成后，可以清除变更记录
  dispatch(clearChangeRecords());
};

export default changeRecordsSlice.reducer;
