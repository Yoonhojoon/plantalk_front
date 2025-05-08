
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Plant, PlantEnvironment, PlantStatus } from "../models/PlantModel";

interface PlantContextType {
  plants: Plant[];
  addPlant: (name: string, type: string, image: string, environment: PlantEnvironment) => void;
  updatePlantStatus: (id: string, status: PlantStatus) => void;
  removePlant: (id: string) => void;
  getPlantsNeedingAttention: () => Plant[];
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const usePlantContext = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error("usePlantContext must be used within a PlantProvider");
  }
  return context;
};

interface PlantProviderProps {
  children: ReactNode;
}

export const PlantProvider = ({ children }: PlantProviderProps) => {
  const [plants, setPlants] = useState<Plant[]>([]);

  // Load plants from localStorage on mount
  useEffect(() => {
    const savedPlants = localStorage.getItem('homegardener-plants');
    if (savedPlants) {
      setPlants(JSON.parse(savedPlants));
    } else {
      // Add sample plants if none exist
      setPlants([
        {
          id: '1',
          name: '아름다운 선인장',
          type: '선인장',
          image: '/plants/cactus.jpg',
          environment: {
            temperature: { min: 18, max: 32 },
            light: { min: 70, max: 100 },
            humidity: { min: 20, max: 50 }
          },
          status: {
            temperature: 25,
            light: 85,
            humidity: 35
          }
        },
        {
          id: '2',
          name: '안개꽃',
          type: '꽃',
          image: '/plants/babys-breath.jpg',
          environment: {
            temperature: { min: 15, max: 26 },
            light: { min: 40, max: 80 },
            humidity: { min: 40, max: 70 }
          },
          status: {
            temperature: 22,
            light: 60,
            humidity: 55
          }
        }
      ]);
    }
  }, []);

  // Save plants to localStorage whenever they change
  useEffect(() => {
    if (plants.length > 0) {
      localStorage.setItem('homegardener-plants', JSON.stringify(plants));
    }
  }, [plants]);

  const addPlant = (name: string, type: string, image: string, environment: PlantEnvironment) => {
    const newPlant: Plant = {
      id: Date.now().toString(),
      name,
      type,
      image,
      environment,
      status: {
        temperature: (environment.temperature.min + environment.temperature.max) / 2,
        light: (environment.light.min + environment.light.max) / 2,
        humidity: (environment.humidity.min + environment.humidity.max) / 2
      }
    };
    setPlants([...plants, newPlant]);
  };

  const updatePlantStatus = (id: string, status: PlantStatus) => {
    setPlants(
      plants.map((plant) =>
        plant.id === id ? { ...plant, status } : plant
      )
    );
  };

  const removePlant = (id: string) => {
    setPlants(plants.filter((plant) => plant.id !== id));
  };

  const getPlantsNeedingAttention = () => {
    return plants.filter((plant) => {
      const { temperature, light, humidity } = plant.status;
      const env = plant.environment;

      return (
        temperature < env.temperature.min ||
        temperature > env.temperature.max ||
        light < env.light.min ||
        light > env.light.max ||
        humidity < env.humidity.min ||
        humidity > env.humidity.max
      );
    });
  };

  const value = {
    plants,
    addPlant,
    updatePlantStatus,
    removePlant,
    getPlantsNeedingAttention
  };

  return <PlantContext.Provider value={value}>{children}</PlantContext.Provider>;
};
