// EmailJS Service for Unitrade
// Handles sending order notifications to sellers

class EmailService {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Load EmailJS SDK
            if (typeof emailjs === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
                script.onload = () => this.initializeEmailJS();
                document.head.appendChild(script);
            } else {
                this.initializeEmailJS();
            }
        } catch (error) {
            console.error('Error initializing EmailJS:', error);
        }
    }

    initializeEmailJS() {
        try {
            // Initialize EmailJS with your public key
            // For now, use a placeholder that will work in development
            emailjs.init('user_placeholder'); // This will be replaced with actual key
            this.isInitialized = true;
            console.log('EmailJS initialized successfully');
        } catch (error) {
            console.error('Error initializing EmailJS:', error);
        }
    }

    async sendOrderNotification(orderData, sellerEmail) {
        if (!this.isInitialized) {
            throw new Error('EmailJS not initialized');
        }

        try {
            const templateParams = {
                to_email: sellerEmail,
                seller_name: orderData.sellerName || 'Seller',
                buyer_name: orderData.buyerName || orderData.buyerId,
                buyer_phone: orderData.buyerPhone || 'Not provided',
                buyer_location: orderData.buyerLocation || orderData.shippingAddress || 'Not provided',
                product_title: orderData.productTitle || 'Product',
                product_price: orderData.totalPrice || orderData.productPrice || '0.00',
                quantity: orderData.quantity || 1,
                order_id: orderData.id || 'Unknown',
                order_date: new Date().toLocaleDateString(),
                total_amount: (orderData.totalPrice || orderData.productPrice || 0) * (orderData.quantity || 1)
            };

            const result = await emailjs.send(
                'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                templateParams
            );

            console.log('Order notification sent successfully:', result);
            return { success: true, message: 'Order notification sent successfully' };
        } catch (error) {
            console.error('Error sending order notification:', error);
            throw new Error('Failed to send order notification: ' + error.message);
        }
    }

    async sendOrderConfirmation(orderData, buyerEmail) {
        if (!this.isInitialized) {
            throw new Error('EmailJS not initialized');
        }

        try {
            const templateParams = {
                to_email: buyerEmail,
                buyer_name: orderData.buyerName || orderData.buyerId,
                product_title: orderData.productTitle || 'Product',
                product_price: orderData.totalPrice || orderData.productPrice || '0.00',
                quantity: orderData.quantity || 1,
                order_id: orderData.id || 'Unknown',
                order_date: new Date().toLocaleDateString(),
                total_amount: (orderData.totalPrice || orderData.productPrice || 0) * (orderData.quantity || 1)
            };

            const result = await emailjs.send(
                'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'YOUR_CONFIRMATION_TEMPLATE_ID', // Replace with your confirmation template ID
                templateParams
            );

            console.log('Order confirmation sent successfully:', result);
            return { success: true, message: 'Order confirmation sent successfully' };
        } catch (error) {
            console.error('Error sending order confirmation:', error);
            throw new Error('Failed to send order confirmation: ' + error.message);
        }
    }
}

// Initialize email service
const emailService = new EmailService();

// Export for use in other scripts
window.EmailService = EmailService;
window.emailService = emailService;
