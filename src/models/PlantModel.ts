
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
  type: string;
  image: string;
  environment: PlantEnvironment;
  status: PlantStatus;
}
