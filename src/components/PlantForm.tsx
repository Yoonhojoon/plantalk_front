
import { useState } from "react";
import { PlantEnvironment } from "../models/PlantModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplet, Sun, Clock } from "lucide-react";
import { usePlantContext } from "@/contexts/PlantContext";
import { useToast } from "@/components/ui/use-toast";
import DualRangeSlider from "./DualRangeSlider";

interface PlantFormProps {
  onComplete?: () => void;
}

export default function PlantForm({ onComplete }: PlantFormProps) {
  const { addPlant } = usePlantContext();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("Indoor");
  const [image, setImage] = useState("");
  const [wateringInterval, setWateringInterval] = useState(7); // Added watering interval state
  const [environment, setEnvironment] = useState<PlantEnvironment>({
    temperature: { min: 18, max: 28 },
    light: { min: 40, max: 80 },
    humidity: { min: 30, max: 70 }
  });

  const handleImageChange = () => {
    // In a real app, this would open a file dialog or camera
    // For this demo, we'll just use a placeholder image
    const placeholderImages = [
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=500",
      "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=500",
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=500",
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=500"
    ];
    setImage(placeholderImages[Math.floor(Math.random() * placeholderImages.length)]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !type || !image || !location) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    // Fixed: Pass all required arguments including wateringInterval
    addPlant(name, type, location, image, environment, wateringInterval);
    
    toast({
      title: "식물 등록 완료",
      description: `${name}이(가) 성공적으로 등록되었습니다.`,
    });
    
    // Reset form
    setName("");
    setType("");
    setLocation("Indoor");
    setImage("");
    setWateringInterval(7);
    setEnvironment({
      temperature: { min: 18, max: 28 },
      light: { min: 40, max: 80 },
      humidity: { min: 30, max: 70 }
    });
    
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>새로운 식물 등록</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">식물 이름</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="식물 이름을 입력하세요" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">식물 종류</Label>
            <Input 
              id="type" 
              value={type} 
              onChange={(e) => setType(e.target.value)} 
              placeholder="식물 종류를 입력하세요"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">위치</Label>
            <select
              id="location"
              className="w-full border border-input bg-background px-3 py-2 rounded-md"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="Indoor">실내</option>
              <option value="Outdoor">실외</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wateringInterval">물주기 간격 (일)</Label>
            <Input
              id="wateringInterval"
              type="number"
              min={1}
              max={30}
              value={wateringInterval}
              onChange={(e) => setWateringInterval(Number(e.target.value))}
              placeholder="며칠마다 물을 주는지 입력하세요"
            />
          </div>
          
          <div className="space-y-2">
            <Label>식물 사진</Label>
            {image ? (
              <div className="relative h-40 w-full overflow-hidden rounded-md">
                <img 
                  src={image} 
                  className="w-full h-full object-cover"
                  alt="Selected plant"
                />
                <Button 
                  type="button" 
                  size="sm" 
                  variant="secondary" 
                  className="absolute bottom-2 right-2"
                  onClick={handleImageChange}
                >
                  변경
                </Button>
              </div>
            ) : (
              <Button 
                type="button" 
                className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-md"
                variant="outline"
                onClick={handleImageChange}
              >
                <span className="text-muted-foreground">사진 선택</span>
                <span className="text-xs text-muted-foreground mt-1">(갤러리에서 선택)</span>
              </Button>
            )}
          </div>
          
          <div className="space-y-4 pt-4">
            <h3 className="font-medium">필요 환경 조건</h3>
            
            <div className="space-y-4">
              <DualRangeSlider
                label="온도 (°C)"
                minValue={environment.temperature.min}
                maxValue={environment.temperature.max}
                minLimit={0}
                maxLimit={40}
                step={1}
                unit="°C"
                icon={<Thermometer size={16} className="text-red-500" />}
                onChange={(min, max) => 
                  setEnvironment({
                    ...environment, 
                    temperature: { min, max }
                  })
                }
              />
              
              <DualRangeSlider
                label="광량 (%)"
                minValue={environment.light.min}
                maxValue={environment.light.max}
                minLimit={0}
                maxLimit={100}
                step={5}
                unit="%"
                icon={<Sun size={16} className="text-yellow-500" />}
                onChange={(min, max) => 
                  setEnvironment({
                    ...environment, 
                    light: { min, max }
                  })
                }
              />
              
              <DualRangeSlider
                label="습도 (%)"
                minValue={environment.humidity.min}
                maxValue={environment.humidity.max}
                minLimit={0}
                maxLimit={100}
                step={5}
                unit="%"
                icon={<Droplet size={16} className="text-blue-500" />}
                onChange={(min, max) => 
                  setEnvironment({
                    ...environment, 
                    humidity: { min, max }
                  })
                }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">등록하기</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
