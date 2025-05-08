
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
                d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
                transform="translate(12, 12) scale(0.8) translate(-12, -12)"
              />
            </svg>
            <div className="absolute" style={{ top: '-20%', right: '-20%' }}>
              <svg viewBox="0 0 24 24" className={`${size === 'small' ? 'w-6 h-6' : size === 'medium' ? 'w-8 h-8' : 'w-10 h-10'} text-plant-accent`}>
                <path
                  fill="currentColor"
                  d="M15,5A3,3,0,0,1,12,8A3,3,0,0,1,9,5A3,3,0,0,1,12,2A3,3,0,0,1,15,5M12,22A1,1,0,0,1,11,21V16H10A1,1,0,0,1,9,15V12A2,2,0,0,1,11,10H13A2,2,0,0,1,15,12V15A1,1,0,0,1,14,16H13V21A1,1,0,0,1,12,22M12,4A1,1,0,0,0,11,5A1,1,0,0,0,12,6A1,1,0,0,0,13,5A1,1,0,0,0,12,4Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {size !== 'small' && (
        <div className="mt-2 text-center">
          <div className={`font-bold ${size === 'large' ? 'text-2xl' : 'text-xl'} text-plant-green`}>Plant Buddy</div>
          {size === 'large' && <div className="text-xs text-plant-dark-green mt-1">Grow with care</div>}
        </div>
      )}
    </div>
  );
}
