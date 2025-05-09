import { useState, useEffect } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

interface DualRangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: {
    min: number;
    max: number;
  };
  onChange: (value: { min: number; max: number }) => void;
  unit?: string;
}

export default function DualRangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  unit = ""
}: DualRangeSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    if (newMin <= value.max) {
      onChange({ min: newMin, max: value.max });
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    if (newMax >= value.min) {
      onChange({ min: value.min, max: newMax });
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative h-8">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.min}
          onChange={handleMinChange}
          className="absolute w-full h-8 opacity-0 cursor-pointer z-20"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.max}
          onChange={handleMaxChange}
          className="absolute w-full h-8 opacity-0 cursor-pointer z-20"
        />
        <div className="absolute inset-0 h-1.5 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div 
            className="absolute h-full bg-plant-green rounded-full" 
            style={{ 
              left: `${((value.min - min) / (max - min)) * 100}%`,
              right: `${100 - ((value.max - min) / (max - min)) * 100}%`
            }}
          />
        </div>
        <div 
          className="absolute w-5 h-5 bg-white border-2 border-plant-green rounded-full top-1/2 -translate-y-1/2 -ml-2.5 shadow-md"
          style={{ left: `${((value.min - min) / (max - min)) * 100}%` }}
        />
        <div 
          className="absolute w-5 h-5 bg-white border-2 border-plant-green rounded-full top-1/2 -translate-y-1/2 -ml-2.5 shadow-md"
          style={{ left: `${((value.max - min) / (max - min)) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{value.min}{unit}</span>
        <span>{value.max}{unit}</span>
      </div>
    </div>
  );
}
