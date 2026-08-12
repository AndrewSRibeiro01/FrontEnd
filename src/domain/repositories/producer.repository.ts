import type {
  NewProducer,
  Producer,
  ProducerPatch,
} from '../entities/producer';

export interface ProducerRepository {
  list(): Promise<Producer[]>;
  getById(id: string): Promise<Producer>;
  create(input: NewProducer): Promise<Producer>;
  update(id: string, input: ProducerPatch): Promise<Producer>;
  delete(id: string): Promise<void>;
}
