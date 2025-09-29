// OneSignal Web SDK Email Service for Unitrade
// Uses OneSignal's Web SDK instead of direct API calls

class OneSignalWebEmailService {
    constructor() {
        this.appId = '7e07771a-fbb9-4c16-acc6-e7e121038011';
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Load OneSignal SDK
            if (!window.OneSignal) {
                await this.loadOneSignalSDK();
            }

            // Initialize OneSignal
            window.OneSignal.init({
                appId: this.appId,
                notifyButton: {
                    enable: false // We don't need the notification button
                },
                allowLocalhostAsSecureOrigin: true
            });

            this.isInitialized = true;
            console.log('✅ OneSignal Web SDK initialized');
        } catch (error) {
            console.error('❌ Error initializing OneSignal:', error);
        }
    }

    async loadOneSignalSDK() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Send email notification using OneSignal Web SDK
    async sendOrderNotificationEmail(sellerEmail, orderData) {
        try {
            if (!this.isInitialized) {
                await this.init();
            }

            console.log('📧 Sending OneSignal email via Web SDK to:', sellerEmail);

            // Create email content
            const emailContent = this.generateEmailContent(orderData);

            // Use OneSignal's Web SDK to send email
            const result = await window.OneSignal.sendEmail({
                email: sellerEmail,
                subject: `🎉 New Order Received - ${orderData.productTitle}`,
                body: emailContent,
                isHtml: true
            });

            console.log('✅ OneSignal email sent via Web SDK:', result);
            return { success: true, messageId: result.id };

        } catch (error) {
            console.error('❌ Error sending OneSignal email via Web SDK:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    // Generate email content
    generateEmailContent(orderData) {
        const orderDate = new Date().toLocaleString();
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Order Notification</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #0d9488, #14b8a6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
                .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
                .highlight { color: #0d9488; font-weight: bold; }
                .button { display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 New Order Received!</h1>
                    <p>Someone has placed an order for your item on Unitrade</p>
                </div>
                
                <div class="content">
                    <h2>Order Details</h2>
                    <div class="order-details">
                        <p><strong>Product:</strong> <span class="highlight">${orderData.productTitle || 'Unknown Product'}</span></p>
                        <p><strong>Price:</strong> <span class="highlight">GHS ${orderData.productPrice || orderData.totalPrice || '0.00'}</span></p>
                        <p><strong>Quantity:</strong> ${orderData.quantity || 1}</p>
                        <p><strong>Order Date:</strong> ${orderDate}</p>
                    </div>

                    <h2>Buyer Information</h2>
                    <div class="order-details">
                        <p><strong>Name:</strong> ${orderData.buyerName || 'Not provided'}</p>
                        <p><strong>Phone:</strong> ${orderData.buyerPhone || orderData.buyerContact || 'Not provided'}</p>
                        <p><strong>Location:</strong> ${orderData.buyerLocation || orderData.shippingAddress || 'Not provided'}</p>
                    </div>

                    <div style="text-align: center; margin: 20px 0;">
                        <a href="https://your-website.com/seller-notifications-dashboard.html" class="button">
                            View Order in Dashboard
                        </a>
                    </div>

                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 15px 0;">
                        <p><strong>⚠️ Important:</strong> Please contact the buyer as soon as possible to arrange delivery or pickup. The buyer is waiting for your response!</p>
                    </div>
                </div>

                <div class="footer">
                    <p>This is an automated notification from Unitrade</p>
                    <p>If you have any questions, please contact our support team</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    // Test email functionality
    async testEmail(sellerEmail) {
        const testOrderData = {
            productTitle: 'Test Product',
            productPrice: 100,
            quantity: 1,
            totalPrice: 100,
            buyerName: 'Test Buyer',
            buyerPhone: '1234567890',
            buyerLocation: 'Test Location'
        };

        try {
            await this.sendOrderNotificationEmail(sellerEmail, testOrderData);
            return { success: true, message: 'Test email sent successfully via OneSignal Web SDK!' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

// Create global instance
const oneSignalWebEmailService = new OneSignalWebEmailService();
window.oneSignalWebEmailService = oneSignalWebEmailService;
