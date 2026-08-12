export interface PieSlice {
  label: string;
  value: number;
  percentage: number;
}

export interface LandUseSlice {
  label: 'arable' | 'vegetation';
  hectares: number;
  percentage: number;
}

export interface DashboardSummary {
  totalFarms: number;
  totalHectares: number;
  farmsByState: PieSlice[];
  cropsByName: PieSlice[];
  landUse: LandUseSlice[];
}
