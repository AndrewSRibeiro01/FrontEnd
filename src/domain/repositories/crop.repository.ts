import type { Crop, NewCrop } from '../entities/crop';

export interface CropRepository {
  list(harvestId?: string): Promise<Crop[]>;
  getById(id: string): Promise<Crop>;
  create(input: NewCrop): Promise<Crop>;
  delete(id: string): Promise<void>;
}
