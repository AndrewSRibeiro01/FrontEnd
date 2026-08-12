import type {
  NewProducer,
  Producer,
  ProducerPatch,
} from '../../domain/entities/producer';
import type { ProducerRepository } from '../../domain/repositories/producer.repository';
import { stripDocument } from '../../domain/validation/document';
import { db, nextId } from './in-memory-db';

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export class ProducerMockRepository implements ProducerRepository {
  async list(): Promise<Producer[]> {
    return delay([...db.producers]);
  }

  async getById(id: string): Promise<Producer> {
    const found = db.producers.find((p) => p.id === id);
    if (!found) throw new Error(`Producer ${id} not found`);
    return delay({ ...found });
  }

  async create(input: NewProducer): Promise<Producer> {
    const producer: Producer = {
      id: nextId('p'),
      document: stripDocument(input.document),
      name: input.name.trim(),
    };
    db.producers.push(producer);
    return delay({ ...producer });
  }

  async update(id: string, input: ProducerPatch): Promise<Producer> {
    const index = db.producers.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Producer ${id} not found`);
    const merged: Producer = {
      ...db.producers[index],
      ...(input.document !== undefined
        ? { document: stripDocument(input.document) }
        : {}),
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    };
    db.producers[index] = merged;
    return delay({ ...merged });
  }

  async delete(id: string): Promise<void> {
    db.producers = db.producers.filter((p) => p.id !== id);
    const removedFarms = db.farms.filter((f) => f.producerId === id).map((f) => f.id);
    db.farms = db.farms.filter((f) => f.producerId !== id);
    const removedHarvests = db.harvests
      .filter((h) => removedFarms.includes(h.farmId))
      .map((h) => h.id);
    db.harvests = db.harvests.filter((h) => !removedFarms.includes(h.farmId));
    db.crops = db.crops.filter((c) => !removedHarvests.includes(c.harvestId));
    return delay(undefined);
  }
}
