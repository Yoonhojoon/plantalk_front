
import { useState } from "react";
import { usePlantContext } from "@/contexts/PlantContext";
import PlantCard from "@/components/PlantCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EnvironmentSlider from "@/components/EnvironmentSlider";
import { Thermometer, Droplet, Sun } from "lucide-react";
import { PlantStatus } from "@/models/PlantModel";

export default function DashboardScreen() {
  const { plants, updatePlantStatus } = usePlantContext();
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  const selectedPlant = plants.find(p => p.id === selectedPlantId);

  const handleStatusChange = (status: Partial<PlantStatus>) => {
    if (selectedPlant) {
      updatePlantStatus(selectedPlant.id, {
        ...selectedPlant.status,
        ...status
      });
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">내 식물 상태</h1>
      </div>

      {plants.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">등록된 식물이 없습니다.</p>
          <p className="text-sm text-muted-foreground mt-2">
            첫 식물을 등록해보세요!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onClick={() => setSelectedPlantId(plant.id)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!selectedPlantId} onOpenChange={(open) => !open && setSelectedPlantId(null)}>
        {selectedPlant && (
          <DialogContent className="max-w-md">
            <div className="space-y-4">
              <div className="relative h-48 -mt-4 -mx-6 overflow-hidden">
                <img 
                  src={selectedPlant.image} 
                  alt={selectedPlant.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=500";
                  }}
                />
              </div>
              
              <div>
                <h2 className="text-xl font-bold">{selectedPlant.name}</h2>
                <p className="text-muted-foreground text-sm">{selectedPlant.type}</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">현재 환경 조건 조절</h3>
                
                <EnvironmentSlider
                  label="온도 (°C)"
                  value={selectedPlant.status.temperature}
                  min={0}
                  max={40}
                  icon={<Thermometer size={16} />}
                  onChange={(value) => handleStatusChange({ temperature: value })}
                />
                
                <EnvironmentSlider
                  label="조도 (%)"
                  value={selectedPlant.status.light}
                  min={0}
                  max={100}
                  step={5}
                  icon={<Sun size={16} />}
                  onChange={(value) => handleStatusChange({ light: value })}
                />
                
                <EnvironmentSlider
                  label="습도 (%)"
                  value={selectedPlant.status.humidity}
                  min={0}
                  max={100}
                  step={5}
                  icon={<Droplet size={16} />}
                  onChange={(value) => handleStatusChange({ humidity: value })}
                />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">적정 환경 조건</h3>
                <div className="text-sm grid grid-cols-3 gap-2">
                  <div className="p-2 bg-muted rounded-md flex flex-col items-center">
                    <Thermometer size={16} className="mb-1" />
                    <span>{selectedPlant.environment.temperature.min}-{selectedPlant.environment.temperature.max}°C</span>
                  </div>
                  <div className="p-2 bg-muted rounded-md flex flex-col items-center">
                    <Sun size={16} className="mb-1" />
                    <span>{selectedPlant.environment.light.min}-{selectedPlant.environment.light.max}%</span>
                  </div>
                  <div className="p-2 bg-muted rounded-md flex flex-col items-center">
                    <Droplet size={16} className="mb-1" />
                    <span>{selectedPlant.environment.humidity.min}-{selectedPlant.environment.humidity.max}%</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => setSelectedPlantId(null)}>
                닫기
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
