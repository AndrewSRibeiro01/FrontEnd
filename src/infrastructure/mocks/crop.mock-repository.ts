import type { Crop, NewCrop } from '../../domain/entities/crop';
import type { CropRepository } from '../../domain/repositories/crop.repository';
import { db, nextId } from './in-memory-db';

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export class CropMockRepository implements CropRepository {
  async list(harvestId?: string): Promise<Crop[]> {
    const items = harvestId
      ? db.crops.filter((c) => c.harvestId === harvestId)
      : db.crops;
    return delay(items.map((c) => ({ ...c })));
  }

  async getById(id: string): Promise<Crop> {
    const found = db.crops.find((c) => c.id === id);
    if (!found) throw new Error(`Crop ${id} not found`);
    return delay({ ...found });
  }

  async create(input: NewCrop): Promise<Crop> {
    const crop: Crop = { id: nextId('c'), ...input, name: input.name.trim() };
    db.crops.push(crop);
    return delay({ ...crop });
  }

  async delete(id: string): Promise<void> {
    db.crops = db.crops.filter((c) => c.id !== id);
    return delay(undefined);
  }
}
