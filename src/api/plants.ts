import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export type PlantEmotion = 'happy' | 'sad' | 'angry' | 'neutral';

export const getPlantEmotion = async (plantId: string): Promise<PlantEmotion> => {
  const response = await axios.get(`${API_URL}/api/plants/${plantId}/emotion`);
  return response.data.emotion;
};

export const sendNotification = async (data: {
  token: string;
  plantId: string;
  emotion: PlantEmotion;
  message: {
    title: string;
    body: string;
    icon: string;
    badge: string;
    data: {
      plantId: string;
      emotion: PlantEmotion;
    };
  };
}) => {
  const response = await axios.post(`${API_URL}/api/notifications`, data);
  return response.data;
}; 