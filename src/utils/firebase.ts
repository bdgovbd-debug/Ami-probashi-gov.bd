import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCVVSJA0qwZBPTe6VYGMHBS-1PTuonqBO0",
  authDomain: "web-otp-live.firebaseapp.com",
  databaseURL: "https://web-otp-live-default-rtdb.firebaseio.com",
  projectId: "web-otp-live",
  storageBucket: "web-otp-live.firebasestorage.app",
  messagingSenderId: "185497647035",
  appId: "1:185497647035:web:29427cfb4174d9e985f69e"
};

// Initialize firebase
const app = initializeApp(firebaseConfig);

// Helper function to log activity to backend
async function logPushActivity(userId: string, action: string, details: any) {
  try {
    await fetch("/api/log-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action, details })
    });
  } catch (err) {
    console.error("Activity logging failed", err);
  }
}

export async function requestNotificationPermissionAndGetToken(userId: string): Promise<string | null> {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("FCM represents that Push notification is not supported in this browser environment.");
      return null;
    }

    const messaging = getMessaging(app);

    // Request permission from the user
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // Get the registration token
      const token = await getToken(messaging, {
        vapidKey: "CMrmIVuKJJsOJ4URUkyFaen-jLCUU6_gJ6viIF2waWs"
      });

      if (token) {
        console.log('Web Push Subscription Token Generated Successfully:', token);
        
        // Log the token to the backend so the administrator has access to it
        await logPushActivity(userId, "পুশ নোটিফিকেশন টোকেন তৈরি হয়েছে", {
          fcmToken: token,
          browser: navigator.userAgent,
          platform: navigator.platform
        });

        // Register visual foreground messages listener
        onMessage(messaging, (payload) => {
          console.log('Foreground message received: ', payload);
          // Show alert or dispatch event
          const event = new CustomEvent('fcm-foreground-notification', { detail: payload });
          window.dispatchEvent(event);
        });

        return token;
      } else {
        console.warn('No Web Push registration token available. Request permission to generate one.');
        return null;
      }
    } else {
      console.warn('Unable to get permission to notify.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
  }
}
