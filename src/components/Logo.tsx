
import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Logo({ size = 'medium' }: LogoProps) {
  const sizeClass = {
    small: 'w-10 h-10',
    medium: 'w-20 h-20',
    large: 'w-40 h-40',
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClass[size]}`}>
        <img 
          src="/lovable-uploads/dccb9ed4-455d-4134-8852-8cd7f9cc4927.png" 
          alt="Planttalk Logo" 
          className={`${sizeClass[size]}`}
        />
      </div>
      {size !== 'small' && (
        <div className="mt-2 text-center">
          <div className={`font-bold ${size === 'large' ? 'text-3xl' : 'text-xl'} text-plant-green`}>Planttalk</div>
          {size === 'large' && <div className="text-sm text-plant-dark-green mt-1">식물과 함께 성장하기</div>}
        </div>
      )}
    </div>
  );
}
