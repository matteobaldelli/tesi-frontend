export class Metric {
  id?: number;
  name: string;
  weight: number;
  unit_label: string;
  total_range_min: number;
  total_range_max: number;
  healthy_range_min: number;
  healthy_range_max: number;
  gender: string;
  category_id?: number;
}
