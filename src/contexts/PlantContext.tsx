
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Plant, PlantEnvironment, PlantStatus } from "../models/PlantModel";

interface PlantContextType {
  plants: Plant[];
  addPlant: (name: string, species: string, location: string, image: string, environment: PlantEnvironment, wateringInterval: number, lastWatered?: string) => void;
  updatePlantStatus: (id: string, status: PlantStatus) => void;
  removePlant: (id: string) => void;
  updatePlantWatering: (id: string, lastWatered: string) => void; // Add this method
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
    const savedPlants = localStorage.getItem('plantapp-plants');
    if (savedPlants) {
      setPlants(JSON.parse(savedPlants));
    } else {
      // Add sample plants if none exist
      setPlants([
        {
          id: '1',
          name: 'Peace Lily',
          species: 'Spathiphyllum',
          location: 'Indoor',
          type: 'Flowering plant',
          image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=500',
          environment: {
            temperature: { min: 18, max: 26 },
            light: { min: 40, max: 70 },
            humidity: { min: 40, max: 70 }
          },
          status: {
            temperature: 22,
            light: 60,
            humidity: 55
          },
          wateringInterval: 7,
          lastWatered: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Snake Plant',
          species: 'Sansevieria',
          location: 'Indoor',
          type: 'Succulent',
          image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=500',
          environment: {
            temperature: { min: 18, max: 32 },
            light: { min: 30, max: 80 },
            humidity: { min: 20, max: 60 }
          },
          status: {
            temperature: 24,
            light: 70,
            humidity: 35
          },
          wateringInterval: 14,
          lastWatered: new Date().toISOString()
        }
      ]);
    }
  }, []);

  // Save plants to localStorage whenever they change
  useEffect(() => {
    if (plants.length > 0) {
      localStorage.setItem('plantapp-plants', JSON.stringify(plants));
    }
  }, [plants]);

  const addPlant = (name: string, species: string, location: string, image: string, environment: PlantEnvironment, wateringInterval: number, lastWatered?: string) => {
    const newPlant: Plant = {
      id: Date.now().toString(),
      name,
      species,
      location,
      type: species, // Using species as the type for now
      image,
      environment,
      status: {
        temperature: (environment.temperature.min + environment.temperature.max) / 2,
        light: (environment.light.min + environment.light.max) / 2,
        humidity: (environment.humidity.min + environment.humidity.max) / 2
      },
      wateringInterval,
      lastWatered: lastWatered || new Date().toISOString()
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

  const updatePlantWatering = (id: string, lastWatered: string) => {
    setPlants(
      plants.map((plant) =>
        plant.id === id ? { ...plant, lastWatered } : plant
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
    updatePlantWatering,
    getPlantsNeedingAttention
  };

  return <PlantContext.Provider value={value}>{children}</PlantContext.Provider>;
};
