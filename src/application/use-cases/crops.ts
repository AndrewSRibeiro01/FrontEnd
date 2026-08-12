import type { NewCrop } from '../../domain/entities/crop';
import { repositories } from '../../infrastructure/repositories';
import { cropsActions } from '../store/crops.slice';
import type { AppDispatch } from '../store';

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Erro desconhecido';
}

export function loadCrops(harvestId?: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(cropsActions.loadStarted());
    try {
      const list = await repositories.crops.list(harvestId);
      dispatch(cropsActions.loadSucceeded(list));
    } catch (e) {
      dispatch(cropsActions.loadFailed(errorMessage(e)));
    }
  };
}

export function createCrop(input: NewCrop) {
  return async (dispatch: AppDispatch) => {
    const crop = await repositories.crops.create(input);
    dispatch(cropsActions.upserted(crop));
    return crop;
  };
}

export function deleteCrop(id: string) {
  return async (dispatch: AppDispatch) => {
    await repositories.crops.delete(id);
    dispatch(cropsActions.removed(id));
  };
}
