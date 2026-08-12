import type { Crop } from '../../domain/entities/crop';
import type { Farm } from '../../domain/entities/farm';
import type { Harvest } from '../../domain/entities/harvest';
import type { Producer } from '../../domain/entities/producer';

export interface InMemoryDb {
  producers: Producer[];
  farms: Farm[];
  harvests: Harvest[];
  crops: Crop[];
}

function seed(): InMemoryDb {
  const producers: Producer[] = [
    { id: 'p-1', document: '39053344705', name: 'João da Silva' },
    { id: 'p-2', document: '11222333000181', name: 'Agropecuária Boa Terra Ltda' },
    { id: 'p-3', document: '52998224725', name: 'Maria Souza' },
  ];

  const farms: Farm[] = [
    {
      id: 'f-1',
      producerId: 'p-1',
      name: 'Fazenda Boa Vista',
      city: 'Uberaba',
      state: 'MG',
      totalHa: 1500,
      arableHa: 900,
      vegetationHa: 500,
    },
    {
      id: 'f-2',
      producerId: 'p-2',
      name: 'Fazenda Três Rios',
      city: 'Rondonópolis',
      state: 'MT',
      totalHa: 3200,
      arableHa: 2400,
      vegetationHa: 700,
    },
    {
      id: 'f-3',
      producerId: 'p-2',
      name: 'Fazenda Serra Verde',
      city: 'Cascavel',
      state: 'PR',
      totalHa: 800,
      arableHa: 500,
      vegetationHa: 200,
    },
    {
      id: 'f-4',
      producerId: 'p-3',
      name: 'Sítio Ipê Amarelo',
      city: 'Ribeirão Preto',
      state: 'SP',
      totalHa: 250,
      arableHa: 180,
      vegetationHa: 60,
    },
  ];

  const harvests: Harvest[] = [
    { id: 'h-1', farmId: 'f-1', year: 2023, label: 'Safra 2023' },
    { id: 'h-2', farmId: 'f-1', year: 2024, label: 'Safra 2024' },
    { id: 'h-3', farmId: 'f-2', year: 2024, label: 'Safra 2024' },
    { id: 'h-4', farmId: 'f-3', year: 2024, label: 'Safra 2024' },
    { id: 'h-5', farmId: 'f-4', year: 2024, label: 'Safra 2024' },
  ];

  const crops: Crop[] = [
    { id: 'c-1', harvestId: 'h-1', name: 'Soja' },
    { id: 'c-2', harvestId: 'h-2', name: 'Soja' },
    { id: 'c-3', harvestId: 'h-2', name: 'Milho' },
    { id: 'c-4', harvestId: 'h-3', name: 'Soja' },
    { id: 'c-5', harvestId: 'h-3', name: 'Algodão' },
    { id: 'c-6', harvestId: 'h-4', name: 'Milho' },
    { id: 'c-7', harvestId: 'h-5', name: 'Café' },
  ];

  return { producers, farms, harvests, crops };
}

export const db: InMemoryDb = seed();

let idCounter = 1000;
export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
