
export interface EnvironmentCondition {
  min: number;
  max: number;
}

export interface PlantEnvironment {
  temperature: EnvironmentCondition;
  light: EnvironmentCondition;
  humidity: EnvironmentCondition;
}

export interface PlantStatus {
  temperature: number;
  light: number;
  humidity: number;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  location: string;
  type: string;
  image: string;
  environment: PlantEnvironment;
  status: PlantStatus;
  wateringInterval: number;
  lastWatered?: string; // ISO date string of last watering
  emotionalState?: string; // For plant character mood on detail page
}
