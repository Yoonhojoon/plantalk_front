
import { useState } from "react";
import { PlantEnvironment } from "../models/PlantModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Thermometer, Droplet, Sun } from "lucide-react";
import { usePlantContext } from "@/contexts/PlantContext";
import { useToast } from "@/components/ui/use-toast";

interface PlantFormProps {
  onComplete?: () => void;
}

export default function PlantForm({ onComplete }: PlantFormProps) {
  const { addPlant } = usePlantContext();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("Indoor"); // Added location state
  const [image, setImage] = useState("");
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
    
    // Updated to pass all 5 required arguments
    addPlant(name, type, location, image, environment);
    
    toast({
      title: "식물 등록 완료",
      description: `${name}이(가) 성공적으로 등록되었습니다.`,
    });
    
    // Reset form
    setName("");
    setType("");
    setLocation("Indoor");
    setImage("");
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
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Thermometer size={16} />
                  <Label>온도 (°C)</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs mb-1 block">최소</Label>
                    <Slider
                      value={[environment.temperature.min]}
                      min={0}
                      max={40}
                      step={1}
                      onValueChange={(values) => 
                        setEnvironment({
                          ...environment,
                          temperature: { ...environment.temperature, min: values[0] }
                        })
                      }
                    />
                    <div className="mt-1 text-center text-sm">{environment.temperature.min}°C</div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">최대</Label>
                    <Slider
                      value={[environment.temperature.max]}
                      min={0}
                      max={40}
                      step={1}
                      onValueChange={(values) => 
                        setEnvironment({
                          ...environment,
                          temperature: { ...environment.temperature, max: values[0] }
                        })
                      }
                    />
                    <div className="mt-1 text-center text-sm">{environment.temperature.max}°C</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sun size={16} />
                  <Label>조도 (%)</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs mb-1 block">최소</Label>
                    <Slider
                      value={[environment.light.min]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(values) => 
                        setEnvironment({
                          ...environment,
                          light: { ...environment.light, min: values[0] }
                        })
                      }
                    />
                    <div className="mt-1 text-center text-sm">{environment.light.min}%</div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">최대</Label>
                    <Slider
                      value={[environment.light.max]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(values) => 
                        setEnvironment({
                          ...environment,
                          light: { ...environment.light, max: values[0] }
                        })
                      }
                    />
                    <div className="mt-1 text-center text-sm">{environment.light.max}%</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Droplet size={16} />
                  <Label>습도 (%)</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs mb-1 block">최소</Label>
                    <Slider
                      value={[environment.humidity.min]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(values) => 
                        setEnvironment({
                          ...environment,
                          humidity: { ...environment.humidity, min: values[0] }
                        })
                      }
                    />
                    <div className="mt-1 text-center text-sm">{environment.humidity.min}%</div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">최대</Label>
                    <Slider
                      value={[environment.humidity.max]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(values) => 
                        setEnvironment({
                          ...environment,
                          humidity: { ...environment.humidity, max: values[0] }
                        })
                      }
                    />
                    <div className="mt-1 text-center text-sm">{environment.humidity.max}%</div>
                  </div>
                </div>
              </div>
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
