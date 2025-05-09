import { useState } from "react";
import { Plant } from "../models/PlantModel";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Thermometer, Droplet, Sun, Droplets, Star } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { usePlantContext } from "@/contexts/PlantContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import PlantEmotionUpdater from "./PlantEmotionUpdater";

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const { removePlant, updatePlantWatering, representativePlantId, setRepresentativePlant, clearRepresentativePlant } = usePlantContext();
  const [open, setOpen] = useState(false);
  const [wateringDialogOpen, setWateringDialogOpen] = useState(false);
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removePlant(plant.id);
    toast.success("식물이 삭제되었습니다");
    setOpen(false);
  };

  const handleWater = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWateringDialogOpen(true);
  };
  
  const confirmWatering = () => {
    const currentDate = new Date().toISOString();
    updatePlantWatering(plant.id, currentDate);
    toast.success(`${plant.name}에 물을 주었습니다!`);
    setWateringDialogOpen(false);
  };
  
  // Calculate days until next watering
  const getDaysUntilNextWatering = (): number => {
    const lastWatered = plant.lastWatered 
      ? new Date(plant.lastWatered) 
      : new Date(); // Default to today if not set
    
    const nextWatering = new Date(lastWatered);
    nextWatering.setDate(nextWatering.getDate() + plant.wateringInterval);
    
    const today = new Date();
    const diffTime = nextWatering.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysUntilWatering = getDaysUntilNextWatering();
  
  const isTemperatureOk = 
    plant.status.temperature >= plant.environment.temperature.min &&
    plant.status.temperature <= plant.environment.temperature.max;
  
  const isHumidityOk = 
    plant.status.humidity >= plant.environment.humidity.min &&
    plant.status.humidity <= plant.environment.humidity.max;
    
  const isLightOk = 
    plant.status.light >= plant.environment.light.min &&
    plant.status.light <= plant.environment.light.max;

  // 대표 식물 지정/해제 핸들러
  const handleSetRepresentative = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRepresentativePlant(plant.id);
    toast.success(`'${plant.name}'이(가) 대표 식물로 지정되었습니다!`);
  };
  const handleClearRepresentative = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearRepresentativePlant();
    toast.success("대표 식물이 해제되었습니다.");
  };

  const isRepresentative = representativePlantId === plant.id;

  return (
    <Link to={`/plant-detail/${plant.id}`} className="block">
      <PlantEmotionUpdater plantId={plant.id} />
      <Card className="plant-card border-0 relative">
        {/* 대표 식물 뱃지 및 별표 버튼 */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
          {isRepresentative && (
            <div className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              대표
            </div>
          )}
          <Button
            size="icon"
            variant="ghost"
            className={`rounded-full border-none p-1 ${isRepresentative ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
            aria-label={isRepresentative ? '대표 해제' : '대표로 지정'}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (isRepresentative) {
                clearRepresentativePlant();
                toast.success("대표 식물이 해제되었습니다.");
              } else {
                setRepresentativePlant(plant.id);
                toast.success(`'${plant.name}'이(가) 대표 식물로 지정되었습니다!`);
              }
            }}
          >
            <Star fill={isRepresentative ? '#facc15' : 'none'} size={22} />
          </Button>
        </div>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 z-10 bg-white/70 hover:bg-white/90 text-gray-500 rounded-full p-1 w-8 h-8"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
              }}
            >
              <Trash2 size={16} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                {plant.name}을(를) 식물 컬렉션에서 영구적으로 삭제합니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">취소</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 rounded-full"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
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
        
        <div className="relative h-40 overflow-hidden">
          <img 
            src={plant.image} 
            alt={plant.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=500";
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
            <div className="flex justify-between">
              <div>
                <h3 className="text-white font-medium text-lg">{plant.name}</h3>
                <p className="text-white/80 text-xs">{plant.species}</p>
              </div>
              <div className="bg-plant-green/90 text-white text-xs font-semibold px-2 py-1 rounded-full self-start">
                {plant.location === "Indoor" ? "실내" : plant.location === "Outdoor" ? "실외" : "발코니"}
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <Button 
                variant="outline" 
                size="sm"
                className={`flex items-center ${daysUntilWatering <= 0 ? 'text-red-500 border-red-200 hover:bg-red-50' : 'text-blue-500 border-blue-200 hover:bg-blue-50'}`}
                onClick={handleWater}
              >
                {daysUntilWatering <= 0 ? (
                  <>
                    <Droplets className="mr-1" size={16} />
                    <span className="text-xs">물을 주세요</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-bold mr-1">D-{daysUntilWatering}</span>
                    <span className="text-xs">물</span>
                  </>
                )}
              </Button>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1">
                <div className={`p-1.5 rounded-lg ${isTemperatureOk ? 'bg-red-100 text-red-600 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300'}`}>
                  <Thermometer size={16} />
                </div>
                
                <div className={`p-1.5 rounded-lg ${isHumidityOk ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300'}`}>
                  <Droplet size={16} />
                </div>
                
                <div className={`p-1.5 rounded-lg ${isLightOk ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300'}`}>
                  <Sun size={16} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
