import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyBhtiorw19cwvkB_UR6rpYsbie4qK0BYV0",
  authDomain: "chatstream-26660.firebaseapp.com",
  projectId: "chatstream-26660",
  storageBucket: "chatstream-26660.firebasestorage.app",
  messagingSenderId: "647763118183",
  appId: "1:647763118183:web:bdbbe04723d6aa1387acc2",
  measurementId: "G-PLQHM80DRC"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
