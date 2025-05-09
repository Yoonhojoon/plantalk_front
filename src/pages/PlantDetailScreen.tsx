import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlantContext } from "@/contexts/PlantContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Thermometer, Droplet, Sun, Clock, Pencil, Check, Camera, Image, Bluetooth } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plant } from "@/models/PlantModel";
import DualRangeSlider from "@/components/DualRangeSlider";
import PlantCharacter from "@/components/PlantCharacter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { usePlantEmotionNotification } from '@/hooks/usePlantEmotionNotification';
import { Separator } from "@/components/ui/separator";

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

export default function PlantDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plants, updatePlantStatus, updatePlant } = usePlantContext();
  
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [location, setLocation] = useState("Indoor");
  const [image, setImage] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  
  const [temperature, setTemperature] = useState({ min: 0, max: 0 });
  const [humidity, setHumidity] = useState({ min: 0, max: 0 });
  const [light, setLight] = useState({ min: 0, max: 0 });
  const [wateringInterval, setWateringInterval] = useState(7);
  const [lastWatered, setLastWatered] = useState<Date | undefined>(new Date());
  const [sensors, setSensors] = useState<Sensor[]>([]);
  
  const [speciesList, setSpeciesList] = useState<{ id: string, scientific_name: string, description: string }[]>([]);
  
  const [sensorStatus, setSensorStatus] = useState({ temperature: 0, humidity: 0, light: 0 });
  
  // 식물의 감정 상태 모니터링 및 알림
  const { emotion, testNotification } = usePlantEmotionNotification(id || '');
  
  const fetchSensorStatusByPlantId = async (plantId: string) => {
    const { data: plantData, error: plantError } = await supabase
      .from('plants')
      .select('sensor_id')
      .eq('id', plantId)
      .maybeSingle();

    if (plantError || !plantData?.sensor_id) {
      console.error("sensor_id를 가져오지 못했습니다.");
      return;
    }

    const sensorId = plantData.sensor_id;
    console.log(sensorId);

    const { data: statusData, error: statusError } = await supabase
      .from('plant_status_logs')
      .select('temperature, humidity, light')
      .eq('sensor_id', sensorId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log(statusData);

    if (statusError) {
      console.error("센서 상태 조회 실패", statusError);
      return;
    }

    if (statusData) {
      setSensorStatus({
        temperature: statusData.temperature ?? 0,
        humidity: statusData.humidity ?? 0,
        light: statusData.light ?? 0,
      });
    }
  };

  useEffect(() => {
    if (id && plants.length > 0) {
      const foundPlant = plants.find(p => p.id === id);
      console.log(foundPlant);
      if (foundPlant) {
        // 변환
        const convertedPlant = {
          ...foundPlant,
          environment: {
            temperature: {
              min: foundPlant.temp_range_min,
              max: foundPlant.temp_range_max,
            },
            humidity: {
              min: foundPlant.humidity_range_min,
              max: foundPlant.humidity_range_max,
            },
            light: {
              min: foundPlant.light_range_min,
              max: foundPlant.light_range_max,
            },
          },
          status: foundPlant.status || {
            temperature: 0,
            humidity: 0,
            light: 0,
          },
          wateringInterval: foundPlant.watering_cycle_days,
          lastWatered: foundPlant.last_watered_at,
          image: foundPlant.image_url,
          species: foundPlant.species_id,
          type: '', // 필요시 기본값
        };
        setPlant(convertedPlant);
        setName(convertedPlant.name);
        setSpecies(convertedPlant.species);
        setLocation(convertedPlant.location);
        setImage(convertedPlant.image);
        setDescription(convertedPlant.type || "");
        setTemperature({
          min: convertedPlant.environment.temperature.min,
          max: convertedPlant.environment.temperature.max
        });
        setHumidity({
          min: convertedPlant.environment.humidity.min,
          max: convertedPlant.environment.humidity.max
        });
        setLight({
          min: convertedPlant.environment.light.min,
          max: convertedPlant.environment.light.max
        });
        setWateringInterval(convertedPlant.wateringInterval);
        if (convertedPlant.lastWatered) {
          const date = new Date(convertedPlant.lastWatered);
          setLastWatered(date);
          setSelectedHour(date.getHours());
          setSelectedMinute(date.getMinutes());
        }
        // 임시 센서 데이터 (실제로는 API나 데이터베이스에서 가져와야 함)
        setSensors([
          {
            id: 'SENSOR_01',
            name: 'SENSOR_01',
            status: 'connected',
            signalStrength: 85,
            measurements: {
              temperature: true,
              humidity: true,
              light: true
            }
          }
        ]);
      }
    }
  }, [id, plants]);

  useEffect(() => {
    const fetchSpecies = async () => {
      const { data } = await supabase.from('plant_species').select('id, scientific_name, description');
      if (data) setSpeciesList(data);
    };
    fetchSpecies();
  }, []);

  useEffect(() => {
    if (id) {
      fetchSensorStatusByPlantId(id);
      
      // 15초마다 센서 데이터 업데이트
      const intervalId = setInterval(() => {
        fetchSensorStatusByPlantId(id);
      }, 15000); // 15초

      // 컴포넌트가 언마운트될 때 인터벌 정리
      return () => clearInterval(intervalId);
    }
  }, [id]);

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
    toast.success("이미지가 변경되었습니다!");
  };

  const handleTimeSelect = (hour: number, minute: number) => {
    if (lastWatered) {
      const newDate = new Date(lastWatered);
      newDate.setHours(hour, minute);
      setLastWatered(newDate);
    }
    setShowTimePicker(false);
  };
  
  const handleSave = async () => {
    if (!plant) return;
    
    try {
      console.log('업데이트할 데이터:', {
        name,
        species_id: species,
        location,
        image_url: image,
        temp_range_min: plant.environment.temperature.min,
        temp_range_max: plant.environment.temperature.max,
        humidity_range_min: plant.environment.humidity.min,
        humidity_range_max: plant.environment.humidity.max,
        light_range_min: plant.environment.light.min,
        light_range_max: plant.environment.light.max,
        watering_cycle_days: wateringInterval,
        last_watered_at: lastWatered?.toISOString()
      });

      // DB 업데이트
      const { data, error } = await supabase
        .from('plants')
        .update({
          name: name,
          species_id: species,
          location: location,
          image_url: image,
          temp_range_min: plant.environment.temperature.min,
          temp_range_max: plant.environment.temperature.max,
          humidity_range_min: plant.environment.humidity.min,
          humidity_range_max: plant.environment.humidity.max,
          light_range_min: plant.environment.light.min,
          light_range_max: plant.environment.light.max,
          watering_cycle_days: wateringInterval,
          last_watered_at: lastWatered?.toISOString()
        })
        .eq('id', plant.id)
        .select();

      if (error) {
        console.error('DB 업데이트 에러:', error);
        throw error;
      }

      console.log('업데이트된 데이터:', data);
      setIsEditing(false);
      toast.success("식물 정보가 업데이트되었습니다");
    } catch (error) {
      console.error('식물 정보 업데이트 실패:', error);
      toast.error("식물 정보 업데이트에 실패했습니다");
    }
  };
  
  // Calculate plant emotional state based on environmental conditions
  const getEmotionalState = (): string => {
    if (!plant) return "행복해요";
    
    // 센서에서 받아온 실시간 값 사용!
    const { temperature, humidity, light } = sensorStatus;
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
  
  const MeasurementIcons = ({ measurements }: { measurements: Sensor['measurements'] }) => (
    <div className="flex gap-1">
      {measurements.temperature && (
        <Thermometer size={14} className="text-red-500" />
      )}
      {measurements.humidity && (
        <Droplet size={14} className="text-blue-500" />
      )}
      {measurements.light && (
        <Sun size={14} className="text-yellow-500" />
      )}
    </div>
  );
  
  const speciesName = speciesList.find(s => s.id === plant?.species)?.scientific_name || plant?.species;
  const speciesDescription = speciesList.find(s => s.id === plant?.species)?.description || "설명이 없습니다";
  
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
        <h1 className="text-xl font-bold">{plant?.name || '식물 상세'}</h1>
      </div>

      {/* Horizontal split layout - Plant Character and Status */}
      <div className="flex mb-6">
        {/* Left side (50%): Plant Image */}
        <div className="w-1/2 pr-2 flex items-center justify-center">
          <PlantCharacter 
            emotionalState={emotionalState} 
            imageUrl={plant.image_url}
          />
        </div>
        
        {/* Right side (50%): Plant Status */}
        <div className="w-1/2 pl-2">
          <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden h-full">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <h3 className="font-semibold">{plant.name}의 상태</h3>
              </div>
              
              <div className="flex items-center mb-4">
                <p className="text-sm text-plant-dark-green font-medium mr-2">"{emotionalState}"</p>
                <div className="text-lg">
                  {emotionalState === '행복해요' && '😊'}
                  {emotionalState === '추워요' && '🥶'}
                  {emotionalState === '더워요' && '🥵'}
                  {emotionalState === '건조해요' && '😰'}
                  {emotionalState === '습해요' && '💧'}
                  {emotionalState === '목말라요' && '🥺'}
                  {emotionalState === '너무 어두워요' && '😴'}
                  {emotionalState === '햇빛이 너무 강해요' && '😎'}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Thermometer size={18} className="text-red-500 mr-2" />
                  <span className="text-sm">온도: {sensorStatus.temperature}°C</span>
                </div>
                
                <div className="flex items-center">
                  <Droplet size={18} className="text-blue-500 mr-2" />
                  <span className="text-sm">습도: {sensorStatus.humidity}%</span>
                </div>
                
                <div className="flex items-center">
                  <Sun size={18} className="text-yellow-500 mr-2" />
                  <span className="text-sm">광량: {sensorStatus.light} lux</span>
                </div>
                
                <div className="flex items-center">
                  <Clock size={18} className="text-plant-green mr-2" />
                  <span className="text-sm">물주기: {plant.wateringInterval}일</span>
                </div>

                <div className="flex items-center">
                  <Clock size={18} className="text-plant-green mr-2" />
                  <span className="text-sm">
                    마지막 물 준 날: {plant.lastWatered ? format(new Date(plant.lastWatered), 'yyyy년 MM월 dd일', { locale: ko }) : '없음'}
                  </span>
                </div>

                <div className="flex items-center">
                  <Clock size={18} className="text-plant-green mr-2" />
                  <span className="text-sm">
                    다음 물주기까지: {
                      plant.lastWatered ? (
                        (() => {
                          const lastWatered = new Date(plant.lastWatered);
                          const nextWatering = new Date(lastWatered);
                          nextWatering.setDate(nextWatering.getDate() + plant.wateringInterval);
                          const today = new Date();
                          const diffTime = nextWatering.getTime() - today.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          return diffDays > 0 ? `${diffDays}일 남음` : '오늘 물을 줘야 해요!';
                        })()
                      ) : '알 수 없음'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Editable Information */}
      {isEditing ? (
        <div className="space-y-6">
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
                onValueChange={setSpecies}
              >
                <SelectTrigger className="flex-1 plant-form-input">
                  <SelectValue placeholder="품종 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="스파티필럼">스파티필럼</SelectItem>
                  <SelectItem value="몬스테라">몬스테라</SelectItem>
                  <SelectItem value="산세베리아">산세베리아</SelectItem>
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
                <SelectItem value="Indoor">실내</SelectItem>
                <SelectItem value="Outdoor">실외</SelectItem>
                <SelectItem value="Balcony">발코니</SelectItem>
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

          <div className="space-y-2">
            <Label>식물 설명</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24"
              placeholder="이 식물에 대한 메모나 설명을 입력하세요"
            />
          </div>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <h3 className="font-semibold mb-2">적정 환경 조건</h3>
              
              <DualRangeSlider
                label="온도 (°C)"
                minValue={plant.environment.temperature.min}
                maxValue={plant.environment.temperature.max}
                minLimit={0}
                maxLimit={40}
                step={1}
                unit="°C"
                icon={<Thermometer size={18} className="text-red-500" />}
                onChange={(min, max) => {
                  setPlant({
                    ...plant,
                    environment: {
                      ...plant.environment,
                      temperature: { min, max }
                    }
                  });
                }}
              />
              
              <DualRangeSlider
                label="습도 (%)"
                minValue={plant.environment.humidity.min}
                maxValue={plant.environment.humidity.max}
                minLimit={0}
                maxLimit={100}
                step={5}
                unit="%"
                icon={<Droplet size={18} className="text-blue-500" />}
                onChange={(min, max) => {
                  setPlant({
                    ...plant,
                    environment: {
                      ...plant.environment,
                      humidity: { min, max }
                    }
                  });
                }}
              />
              
              <DualRangeSlider
                label="광량 (lux)"
                minValue={plant.environment.light.min}
                maxValue={plant.environment.light.max}
                minLimit={0}
                maxLimit={1000}
                step={10}
                unit="lux"
                icon={<Sun size={18} className="text-yellow-500" />}
                onChange={(min, max) => {
                  setPlant({
                    ...plant,
                    environment: {
                      ...plant.environment,
                      light: { min, max }
                    }
                  });
                }}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* 식물 기본 정보 */}
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                  {plant.image_url ? (
                    <img 
                      src={plant.image_url} 
                      alt={plant.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Image size={32} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{plant.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{speciesName}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-plant-light-green/20 text-plant-green text-xs rounded-full">
                      {plant.location === "Indoor" ? "실내" : plant.location === "Outdoor" ? "실외" : "발코니"}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 식물 설명 */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">식물 설명</h4>
                <p className="text-sm leading-relaxed">
                  {description || "아직 설명이 없습니다. 식물에 대한 설명을 추가해보세요!"}
                </p>
              </div>

              <Separator />

              {/* 적정 환경 */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">적정 환경</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <Thermometer size={16} className="text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">온도</p>
                      <p className="text-sm text-muted-foreground">
                        {plant.environment.temperature.min}°C ~ {plant.environment.temperature.max}°C
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Droplet size={16} className="text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">습도</p>
                      <p className="text-sm text-muted-foreground">
                        {plant.environment.humidity.min}% ~ {plant.environment.humidity.max}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Sun size={16} className="text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">광량</p>
                      <p className="text-sm text-muted-foreground">
                        {plant.environment.light.min} lux ~ {plant.environment.light.max} lux
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 연동된 센서 */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">연동된 센서</h4>
                <div className="space-y-2">
                  {sensors.length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">연동된 센서가 없습니다</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => toast.info('센서 연결 기능은 준비 중입니다.')}
                      >
                        센서 연결하기
                      </Button>
                    </div>
                  ) : (
                    sensors.map((sensor) => (
                      <div
                        key={sensor.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${
                            sensor.status === 'connected' ? 'bg-green-100' : 'bg-red-100'
                          } flex items-center justify-center`}>
                            <Bluetooth
                              size={16}
                              className={sensor.status === 'connected' ? 'text-green-500' : 'text-red-500'}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{sensor.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <MeasurementIcons measurements={sensor.measurements} />
                              <p className="text-xs text-muted-foreground">
                                통합 환경 센서
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3].map((bar) => (
                            <div
                              key={bar}
                              className={`w-1 h-3 rounded-full ${
                                (sensor.signalStrength || 0) >= bar * 30
                                  ? sensor.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                                  : 'bg-muted-foreground/20'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
