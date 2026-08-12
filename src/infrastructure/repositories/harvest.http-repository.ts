import type { Harvest, NewHarvest } from '../../domain/entities/harvest';
import type { HarvestRepository } from '../../domain/repositories/harvest.repository';
import { apiClient } from '../http/api-client';

export class HarvestHttpRepository implements HarvestRepository {
  async list(farmId?: string): Promise<Harvest[]> {
    const { data } = await apiClient.get<Harvest[]>('/harvests', {
      params: farmId ? { farmId } : undefined,
    });
    return data;
  }

  async getById(id: string): Promise<Harvest> {
    const { data } = await apiClient.get<Harvest>(`/harvests/${id}`);
    return data;
  }

  async create(input: NewHarvest): Promise<Harvest> {
    const { data } = await apiClient.post<Harvest>('/harvests', input);
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/harvests/${id}`);
  }
}
