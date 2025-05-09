importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAZam_eWgXun69VBsLvxxHbuCxXemPU_Xc",
  authDomain: "planttalk-745a2.firebaseapp.com",
  projectId: "planttalk-745a2",
  storageBucket: "planttalk-745a2.firebasestorage.app",
  messagingSenderId: "543054048231",
  appId: "1:543054048231:web:e181532ab56f305278ab42",
  measurementId: "G-MBDVM0LMZ4"
});

const messaging = firebase.messaging();

// 백그라운드 메시지 수신 처리
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 