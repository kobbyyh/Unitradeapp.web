// Simple Notification Service for Unitrade (Standalone)
// Works without complex Firebase imports

class SimpleNotificationService {
    constructor() {
        this.isInitialized = false;
        this.notifications = []; // Store notifications locally for demo
        this.init();
    }

    async init() {
        try {
            // Wait a bit for the page to load
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.isInitialized = true;
            console.log('Simple Notification Service initialized (standalone mode)');
        } catch (error) {
            console.error('Error initializing notification service:', error);
        }
    }

    // Create in-app notification for seller
    async createSellerNotification(orderData, sellerId) {
        if (!this.isInitialized) {
            throw new Error('Notification service not initialized');
        }

        try {
            const notificationData = {
                id: 'notification_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
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
                createdAt: new Date(),
                priority: 'high'
            };

            // Store notification locally (in real app, this would go to Firebase)
            this.notifications.push(notificationData);
            
            // Also store in localStorage for persistence
            const storedNotifications = JSON.parse(localStorage.getItem('seller_notifications') || '[]');
            storedNotifications.push(notificationData);
            localStorage.setItem('seller_notifications', JSON.stringify(storedNotifications));

            console.log('Seller notification created:', notificationData.id);

            return {
                success: true,
                notificationId: notificationData.id,
                message: 'Notification created successfully'
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

    // Get seller notifications
    async getSellerNotifications(sellerId) {
        if (!this.isInitialized) {
            throw new Error('Notification service not initialized');
        }

        try {
            // Get notifications from localStorage
            const storedNotifications = JSON.parse(localStorage.getItem('seller_notifications') || '[]');
            
            // Filter by seller ID
            const sellerNotifications = storedNotifications.filter(notification => 
                notification.sellerId === sellerId
            );

            // Sort by creation date (newest first)
            sellerNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return sellerNotifications;

        } catch (error) {
            console.error('Error getting seller notifications:', error);
            throw new Error('Failed to get notifications: ' + error.message);
        }
    }

    // Mark notification as read
    async markNotificationAsRead(notificationId) {
        if (!this.isInitialized) {
            throw new Error('Notification service not initialized');
        }

        try {
            // Update in localStorage
            const storedNotifications = JSON.parse(localStorage.getItem('seller_notifications') || '[]');
            const notificationIndex = storedNotifications.findIndex(n => n.id === notificationId);
            
            if (notificationIndex !== -1) {
                storedNotifications[notificationIndex].read = true;
                storedNotifications[notificationIndex].readAt = new Date();
                localStorage.setItem('seller_notifications', JSON.stringify(storedNotifications));
            }

            // Update in memory
            const notification = this.notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
                notification.readAt = new Date();
            }

            return { success: true };

        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw new Error('Failed to mark notification as read: ' + error.message);
        }
    }

    // Get unread notification count
    async getUnreadCount(sellerId) {
        try {
            const notifications = await this.getSellerNotifications(sellerId);
            return notifications.filter(n => !n.read).length;
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    }

    // Clear all notifications (for testing)
    clearAllNotifications() {
        localStorage.removeItem('seller_notifications');
        this.notifications = [];
        console.log('All notifications cleared');
    }
}

// Initialize simple notification service
const simpleNotificationService = new SimpleNotificationService();

// Export for use in other scripts
window.SimpleNotificationService = SimpleNotificationService;
window.simpleNotificationService = simpleNotificationService;
