import type {
  NewProducer,
  ProducerPatch,
} from '../../domain/entities/producer';
import { repositories } from '../../infrastructure/repositories';
import { producersActions } from '../store/producers.slice';
import type { AppDispatch } from '../store';

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Erro desconhecido';
}

export function loadProducers() {
  return async (dispatch: AppDispatch) => {
    dispatch(producersActions.loadStarted());
    try {
      const list = await repositories.producers.list();
      dispatch(producersActions.loadSucceeded(list));
    } catch (e) {
      dispatch(producersActions.loadFailed(errorMessage(e)));
    }
  };
}

export function createProducer(input: NewProducer) {
  return async (dispatch: AppDispatch) => {
    const producer = await repositories.producers.create(input);
    dispatch(producersActions.upserted(producer));
    return producer;
  };
}

export function updateProducer(id: string, input: ProducerPatch) {
  return async (dispatch: AppDispatch) => {
    const producer = await repositories.producers.update(id, input);
    dispatch(producersActions.upserted(producer));
    return producer;
  };
}

export function deleteProducer(id: string) {
  return async (dispatch: AppDispatch) => {
    await repositories.producers.delete(id);
    dispatch(producersActions.removed(id));
  };
}
