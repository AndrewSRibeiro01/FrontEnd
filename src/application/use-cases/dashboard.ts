import { repositories } from '../../infrastructure/repositories';
import { dashboardActions } from '../store/dashboard.slice';
import type { AppDispatch } from '../store';

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Erro desconhecido';
}

export function loadDashboard() {
  return async (dispatch: AppDispatch) => {
    dispatch(dashboardActions.loadStarted());
    try {
      const data = await repositories.dashboard.get();
      dispatch(dashboardActions.loadSucceeded(data));
    } catch (e) {
      dispatch(dashboardActions.loadFailed(errorMessage(e)));
    }
  };
}
