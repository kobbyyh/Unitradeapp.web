// Firebase Cloud Messaging Service Worker
// Handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker
const firebaseConfig = {
    apiKey: "AIzaSyBzyKtEKbUMt66t9Sfk_onbOcJNic_t5oc",
    authDomain: "unitrade-d74e9.firebaseapp.com",
    projectId: "unitrade-d74e9",
    storageBucket: "unitrade-d74e9.firebasestorage.app",
    messagingSenderId: "619229942843",
    appId: "1:619229942843:web:8eced8b46057a24b04f81e",
    measurementId: "G-6DPM2BCY97"
};

firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('📱 Background message received:', payload);

    const notificationTitle = payload.notification?.title || 'New Order on Unitrade!';
    const notificationOptions = {
        body: payload.notification?.body || 'You have received a new order',
        icon: '/images/app_logo.png',
        badge: '/images/app_logo.png',
        data: payload.data || {},
        actions: [
            {
                action: 'view',
                title: 'View Order',
                icon: '/images/app_logo.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss'
            }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked:', event);
    
    event.notification.close();

    if (event.action === 'view') {
        // Open the app and navigate to the order
        const orderId = event.notification.data?.orderId;
        const url = orderId ? `/seller-dashboard.html?order=${orderId}` : '/seller-dashboard.html';
        
        event.waitUntil(
            clients.openWindow(url)
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        console.log('🔔 Notification dismissed');
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/seller-dashboard.html')
        );
    }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('🔔 Notification closed:', event);
});

console.log('✅ Firebase Messaging Service Worker loaded');
