import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Tab {
  path: string;
  title: string;
}

interface TabsState {
  tabs: Tab[];
  activeTab: string | null;
}

const initialState: TabsState = {
  tabs: [],
  activeTab: null,
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<Tab>) => {
      if (!state.tabs.some(tab => tab.path === action.payload.path)) {
        state.tabs.push(action.payload);
      }
      state.activeTab = action.payload.path;
    },
    removeTab: (state, action: PayloadAction<string>) => {
      state.tabs = state.tabs.filter(tab => tab.path !== action.payload);
      if (state.activeTab === action.payload) {
        state.activeTab = state.tabs.length > 0 ? state.tabs[state.tabs.length - 1].path : null;
      }
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    clearAllTabs: (state) => {
      state.tabs = [];
      state.activeTab = null;
    },
  },
});

export const { addTab, removeTab, setActiveTab, clearAllTabs } = tabsSlice.actions;
export default tabsSlice.reducer;
