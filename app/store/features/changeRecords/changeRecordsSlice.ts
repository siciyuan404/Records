import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChangeRecord } from '@/app/sys/add/types';

interface ChangeRecordsState {
  records: ChangeRecord[];
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
      const { index, direction } = action.payload;
      if (direction === 'up' && index > 0) {
        [state.records[index - 1], state.records[index]] = [state.records[index], state.records[index - 1]];
      } else if (direction === 'down' && index < state.records.length - 1) {
        [state.records[index], state.records[index + 1]] = [state.records[index + 1], state.records[index]];
      }
    },
    clearChangeRecords: (state) => {
      state.records = [];
    },
  },
});

export const { addChangeRecord, deleteChangeRecord, moveChangeRecord, clearChangeRecords } = changeRecordsSlice.actions;

// 这是一个 thunk action creator，用于模拟同步到 GitHub 的操作
export const syncToGithub = () => async (dispatch: any, getState: any) => {
  // 在这里实现同步到 GitHub 的逻辑
  console.log('Syncing to GitHub...');
  // 同步完成后，可以清除变更记录
  dispatch(clearChangeRecords());
};

export default changeRecordsSlice.reducer;
