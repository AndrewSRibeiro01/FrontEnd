import type { DashboardSummary } from '../entities/dashboard';

export interface DashboardRepository {
  get(): Promise<DashboardSummary>;
}
