import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// For development, we'll use localStorage to store Firebase config
const getFirebaseConfig = () => {
  const config = {
    apiKey: localStorage.getItem('FIREBASE_API_KEY') || '',
    authDomain: localStorage.getItem('FIREBASE_AUTH_DOMAIN') || '',
    projectId: localStorage.getItem('FIREBASE_PROJECT_ID') || '',
    storageBucket: localStorage.getItem('FIREBASE_STORAGE_BUCKET') || '',
    messagingSenderId: localStorage.getItem('FIREBASE_MESSAGING_SENDER_ID') || '',
    appId: localStorage.getItem('FIREBASE_APP_ID') || '',
  };

  // Validate required fields
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing Firebase configuration. Please set the following in localStorage: ${missingFields.join(', ')}`);
  }

  return config;
};

let app;
let messaging;

export const initializeFirebase = () => {
  try {
    const firebaseConfig = getFirebaseConfig();
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
};

export const requestNotificationPermission = async () => {
  if (!app) {
    const initialized = initializeFirebase();
    if (!initialized) {
      throw new Error('Firebase not properly configured');
    }
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: localStorage.getItem('FIREBASE_VAPID_KEY') || '',
      });
      return token;
    }
    throw new Error('Notification permission denied');
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      console.error('Messaging not initialized');
      return;
    }
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });