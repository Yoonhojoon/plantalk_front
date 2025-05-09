import { usePlantEmotionNotification } from '@/hooks/usePlantEmotionNotification';

export default function PlantDetailPage() {
  const { emotion, testNotification } = usePlantEmotionNotification(plantId);

  return (
    <div>
      <button
        onClick={testNotification}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        알림 테스트
      </button>
    </div>
  );
} 