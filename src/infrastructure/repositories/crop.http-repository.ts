import type { Crop, NewCrop } from '../../domain/entities/crop';
import type { CropRepository } from '../../domain/repositories/crop.repository';
import { apiClient } from '../http/api-client';

export class CropHttpRepository implements CropRepository {
  async list(harvestId?: string): Promise<Crop[]> {
    const { data } = await apiClient.get<Crop[]>('/crops', {
      params: harvestId ? { harvestId } : undefined,
    });
    return data;
  }

  async getById(id: string): Promise<Crop> {
    const { data } = await apiClient.get<Crop>(`/crops/${id}`);
    return data;
  }

  async create(input: NewCrop): Promise<Crop> {
    const { data } = await apiClient.post<Crop>('/crops', input);
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/crops/${id}`);
  }
}
