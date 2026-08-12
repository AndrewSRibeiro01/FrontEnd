import type { Producer } from '../entities/producer';

export interface ProducerRepository {
  list(): Promise<Producer[]>;
  getById(id: string): Promise<Producer>;
  create(input: Omit<Producer, 'id'>): Promise<Producer>;
  update(id: string, input: Partial<Omit<Producer, 'id'>>): Promise<Producer>;
  delete(id: string): Promise<void>;
}
