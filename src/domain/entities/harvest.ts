export interface Harvest {
  id: string;
  farmId: string;
  year: number;
  label: string;
}

export type NewHarvest = Omit<Harvest, 'id' | 'label'>;
