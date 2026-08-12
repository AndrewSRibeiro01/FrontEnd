import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Producer } from '../../domain/entities/producer';

export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ProducersState {
  byId: Record<string, Producer>;
  ids: string[];
  status: Status;
  error: string | null;
}

const initialState: ProducersState = {
  byId: {},
  ids: [],
  status: 'idle',
  error: null,
};

const producersSlice = createSlice({
  name: 'producers',
  initialState,
  reducers: {
    loadStarted(state) {
      state.status = 'loading';
      state.error = null;
    },
    loadSucceeded(state, action: PayloadAction<Producer[]>) {
      state.status = 'succeeded';
      state.byId = {};
      state.ids = [];
      for (const p of action.payload) {
        state.byId[p.id] = p;
        state.ids.push(p.id);
      }
    },
    loadFailed(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    upserted(state, action: PayloadAction<Producer>) {
      const p = action.payload;
      if (!state.byId[p.id]) state.ids.push(p.id);
      state.byId[p.id] = p;
    },
    removed(state, action: PayloadAction<string>) {
      delete state.byId[action.payload];
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
});

export const producersActions = producersSlice.actions;
export const producersReducer = producersSlice.reducer;
