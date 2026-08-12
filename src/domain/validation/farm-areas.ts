export interface FarmAreasInput {
  totalHa: number;
  arableHa: number;
  vegetationHa: number;
}

export type FarmAreasError =
  | 'total-negative'
  | 'arable-negative'
  | 'vegetation-negative'
  | 'sum-exceeds-total';

export function validateFarmAreas(
  areas: FarmAreasInput,
): FarmAreasError | null {
  if (areas.totalHa < 0) return 'total-negative';
  if (areas.arableHa < 0) return 'arable-negative';
  if (areas.vegetationHa < 0) return 'vegetation-negative';
  if (areas.arableHa + areas.vegetationHa > areas.totalHa) {
    return 'sum-exceeds-total';
  }
  return null;
}
