// Firebase Notification Service for Unitrade
// Stores notifications in Firebase for public website

class FirebaseNotificationService {
    constructor() {
        this.isInitialized = false;
        this.db = null;
        this.init();
    }

    async init() {
        try {
            // Wait for Firebase to be available globally
            let attempts = 0;
            while (typeof firebase === 'undefined' && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (typeof firebase !== 'undefined') {
                // Use global Firebase instance
                this.db = firebase.firestore();
                this.isInitialized = true;
                console.log('Firebase Notification Service initialized');
            } else {
                // Fallback: initialize Firebase directly
                await this.initializeFirebase();
            }
        } catch (error) {
            console.error('Error initializing Firebase notification service:', error);
        }
    }

    async initializeFirebase() {
        try {
            // Initialize Firebase with your config
            const firebaseConfig = {
                apiKey: "AIzaSyBzyKtEKbUMt66t9Sfk_onbOcJNic_t5oc",
                authDomain: "unitrade-d74e9.firebaseapp.com",
                projectId: "unitrade-d74e9",
                storageBucket: "unitrade-d74e9.firebasestorage.app",
                messagingSenderId: "619229942843",
                appId: "1:619229942843:web:8eced8b46057a24b04f81e",
                measurementId: "G-6DPM2BCY97"
            };

            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            this.db = firebase.firestore();
            this.isInitialized = true;
            
            console.log('Firebase Notification Service initialized with direct config');
        } catch (error) {
            console.error('Error initializing Firebase directly:', error);
        }
    }

    // Create in-app notification for seller
    async createSellerNotification(orderData, sellerId) {
        if (!this.isInitialized) {
            throw new Error('Firebase notification service not initialized');
        }

        try {
            const notificationData = {
                sellerId: sellerId,
                orderId: orderData.id,
                type: 'new_order',
                title: 'New Order Received!',
                message: `${orderData.buyerName || 'A buyer'} ordered "${orderData.productTitle || 'your item'}" for GHS ${orderData.totalPrice || orderData.productPrice || '0.00'}`,
                orderData: {
                    productTitle: orderData.productTitle,
                    buyerName: orderData.buyerName,
                    buyerPhone: orderData.buyerPhone || orderData.buyerContact,
                    buyerLocation: orderData.buyerLocation || orderData.shippingAddress,
                    productPrice: orderData.totalPrice || orderData.productPrice,
                    quantity: orderData.quantity,
                    orderDate: new Date()
                },
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                priority: 'high'
            };

            // Save notification to Firebase
            const docRef = await this.db.collection('seller_notifications').add(notificationData);
            console.log('Seller notification created in Firebase:', docRef.id);

            return {
                success: true,
                notificationId: docRef.id,
                message: 'Notification created successfully in Firebase'
            };

        } catch (error) {
            console.error('Error creating seller notification:', error);
            throw new Error('Failed to create notification: ' + error.message);
        }
    }

    // Send email notification (simple version)
    async sendEmailNotification(orderData, sellerEmail) {
        try {
            // Create email content
            const emailContent = this.generateEmailContent(orderData);
            
            // Show email preview
            this.showEmailPreview(orderData, sellerEmail, emailContent);
            
            return {
                success: true,
                message: 'Email notification prepared',
                isPreview: true
            };

        } catch (error) {
            console.error('Error sending email notification:', error);
            throw new Error('Failed to send email: ' + error.message);
        }
    }

    // Generate email content
    generateEmailContent(orderData) {
        return `
📧 NEW ORDER NOTIFICATION
═══════════════════════════════════════════════════════════════

Dear Seller,

🎉 You have received a new order on Unitrade!

ORDER DETAILS:
───────────────────────────────────────────────────────────────
Product: ${orderData.productTitle || 'Product'}
Price: GHS ${orderData.totalPrice || orderData.productPrice || '0.00'}
Quantity: ${orderData.quantity || 1}
Total Amount: GHS ${(orderData.totalPrice || orderData.productPrice || 0) * (orderData.quantity || 1)}
Order ID: ${orderData.id || 'Unknown'}
Order Date: ${new Date().toLocaleDateString()}

BUYER INFORMATION:
───────────────────────────────────────────────────────────────
Name: ${orderData.buyerName || orderData.buyerId || 'Unknown'}
Phone: ${orderData.buyerPhone || orderData.buyerContact || 'Not provided'}
Location: ${orderData.buyerLocation || orderData.shippingAddress || 'Not provided'}

NEXT STEPS:
───────────────────────────────────────────────────────────────
1. Log in to your seller dashboard
2. Contact the buyer using the information above
3. Arrange pickup or delivery
4. Update order status when completed

This notification was sent from Unitrade - University Trading Platform
═══════════════════════════════════════════════════════════════
        `;
    }

    // Show email preview
    showEmailPreview(orderData, sellerEmail, emailContent) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">📧 Email Notification</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p class="text-blue-800 font-medium">📧 Email would be sent to: ${sellerEmail}</p>
                    <p class="text-blue-700 text-sm">To send real emails, integrate with EmailJS or your preferred email service.</p>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg">
                    <pre class="text-sm whitespace-pre-wrap font-mono">${emailContent}</pre>
                </div>
                <div class="mt-4 flex justify-end space-x-2">
                    <button onclick="this.closest('.fixed').remove()" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                        Close
                    </button>
                    <button onclick="this.closest('.fixed').remove(); alert('Email sent! (This is a preview)')" class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
                        Send Email
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Get seller notifications from Firebase
    async getSellerNotifications(sellerId) {
        if (!this.isInitialized) {
            throw new Error('Firebase notification service not initialized');
        }

        try {
            const notificationsSnapshot = await this.db.collection('seller_notifications')
                .where('sellerId', '==', sellerId)
                .orderBy('createdAt', 'desc')
                .limit(50)
                .get();

            const notifications = [];

            notificationsSnapshot.forEach((doc) => {
                notifications.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return notifications;

        } catch (error) {
            console.error('Error getting seller notifications:', error);
            throw new Error('Failed to get notifications: ' + error.message);
        }
    }

    // Mark notification as read in Firebase
    async markNotificationAsRead(notificationId) {
        if (!this.isInitialized) {
            throw new Error('Firebase notification service not initialized');
        }

        try {
            await this.db.collection('seller_notifications').doc(notificationId).update({
                read: true,
                readAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            return { success: true };

        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw new Error('Failed to mark notification as read: ' + error.message);
        }
    }

    // Get unread notification count from Firebase
    async getUnreadCount(sellerId) {
        try {
            const notifications = await this.getSellerNotifications(sellerId);
            return notifications.filter(n => !n.read).length;
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    }

    // Delete notification from Firebase
    async deleteNotification(notificationId) {
        if (!this.isInitialized) {
            throw new Error('Firebase notification service not initialized');
        }

        try {
            await this.db.collection('seller_notifications').doc(notificationId).delete();
            return { success: true };
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw new Error('Failed to delete notification: ' + error.message);
        }
    }
}

// Initialize Firebase notification service
const firebaseNotificationService = new FirebaseNotificationService();

// Export for use in other scripts
window.FirebaseNotificationService = FirebaseNotificationService;
window.firebaseNotificationService = firebaseNotificationService;
