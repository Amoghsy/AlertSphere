import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import type { Messaging } from "firebase/messaging";

// -------------------------------------------
// FIREBASE CONFIG
// -------------------------------------------

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth + Firestore
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// -------------------------------------------
// FIREBASE CLOUD MESSAGING (FCM)
// -------------------------------------------

let messaging: Messaging | null = null;

// Initialize messaging only if supported
(async () => {
  const supported = await isSupported();
  if (supported) {
    messaging = getMessaging(app);
  } else {
    console.warn("⚠️ Firebase Messaging is NOT supported in this browser.");
  }
})();

// -------------------------------------------
// REQUEST NOTIFICATION PERMISSION (EXPORT THIS)
// -------------------------------------------

async function waitForMessaging(timeout = 5000): Promise<void> {
  const interval = 50;
  const maxAttempts = Math.ceil(timeout / interval);
  let attempts = 0;
  return new Promise((resolve, reject) => {
    const id = setInterval(() => {
      if (messaging) {
        clearInterval(id);
        resolve();
      } else if (++attempts >= maxAttempts) {
        clearInterval(id);
        reject(new Error("Messaging not initialized within timeout"));
      }
    }, interval);
  });
}

export async function requestNotificationPermission() {
  console.log("🔵 Requesting Notification Permission...");

  try {
    const permission = await Notification.requestPermission();
    console.log("🔵 Permission result:", permission);

    if (permission !== "granted") {
      console.warn("❌ Permission NOT granted.");
      return null;
    }

    console.log("🔵 Registering Service Worker...");
    const swReg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("🟢 Service Worker Registered:", swReg);

    console.log("🔵 Getting messaging instance...");
    await waitForMessaging();

    console.log("🔵 Fetching FCM token...");
    const token = await getToken(messaging!, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });

    console.log("🟢 FCM Token:", token);
    return token;

  } catch (error: any) {
    console.error("❌ FCM ERROR (RAW):", error);
    console.error("❌ FCM ERROR message:", error?.message);
    console.error("❌ FCM ERROR code:", error?.code);
    console.error("❌ FCM ERROR string:", error?.toString());
    console.error("❌ FCM ERROR JSON:", JSON.stringify(error));

    // More detailed error from PushManager (if available)
    if (error && error.name) console.error("❌ Error Name:", error.name);
    if (error && error.stack) console.error("❌ Error Stack:", error.stack);

    return null;
  }
}


// -------------------------------------------
// FOREGROUND NOTIFICATION LISTENER
// -------------------------------------------

export function listenForForegroundNotifications() {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("🔥 Foreground notification received:", payload);

    const { title, body } = payload.notification || {};

    if (!title) return;

    new Notification(title, {
      body,
      icon: "/icons/alert.png",
    });
  });
}
const swReg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

console.log("SW registered:", swReg);

