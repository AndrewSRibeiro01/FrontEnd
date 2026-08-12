import type { Farm, FarmPatch, NewFarm } from '../../domain/entities/farm';
import type { FarmRepository } from '../../domain/repositories/farm.repository';
import { apiClient } from '../http/api-client';

export class FarmHttpRepository implements FarmRepository {
  async list(producerId?: string): Promise<Farm[]> {
    const { data } = await apiClient.get<Farm[]>('/farms', {
      params: producerId ? { producerId } : undefined,
    });
    return data;
  }

  async getById(id: string): Promise<Farm> {
    const { data } = await apiClient.get<Farm>(`/farms/${id}`);
    return data;
  }

  async create(input: NewFarm): Promise<Farm> {
    const { data } = await apiClient.post<Farm>('/farms', input);
    return data;
  }

  async update(id: string, input: FarmPatch): Promise<Farm> {
    const { data } = await apiClient.patch<Farm>(`/farms/${id}`, input);
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/farms/${id}`);
  }
}
