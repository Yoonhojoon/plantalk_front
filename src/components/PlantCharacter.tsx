
import { ReactNode } from 'react';

interface PlantCharacterProps {
  emotionalState: string;
}

export default function PlantCharacter({ emotionalState }: PlantCharacterProps) {
  // Character expressions based on emotional state
  const characterExpressions: Record<string, { emoji: string, color: string }> = {
    '행복해요': { emoji: '😊', color: 'bg-green-100' },
    '더워요': { emoji: '🥵', color: 'bg-red-100' },
    '추워요': { emoji: '🥶', color: 'bg-blue-100' },
    '건조해요': { emoji: '😰', color: 'bg-yellow-100' },
    '습해요': { emoji: '💧', color: 'bg-blue-100' },
    '목말라요': { emoji: '🥺', color: 'bg-yellow-100' },
    '너무 어두워요': { emoji: '😴', color: 'bg-gray-100' },
    '햇빛이 너무 강해요': { emoji: '😎', color: 'bg-yellow-100' }
  };
  
  // Default in case the emotional state isn't found
  const { emoji, color } = characterExpressions[emotionalState] || { emoji: '🌱', color: 'bg-green-100' };
  
  return (
    <div className={`${color} rounded-full p-4 aspect-square flex items-center justify-center`}>
      <div className="text-5xl">{emoji}</div>
    </div>
  );
}
