
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface EnvironmentSliderProps {
  label: string;
  minValue: number;
  maxValue: number;
  min: number;
  max: number;
  step?: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  icon: React.ReactNode;
}

export default function EnvironmentSlider({
  label,
  minValue,
  maxValue,
  min,
  max,
  step = 1,
  onMinChange,
  onMaxChange,
  icon
}: EnvironmentSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <Label>{label}</Label>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">최소값</span>
            <span className="text-sm font-medium">{minValue}</span>
          </div>
          <Slider
            value={[minValue]}
            min={min}
            max={max}
            step={step}
            onValueChange={(values) => onMinChange(values[0])}
            className="bg-blue-100 dark:bg-blue-900/30"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">최대값</span>
            <span className="text-sm font-medium">{maxValue}</span>
          </div>
          <Slider
            value={[maxValue]}
            min={min}
            max={max}
            step={step}
            onValueChange={(values) => onMaxChange(values[0])}
            className="bg-red-100 dark:bg-red-900/30"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
