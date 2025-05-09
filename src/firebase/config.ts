import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  // TODO: Firebase 콘솔에서 가져온 설정을 여기에 넣어주세요
  apiKey: "AIzaSyAZam_eWgXun69VBsLvxxHbuCxXemPU_Xc",
  authDomain: "planttalk-745a2.firebaseapp.com",
  projectId: "planttalk-745a2",
  storageBucket: "planttalk-745a2.firebasestorage.app",
  messagingSenderId: "543054048231",
  appId: "1:543054048231:web:e181532ab56f305278ab42",
  measurementId: "G-MBDVM0LMZ4"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// 👇 이 부분 추가!
getToken(messaging, {
    vapidKey: VAPID_KEY
  }).then((currentToken) => {
    if (currentToken) {
      console.log("📱 [FCM] Android Token:", currentToken);
    } else {
      console.warn("❌ [FCM] No token available");
    }
  }).catch((err) => {
    console.error("🚨 [FCM] Token fetch error:", err);
  });
export const requestNotificationPermission = async () => {
  try {
    console.log('Checking notification support...');
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    console.log('Current notification permission:', Notification.permission);
    
    if (Notification.permission === 'granted') {
      console.log('Notification permission already granted');
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY
      });
      return token;
    }

    if (Notification.permission === 'denied') {
      throw new Error('Notification permission denied');
    }

    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('Permission result:', permission);
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY
      });
      return token;
    }
    throw new Error('Notification permission denied');
  } catch (error) {
    console.error('Error getting notification permission:', error);
    throw error;
  }
};

export { messaging }; 