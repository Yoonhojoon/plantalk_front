
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlantContext } from "@/contexts/PlantContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Thermometer, Droplet, Sun, Clock, Pencil, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plant } from "@/models/PlantModel";
import DualRangeSlider from "@/components/DualRangeSlider";
import PlantCharacter from "@/components/PlantCharacter";

export default function PlantDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plants, updatePlantStatus } = usePlantContext();
  
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  
  const [temperature, setTemperature] = useState({ min: 0, max: 0 });
  const [humidity, setHumidity] = useState({ min: 0, max: 0 });
  const [light, setLight] = useState({ min: 0, max: 0 });
  const [wateringInterval, setWateringInterval] = useState(7);
  
  useEffect(() => {
    if (id && plants.length > 0) {
      const foundPlant = plants.find(p => p.id === id);
      if (foundPlant) {
        setPlant(foundPlant);
        setTemperature({
          min: foundPlant.environment.temperature.min,
          max: foundPlant.environment.temperature.max
        });
        setHumidity({
          min: foundPlant.environment.humidity.min,
          max: foundPlant.environment.humidity.max
        });
        setLight({
          min: foundPlant.environment.light.min,
          max: foundPlant.environment.light.max
        });
        setWateringInterval(foundPlant.wateringInterval);
        setDescription(foundPlant.type || "");
      }
    }
  }, [id, plants]);
  
  const handleSave = () => {
    if (!plant) return;
    
    updatePlantStatus(plant.id, {
      temperature: plant.status.temperature,
      humidity: plant.status.humidity,
      light: plant.status.light
    });
    
    // In a real app, we would also update other plant details here
    
    setIsEditing(false);
    toast.success("식물 정보가 업데이트되었습니다");
  };
  
  // Calculate plant emotional state based on environmental conditions
  const getEmotionalState = (): string => {
    if (!plant) return "행복해요";
    
    const { temperature, humidity, light } = plant.status;
    const env = plant.environment;
    
    if (temperature < env.temperature.min) return "추워요";
    if (temperature > env.temperature.max) return "더워요";
    if (humidity < env.humidity.min) return "건조해요";
    if (humidity > env.humidity.max) return "습해요";
    if (light < env.light.min) return "너무 어두워요";
    if (light > env.light.max) return "햇빛이 너무 강해요";
    
    // Calculate days until next watering
    const lastWatered = plant.lastWatered 
      ? new Date(plant.lastWatered) 
      : new Date();
      
    const nextWatering = new Date(lastWatered);
    nextWatering.setDate(nextWatering.getDate() + plant.wateringInterval);
    
    const today = new Date();
    const diffTime = nextWatering.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "목말라요";
    
    return "행복해요";
  };
  
  if (!plant) {
    return (
      <div className="container max-w-md mx-auto px-4 py-12 text-center">
        <p>식물을 찾을 수 없습니다</p>
        <Button 
          className="mt-4 bg-plant-green hover:bg-plant-dark-green"
          onClick={() => navigate('/dashboard')}
        >
          홈으로 돌아가기
        </Button>
      </div>
    );
  }
  
  const emotionalState = getEmotionalState();
  
  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">{plant.name}</h1>
        </div>
        {isEditing ? (
          <Button 
            size="icon"
            className="bg-plant-green hover:bg-plant-dark-green"
            onClick={handleSave}
          >
            <Check size={20} />
          </Button>
        ) : (
          <Button 
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={20} />
          </Button>
        )}
      </div>
      
      {/* Plant Image */}
      <div className="relative mb-6 rounded-xl overflow-hidden h-64">
        <img 
          src={plant.image} 
          alt={plant.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=500";
          }}
        />
      </div>
      
      <div className="flex mb-6">
        {/* Plant Character */}
        <div className="w-1/3 pr-4">
          <PlantCharacter emotionalState={emotionalState} />
        </div>
        
        {/* Plant Status */}
        <div className="w-2/3">
          <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{plant.name}의 상태</h3>
              <p className="text-sm mb-4 text-plant-dark-green font-medium">"{emotionalState}"</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Thermometer size={18} className="text-red-500 mr-2" />
                  <span className="text-sm">온도: {plant.status.temperature}°C</span>
                </div>
                
                <div className="flex items-center">
                  <Droplet size={18} className="text-blue-500 mr-2" />
                  <span className="text-sm">습도: {plant.status.humidity}%</span>
                </div>
                
                <div className="flex items-center">
                  <Sun size={18} className="text-yellow-500 mr-2" />
                  <span className="text-sm">광량: {plant.status.light}%</span>
                </div>
                
                <div className="flex items-center">
                  <Clock size={18} className="text-plant-green mr-2" />
                  <span className="text-sm">물주기: {plant.wateringInterval}일</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Editable Information */}
      {isEditing ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">식물 설명</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24"
              placeholder="이 식물에 대한 메모나 설명을 입력하세요"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">물주기 간격 (일)</label>
            <Input
              type="number"
              min="1"
              max="60"
              value={wateringInterval}
              onChange={(e) => setWateringInterval(Number(e.target.value))}
            />
          </div>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <h3 className="font-semibold mb-2">적정 환경 조건</h3>
              
              <DualRangeSlider
                label="온도 (°C)"
                minValue={temperature.min}
                maxValue={temperature.max}
                minLimit={0}
                maxLimit={40}
                step={1}
                unit="°C"
                icon={<Thermometer size={18} className="text-red-500" />}
                onChange={(min, max) => setTemperature({ min, max })}
              />
              
              <DualRangeSlider
                label="습도 (%)"
                minValue={humidity.min}
                maxValue={humidity.max}
                minLimit={0}
                maxLimit={100}
                step={5}
                unit="%"
                icon={<Droplet size={18} className="text-blue-500" />}
                onChange={(min, max) => setHumidity({ min, max })}
              />
              
              <DualRangeSlider
                label="광량 (%)"
                minValue={light.min}
                maxValue={light.max}
                minLimit={0}
                maxLimit={100}
                step={5}
                unit="%"
                icon={<Sun size={18} className="text-yellow-500" />}
                onChange={(min, max) => setLight({ min, max })}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">식물 정보</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">품종</h4>
                <p className="text-sm">{plant.species}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">위치</h4>
                <p className="text-sm">{plant.location === "Indoor" ? "실내" : plant.location === "Outdoor" ? "실외" : "발코니"}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">설명</h4>
                <p className="text-sm">{description || "설명이 없습니다"}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">적정 환경</h4>
                <p className="text-sm">온도: {plant.environment.temperature.min}°C ~ {plant.environment.temperature.max}°C</p>
                <p className="text-sm">습도: {plant.environment.humidity.min}% ~ {plant.environment.humidity.max}%</p>
                <p className="text-sm">광량: {plant.environment.light.min}% ~ {plant.environment.light.max}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
