import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Harvest } from '../../domain/entities/harvest';
import type { Status } from './producers.slice';

export interface HarvestsState {
  byId: Record<string, Harvest>;
  ids: string[];
  status: Status;
  error: string | null;
}

const initialState: HarvestsState = {
  byId: {},
  ids: [],
  status: 'idle',
  error: null,
};

const harvestsSlice = createSlice({
  name: 'harvests',
  initialState,
  reducers: {
    loadStarted(state) {
      state.status = 'loading';
      state.error = null;
    },
    loadSucceeded(state, action: PayloadAction<Harvest[]>) {
      state.status = 'succeeded';
      state.byId = {};
      state.ids = [];
      for (const h of action.payload) {
        state.byId[h.id] = h;
        state.ids.push(h.id);
      }
    },
    loadFailed(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    upserted(state, action: PayloadAction<Harvest>) {
      const h = action.payload;
      if (!state.byId[h.id]) state.ids.push(h.id);
      state.byId[h.id] = h;
    },
    removed(state, action: PayloadAction<string>) {
      delete state.byId[action.payload];
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
});

export const harvestsActions = harvestsSlice.actions;
export const harvestsReducer = harvestsSlice.reducer;
