export class Metric {
  id?: number;
  name: string;
  weight: number;
  unitLabel: string;
  totalRangeMin: number;
  totalRangeMax: number;
  healthyRangeMin: number;
  healthyRangeMax: number;
  gender: string;
  categoryId?: number;
  categoryName?: string;
}
