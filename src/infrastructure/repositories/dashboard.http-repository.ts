import type { DashboardSummary } from '../../domain/entities/dashboard';
import type { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import { apiClient } from '../http/api-client';

export class DashboardHttpRepository implements DashboardRepository {
  async get(): Promise<DashboardSummary> {
    const { data } = await apiClient.get<DashboardSummary>('/dashboard');
    return data;
  }
}
