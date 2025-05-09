export interface Plant {
  id: string;
  user_id: string;
  species_id: string;
  name: string;
  image_url: string;
  location: string;
  watering_cycle_days: number;
  last_watered_at: string;
  next_watering_date: string;
  temp_range_min: number;
  temp_range_max: number;
  humidity_range_min: number;
  humidity_range_max: number;
  light_range_min: number;
  light_range_max: number;
  created_at: string;
  updated_at: string;
  sensor_id: string;
} 