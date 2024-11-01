import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { resourcesApi } from './api/resourcesApi';
import { listApi } from './api/listApi';
import { categoriesApi } from './api/categoriesApi';
import { tagsApi } from './api/tagsApi';
import { githubApi } from './api/githubApi';
import categoriesReducer from './features/categories/categoriesSlice';
import resourcesReducer from './features/resources/resourcesSlice';
import listReducer from './features/list/listSlice';
import tabsReducer from './features/tabs/tabsSlice';
import changeRecordsReducer from './features/changeRecords/changeRecordsSlice';
import { iconsApi } from './features/icons/iconsApi';

export const store = configureStore({
  reducer: {
    tabs: tabsReducer,
    categories: categoriesReducer,
    resources: resourcesReducer,
    list: listReducer,
    changeRecords: changeRecordsReducer,
    [resourcesApi.reducerPath]: resourcesApi.reducer,
    [listApi.reducerPath]: listApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [githubApi.reducerPath]: githubApi.reducer,
    [iconsApi.reducerPath]: iconsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      resourcesApi.middleware,
      listApi.middleware,
      categoriesApi.middleware,
      tagsApi.middleware,
      githubApi.middleware,
      iconsApi.middleware
    )
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
