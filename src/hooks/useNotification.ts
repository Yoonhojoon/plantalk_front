import { useEffect, useState } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging, requestNotificationPermission } from '../firebase/config';

export const useNotification = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('useNotification hook initialized');
    
    const initializeNotification = async () => {
      try {
        console.log('Requesting notification permission...');
        const token = await requestNotificationPermission();
        console.log('Notification permission granted, token:', token);
        setToken(token);
      } catch (err) {
        console.error('Error in initializeNotification:', err);
        setError(err instanceof Error ? err : new Error('Failed to get notification token'));
      }
    };

    initializeNotification();

    // 포그라운드 메시지 수신 처리
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      
      // 브라우저가 열려있을 때는 기본 알림을 표시
      new Notification(payload.notification?.title || '새로운 알림', {
        body: payload.notification?.body,
        icon: '/favicon.ico' // TODO: 알림에 표시할 아이콘 경로를 설정해주세요
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { token, error };
}; 