
import { usePlantContext } from "@/contexts/PlantContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Thermometer, Droplet, Sun, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const { plants, getPlantsNeedingAttention } = usePlantContext();
  const plantsNeedingAttention = getPlantsNeedingAttention();
  
  // Create some watering reminders for the plants
  const wateringReminders = plants.map((plant) => ({
    id: `water-${plant.id}`,
    plant,
    type: 'watering',
    message: `${plant.name} 물주기 시간`,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
    icon: <Droplet size={18} className="text-blue-500" />
  }));
  
  // Create issue notifications for plants needing attention
  const issueNotifications = plantsNeedingAttention.flatMap((plant) => {
    const notifications = [];
    const { temperature, light, humidity } = plant.status;
    const env = plant.environment;
    
    if (temperature < env.temperature.min) {
      notifications.push({
        id: `temp-low-${plant.id}`,
        plant,
        type: 'issue',
        message: `${plant.name} 온도가 너무 낮습니다`,
        details: `현재: ${temperature}°C, 최소: ${env.temperature.min}°C`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 10800000)).toISOString(),
        icon: <Thermometer size={18} className="text-blue-500" />
      });
    } else if (temperature > env.temperature.max) {
      notifications.push({
        id: `temp-high-${plant.id}`,
        plant,
        type: 'issue',
        message: `${plant.name} 온도가 너무 높습니다`,
        details: `현재: ${temperature}°C, 최대: ${env.temperature.max}°C`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 10800000)).toISOString(),
        icon: <Thermometer size={18} className="text-red-500" />
      });
    }
    
    if (humidity < env.humidity.min) {
      notifications.push({
        id: `humid-low-${plant.id}`,
        plant,
        type: 'issue',
        message: `${plant.name} 습도가 부족합니다`,
        details: `현재: ${humidity}%, 최소: ${env.humidity.min}%`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 21600000)).toISOString(),
        icon: <Droplet size={18} className="text-blue-500" />
      });
    } else if (humidity > env.humidity.max) {
      notifications.push({
        id: `humid-high-${plant.id}`,
        plant,
        type: 'issue',
        message: `${plant.name} 습도가 너무 높습니다`,
        details: `현재: ${humidity}%, 최대: ${env.humidity.max}%`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 21600000)).toISOString(),
        icon: <Droplet size={18} className="text-blue-500" />
      });
    }
    
    if (light < env.light.min) {
      notifications.push({
        id: `light-low-${plant.id}`,
        plant,
        type: 'issue',
        message: `${plant.name} 더 많은 빛이 필요합니다`,
        details: `현재: ${light}%, 최소: ${env.light.min}%`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 36000000)).toISOString(),
        icon: <Sun size={18} className="text-yellow-500" />
      });
    } else if (light > env.light.max) {
      notifications.push({
        id: `light-high-${plant.id}`,
        plant,
        type: 'issue',
        message: `${plant.name} 빛이 너무 많습니다`,
        details: `현재: ${light}%, 최대: ${env.light.max}%`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 36000000)).toISOString(),
        icon: <Sun size={18} className="text-yellow-500" />
      });
    }
    
    return notifications;
  });
  
  // Combine all notifications
  const allNotifications = [...wateringReminders, ...issueNotifications].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Format timestamp to display as "x hours ago"
  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}분 전`;
    } else if (diffHrs < 24) {
      return `${diffHrs}시간 전`;
    } else {
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays}일 전`;
    }
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-20">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">알림</h1>
      </div>
      
      {allNotifications.length === 0 ? (
        <div className="text-center py-12 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200">
          <p className="text-muted-foreground">현재 알림이 없습니다</p>
          <p className="text-xs text-muted-foreground mt-2">모든 식물이 건강합니다!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allNotifications.map((notification) => (
            <div 
              key={notification.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex"
            >
              <div className="mr-3 mt-1">
                {notification.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{notification.message}</h3>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="inline mr-1" /> 
                    {formatTime(notification.timestamp)}
                  </div>
                </div>
                {notification.details && (
                  <p className="text-sm text-gray-500">{notification.details}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{notification.plant.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
