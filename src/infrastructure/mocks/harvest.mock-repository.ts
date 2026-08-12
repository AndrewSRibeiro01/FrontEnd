import type { Harvest, NewHarvest } from '../../domain/entities/harvest';
import type { HarvestRepository } from '../../domain/repositories/harvest.repository';
import { db, nextId } from './in-memory-db';

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export class HarvestMockRepository implements HarvestRepository {
  async list(farmId?: string): Promise<Harvest[]> {
    const items = farmId
      ? db.harvests.filter((h) => h.farmId === farmId)
      : db.harvests;
    return delay(items.map((h) => ({ ...h })));
  }

  async getById(id: string): Promise<Harvest> {
    const found = db.harvests.find((h) => h.id === id);
    if (!found) throw new Error(`Harvest ${id} not found`);
    return delay({ ...found });
  }

  async create(input: NewHarvest): Promise<Harvest> {
    const harvest: Harvest = {
      id: nextId('h'),
      ...input,
      label: `Safra ${input.year}`,
    };
    db.harvests.push(harvest);
    return delay({ ...harvest });
  }

  async delete(id: string): Promise<void> {
    db.harvests = db.harvests.filter((h) => h.id !== id);
    db.crops = db.crops.filter((c) => c.harvestId !== id);
    return delay(undefined);
  }
}
