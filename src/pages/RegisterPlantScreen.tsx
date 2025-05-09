import { useState, useEffect } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import SensorSelector from "@/components/SensorSelector";
import { supabase } from "@/lib/supabase";

interface Sensor {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  signalStrength?: number;
  measurements: {
    temperature: boolean;
    humidity: boolean;
    light: boolean;
  };
}

interface PlantSpecies {
  id: string;
  name: string;
  description: string;
}

export default function RegisterPlantScreen() {
  const navigate = useNavigate();
  const { addPlant } = usePlantContext();
  
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [selectedSpeciesId, setSelectedSpeciesId] = useState("");
  const [location, setLocation] = useState("실내");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedSensors, setSelectedSensors] = useState<Sensor[]>([]);
  const [plantSpecies, setPlantSpecies] = useState<PlantSpecies[]>([]);
  
  const [temperature, setTemperature] = useState({ min: 18, max: 26 });
  const [humidity, setHumidity] = useState({ min: 40, max: 70 });
  const [light, setLight] = useState({ min: 40, max: 70 });
  const [wateringInterval, setWateringInterval] = useState(7);
  const [lastWatered, setLastWatered] = useState<Date | undefined>(new Date());

  useEffect(() => {
    // 식물 품종 데이터 가져오기
    const fetchPlantSpecies = async () => {
      try {
        const { data, error } = await supabase
          .from('plant_species')
          .select('*')
          .order('name');

        if (error) throw error;
        setPlantSpecies(data || []);
      } catch (error) {
        console.error('식물 품종 데이터 로딩 에러:', error);
        toast.error('식물 품종 데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchPlantSpecies();
  }, []);

  const handleSpeciesChange = (value: string) => {
    setSpecies(value);
    if (value === "custom") {
      // 랜덤 이미지 URL 설정
      const randomImages = [
        "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=500",
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=500",
        "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=500",
        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=500"
      ];
      setImage(randomImages[Math.floor(Math.random() * randomImages.length)]);
      setSelectedSpeciesId(""); // 직접 입력 시 species_id는 비움
    } else {
      // 선택된 품종에 따른 이미지 URL 설정
      setImage(`/images/emotion/${value}/happy.png`);
      // 선택된 품종의 id 찾기
      const selectedSpecies = plantSpecies.find(s => s.name === value);
      if (selectedSpecies) {
        setSelectedSpeciesId(selectedSpecies.id);
      }
    }
  };

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 로그인된 사용자 정보 가져오기
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (!name || !species || !location || !lastWatered) {
      toast.error("필수 정보를 모두 입력해주세요");
      return;
    }

    if (selectedSensors.length === 0) {
      toast.error("최소 하나 이상의 센서를 선택해주세요");
      return;
    }

    if (species !== "custom" && !selectedSpeciesId) {
      toast.error("식물 품종을 선택해주세요");
      return;
    }

    const plantData = {
      user_id: user.id,
      species_id: selectedSpeciesId,
      name: name,
      image_url: image,
      location: location,
      watering_cycle_days: wateringInterval,
      last_watered_at: lastWatered.toISOString(),
      temp_range_min: temperature.min,
      temp_range_max: temperature.max,
      humidity_range_min: humidity.min,
      humidity_range_max: humidity.max,
      light_range_min: light.min,
      light_range_max: light.max,
      sensor_id: selectedSensors.length > 0 ? selectedSensors[0].id : ''
    };

    console.log('저장할 식물 데이터:', plantData);

    try {
      const { data, error } = await supabase
        .from('plants')
        .insert([plantData])
        .select();

      if (error) throw error;

      console.log('저장된 식물 데이터:', data);
      toast.success("식물이 등록되었습니다!");
      navigate("/dashboard");
    } catch (error) {
      console.error('식물 등록 에러:', error);
      toast.error("식물 등록에 실패했습니다.");
    }
  };
  
  const handleTimeSelect = (hour: number, minute: number) => {
    if (lastWatered) {
      const newDate = new Date(lastWatered);
      newDate.setHours(hour, minute);
      setLastWatered(newDate);
    }
    setShowTimePicker(false);
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
          <div className="flex gap-2">
            <Select
              value={species}
              onValueChange={handleSpeciesChange}
            >
              <SelectTrigger className="flex-1 plant-form-input">
                <SelectValue placeholder="품종 선택" />
              </SelectTrigger>
              <SelectContent>
                {plantSpecies.map((species) => (
                  <SelectItem key={species.id} value={species.name}>
                    {species.name}
                  </SelectItem>
                ))}
                <SelectItem value="custom">직접 입력</SelectItem>
              </SelectContent>
            </Select>
            {species === "custom" && (
              <Input
                placeholder="품종 입력"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="flex-1 plant-form-input"
              />
            )}
          </div>
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
              <SelectItem value="실내">실내</SelectItem>
              <SelectItem value="실외">실외</SelectItem>
              <SelectItem value="발코니">발코니</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="lastWatered" className="flex items-center gap-2">
            <Clock size={18} className="text-plant-green" />
            마지막 물주기
          </Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal plant-form-input",
                    !lastWatered && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {lastWatered ? (
                    format(lastWatered, "PPP", { locale: ko })
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={lastWatered}
                  onSelect={setLastWatered}
                  initialFocus
                  locale={ko}
                />
              </PopoverContent>
            </Popover>

            <Popover open={showTimePicker} onOpenChange={setShowTimePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-32 justify-start text-left font-normal plant-form-input",
                    !lastWatered && "text-muted-foreground"
                  )}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {lastWatered ? (
                    format(lastWatered, "HH:mm", { locale: ko })
                  ) : (
                    <span>시간 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={selectedHour}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 0 && value <= 23) {
                          setSelectedHour(value);
                        }
                      }}
                      className="w-16 text-center"
                    />
                    <span className="text-muted-foreground">시</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={selectedMinute}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 0 && value <= 59) {
                          setSelectedMinute(value);
                        }
                      }}
                      className="w-16 text-center"
                    />
                    <span className="text-muted-foreground">분</span>
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTimePicker(false)}
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleTimeSelect(selectedHour, selectedMinute)}
                  >
                    확인
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
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
            <h3 className="font-semibold mb-2">연동할 센서</h3>
            <SensorSelector
              selectedSensors={selectedSensors}
              onSensorsChange={setSelectedSensors}
            />
          </CardContent>
        </Card>
        
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
