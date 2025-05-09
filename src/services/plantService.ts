import api from './api';
import { Plant } from '../types/plant';

export interface Species {
  id: string;
  name: string;
  temp_range_min: number;
  temp_range_max: number;
  humidity_range_min: number;
  humidity_range_max: number;
  light_range_min: number;
  light_range_max: number;
  watering_cycle_days: number;
}

export interface CreatePlantRequest {
  species_id: string;
  name: string;
  location: string;
  watering_cycle_days: number;
  last_watered_at: string;
  temp_range_min: number;
  temp_range_max: number;
  humidity_range_min: number;
  humidity_range_max: number;
  light_range_min: number;
  light_range_max: number;
  sensor_id?: string;
  image_url?: string;
}

export const plantService = {
  async getPlants(): Promise<Plant[]> {
    try {
      const response = await api.get<Plant[]>('/plants');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch plants:', error);
      throw error;
    }
  },

  async getPlantById(id: string): Promise<Plant> {
    try {
      const response = await api.get<Plant>(`/plants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch plant ${id}:`, error);
      throw error;
    }
  },

  async getSpecies(): Promise<Species[]> {
    try {
      const response = await api.get<Species[]>('/species');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch species:', error);
      throw error;
    }
  },

  getDefaultImageUrl(speciesId: string): string {
    return `images/emotion/${speciesId}/happy.png`;
  },

  getRandomImageUrl(): string {
    const randomImages = [
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=500",
      "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=500",
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=500",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=500"
    ];
    return randomImages[Math.floor(Math.random() * randomImages.length)];
  },

  async createPlant(plantData: CreatePlantRequest): Promise<Plant> {
    try {
      // species_id가 있으면 기본 이미지 URL 설정, 없으면 랜덤 이미지 사용
      if (!plantData.image_url) {
        plantData.image_url = plantData.species_id 
          ? this.getDefaultImageUrl(plantData.species_id)
          : this.getRandomImageUrl();
      }
      
      const response = await api.post<Plant>('/plants', plantData);
      return response.data;
    } catch (error) {
      console.error('Failed to create plant:', error);
      throw error;
    }
  }
}; 