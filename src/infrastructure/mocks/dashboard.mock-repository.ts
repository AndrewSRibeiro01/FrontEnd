import type {
  DashboardSummary,
  LandUseSlice,
  PieSlice,
} from '../../domain/entities/dashboard';
import type { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import { db } from './in-memory-db';

function toPieSlices(counts: Map<string, number>, total: number): PieSlice[] {
  return Array.from(counts.entries())
    .map(([label, value]) => ({
      label,
      value,
      percentage: total > 0 ? +((value / total) * 100).toFixed(2) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

export class DashboardMockRepository implements DashboardRepository {
  async get(): Promise<DashboardSummary> {
    const farms = db.farms;
    const totalFarms = farms.length;
    const totalHectares = +farms
      .reduce((acc, f) => acc + f.totalHa, 0)
      .toFixed(2);

    const stateCounts = new Map<string, number>();
    for (const f of farms) {
      stateCounts.set(f.state, (stateCounts.get(f.state) ?? 0) + 1);
    }
    const farmsByState = toPieSlices(stateCounts, totalFarms);

    const cropCounts = new Map<string, number>();
    for (const c of db.crops) {
      cropCounts.set(c.name, (cropCounts.get(c.name) ?? 0) + 1);
    }
    const totalCrops = db.crops.length;
    const cropsByName = toPieSlices(cropCounts, totalCrops);

    const arable = +farms.reduce((acc, f) => acc + f.arableHa, 0).toFixed(2);
    const vegetation = +farms
      .reduce((acc, f) => acc + f.vegetationHa, 0)
      .toFixed(2);
    const landTotal = arable + vegetation;
    const landUse: LandUseSlice[] = [
      {
        label: 'arable',
        hectares: arable,
        percentage: landTotal > 0 ? +((arable / landTotal) * 100).toFixed(2) : 0,
      },
      {
        label: 'vegetation',
        hectares: vegetation,
        percentage:
          landTotal > 0 ? +((vegetation / landTotal) * 100).toFixed(2) : 0,
      },
    ];

    return {
      totalFarms,
      totalHectares,
      farmsByState,
      cropsByName,
      landUse,
    };
  }
}
