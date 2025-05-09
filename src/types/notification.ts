export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: 'watering' | 'environment' | 'system';
  plant_id?: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationResponse {
  data: Notification[];
  error: null | {
    message: string;
    code: string;
  };
} 