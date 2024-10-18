import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './features/categories/categoriesSlice';
import resourcesReducer from './features/resources/resourcesSlice';
import listReducer from './features/list/listSlice';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    resources: resourcesReducer,
    list: listReducer,
    // 其他reducers...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
