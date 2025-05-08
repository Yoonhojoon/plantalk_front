
import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Logo({ size = 'medium' }: LogoProps) {
  const sizeClass = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClass[size]}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <svg viewBox="0 0 24 24" className={`${sizeClass[size]} text-plant-green`}>
              <path
                fill="currentColor"
                d="M12,3.5C7.03,3.5,3,7.53,3,12.5C3,17.47,7.03,21.5,12,21.5C12.39,21.5,12.77,21.47,13.14,21.41C13.9,21.67,14.7,21.83,15.5,21.9V20C15.5,18.92,15.97,17.93,16.7,17.2C17.43,16.47,18.42,16,19.5,16V3.5H12M10,7.5H14V9.5H10V7.5M7,10.5H17V12.5H7V10.5M8,14.5H13V16.5H8V14.5Z"
              />
            </svg>
          </div>
        </div>
      </div>
      {size !== 'small' && (
        <div className="mt-2 text-center">
          <div className={`font-bold ${size === 'large' ? 'text-2xl' : 'text-xl'} text-plant-green`}>Mood Green</div>
          {size === 'large' && <div className="text-xs text-plant-dark-green mt-1">식물과 함께 성장하기</div>}
        </div>
      )}
    </div>
  );
}
