import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useNotification } from './useNotification';
import { sendFCMNotification } from '@/api/notifications';

const getEmotionMessage = (emotion: string, plantName: string) => {
  const messages = {
    sad: `${plantName}가 슬퍼하고 있어요. 물을 주거나 햇빛을 쬐여주세요.`,
    angry: `${plantName}가 화가 나있어요. 온도나 습도를 확인해주세요.`,
    tired: `${plantName}가 지쳐있어요. 휴식을 주세요.`,
    scared: `${plantName}가 불안해하고 있어요. 환경을 안정화해주세요.`,
    default: `${plantName}의 상태가 좋지 않아요. 확인이 필요합니다.`
  };
  return messages[emotion as keyof typeof messages] || messages.default;
};

export const usePlantEmotionNotification = (plantId: string) => {
  const { token } = useNotification();

  const { data: plantData } = useQuery({
    queryKey: ['plant', plantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plants')
        .select('id, name, sensor_id')
        .eq('id', plantId)
        .single();
      
      if (error) throw error;
      return data;
      
    }
  });

  const { data: emotion } = useQuery({
    queryKey: ['plantEmotion', plantId],
    queryFn: async () => {
      if (!plantData?.sensor_id) return null;

      const { data: statusData, error: statusError } = await supabase
        .from('plant_status_logs')
        .select('emotion')
        .eq('sensor_id', plantData.sensor_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (statusError) throw statusError;
      return statusData?.emotion;
    },
    refetchInterval: 1000 * 60 * 30, // 30분마다 감정 상태 확인
    enabled: !!plantData?.sensor_id
  });

  // 테스트용 함수
  const testNotification = async () => {
    if (!token || !plantData?.name) {
      console.error('FCM 토큰 또는 식물 정보가 없습니다.');
      return;
    }

    try {
      await sendFCMNotification({
        token,
        title: '식물의 감정 상태가 좋지 않아요!',
        body: getEmotionMessage('sad', plantData.name),
        data: {
          plantId,
          emotion: 'sad',
        },
      });
      console.log('알림 전송 성공');
    } catch (error) {
      console.error('알림 전송 실패:', error);
    }
  };

  const sendTestNotification = async () => {
    try {
      if (!token) {
        console.error('FCM 토큰이 없습니다.');
        return;
      }

      if (!plantData) {
        console.error('식물 정보가 없습니다.');
        return;
      }

      console.log('테스트 알림 전송 시도:', {
        fcmToken: token,
        plantName: plantData.name,
        plantId: plantData.id
      });

      await sendFCMNotification({
        token,
        title: '테스트 알림',
        body: `${plantData.name}의 테스트 알림입니다.`,
        data: {
          plantId: plantData.id.toString(),
          type: 'test'
        }
      });

      console.log('테스트 알림 전송 성공');
    } catch (error) {
      console.error('테스트 알림 전송 실패:', error);
      if (error instanceof Error) {
        console.error('에러 상세:', error.message);
      }
    }
  };

  useEffect(() => {
    if (emotion && emotion !== 'happy' && token && plantData?.name) {
      sendFCMNotification({
        token,
        title: '식물의 감정 상태가 좋지 않아요!',
        body: getEmotionMessage(emotion, plantData.name),
        data: {
          plantId,
          emotion,
        },
      }).catch(error => {
        console.error('Failed to send notification:', error);
      });
    }
  }, [emotion, plantId, token, plantData?.name]);

  return { emotion, testNotification, sendTestNotification };
}; 