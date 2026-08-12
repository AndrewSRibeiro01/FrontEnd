import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Crop } from '../../domain/entities/crop';
import type { Status } from './producers.slice';

export interface CropsState {
  byId: Record<string, Crop>;
  ids: string[];
  status: Status;
  error: string | null;
}

const initialState: CropsState = {
  byId: {},
  ids: [],
  status: 'idle',
  error: null,
};

const cropsSlice = createSlice({
  name: 'crops',
  initialState,
  reducers: {
    loadStarted(state) {
      state.status = 'loading';
      state.error = null;
    },
    loadSucceeded(state, action: PayloadAction<Crop[]>) {
      state.status = 'succeeded';
      state.byId = {};
      state.ids = [];
      for (const c of action.payload) {
        state.byId[c.id] = c;
        state.ids.push(c.id);
      }
    },
    loadFailed(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    upserted(state, action: PayloadAction<Crop>) {
      const c = action.payload;
      if (!state.byId[c.id]) state.ids.push(c.id);
      state.byId[c.id] = c;
    },
    removed(state, action: PayloadAction<string>) {
      delete state.byId[action.payload];
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
});

export const cropsActions = cropsSlice.actions;
export const cropsReducer = cropsSlice.reducer;
