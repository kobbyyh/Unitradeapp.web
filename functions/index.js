// Firebase Cloud Functions for Unitrade Notifications
// Handles real-time notifications when orders are placed

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

// Cloud Function: Triggered when a new order is created
exports.onOrderCreated = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async (snap, context) => {
        try {
            const orderData = snap.data();
            const orderId = context.params.orderId;
            
            console.log('📦 New order created:', orderId);
            console.log('📦 Order data:', orderData);
            
            // Get seller's FCM token from their profile
            const sellerId = orderData.sellerId;
            if (!sellerId) {
                console.log('❌ No seller ID found in order');
                return null;
            }
            
            // Get seller's FCM token
            const sellerDoc = await admin.firestore()
                .collection('users')
                .doc(sellerId)
                .get();
            
            if (!sellerDoc.exists) {
                console.log('❌ Seller not found:', sellerId);
                return null;
            }
            
            const sellerData = sellerDoc.data();
            const fcmToken = sellerData.fcmToken;
            
            if (!fcmToken) {
                console.log('❌ No FCM token found for seller:', sellerId);
                return null;
            }
            
            // Create notification payload
            const notification = {
                title: '🎉 New Order on Unitrade!',
                body: `${orderData.productTitle} - ${orderData.buyerName}`,
                data: {
                    orderId: orderId,
                    productTitle: orderData.productTitle,
                    buyerName: orderData.buyerName,
                    totalPrice: orderData.totalPrice.toString(),
                    type: 'new_order'
                }
            };
            
            // Send FCM notification
            const message = {
                token: fcmToken,
                notification: notification,
                data: notification.data,
                android: {
                    notification: {
                        icon: 'ic_notification',
                        color: '#0d9488',
                        sound: 'default'
                    }
                },
                webpush: {
                    notification: {
                        icon: '/images/app_logo.png',
                        badge: '/images/app_logo.png',
                        actions: [
                            {
                                action: 'view',
                                title: 'View Order'
                            },
                            {
                                action: 'dismiss',
                                title: 'Dismiss'
                            }
                        ]
                    }
                }
            };
            
            // Send the notification
            const response = await admin.messaging().send(message);
            console.log('✅ FCM notification sent successfully:', response);
            
            // Update order with notification status
            await admin.firestore()
                .collection('orders')
                .doc(orderId)
                .update({
                    notificationSent: true,
                    notificationSentAt: admin.firestore.FieldValue.serverTimestamp()
                });
            
            return response;
            
        } catch (error) {
            console.error('❌ Error sending FCM notification:', error);
            return null;
        }
    });

// Cloud Function: Save FCM token for user
exports.saveFCMToken = functions.https.onCall(async (data, context) => {
    try {
        const { token, userId } = data;
        
        if (!token || !userId) {
            throw new functions.https.HttpsError('invalid-argument', 'Token and userId are required');
        }
        
        // Save FCM token to user's profile
        await admin.firestore()
            .collection('users')
            .doc(userId)
            .update({
                fcmToken: token,
                fcmTokenUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        
        console.log('✅ FCM token saved for user:', userId);
        
        return { success: true, message: 'FCM token saved successfully' };
        
    } catch (error) {
        console.error('❌ Error saving FCM token:', error);
        throw new functions.https.HttpsError('internal', 'Failed to save FCM token');
    }
});

// Cloud Function: Send test notification
exports.sendTestNotification = functions.https.onCall(async (data, context) => {
    try {
        const { userId } = data;
        
        if (!userId) {
            throw new functions.https.HttpsError('invalid-argument', 'UserId is required');
        }
        
        // Get user's FCM token
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(userId)
            .get();
        
        if (!userDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'User not found');
        }
        
        const userData = userDoc.data();
        const fcmToken = userData.fcmToken;
        
        if (!fcmToken) {
            throw new functions.https.HttpsError('not-found', 'No FCM token found for user');
        }
        
        // Create test notification
        const message = {
            token: fcmToken,
            notification: {
                title: '🧪 Test Notification',
                body: 'This is a test notification from Unitrade!'
            },
            data: {
                type: 'test',
                timestamp: new Date().toISOString()
            }
        };
        
        // Send notification
        const response = await admin.messaging().send(message);
        console.log('✅ Test notification sent:', response);
        
        return { success: true, messageId: response };
        
    } catch (error) {
        console.error('❌ Error sending test notification:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send test notification');
    }
});
