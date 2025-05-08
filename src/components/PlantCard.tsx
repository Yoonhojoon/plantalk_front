
import { useState } from "react";
import { Plant } from "../models/PlantModel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplet, Sun } from "lucide-react";

interface PlantCardProps {
  plant: Plant;
  onClick?: () => void;
}

export default function PlantCard({ plant, onClick }: PlantCardProps) {
  const isTemperatureOk = 
    plant.status.temperature >= plant.environment.temperature.min &&
    plant.status.temperature <= plant.environment.temperature.max;
  
  const isLightOk = 
    plant.status.light >= plant.environment.light.min &&
    plant.status.light <= plant.environment.light.max;
  
  const isHumidityOk = 
    plant.status.humidity >= plant.environment.humidity.min &&
    plant.status.humidity <= plant.environment.humidity.max;

  const getStatusEmoji = (isOk: boolean) => isOk ? "😊" : "😢";

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={plant.image} 
          alt={plant.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback image if the plant image fails to load
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=500";
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{plant.name}</CardTitle>
          <Badge variant="outline">{plant.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted">
            <div className="flex items-center mb-1">
              <Thermometer size={16} className="mr-1" />
              <span className="text-sm">{plant.status.temperature}°C</span>
            </div>
            <span className="text-xl">{getStatusEmoji(isTemperatureOk)}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted">
            <div className="flex items-center mb-1">
              <Sun size={16} className="mr-1" />
              <span className="text-sm">{plant.status.light}%</span>
            </div>
            <span className="text-xl">{getStatusEmoji(isLightOk)}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted">
            <div className="flex items-center mb-1">
              <Droplet size={16} className="mr-1" />
              <span className="text-sm">{plant.status.humidity}%</span>
            </div>
            <span className="text-xl">{getStatusEmoji(isHumidityOk)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="text-xs text-muted-foreground">
          {!isTemperatureOk || !isLightOk || !isHumidityOk 
            ? "관리가 필요해요" 
            : "모든 환경이 적합해요"}
        </div>
      </CardFooter>
    </Card>
  );
}
