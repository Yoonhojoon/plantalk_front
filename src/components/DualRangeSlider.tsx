import { useState, useEffect } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

interface DualRangeSliderProps {
  label: string;
  minValue: number;
  maxValue: number;
  step?: number;
  unit?: string;
  minLimit?: number;
  maxLimit?: number;
  icon?: React.ReactNode;
  className?: string;
  onChange: (min: number, max: number) => void;
}

export default function DualRangeSlider({
  label,
  minValue,
  maxValue,
  step = 1,
  unit = '',
  minLimit = 0,
  maxLimit = 100,
  icon,
  className,
  onChange
}: DualRangeSliderProps) {
  const [min, setMin] = useState(minValue);
  const [max, setMax] = useState(maxValue);
  const [minInput, setMinInput] = useState(minValue.toString());
  const [maxInput, setMaxInput] = useState(maxValue.toString());
  const [isMinFocused, setIsMinFocused] = useState(false);
  const [isMaxFocused, setIsMaxFocused] = useState(false);
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);

  // Calculate percentage for CSS variables
  const minPos = ((min - minLimit) / (maxLimit - minLimit)) * 100;
  const maxPos = ((max - minLimit) / (maxLimit - minLimit)) * 100;

  useEffect(() => {
    // Only update the state if props change from outside
    if (min !== minValue || max !== maxValue) {
      setMin(minValue);
      setMax(maxValue);
      setMinInput(minValue.toString());
      setMaxInput(maxValue.toString());
    }
  }, [minValue, maxValue]);

  // When min handle is moved
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    if (newMin <= max) {
      setMin(newMin);
      setMinInput(newMin.toString());
      onChange(newMin, max);
    } else {
      // If min exceeds max, set min equal to max
      setMin(max);
      setMinInput(max.toString());
      onChange(max, max);
    }
  };

  // When max handle is moved
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    if (newMax >= min) {
      setMax(newMax);
      setMaxInput(newMax.toString());
      onChange(min, newMax);
    } else {
      // If max is less than min, set max equal to min
      setMax(min);
      setMaxInput(min.toString());
      onChange(min, min);
    }
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinInput(e.target.value);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInput(e.target.value);
  };

  const handleMinInputBlur = () => {
    setIsMinFocused(false);
    let newMin = Number(minInput);
    
    // Validate the input
    if (isNaN(newMin)) newMin = min;
    if (newMin < minLimit) newMin = minLimit;
    if (newMin > max) newMin = max;
    
    setMin(newMin);
    setMinInput(newMin.toString());
    onChange(newMin, max);
  };

  const handleMaxInputBlur = () => {
    setIsMaxFocused(false);
    let newMax = Number(maxInput);
    
    // Validate the input
    if (isNaN(newMax)) newMax = max;
    if (newMax > maxLimit) newMax = maxLimit;
    if (newMax < min) newMax = min;
    
    setMax(newMax);
    setMaxInput(newMax.toString());
    onChange(min, newMax);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <Label>{label}</Label>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <button 
            type="button" 
            className="bg-transparent py-1 px-2 hover:bg-gray-100 rounded"
            onClick={() => setIsMinFocused(true)}
          >
            {isMinFocused ? (
              <Input
                type="text"
                value={minInput}
                onChange={handleMinInputChange}
                onBlur={handleMinInputBlur}
                className="w-12 h-6 p-1 text-center"
                autoFocus
              />
            ) : (
              <span>{min}{unit}</span>
            )}
          </button>
          <span>-</span>
          <button 
            type="button" 
            className="bg-transparent py-1 px-2 hover:bg-gray-100 rounded"
            onClick={() => setIsMaxFocused(true)}
          >
            {isMaxFocused ? (
              <Input
                type="text"
                value={maxInput}
                onChange={handleMaxInputChange}
                onBlur={handleMaxInputBlur}
                className="w-12 h-6 p-1 text-center"
                autoFocus
              />
            ) : (
              <span>{max}{unit}</span>
            )}
          </button>
        </div>
      </div>

      <div className="h-10 relative">
        {/* Track background */}
        <div className="absolute inset-0 h-1.5 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-full">
          {/* Selected range */}
          <div 
            className="absolute h-full bg-plant-green rounded-full" 
            style={{ 
              left: `${minPos}%`,
              right: `${100 - maxPos}%`
            }}
          />
        </div>
        
        {/* Min Range Slider */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={min}
          onChange={handleMinChange}
          className="absolute w-full h-10 opacity-0 cursor-pointer z-20"
          style={{
            clipPath: `inset(0 ${100 - minPos}% 0 0)`
          }}
        />
        
        {/* Max Range Slider */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={max}
          onChange={handleMaxChange}
          className="absolute w-full h-10 opacity-0 cursor-pointer z-20"
          style={{
            clipPath: `inset(0 0 0 ${maxPos}%)`
          }}
        />
        
        {/* Min handle */}
        <div 
          className={cn(
            "absolute w-5 h-5 bg-white border-2 border-plant-green rounded-full top-1/2 -translate-y-1/2 -ml-2.5 shadow-md transition-transform",
            isDraggingMin && "scale-110"
          )}
          style={{ left: `${minPos}%` }}
        />
        
        {/* Max handle */}
        <div 
          className={cn(
            "absolute w-5 h-5 bg-white border-2 border-plant-green rounded-full top-1/2 -translate-y-1/2 -ml-2.5 shadow-md transition-transform",
            isDraggingMax && "scale-110"
          )}
          style={{ left: `${maxPos}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{minLimit}{unit}</span>
        <span>{maxLimit}{unit}</span>
      </div>
    </div>
  );
}
