
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
                        
                        <EnvironmentSlider
                          label="온도 (°C)"
                          minValue={plant.status.temperature}
                          maxValue={plant.environment.temperature.max}
                          min={0}
                          max={40}
                          icon={<Thermometer size={16} />}
                          onMinChange={(value) => handleStatusChange(plant.id, { temperature: value })}
                          onMaxChange={(value) => handleStatusChange(plant.id, { 
                            temperature: plant.status.temperature
                          })}
                        />
                        
                        <EnvironmentSlider
                          label="조도 (%)"
                          minValue={plant.status.light}
                          maxValue={plant.environment.light.max}
                          min={0}
                          max={100}
                          step={5}
                          icon={<Sun size={16} />}
                          onMinChange={(value) => handleStatusChange(plant.id, { light: value })}
                          onMaxChange={(value) => handleStatusChange(plant.id, { 
                            light: plant.status.light
                          })}
                        />
                        
                        <EnvironmentSlider
                          label="습도 (%)"
                          minValue={plant.status.humidity}
                          maxValue={plant.environment.humidity.max}
                          min={0}
                          max={100}
                          step={5}
                          icon={<Droplet size={16} />}
                          onMinChange={(value) => handleStatusChange(plant.id, { humidity: value })}
                          onMaxChange={(value) => handleStatusChange(plant.id, { 
                            humidity: plant.status.humidity
                          })}
                        />
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
