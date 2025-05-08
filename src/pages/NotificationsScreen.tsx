
import { useState } from "react";
import { usePlantContext } from "@/contexts/PlantContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Thermometer, Droplet, Sun, Clock, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Notification {
  id: string;
  plant: any;
  type: string;
  message: string;
  details?: string;
  timestamp: string;
  icon: JSX.Element;
}

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const { plants, getPlantsNeedingAttention, updatePlantWatering } = usePlantContext();
  const plantsNeedingAttention = getPlantsNeedingAttention();
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
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
    
    // Combine all notifications and sort by timestamp
    return [...wateringReminders, ...issueNotifications]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  });
  
  const [wateringDialogOpen, setWateringDialogOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  
  // Remove notification
  const handleComplete = (notification: Notification) => {
    if (notification.type === 'watering') {
      setCurrentNotification(notification);
      setWateringDialogOpen(true);
    } else {
      removeNotification(notification.id);
      toast.success("알림이 완료되었습니다");
    }
  };
  
  const confirmWatering = () => {
    if (!currentNotification) return;
    
    const plantId = currentNotification.plant.id;
    updatePlantWatering(plantId, new Date().toISOString());
    removeNotification(currentNotification.id);
    
    toast.success(`${currentNotification.plant.name}에 물을 주었습니다!`);
    setWateringDialogOpen(false);
    setCurrentNotification(null);
  };
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
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
      <AlertDialog open={wateringDialogOpen} onOpenChange={setWateringDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>확인</AlertDialogTitle>
            <AlertDialogDescription>
              식물에게 물을 충분히 주셨나요?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">아니오</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmWatering}
              className="bg-plant-green hover:bg-plant-dark-green rounded-full"
            >
              네
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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
      
      {notifications.length === 0 ? (
        <div className="text-center py-12 rounded-lg bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-muted-foreground">현재 알림이 없습니다</p>
          <p className="text-xs text-muted-foreground mt-2">모든 식물이 건강합니다!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex"
            >
              <div className="mr-3 mt-1">
                {notification.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">
                    {notification.message}
                  </h3>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="inline mr-1" /> 
                    {formatTime(notification.timestamp)}
                  </div>
                </div>
                {notification.details && (
                  <p className="text-sm text-gray-500">
                    {notification.details}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-400">{notification.plant.name}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-900 dark:hover:bg-green-900/20"
                    onClick={() => handleComplete(notification)}
                  >
                    완료
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
