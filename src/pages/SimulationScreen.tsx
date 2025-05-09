import { usePlantContext } from "@/contexts/PlantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplet, Sun } from "lucide-react";
import EnvironmentSlider from "@/components/EnvironmentSlider";
import { PlantStatus } from "@/models/PlantModel";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export default function SimulationScreen() {
  const { plants, updatePlantStatus } = usePlantContext();
  
  // Keep track of which plant card is expanded
  const [expandedPlantId, setExpandedPlantId] = useState<string | null>(null);
  
  const handleExpandToggle = (plantId: string) => {
    setExpandedPlantId(expandedPlantId === plantId ? null : plantId);
  };
  
  const handleStatusChange = (plantId: string, status: Partial<PlantStatus>) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      updatePlantStatus(plant.id, {
        ...plant.status,
        ...status
      });
    }
  };

  const handleEnvironmentChange = (plantId: string, field: keyof PlantStatus, value: number) => {
    handleStatusChange(plantId, { [field]: value });
  };

  const getStatusEmoji = (current: number, min: number, max: number) => {
    return current >= min && current <= max ? "😊" : "😢";
  };

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">환경 시뮬레이션</h1>

      {plants.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">등록된 식물이 없습니다.</p>
          <p className="text-sm text-muted-foreground mt-2">
            첫 식물을 등록해보세요!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {plants.map(plant => (
            <Card key={plant.id} className="overflow-hidden">
              <CardHeader 
                className="pb-2 cursor-pointer"
                onClick={() => handleExpandToggle(plant.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded overflow-hidden">
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
                      <CardTitle className="text-lg">{plant.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{plant.species}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="flex items-center">
                      <Thermometer size={16} className="mr-1" />
                      <span className="text-sm mr-1">{plant.status.temperature}°C</span>
                      <span>
                        {getStatusEmoji(
                          plant.status.temperature,
                          plant.environment.temperature.min,
                          plant.environment.temperature.max
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Sun size={16} className="mr-1" />
                      <span className="text-sm mr-1">{plant.status.light}%</span>
                      <span>
                        {getStatusEmoji(
                          plant.status.light,
                          plant.environment.light.min,
                          plant.environment.light.max
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Droplet size={16} className="mr-1" />
                      <span className="text-sm mr-1">{plant.status.humidity}%</span>
                      <span>
                        {getStatusEmoji(
                          plant.status.humidity,
                          plant.environment.humidity.min,
                          plant.environment.humidity.max
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              {expandedPlantId === plant.id && (
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium">적정 환경 조건</h3>
                        <div className="text-xs text-muted-foreground grid grid-cols-3 gap-2">
                          <div>온도: {plant.environment.temperature.min}-{plant.environment.temperature.max}°C</div>
                          <div>조도: {plant.environment.light.min}-{plant.environment.light.max}%</div>
                          <div>습도: {plant.environment.humidity.min}-{plant.environment.humidity.max}%</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">현재 환경 조절</h3>
                        
                        {/* Temperature Slider */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-medium flex items-center">
                            <Thermometer size={14} className="mr-1 text-red-500" />
                            온도 조절
                          </h4>
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">현재값</span>
                              <span className="text-xs font-medium">{plant.status.temperature}°C</span>
                            </div>
                            <Slider
                              value={[plant.status.temperature]}
                              min={0}
                              max={40}
                              step={1}
                              onValueChange={(values) => handleEnvironmentChange(plant.id, 'temperature', values[0])}
                              className="bg-gradient-to-r from-blue-100 to-red-100 dark:from-blue-900/30 dark:to-red-900/30"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>0°C</span>
                              <span>40°C</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Light Slider */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-medium flex items-center">
                            <Sun size={14} className="mr-1 text-yellow-500" />
                            조도 조절
                          </h4>
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">현재값</span>
                              <span className="text-xs font-medium">{plant.status.light}%</span>
                            </div>
                            <Slider
                              value={[plant.status.light]}
                              min={0}
                              max={100}
                              step={5}
                              onValueChange={(values) => handleEnvironmentChange(plant.id, 'light', values[0])}
                              className="bg-gradient-to-r from-gray-100 to-yellow-100 dark:from-gray-800/30 dark:to-yellow-900/30"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>0%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Humidity Slider */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-medium flex items-center">
                            <Droplet size={14} className="mr-1 text-blue-500" />
                            습도 조절
                          </h4>
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">현재값</span>
                              <span className="text-xs font-medium">{plant.status.humidity}%</span>
                            </div>
                            <Slider
                              value={[plant.status.humidity]}
                              min={0}
                              max={100}
                              step={5}
                              onValueChange={(values) => handleEnvironmentChange(plant.id, 'humidity', values[0])}
                              className="bg-gradient-to-r from-gray-100 to-blue-100 dark:from-gray-800/30 dark:to-blue-900/30"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>0%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
