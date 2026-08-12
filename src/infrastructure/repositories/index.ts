import type { CropRepository } from '../../domain/repositories/crop.repository';
import type { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import type { FarmRepository } from '../../domain/repositories/farm.repository';
import type { HarvestRepository } from '../../domain/repositories/harvest.repository';
import type { ProducerRepository } from '../../domain/repositories/producer.repository';

import { CropMockRepository } from '../mocks/crop.mock-repository';
import { DashboardMockRepository } from '../mocks/dashboard.mock-repository';
import { FarmMockRepository } from '../mocks/farm.mock-repository';
import { HarvestMockRepository } from '../mocks/harvest.mock-repository';
import { ProducerMockRepository } from '../mocks/producer.mock-repository';

import { CropHttpRepository } from './crop.http-repository';
import { DashboardHttpRepository } from './dashboard.http-repository';
import { FarmHttpRepository } from './farm.http-repository';
import { HarvestHttpRepository } from './harvest.http-repository';
import { ProducerHttpRepository } from './producer.http-repository';

export interface Repositories {
  producers: ProducerRepository;
  farms: FarmRepository;
  harvests: HarvestRepository;
  crops: CropRepository;
  dashboard: DashboardRepository;
}

const useMocks =
  (import.meta.env.VITE_USE_MOCKS ?? 'true').toString().toLowerCase() ===
  'true';

export const repositories: Repositories = useMocks
  ? {
      producers: new ProducerMockRepository(),
      farms: new FarmMockRepository(),
      harvests: new HarvestMockRepository(),
      crops: new CropMockRepository(),
      dashboard: new DashboardMockRepository(),
    }
  : {
      producers: new ProducerHttpRepository(),
      farms: new FarmHttpRepository(),
      harvests: new HarvestHttpRepository(),
      crops: new CropHttpRepository(),
      dashboard: new DashboardHttpRepository(),
    };
