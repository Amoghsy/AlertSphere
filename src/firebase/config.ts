// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


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
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

async function initNotifications() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "SBmTdRyrJjv7rVSEROQVSu-DmqrzySqyyNy8nkNt2-w",
    });
    console.log("Citizen FCM token:", token);
    // This token can be subscribed to "alerts" topic on backend if needed
  } else {
    console.log("Notifications permission denied");
  }
}

// Listen for foreground notifications
onMessage(messaging, (payload) => {
  console.log("Foreground notification:", payload);
  const title = payload.notification?.title ?? "Alert";
  const body = payload.notification?.body ?? "";

  // Only create a Notification when the API is available and we have a title
  if (typeof window !== "undefined" && "Notification" in window && title) {
    new Notification(title, {
      body,
      icon: "/icons/alert.png",
    });
  }
});

initNotifications();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
