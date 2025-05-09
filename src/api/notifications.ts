import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const sendFCMNotification = async (data: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}) => {
  try {
    const response = await axios.post(`${API_URL}/api/notifications/fcm`, data);
    return response.data;
  } catch (error) {
    console.error('FCM 알림 전송 실패:', error);
    throw error;
  }
}; 