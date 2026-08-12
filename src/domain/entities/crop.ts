export interface Crop {
  id: string;
  harvestId: string;
  name: string;
}

export type NewCrop = Omit<Crop, 'id'>;
