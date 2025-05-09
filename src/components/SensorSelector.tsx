import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Wifi, Search, Bluetooth, Loader2, Thermometer, Droplet, Sun } from "lucide-react";
import { toast } from "sonner";

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

interface SensorSelectorProps {
  selectedSensors: Sensor[];
  onSensorsChange: (sensors: Sensor[]) => void;
}

export default function SensorSelector({ selectedSensors, onSensorsChange }: SensorSelectorProps) {
  const [showAddSensor, setShowAddSensor] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [availableSensors, setAvailableSensors] = useState<Sensor[]>([]);

  // 임시 센서 목록 (실제로는 블루투스 스캔 결과를 사용해야 함)
  const mockSensors: Sensor[] = [
    { 
      id: '1', 
      name: '거실 센서', 
      status: 'disconnected', 
      signalStrength: 85,
      measurements: {
        temperature: true,
        humidity: true,
        light: true
      }
    },
    { 
      id: '2', 
      name: '침실 센서', 
      status: 'disconnected', 
      signalStrength: 75,
      measurements: {
        temperature: true,
        humidity: true,
        light: true
      }
    },
    { 
      id: '3', 
      name: '주방 센서', 
      status: 'disconnected', 
      signalStrength: 90,
      measurements: {
        temperature: true,
        humidity: true,
        light: true
      }
    },
  ];

  const startScan = () => {
    setIsScanning(true);
    setAvailableSensors([]);
    
    // 실제로는 블루투스 스캔을 시작하는 코드가 들어가야 함
    setTimeout(() => {
      setAvailableSensors(mockSensors);
      setIsScanning(false);
    }, 2000);
  };

  const handleAddSensor = (sensor: Sensor) => {
    if (selectedSensors.some(s => s.id === sensor.id)) {
      toast.error("이미 추가된 센서입니다");
      return;
    }

    onSensorsChange([...selectedSensors, { ...sensor, status: 'connected' }]);
    toast.success("센서가 추가되었습니다");
  };

  const handleRemoveSensor = (sensorId: string) => {
    onSensorsChange(selectedSensors.filter(sensor => sensor.id !== sensorId));
  };

  const getSignalStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-500';
    if (strength >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">연동된 센서</h3>
        <Dialog open={showAddSensor} onOpenChange={setShowAddSensor}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus size={16} />
              센서 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>센서 검색</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <Label>사용 가능한 센서</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startScan}
                  disabled={isScanning}
                  className="gap-2"
                >
                  {isScanning ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      검색 중...
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      검색
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {isScanning ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 size={24} className="animate-spin mr-2" />
                    주변 센서를 검색 중입니다...
                  </div>
                ) : availableSensors.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    검색 버튼을 눌러 주변 센서를 찾아보세요
                  </div>
                ) : (
                  availableSensors.map((sensor) => (
                    <div
                      key={sensor.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                      onClick={() => handleAddSensor(sensor)}
                    >
                      <div className="flex items-center gap-3">
                        <Bluetooth
                          size={20}
                          className={getSignalStrengthColor(sensor.signalStrength || 0)}
                        />
                        <div>
                          <p className="text-sm font-medium">{sensor.name}</p>
                          <div className="flex items-center gap-2">
                            <MeasurementIcons measurements={sensor.measurements} />
                            <p className="text-xs text-muted-foreground">
                              통합 환경 센서
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3].map((bar) => (
                            <div
                              key={bar}
                              className={`w-1 h-3 rounded-full ${
                                (sensor.signalStrength || 0) >= bar * 30
                                  ? getSignalStrengthColor(sensor.signalStrength || 0)
                                  : 'bg-muted-foreground/20'
                              }`}
                            />
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-plant-green hover:text-plant-dark-green"
                        >
                          추가
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {selectedSensors.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            연동된 센서가 없습니다
          </div>
        ) : (
          selectedSensors.map((sensor) => (
            <div
              key={sensor.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Bluetooth
                  size={16}
                  className={sensor.status === 'connected' ? 'text-green-500' : 'text-red-500'}
                />
                <div>
                  <p className="text-sm font-medium">{sensor.name}</p>
                  <div className="flex items-center gap-2">
                    <MeasurementIcons measurements={sensor.measurements} />
                    <p className="text-xs text-muted-foreground">
                      통합 환경 센서
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSensor(sensor.id)}
              >
                제거
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 