import type { NewHarvest } from '../../domain/entities/harvest';
import { repositories } from '../../infrastructure/repositories';
import { harvestsActions } from '../store/harvests.slice';
import type { AppDispatch } from '../store';

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Erro desconhecido';
}

export function loadHarvests(farmId?: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(harvestsActions.loadStarted());
    try {
      const list = await repositories.harvests.list(farmId);
      dispatch(harvestsActions.loadSucceeded(list));
    } catch (e) {
      dispatch(harvestsActions.loadFailed(errorMessage(e)));
    }
  };
}

export function createHarvest(input: NewHarvest) {
  return async (dispatch: AppDispatch) => {
    const harvest = await repositories.harvests.create(input);
    dispatch(harvestsActions.upserted(harvest));
    return harvest;
  };
}

export function deleteHarvest(id: string) {
  return async (dispatch: AppDispatch) => {
    await repositories.harvests.delete(id);
    dispatch(harvestsActions.removed(id));
  };
}
