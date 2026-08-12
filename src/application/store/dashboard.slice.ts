import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { DashboardSummary } from '../../domain/entities/dashboard';
import type { Status } from './producers.slice';

export interface DashboardState {
  data: DashboardSummary | null;
  status: Status;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  status: 'idle',
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    loadStarted(state) {
      state.status = 'loading';
      state.error = null;
    },
    loadSucceeded(state, action: PayloadAction<DashboardSummary>) {
      state.status = 'succeeded';
      state.data = action.payload;
    },
    loadFailed(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const dashboardActions = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;
