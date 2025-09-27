// Enhanced OneSignal Service for Unitrade
// Stores user OneSignal player IDs in Firebase for targeted notifications

class EnhancedOneSignalService {
    constructor() {
        this.isInitialized = false;
        this.appId = '7e07771a-fbb9-4c16-acc6-e7e121038011';
        this.apiKey = 'os_v2_app_pydxogx3xfgbnlgg47qsca4achard57xfh2utk44jkzirkgbw4e6f2o7rol5np2b4f4npdcdtbsvegbslyf3yxtpmzv6p7fqwp3luqi';
        
        // Firebase will be initialized separately
        this.db = null;
        
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
            OneSignal.init({
                appId: this.appId,
                notifyButton: {
                    enable: false,
                },
                allowLocalhostAsSecureOrigin: true,
            });

            this.isInitialized = true;
            console.log('Enhanced OneSignal initialized successfully');
        } catch (error) {
            console.error('Error initializing OneSignal:', error);
        }
    }

    // Subscribe user and store their OneSignal player ID in Firebase
    async subscribeUser(userId) {
        try {
            if (!this.isInitialized) {
                throw new Error('OneSignal not initialized');
            }

            // Show native prompt for subscription
            await OneSignal.showNativePrompt();
            
            // Get the user's OneSignal player ID
            const playerId = await OneSignal.getUserId();
            
            if (playerId) {
                // Store the player ID in Firebase
                await setDoc(doc(this.db, 'onesignal_players', userId), {
                    playerId: playerId,
                    userId: userId,
                    subscribedAt: new Date(),
                    isActive: true
                });
                
                console.log('User subscribed and player ID stored:', userId, playerId);
                return {
                    success: true,
                    playerId: playerId,
                    message: 'User subscribed and player ID stored'
                };
            } else {
                throw new Error('Failed to get OneSignal player ID');
            }
        } catch (error) {
            console.error('Error subscribing user:', error);
            throw new Error('Failed to subscribe user: ' + error.message);
        }
    }

    // Get seller's OneSignal player ID from Firebase
    async getSellerPlayerId(sellerId) {
        try {
            const playerDoc = await getDoc(doc(this.db, 'onesignal_players', sellerId));
            
            if (playerDoc.exists()) {
                const playerData = playerDoc.data();
                return playerData.playerId;
            } else {
                console.warn('Seller not subscribed to notifications:', sellerId);
                return null;
            }
        } catch (error) {
            console.error('Error getting seller player ID:', error);
            return null;
        }
    }

    // Send targeted notification to specific seller
    async sendOrderNotification(orderData, sellerId) {
        if (!this.isInitialized) {
            throw new Error('OneSignal not initialized. Please check your configuration.');
        }

        try {
            console.log('Sending OneSignal notification to seller:', sellerId);
            
            // Get seller's OneSignal player ID
            const sellerPlayerId = await this.getSellerPlayerId(sellerId);
            
            if (!sellerPlayerId) {
                // If seller is not subscribed, send to all users as fallback
                console.log('Seller not subscribed, sending to all users');
                return await this.sendToAllUsers(orderData, sellerId);
            }

            // Send targeted notification to specific seller
            const notificationData = {
                app_id: this.appId,
                include_player_ids: [sellerPlayerId], // Send to specific seller
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
                    sellerId: sellerId,
                    type: 'new_order'
                },
                url: 'seller-dashboard.html',
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
                large_icon: 'https://img.icons8.com/color/96/000000/shopping-cart.png'
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
                console.log('Targeted notification sent successfully:', result);
                return {
                    success: true,
                    message: 'Push notification sent to seller',
                    notificationId: result.id,
                    targeted: true
                };
            } else {
                throw new Error(result.errors ? result.errors.join(', ') : 'Failed to send notification');
            }

        } catch (error) {
            console.error('Error sending OneSignal notification:', error);
            throw new Error('Failed to send push notification: ' + error.message);
        }
    }

    // Fallback: Send to all users if seller is not subscribed
    async sendToAllUsers(orderData, sellerId) {
        const notificationData = {
            app_id: this.appId,
            included_segments: ["All"],
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
                sellerId: sellerId,
                type: 'new_order'
            },
            url: 'seller-dashboard.html',
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
            console.log('Broadcast notification sent successfully:', result);
            return {
                success: true,
                message: 'Push notification sent to all users (seller not subscribed)',
                notificationId: result.id,
                targeted: false
            };
        } else {
            throw new Error(result.errors ? result.errors.join(', ') : 'Failed to send notification');
        }
    }
}

// Initialize enhanced OneSignal service
const enhancedOneSignalService = new EnhancedOneSignalService();

// Export for use in other scripts
window.EnhancedOneSignalService = EnhancedOneSignalService;
window.enhancedOneSignalService = enhancedOneSignalService;
