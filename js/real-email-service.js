// Real Email Service for Unitrade using EmailJS
// This service actually sends emails to seller inboxes

class RealEmailService {
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
            // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
            emailjs.init('YOUR_PUBLIC_KEY');
            this.isInitialized = true;
            console.log('EmailJS initialized successfully');
        } catch (error) {
            console.error('Error initializing EmailJS:', error);
        }
    }

    async sendOrderNotification(orderData, sellerEmail) {
        if (!this.isInitialized) {
            throw new Error('EmailJS not initialized. Please set up your EmailJS credentials.');
        }

        try {
            const templateParams = {
                to_email: sellerEmail,
                seller_name: orderData.sellerName || 'Seller',
                buyer_name: orderData.buyerName || orderData.buyerId,
                buyer_phone: orderData.buyerPhone || orderData.buyerContact || 'Not provided',
                buyer_location: orderData.buyerLocation || orderData.shippingAddress || 'Not provided',
                product_title: orderData.productTitle || 'Product',
                product_price: orderData.totalPrice || orderData.productPrice || '0.00',
                quantity: orderData.quantity || 1,
                order_id: orderData.id || 'Unknown',
                order_date: new Date().toLocaleDateString(),
                total_amount: (orderData.totalPrice || orderData.productPrice || 0) * (orderData.quantity || 1)
            };

            console.log('Sending email to:', sellerEmail);
            console.log('Template params:', templateParams);

            const result = await emailjs.send(
                'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                templateParams
            );

            console.log('Email sent successfully:', result);
            return { 
                success: true, 
                message: 'Order notification sent successfully to ' + sellerEmail,
                emailId: result.text
            };
        } catch (error) {
            console.error('Error sending order notification:', error);
            throw new Error('Failed to send order notification: ' + error.message);
        }
    }

    async sendOrderConfirmation(orderData, buyerEmail) {
        if (!this.isInitialized) {
            throw new Error('EmailJS not initialized. Please set up your EmailJS credentials.');
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

            console.log('Sending confirmation email to:', buyerEmail);

            const result = await emailjs.send(
                'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'YOUR_CONFIRMATION_TEMPLATE_ID', // Replace with your confirmation template ID
                templateParams
            );

            console.log('Confirmation email sent successfully:', result);
            return { 
                success: true, 
                message: 'Order confirmation sent successfully to ' + buyerEmail,
                emailId: result.text
            };
        } catch (error) {
            console.error('Error sending order confirmation:', error);
            throw new Error('Failed to send order confirmation: ' + error.message);
        }
    }

    // Fallback method for testing without EmailJS
    async sendTestEmail(orderData, sellerEmail) {
        console.log('📧 TEST EMAIL (Not actually sent)');
        console.log('To:', sellerEmail);
        console.log('Subject: New Order Received - ' + (orderData.productTitle || 'Product'));
        console.log('Content:', this.generateEmailContent(orderData));
        
        // Show a modal with the email content for testing
        this.showEmailPreview(orderData, sellerEmail);
        
        return { 
            success: true, 
            message: 'Test email generated (not actually sent)',
            isTest: true
        };
    }

    generateEmailContent(orderData) {
        return `
📧 ORDER NOTIFICATION EMAIL
═══════════════════════════════════════════════════════════════

To: ${orderData.sellerEmail || 'seller@example.com'}
Subject: New Order Received - ${orderData.productTitle || 'Product'}

Dear ${orderData.sellerName || 'Seller'},

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
Please contact the buyer to arrange pickup or delivery.
You can find their contact information above.

This email was sent from Unitrade - University Trading Platform
═══════════════════════════════════════════════════════════════
        `;
    }

    showEmailPreview(orderData, sellerEmail) {
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
                <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p class="text-yellow-800 font-medium">⚠️ Test Mode</p>
                    <p class="text-yellow-700 text-sm">This is a preview. To send real emails, configure EmailJS credentials.</p>
                </div>
                <div class="mb-4">
                    <p class="text-sm text-gray-600 mb-2">
                        <strong>To:</strong> ${sellerEmail}
                    </p>
                    <p class="text-sm text-gray-600">
                        <strong>Subject:</strong> New Order Received - ${orderData.productTitle || 'Product'}
                    </p>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg">
                    <pre class="text-sm whitespace-pre-wrap font-mono">${this.generateEmailContent(orderData)}</pre>
                </div>
                <div class="mt-4 flex justify-end">
                    <button onclick="this.closest('.fixed').remove()" class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// Initialize real email service
const emailService = new RealEmailService();

// Export for use in other scripts
window.EmailService = RealEmailService;
window.emailService = emailService;
