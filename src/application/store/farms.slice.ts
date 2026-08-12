import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Farm } from '../../domain/entities/farm';
import type { Status } from './producers.slice';

export interface FarmsState {
  byId: Record<string, Farm>;
  ids: string[];
  status: Status;
  error: string | null;
}

const initialState: FarmsState = {
  byId: {},
  ids: [],
  status: 'idle',
  error: null,
};

const farmsSlice = createSlice({
  name: 'farms',
  initialState,
  reducers: {
    loadStarted(state) {
      state.status = 'loading';
      state.error = null;
    },
    loadSucceeded(state, action: PayloadAction<Farm[]>) {
      state.status = 'succeeded';
      state.byId = {};
      state.ids = [];
      for (const f of action.payload) {
        state.byId[f.id] = f;
        state.ids.push(f.id);
      }
    },
    loadFailed(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    upserted(state, action: PayloadAction<Farm>) {
      const f = action.payload;
      if (!state.byId[f.id]) state.ids.push(f.id);
      state.byId[f.id] = f;
    },
    removed(state, action: PayloadAction<string>) {
      delete state.byId[action.payload];
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
});

export const farmsActions = farmsSlice.actions;
export const farmsReducer = farmsSlice.reducer;
