import { ReactNode } from 'react';

interface PlantCharacterProps {
  emotionalState: string;
  imageUrl?: string;
}

export default function PlantCharacter({ emotionalState, imageUrl }: PlantCharacterProps) {
  // Character expressions based on emotional state
  const characterExpressions: Record<string, { color: string }> = {
    '행복해요': { color: 'bg-green-100' },
    '더워요': { color: 'bg-red-100' },
    '추워요': { color: 'bg-blue-100' },
    '건조해요': { color: 'bg-yellow-100' },
    '습해요': { color: 'bg-blue-100' },
    '목말라요': { color: 'bg-yellow-100' },
    '너무 어두워요': { color: 'bg-gray-100' },
    '햇빛이 너무 강해요': { color: 'bg-yellow-100' }
  };
  
  // Default in case the emotional state isn't found
  const { color } = characterExpressions[emotionalState] || { color: 'bg-green-100' };
  
  return (
    <div className={`${color} rounded-full p-4 aspect-square flex items-center justify-center`}>
      {imageUrl ? (
        <img src={imageUrl} alt={emotionalState} className="w-full h-full object-contain" />
      ) : (
        <div className="text-5xl">🌱</div>
      )}
    </div>
  );
}
