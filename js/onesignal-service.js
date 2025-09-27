// OneSignal Service for Unitrade
// Sends push notifications to sellers when their items are ordered

class OneSignalService {
    constructor() {
        this.isInitialized = false;
        this.appId = '7e07771a-fbb9-4c16-acc6-e7e121038011'; // Your OneSignal App ID
        this.apiKey = 'os_v2_app_pydxogx3xfgbnlgg47qsca4achard57xfh2utk44jkzirkgbw4e6f2o7rol5np2b4f4npdcdtbsvegbslyf3yxtpmzv6p7fqwp3luqi'; // Your OneSignal API Key
        this.senderId = null; // Not needed for web push notifications
        this.init();
    }

    async init() {
        try {
            // Load OneSignal SDK
            if (typeof OneSignal === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
                script.onload = () => this.initializeOneSignal();
                document.head.appendChild(script);
            } else {
                this.initializeOneSignal();
            }
        } catch (error) {
            console.error('Error initializing OneSignal:', error);
        }
    }

    initializeOneSignal() {
        try {
            // Initialize OneSignal
            OneSignal.init({
                appId: this.appId,
                notifyButton: {
                    enable: false, // We'll handle notifications programmatically
                },
                allowLocalhostAsSecureOrigin: true,
            });

            this.isInitialized = true;
            console.log('OneSignal initialized successfully');
        } catch (error) {
            console.error('Error initializing OneSignal:', error);
        }
    }

    async sendOrderNotification(orderData, sellerId) {
        if (!this.isInitialized) {
            throw new Error('OneSignal not initialized. Please check your configuration.');
        }

        try {
            console.log('Sending OneSignal notification to seller:', sellerId);
            console.log('Order data:', orderData);

            // First, try to get the seller's OneSignal player ID from Firebase
            // For now, we'll send to all subscribed users and let them filter
            const notificationData = {
                app_id: this.appId,
                included_segments: ["All"], // Send to all subscribed users
                headings: {
                    en: "🎉 New Order Received!"
                },
                contents: {
                    en: `${orderData.buyerName || 'A buyer'} ordered "${orderData.productTitle || 'your item'}" for GHS ${orderData.totalPrice || orderData.productPrice || '0.00'}`
                },
                data: {
                    orderId: orderData.id,
                    productTitle: orderData.productTitle,
                    buyerName: orderData.buyerName,
                    buyerPhone: orderData.buyerPhone || orderData.buyerContact,
                    buyerLocation: orderData.buyerLocation || orderData.shippingAddress,
                    productPrice: orderData.totalPrice || orderData.productPrice,
                    quantity: orderData.quantity,
                    sellerId: sellerId, // Include seller ID in data for filtering
                    type: 'new_order'
                },
                url: 'seller-dashboard.html', // Redirect to seller dashboard
                buttons: [
                    {
                        id: 'view_order',
                        text: 'View Order',
                        icon: 'https://img.icons8.com/color/48/000000/shopping-cart.png'
                    },
                    {
                        id: 'contact_buyer',
                        text: 'Contact Buyer',
                        icon: 'https://img.icons8.com/color/48/000000/phone.png'
                    }
                ],
                large_icon: 'https://img.icons8.com/color/96/000000/shopping-cart.png',
                big_picture: 'https://img.icons8.com/color/480/000000/shopping-cart.png'
            };

            // Send notification via OneSignal REST API
            const response = await fetch('https://onesignal.com/api/v1/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${this.apiKey}`
                },
                body: JSON.stringify(notificationData)
            });

            const result = await response.json();
            
            if (result.id) {
                console.log('OneSignal notification sent successfully:', result);
                return {
                    success: true,
                    message: 'Push notification sent to all subscribers',
                    notificationId: result.id
                };
            } else {
                throw new Error(result.errors ? result.errors.join(', ') : 'Failed to send notification');
            }

        } catch (error) {
            console.error('Error sending OneSignal notification:', error);
            throw new Error('Failed to send push notification: ' + error.message);
        }
    }

    async sendOrderConfirmation(orderData, buyerId) {
        if (!this.isInitialized) {
            throw new Error('OneSignal not initialized. Please check your configuration.');
        }

        try {
            console.log('Sending OneSignal confirmation to buyer:', buyerId);

            const notificationData = {
                app_id: this.appId,
                include_external_user_ids: [buyerId],
                headings: {
                    en: "✅ Order Confirmed!"
                },
                contents: {
                    en: `Your order for "${orderData.productTitle || 'item'}" has been confirmed by the seller.`
                },
                data: {
                    orderId: orderData.id,
                    productTitle: orderData.productTitle,
                    type: 'order_confirmation'
                },
                url: 'buyer-orders.html',
                buttons: [
                    {
                        id: 'view_order',
                        text: 'View Order',
                        icon: 'https://img.icons8.com/color/48/000000/shopping-cart.png'
                    }
                ]
            };

            const response = await fetch('https://onesignal.com/api/v1/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${this.apiKey}`
                },
                body: JSON.stringify(notificationData)
            });

            const result = await response.json();
            
            if (result.id) {
                console.log('OneSignal confirmation sent successfully:', result);
                return {
                    success: true,
                    message: 'Push notification sent to buyer',
                    notificationId: result.id
                };
            } else {
                throw new Error(result.errors ? result.errors.join(', ') : 'Failed to send confirmation');
            }

        } catch (error) {
            console.error('Error sending OneSignal confirmation:', error);
            throw new Error('Failed to send push notification: ' + error.message);
        }
    }

    // Subscribe user to notifications
    async subscribeUser(userId) {
        try {
            if (!this.isInitialized) {
                throw new Error('OneSignal not initialized');
            }

            // Get the user's OneSignal player ID
            const playerId = await OneSignal.getUserId();
            
            if (playerId) {
                // Store the player ID with the user ID for targeting
                console.log('User subscribed to notifications:', userId, 'Player ID:', playerId);
                return {
                    success: true,
                    playerId: playerId,
                    message: 'User subscribed to notifications'
                };
            } else {
                throw new Error('Failed to get OneSignal player ID');
            }
        } catch (error) {
            console.error('Error subscribing user:', error);
            throw new Error('Failed to subscribe user: ' + error.message);
        }
    }

    // Test notification (for testing purposes)
    async sendTestNotification(sellerId) {
        const testOrderData = {
            id: 'test_order_' + Date.now(),
            productTitle: 'Test Product',
            buyerName: 'Test Buyer',
            buyerPhone: '+233 123 456 789',
            buyerLocation: 'Test Location',
            totalPrice: 100.00,
            quantity: 1
        };

        return await this.sendOrderNotification(testOrderData, sellerId);
    }
}

// Initialize OneSignal service
const oneSignalService = new OneSignalService();

// Export for use in other scripts
window.OneSignalService = OneSignalService;
window.oneSignalService = oneSignalService;
