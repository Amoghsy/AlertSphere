// MUST use compat version for service workers!
// DO NOT use import or ES modules here.

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
 apiKey: "AIzaSyCnITpjw3h-WRpODY9Cv9Y2Ki1EcG3TZWM",
  authDomain: "alertsphere-62588.firebaseapp.com",
  projectId: "alertsphere-62588",
  messagingSenderId: "283626450279",
  appId: "1:283626450279:web:7f55890268beea988653c2",

});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/alert.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
