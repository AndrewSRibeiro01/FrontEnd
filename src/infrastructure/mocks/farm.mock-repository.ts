import type { Farm, FarmPatch, NewFarm } from '../../domain/entities/farm';
import type { FarmRepository } from '../../domain/repositories/farm.repository';
import { validateFarmAreas } from '../../domain/validation/farm-areas';
import { db, nextId } from './in-memory-db';

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export class FarmMockRepository implements FarmRepository {
  async list(producerId?: string): Promise<Farm[]> {
    const items = producerId
      ? db.farms.filter((f) => f.producerId === producerId)
      : db.farms;
    return delay(items.map((f) => ({ ...f })));
  }

  async getById(id: string): Promise<Farm> {
    const found = db.farms.find((f) => f.id === id);
    if (!found) throw new Error(`Farm ${id} not found`);
    return delay({ ...found });
  }

  async create(input: NewFarm): Promise<Farm> {
    const error = validateFarmAreas(input);
    if (error) throw new Error(error);
    const farm: Farm = { id: nextId('f'), ...input };
    db.farms.push(farm);
    return delay({ ...farm });
  }

  async update(id: string, input: FarmPatch): Promise<Farm> {
    const index = db.farms.findIndex((f) => f.id === id);
    if (index === -1) throw new Error(`Farm ${id} not found`);
    const merged: Farm = { ...db.farms[index], ...input };
    const error = validateFarmAreas(merged);
    if (error) throw new Error(error);
    db.farms[index] = merged;
    return delay({ ...merged });
  }

  async delete(id: string): Promise<void> {
    db.farms = db.farms.filter((f) => f.id !== id);
    const removedHarvests = db.harvests
      .filter((h) => h.farmId === id)
      .map((h) => h.id);
    db.harvests = db.harvests.filter((h) => h.farmId !== id);
    db.crops = db.crops.filter((c) => !removedHarvests.includes(c.harvestId));
    return delay(undefined);
  }
}
