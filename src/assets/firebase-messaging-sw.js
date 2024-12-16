importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging.js');

// Configuración de Firebase (copiar desde tu proyecto Firebase)
firebase.initializeApp({
    apiKey: "AIzaSyAEXAMPLEgLJmOixQ8EXAMPLEWm",
    authDomain: "registrapp-notificaciones.firebaseapp.com",
    projectId: "registrapp-notificaciones",
    storageBucket: "registrapp-notificaciones.appspot.com",
    messagingSenderId: "96844400781",
    appId: "1:96844400781:android:4e5f2fe8c7207ea3cafac4"
});

// Inicializar Firebase Messaging
const messaging = firebase.messaging();

// Maneja mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('Recibido un mensaje en segundo plano', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
