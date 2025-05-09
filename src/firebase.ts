import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  // Firebase 콘솔에서 가져온 설정을 여기에 넣어주세요
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

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: 'BDl_0rT_zRg8dE0Auta-wlb-3d6pECCD8qmFPcXdGr9XXmpPEdVfi64EQOR6ktKbusWUoDFfGIl6e2SutFmB-H0'
    });
    if (currentToken) {
      console.log('현재 토큰:', currentToken);
      return currentToken;
    } else {
      console.log('토큰을 가져올 수 없습니다.');
    }
  } catch (err) {
    console.log('토큰을 가져오는 중 오류가 발생했습니다:', err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
}); 