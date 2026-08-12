import type { BrazilianState } from './brazilian-state';

export interface Farm {
  id: string;
  producerId: string;
  name: string;
  city: string;
  state: BrazilianState;
  totalHa: number;
  arableHa: number;
  vegetationHa: number;
}

export type NewFarm = Omit<Farm, 'id'>;
export type FarmPatch = Partial<Omit<Farm, 'id' | 'producerId'>>;
