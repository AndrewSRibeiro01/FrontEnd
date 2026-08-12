import type {
  NewProducer,
  Producer,
  ProducerPatch,
} from '../../domain/entities/producer';
import type { ProducerRepository } from '../../domain/repositories/producer.repository';
import { apiClient } from '../http/api-client';

export class ProducerHttpRepository implements ProducerRepository {
  async list(): Promise<Producer[]> {
    const { data } = await apiClient.get<Producer[]>('/producers');
    return data;
  }

  async getById(id: string): Promise<Producer> {
    const { data } = await apiClient.get<Producer>(`/producers/${id}`);
    return data;
  }

  async create(input: NewProducer): Promise<Producer> {
    const { data } = await apiClient.post<Producer>('/producers', input);
    return data;
  }

  async update(id: string, input: ProducerPatch): Promise<Producer> {
    const { data } = await apiClient.patch<Producer>(
      `/producers/${id}`,
      input,
    );
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/producers/${id}`);
  }
}
