import type { Farm, FarmPatch, NewFarm } from '../entities/farm';

export interface FarmRepository {
  list(producerId?: string): Promise<Farm[]>;
  getById(id: string): Promise<Farm>;
  create(input: NewFarm): Promise<Farm>;
  update(id: string, input: FarmPatch): Promise<Farm>;
  delete(id: string): Promise<void>;
}
