import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlantContext } from "@/contexts/PlantContext";
import { plantService, Species } from "@/services/plantService";
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

export default function RegisterPlantScreen() {
  const navigate = useNavigate();
  const { refreshPlants } = usePlantContext();
  
  const [name, setName] = useState("");
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [customSpecies, setCustomSpecies] = useState("");
  const [location, setLocation] = useState("Indoor");
  const [imageUrl, setImageUrl] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedSensors, setSelectedSensors] = useState<Sensor[]>([]);
  
  const [temperature, setTemperature] = useState({ min: 18, max: 26 });
  const [humidity, setHumidity] = useState({ min: 40, max: 70 });
  const [light, setLight] = useState({ min: 40, max: 70 });
  const [wateringInterval, setWateringInterval] = useState(7);
  const [lastWatered, setLastWatered] = useState<Date | undefined>(new Date());

  // 품종 목록 로드
  useEffect(() => {
    const loadSpecies = async () => {
      try {
        const species = await plantService.getSpecies();
        setSpeciesList(species);
      } catch (error) {
        toast.error("식물 품종 목록을 불러오는데 실패했습니다.");
      }
    };
    loadSpecies();
  }, []);

  // 품종 선택 시 기본값 설정
  const handleSpeciesSelect = (speciesId: string) => {
    if (speciesId === "custom") {
      setSelectedSpecies(null);
      setCustomSpecies("");
      setImageUrl(plantService.getRandomImageUrl());
      return;
    }

    const selected = speciesList.find(s => s.id === speciesId);
    if (selected) {
      setSelectedSpecies(selected);
      setCustomSpecies("");
      setTemperature({
        min: selected.temp_range_min,
        max: selected.temp_range_max
      });
      setHumidity({
        min: selected.humidity_range_min,
        max: selected.humidity_range_max
      });
      setLight({
        min: selected.light_range_min,
        max: selected.light_range_max
      });
      setWateringInterval(selected.watering_cycle_days);
      setImageUrl(plantService.getDefaultImageUrl(selected.id));
    }
  };

  // 직접 입력 시 랜덤 이미지 설정
  const handleCustomSpeciesInput = (value: string) => {
    setCustomSpecies(value);
    setSelectedSpecies(null);
    setImageUrl(plantService.getRandomImageUrl());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || (!selectedSpecies && !customSpecies)) {
      toast.error("필수 정보를 모두 입력해주세요");
      return;
    }

    try {
      const plantData = {
        species_id: selectedSpecies?.id || customSpecies,
        name,
        location,
        watering_cycle_days: wateringInterval,
        last_watered_at: lastWatered?.toISOString() || new Date().toISOString(),
        temp_range_min: temperature.min,
        temp_range_max: temperature.max,
        humidity_range_min: humidity.min,
        humidity_range_max: humidity.max,
        light_range_min: light.min,
        light_range_max: light.max,
        image_url: imageUrl,
        sensor_id: selectedSensors[0]?.id
      };

      await plantService.createPlant(plantData);
      toast.success("식물이 등록되었습니다!");
      await refreshPlants();
      navigate("/plants");
    } catch (error) {
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">새 식물 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>식물 이름</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="식물 이름을 입력하세요"
                  className="plant-form-input"
                />
              </div>

              <div className="space-y-2">
                <Label>식물 품종</Label>
                <div className="flex gap-2">
                  <Select
                    value={selectedSpecies?.id || "custom"}
                    onValueChange={handleSpeciesSelect}
                  >
                    <SelectTrigger className="flex-1 plant-form-input">
                      <SelectValue placeholder="품종 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {speciesList.map(species => (
                        <SelectItem key={species.id} value={species.id}>{species.name}</SelectItem>
                      ))}
                      <SelectItem value="custom">직접 입력</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedSpecies === null && (
                    <Input
                      placeholder="품종 입력"
                      value={customSpecies}
                      onChange={(e) => handleCustomSpeciesInput(e.target.value)}
                      className="flex-1 plant-form-input"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>위치</Label>
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

              <div className="space-y-2">
                <Label>마지막 물 준 날짜</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !lastWatered && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {lastWatered ? format(lastWatered, "PPP", { locale: ko }) : "날짜 선택"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={lastWatered}
                        onSelect={setLastWatered}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTimePicker(!showTimePicker)}
                    className="w-[120px]"
                  >
                    {format(new Date().setHours(selectedHour, selectedMinute), "HH:mm")}
                  </Button>
                </div>
                {showTimePicker && (
                  <div className="flex gap-2 mt-2">
                    <Select
                      value={selectedHour.toString()}
                      onValueChange={(value) => setSelectedHour(parseInt(value))}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="시" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i.toString().padStart(2, "0")}시
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={selectedMinute.toString()}
                      onValueChange={(value) => setSelectedMinute(parseInt(value))}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="분" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={(i * 5).toString()}>
                            {(i * 5).toString().padStart(2, "0")}분
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {imageUrl && (
                <div className="space-y-2">
                  <Label>식물 이미지</Label>
                  <div className="relative overflow-hidden rounded-xl h-64">
                    <img 
                      src={imageUrl} 
                      alt="선택된 식물" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>연결된 센서</Label>
                <SensorSelector
                  selectedSensors={selectedSensors}
                  onSensorsChange={setSelectedSensors}
                />
              </div>

              <div className="space-y-2">
                <Label>권장 온도 범위</Label>
                <DualRangeSlider
                  min={10}
                  max={35}
                  step={1}
                  value={temperature}
                  onChange={(value) => setTemperature(value)}
                  unit="°C"
                />
              </div>

              <div className="space-y-2">
                <Label>권장 습도 범위</Label>
                <DualRangeSlider
                  min={0}
                  max={100}
                  step={1}
                  value={humidity}
                  onChange={(value) => setHumidity(value)}
                  unit="%"
                />
              </div>

              <div className="space-y-2">
                <Label>권장 조도 범위</Label>
                <DualRangeSlider
                  min={0}
                  max={100}
                  step={1}
                  value={light}
                  onChange={(value) => setLight(value)}
                  unit="%"
                />
              </div>

              <div className="space-y-2">
                <Label>물 주기 (일)</Label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={wateringInterval}
                  onChange={(e) => setWateringInterval(parseInt(e.target.value))}
                  className="plant-form-input"
                />
              </div>

              {imageUrl && (
                <div className="space-y-2">
                  <Label>식물 이미지</Label>
                  <div className="relative overflow-hidden rounded-xl h-64">
                    <img 
                      src={imageUrl} 
                      alt="선택된 식물" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button type="submit">
            등록하기
          </Button>
        </div>
      </form>
    </div>
  );
}
