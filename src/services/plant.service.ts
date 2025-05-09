import { supabase } from '@/lib/supabase';
import { Plant } from '@/types/plant';

export class PlantService {
  static async getPlants(userId: string): Promise<Plant[]> {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Plant[];
  }

  static async addPlant(plant: Omit<Plant, 'id' | 'created_at' | 'updated_at'>): Promise<Plant> {
    const { data, error } = await supabase
      .from('plants')
      .insert([plant])
      .select()
      .single();
    if (error) throw error;
    return data as Plant;
  }

  static async updatePlant(id: string, updates: Partial<Plant>): Promise<Plant> {
    const { data, error } = await supabase
      .from('plants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Plant;
  }

  static async deletePlant(id: string): Promise<void> {
    const { error } = await supabase
      .from('plants')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  static async updatePlantWatering(id: string, lastWatered: string): Promise<Plant> {
    try {
      const { data, error } = await supabase
        .from('plants')
        .update({ last_watered: lastWatered })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('물주기 정보 수정 에러:', error);
      throw error;
    }
  }
} 