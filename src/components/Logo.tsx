import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Logo({ size = 'medium' }: LogoProps) {
  const sizeClass = {
    small: 'w-14',
    medium: 'w-28',
    large: 'w-52',
  };

  return (
    <div className="flex flex-col items-center">
      {size !== 'small' && (
        <div className="mb-2 text-center">
          <div className={`font-bold ${size === 'large' ? 'text-7xl' : 'text-2xl'} text-plant-green`}>
            Planttalk
          </div>
          {size === 'large' && (
            <div className="text-1xl text-plant-dark-green mt-1">
              식물과 함께 성장하기,  내 손안에 반려식물
            </div>
          )}
        </div>
      )}

      <div className={`relative ${sizeClass[size]}`}>
        <img 
          src="/lovable-uploads/dccb9ed4-455d-4134-8852-8cd7f9cc4927.png" 
          alt="Planttalk Logo"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
}
