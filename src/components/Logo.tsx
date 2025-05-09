
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
        <img 
          src="/lovable-uploads/9e93da93-a1f7-489d-ab9b-97c590cbf197.png" 
          alt="Planttalk Logo" 
          className={`${sizeClass[size]} rounded-lg`}
        />
      </div>
      {size !== 'small' && (
        <div className="mt-2 text-center">
          <div className={`font-bold ${size === 'large' ? 'text-2xl' : 'text-xl'} text-plant-green`}>Planttalk</div>
          {size === 'large' && <div className="text-xs text-plant-dark-green mt-1">식물과 함께 성장하기</div>}
        </div>
      )}
    </div>
  );
}
