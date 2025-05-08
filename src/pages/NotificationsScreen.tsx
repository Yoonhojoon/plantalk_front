
import { usePlantContext } from "@/contexts/PlantContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Thermometer, Droplet, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationsScreen() {
  const { getPlantsNeedingAttention } = usePlantContext();
  const navigate = useNavigate();
  
  const plantsNeedingAttention = getPlantsNeedingAttention();

  const getStatusIssues = (plantId: string) => {
    const plant = plantsNeedingAttention.find(p => p.id === plantId);
    if (!plant) return [];

    const issues = [];

    if (plant.status.temperature < plant.environment.temperature.min) {
      issues.push({
        type: "temperature",
        message: "온도가 너무 낮아요",
        icon: <Thermometer size={16} className="text-blue-500" />,
        action: "온도를 높여주세요"
      });
    } else if (plant.status.temperature > plant.environment.temperature.max) {
      issues.push({
        type: "temperature",
        message: "온도가 너무 높아요",
        icon: <Thermometer size={16} className="text-red-500" />,
        action: "온도를 낮춰주세요"
      });
    }

    if (plant.status.light < plant.environment.light.min) {
      issues.push({
        type: "light",
        message: "조도가 너무 낮아요",
        icon: <Sun size={16} className="text-amber-500" />,
        action: "더 많은 빛이 필요해요"
      });
    } else if (plant.status.light > plant.environment.light.max) {
      issues.push({
        type: "light",
        message: "조도가 너무 높아요",
        icon: <Sun size={16} className="text-amber-500" />,
        action: "직사광선을 피하게 해주세요"
      });
    }

    if (plant.status.humidity < plant.environment.humidity.min) {
      issues.push({
        type: "humidity",
        message: "습도가 너무 낮아요",
        icon: <Droplet size={16} className="text-blue-500" />,
        action: "물을 주거나 분무해주세요"
      });
    } else if (plant.status.humidity > plant.environment.humidity.max) {
      issues.push({
        type: "humidity",
        message: "습도가 너무 높아요",
        icon: <Droplet size={16} className="text-blue-500" />,
        action: "환기를 시켜주세요"
      });
    }

    return issues;
  };

  const handlePlantClick = (plantId: string) => {
    navigate(`/dashboard?plant=${plantId}`);
  };

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">관리 알림</h1>

      {plantsNeedingAttention.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-garden-green font-medium">모든 식물이 건강해요! 😊</p>
          <p className="text-sm text-muted-foreground mt-2">
            관리가 필요한 식물이 없습니다
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {plantsNeedingAttention.map(plant => (
            <Card 
              key={plant.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handlePlantClick(plant.id)}
            >
              <CardHeader className="pb-2 flex flex-row items-center space-x-4 p-4">
                <div className="h-16 w-16 rounded overflow-hidden">
                  <img 
                    src={plant.image} 
                    alt={plant.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=500";
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{plant.name}</h3>
                  <p className="text-sm text-muted-foreground">{plant.type}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-4 px-4">
                <div className="space-y-2">
                  {getStatusIssues(plant.id).map((issue, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <div className="mt-0.5">{issue.icon}</div>
                      <div>
                        <p className="font-medium">{issue.message}</p>
                        <p className="text-muted-foreground">{issue.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
