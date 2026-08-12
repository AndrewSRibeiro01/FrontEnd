import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Producer } from '../../domain/entities/producer';

interface ProducersState {
  items: Producer[];
  loading: boolean;
  error: string | null;
}

const initialState: ProducersState = {
  items: [],
  loading: false,
  error: null,
};

const producersSlice = createSlice({
  name: 'producers',
  initialState,
  reducers: {
    loadStarted(state) {
      state.loading = true;
      state.error = null;
    },
    loadSucceeded(state, action: PayloadAction<Producer[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    loadFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { loadStarted, loadSucceeded, loadFailed } = producersSlice.actions;
export const producersReducer = producersSlice.reducer;
