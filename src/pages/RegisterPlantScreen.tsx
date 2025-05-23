
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlantContext } from "@/contexts/PlantContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Camera, Image, Thermometer, Droplet, Sun, Clock } from "lucide-react";
import { toast } from "sonner";
import DualRangeSlider from "@/components/DualRangeSlider";

export default function RegisterPlantScreen() {
  const navigate = useNavigate();
  const { addPlant } = usePlantContext();
  
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [location, setLocation] = useState("Indoor");
  const [image, setImage] = useState("");
  const [temperature, setTemperature] = useState({ min: 18, max: 26 });
  const [humidity, setHumidity] = useState({ min: 40, max: 70 });
  const [light, setLight] = useState({ min: 30, max: 70 });
  const [wateringInterval, setWateringInterval] = useState(7); // Default: 7 days
  
  const handleImageSelect = () => {
    // In a real app, this would open a file picker or camera
    // For now, we'll use placeholder images
    const placeholderImages = [
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=500",
      "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=500",
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=500",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=500"
    ];
    setImage(placeholderImages[Math.floor(Math.random() * placeholderImages.length)]);
    toast.success("이미지가 선택되었습니다!");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !species || !image) {
      toast.error("모든 필수 항목을 입력하고 이미지를 선택해주세요");
      return;
    }
    
    // Create current date for lastWatered
    const currentDate = new Date().toISOString();
    
    addPlant(name, species, location, image, {
      temperature,
      light, 
      humidity
    }, wateringInterval, currentDate);
    
    toast.success("식물이 추가되었습니다!");
    navigate("/dashboard");
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
        <h1 className="text-xl font-bold">새 식물 등록</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="name">식물 이름</Label>
          <Input
            id="name"
            placeholder="예: 피스 릴리"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="plant-form-input"
          />
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="species">식물 품종</Label>
          <Input
            id="species"
            placeholder="예: 스파티필럼"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="plant-form-input"
          />
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="location">위치</Label>
          <Select
            value={location}
            onValueChange={setLocation}
          >
            <SelectTrigger className="plant-form-input">
              <SelectValue placeholder="위치 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Indoor">실내</SelectItem>
              <SelectItem value="Outdoor">실외</SelectItem>
              <SelectItem value="Balcony">발코니</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="wateringInterval" className="flex items-center gap-2">
            <Clock size={18} className="text-plant-green" />
            물주기 간격 (일)
          </Label>
          <Input
            id="wateringInterval"
            type="number"
            min="1"
            max="60"
            value={wateringInterval}
            onChange={(e) => setWateringInterval(Number(e.target.value))}
            className="plant-form-input"
          />
        </div>
        
        <div className="space-y-4">
          <Label>식물 이미지</Label>
          {image ? (
            <div className="relative overflow-hidden rounded-xl h-64">
              <img 
                src={image} 
                alt="선택된 식물" 
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                className="absolute bottom-3 right-3 rounded-full bg-white text-plant-green hover:bg-white/90"
                onClick={handleImageSelect}
              >
                이미지 변경
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-24 flex flex-col gap-2 rounded-xl border-dashed"
                onClick={handleImageSelect}
              >
                <Camera size={24} />
                <span className="text-xs">사진 촬영</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-24 flex flex-col gap-2 rounded-xl border-dashed"
                onClick={handleImageSelect}
              >
                <Image size={24} />
                <span className="text-xs">갤러리에서 선택</span>
              </Button>
            </div>
          )}
        </div>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-6">
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
        
        <Button 
          type="submit" 
          className="w-full bg-plant-green hover:bg-plant-dark-green text-white rounded-full h-12"
        >
          식물 추가
        </Button>
      </form>
    </div>
  );
}
