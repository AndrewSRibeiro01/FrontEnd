import type { FarmPatch, NewFarm } from '../../domain/entities/farm';
import { repositories } from '../../infrastructure/repositories';
import { farmsActions } from '../store/farms.slice';
import type { AppDispatch } from '../store';

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Erro desconhecido';
}

export function loadFarms(producerId?: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(farmsActions.loadStarted());
    try {
      const list = await repositories.farms.list(producerId);
      dispatch(farmsActions.loadSucceeded(list));
    } catch (e) {
      dispatch(farmsActions.loadFailed(errorMessage(e)));
    }
  };
}

export function createFarm(input: NewFarm) {
  return async (dispatch: AppDispatch) => {
    const farm = await repositories.farms.create(input);
    dispatch(farmsActions.upserted(farm));
    return farm;
  };
}

export function updateFarm(id: string, input: FarmPatch) {
  return async (dispatch: AppDispatch) => {
    const farm = await repositories.farms.update(id, input);
    dispatch(farmsActions.upserted(farm));
    return farm;
  };
}

export function deleteFarm(id: string) {
  return async (dispatch: AppDispatch) => {
    await repositories.farms.delete(id);
    dispatch(farmsActions.removed(id));
  };
}
