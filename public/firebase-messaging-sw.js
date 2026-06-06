importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCVVSJA0qwZBPTe6VYGMHBS-1PTuonqBO0",
  authDomain: "web-otp-live.firebaseapp.com",
  databaseURL: "https://web-otp-live-default-rtdb.firebaseio.com",
  projectId: "web-otp-live",
  storageBucket: "web-otp-live.firebasestorage.app",
  messagingSenderId: "185497647035",
  appId: "1:185497647035:web:29427cfb4174d9e985f69e"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message: ', payload);
  
  const title = payload.notification?.title || 'নতুন আপডেট!';
  const options = {
    body: payload.notification?.body || 'স্মার্ট ডিজিটাল প্রবাসী সেবা পোর্টাল থেকে নতুন একটি আপডেট এসেছে।',
    icon: '/my-logo.jpg',
    badge: '/my-logo.jpg',
    data: payload.data
  };

  self.registration.showNotification(title, options);
});
