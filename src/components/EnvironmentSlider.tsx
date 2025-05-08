
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface EnvironmentSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  icon: React.ReactNode;
}

export default function EnvironmentSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  icon
}: EnvironmentSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <Label>{label}</Label>
        </div>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => onChange(values[0])}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
