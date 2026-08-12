import { configureStore } from '@reduxjs/toolkit';

import { cropsReducer } from './crops.slice';
import { dashboardReducer } from './dashboard.slice';
import { farmsReducer } from './farms.slice';
import { harvestsReducer } from './harvests.slice';
import { producersReducer } from './producers.slice';

export const store = configureStore({
  reducer: {
    producers: producersReducer,
    farms: farmsReducer,
    harvests: harvestsReducer,
    crops: cropsReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
