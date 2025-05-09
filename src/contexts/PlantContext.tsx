import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Plant } from "@/types/plant";
import { PlantService } from "@/services/plant.service";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface PlantContextType {
  plants: Plant[];
  addPlant: (
    species_id: string,
    name: string,
    image_url: string,
    location: string,
    watering_cycle: number,
    last_watered: string,
    next_watering: string,
    temp_range_min: number,
    temp_range_max: number,
    humidity_range_min: number,
    humidity_range_max: number,
    light_range_min: number,
    light_range_max: number,
    sensor_id: string
  ) => Promise<Plant>;
  removePlant: (id: string) => Promise<void>;
  updatePlant: (id: string, updatedPlant: Partial<Plant>) => Promise<void>;
  representativePlantId: string | null;
  setRepresentativePlant: (id: string) => void;
  clearRepresentativePlant: () => void;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

interface PlantProviderProps {
  children: ReactNode;
}

export const usePlantContext = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error("usePlantContext must be used within a PlantProvider");
  }
  return context;
};

export const PlantProvider = ({ children }: PlantProviderProps) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [representativePlantId, setRepresentativePlantId] = useState<string | null>(() => {
    // 로컬 스토리지에서 대표 식물 ID 불러오기
    const savedId = localStorage.getItem('plantapp-representative');
    return savedId || null;
  });
  const { user } = useAuth();

  // Load plants from Supabase when user changes
  useEffect(() => {
    const loadPlants = async () => {
      if (user) {
        try {
          const plantsData = await PlantService.getPlants(user.id);
          setPlants(plantsData);
        } catch (error) {
          console.error('식물 데이터 로드 에러:', error);
          toast.error('식물 데이터를 불러오는데 실패했습니다.');
        }
      } else {
        setPlants([]);
      }
    };

    loadPlants();
  }, [user]);

  const addPlant = async (
    species_id: string,
    name: string,
    image_url: string,
    location: string,
    watering_cycle: number,
    last_watered: string,
    next_watering: string,
    temp_range_min: number,
    temp_range_max: number,
    humidity_range_min: number,
    humidity_range_max: number,
    light_range_min: number,
    light_range_max: number,
    sensor_id: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('사용자가 로그인되어 있지 않습니다.');

      const newPlant = await PlantService.addPlant({
        species_id,
        name,
        image_url,
        location,
        watering_cycle,
        last_watered,
        next_watering,
        temp_range_min,
        temp_range_max,
        humidity_range_min,
        humidity_range_max,
        light_range_min,
        light_range_max,
        user_id: user.id,
        sensor_id
      });

      setPlants(prev => [...prev, newPlant]);
      return newPlant;
    } catch (error) {
      console.error('식물 추가 실패:', error);
      throw error;
    }
  };

  const removePlant = async (id: string) => {
    try {
      // 먼저 plant_status_logs 삭제
      const { error: logsError } = await supabase
        .from('plant_status_logs')
        .delete()
        .eq('plant_id', id);

      if (logsError) {
        console.error('식물 상태 로그 삭제 실패:', logsError);
        throw logsError;
      }

      // 그 다음 식물 삭제
      const { error: plantError } = await supabase
        .from('plants')
        .delete()
        .eq('id', id);

      if (plantError) {
        console.error('식물 삭제 실패:', plantError);
        throw plantError;
      }

      setPlants(prev => prev.filter(plant => plant.id !== id));
      if (representativePlantId === id) {
        setRepresentativePlantId(null);
      }
      toast.success('식물이 삭제되었습니다.');
    } catch (error) {
      console.error('식물 삭제 에러:', error);
      toast.error('식물 삭제에 실패했습니다.');
      throw error;
    }
  };

  const updatePlant = async (id: string, updatedPlant: Partial<Plant>) => {
    try {
      const result = await PlantService.updatePlant(id, updatedPlant);
      setPlants(prev => prev.map(plant => 
        plant.id === id ? result : plant
      ));
    } catch (error) {
      console.error('식물 업데이트 에러:', error);
      toast.error('식물 정보 업데이트에 실패했습니다.');
    }
  };

  const setRepresentativePlant = (id: string) => {
    setRepresentativePlantId(id);
    localStorage.setItem('plantapp-representative', id);
  };

  const clearRepresentativePlant = () => {
    setRepresentativePlantId(null);
    localStorage.removeItem('plantapp-representative');
  };

  const value = {
    plants,
    addPlant,
    removePlant,
    updatePlant,
    representativePlantId,
    setRepresentativePlant,
    clearRepresentativePlant
  };

  return <PlantContext.Provider value={value}>{children}</PlantContext.Provider>;
};
