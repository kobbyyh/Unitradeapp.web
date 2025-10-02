// Firebase Cloud Messaging Service for Unitrade
// Handles push notifications for sellers

class FCMService {
    constructor() {
        this.messaging = null;
        this.isSupported = false;
        this.isInitialized = false;
        this.registration = null;
    }

    // Initialize FCM
    async initialize() {
        try {
            // Check if service worker is supported
            if (!('serviceWorker' in navigator)) {
                console.log('❌ Service Worker not supported');
                return false;
            }

            // Check if notifications are supported
            if (!('Notification' in window)) {
                console.log('❌ Notifications not supported');
                return false;
            }

            // Check if Firebase is available
            if (typeof firebase === 'undefined') {
                console.log('❌ Firebase not loaded');
                return false;
            }

            // Initialize Firebase if not already initialized
            if (!firebase.apps.length) {
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
                console.log('✅ Firebase initialized in FCM service');
            }

            // Initialize Firebase Messaging
            this.messaging = firebase.messaging();
            this.isSupported = true;

            // Request notification permission
            const permission = await this.requestPermission();
            if (permission !== 'granted') {
                console.log('❌ Notification permission denied');
                return false;
            }

            // Get FCM token
            const token = await this.getToken();
            if (token) {
                console.log('✅ FCM Token obtained:', token);
                await this.saveTokenToServer(token);
                this.isInitialized = true;
                return true;
            }

            return false;

        } catch (error) {
            console.error('❌ FCM initialization failed:', error);
            return false;
        }
    }

    // Request notification permission
    async requestPermission() {
        try {
            const permission = await Notification.requestPermission();
            console.log('🔔 Notification permission:', permission);
            return permission;
        } catch (error) {
            console.error('❌ Permission request failed:', error);
            return 'denied';
        }
    }

    // Get FCM token
    async getToken() {
        try {
            const token = await this.messaging.getToken({
                vapidKey: 'BL8Uolwxu3G73kOJJdoP0X4hJdMHY10V_UFGtejg70k2AckVhKir0Kewpmk-7E0sOlEOkgR7Fx-2zAM-WhNUOFo' // Get this from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
            });
            return token;
        } catch (error) {
            console.error('❌ Token retrieval failed:', error);
            return null;
        }
    }

    // Save token to Firebase Cloud Functions
    async saveTokenToServer(token) {
        try {
            // Check if Firebase Functions is available
            if (typeof firebase === 'undefined' || !firebase.functions) {
                console.log('⚠️ Firebase Functions not available');
                return;
            }
            
            // Call Cloud Function to save token
            const saveToken = firebase.functions().httpsCallable('saveFCMToken');
            const result = await saveToken({
                token: token,
                userId: this.getCurrentUserId()
            });
            
            console.log('✅ FCM token saved to Firebase:', result.data);
        } catch (error) {
            console.log('⚠️ Failed to save FCM token:', error.message);
            console.log('💡 Make sure Firebase Functions are deployed');
        }
    }

    // Get current user ID (implement based on your auth system)
    getCurrentUserId() {
        // This should return the current seller's user ID
        // Implement based on your authentication system
        return localStorage.getItem('userId') || 'anonymous';
    }

    // Listen for background messages
    setupBackgroundMessageListener() {
        if (!this.messaging) return;

        this.messaging.onBackgroundMessage((payload) => {
            console.log('📱 Background message received:', payload);
            
            const notificationTitle = payload.notification?.title || 'New Order!';
            const notificationOptions = {
                body: payload.notification?.body || 'You have a new order',
                icon: '/images/app_logo.png',
                badge: '/images/app_logo.png',
                data: payload.data || {}
            };

            self.registration.showNotification(notificationTitle, notificationOptions);
        });
    }

    // Listen for foreground messages
    setupForegroundMessageListener() {
        if (!this.messaging) return;

        this.messaging.onMessage((payload) => {
            console.log('📱 Foreground message received:', payload);
            
            // Show notification in foreground
            if (payload.notification) {
                this.showNotification(
                    payload.notification.title,
                    payload.notification.body,
                    payload.data
                );
            }
        });
    }

    // Show notification
    showNotification(title, body, data = {}) {
        console.log('🔔 Attempting to show notification:', { title, body, permission: Notification.permission });
        
        if (Notification.permission === 'granted') {
            try {
                const notification = new Notification(title, {
                    body: body,
                    icon: '/images/app_logo.png',
                    badge: '/images/app_logo.png',
                    data: data
                });

                console.log('✅ Notification created successfully');

                // Handle notification click
                notification.onclick = (event) => {
                    event.preventDefault();
                    window.focus();
                    console.log('🔔 Notification clicked');
                    
                    // Navigate to relevant page
                    if (data.orderId) {
                        window.location.href = `/seller-dashboard.html?order=${data.orderId}`;
                    } else {
                        window.location.href = '/seller-dashboard.html';
                    }
                };

                // Handle notification close
                notification.onclose = () => {
                    console.log('🔔 Notification closed');
                };

                // Handle notification error
                notification.onerror = (error) => {
                    console.error('❌ Notification error:', error);
                };

            } catch (error) {
                console.error('❌ Error creating notification:', error);
            }
        } else {
            console.log('❌ Notification permission not granted:', Notification.permission);
        }
    }

    // Send test notification
    async sendTestNotification() {
        try {
            const response = await fetch('/api/send-test-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.getCurrentUserId()
                })
            });

            if (response.ok) {
                console.log('✅ Test notification sent');
                return true;
            } else {
                console.log('⚠️ Backend not available, simulating test notification');
                // Simulate notification for testing
                this.showNotification('Test Notification', 'This is a test notification from Unitrade!');
                return true;
            }
        } catch (error) {
            console.log('⚠️ Backend not available, simulating test notification');
            // Simulate notification for testing
            this.showNotification('Test Notification', 'This is a test notification from Unitrade!');
            return true;
        }
    }

    // Check if FCM is ready
    isReady() {
        return this.isSupported && this.isInitialized;
    }
}

// Create global instance
const fcmService = new FCMService();
window.fcmService = fcmService;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing FCM...');
    const success = await fcmService.initialize();
    
    if (success) {
        console.log('✅ FCM initialized successfully');
        fcmService.setupForegroundMessageListener();
    } else {
        console.log('❌ FCM initialization failed');
    }
});
