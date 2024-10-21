import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { resourcesApi } from './api/resourcesApi';
import { listApi } from './api/listApi';
import { categoriesApi } from './api/categoriesApi';
import categoriesReducer from './features/categories/categoriesSlice';
import resourcesReducer from './features/resources/resourcesSlice';
import listReducer from './features/list/listSlice';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    resources: resourcesReducer,
    list: listReducer,
    [resourcesApi.reducerPath]: resourcesApi.reducer,
    [listApi.reducerPath]: listApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      resourcesApi.middleware,
      listApi.middleware,
      categoriesApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
