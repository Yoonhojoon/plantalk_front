import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plant } from '../types/plant';
import { plantService } from '../services/plantService';

interface PlantContextType {
  plants: Plant[];
  loading: boolean;
  error: string | null;
  refreshPlants: () => Promise<void>;
}

const PlantContext = createContext<PlantContextType | null>(null);

export const usePlantContext = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlantContext must be used within a PlantProvider');
  }
  return context;
};

interface PlantProviderProps {
  children: ReactNode;
}

export const PlantProvider = ({ children }: PlantProviderProps) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await plantService.getPlants();
      setPlants(data);
    } catch (error: any) {
      setError(error.response?.data?.detail || '식물 정보를 불러오는데 실패했습니다.');
      alert(error.response?.data?.detail || '식물 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const value = {
    plants,
    loading,
    error,
    refreshPlants: fetchPlants
  };

  return (
    <PlantContext.Provider value={value}>
      {children}
    </PlantContext.Provider>
  );
};
