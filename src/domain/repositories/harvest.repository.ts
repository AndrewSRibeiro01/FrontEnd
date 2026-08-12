import type { Harvest, NewHarvest } from '../entities/harvest';

export interface HarvestRepository {
  list(farmId?: string): Promise<Harvest[]>;
  getById(id: string): Promise<Harvest>;
  create(input: NewHarvest): Promise<Harvest>;
  delete(id: string): Promise<void>;
}
