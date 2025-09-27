// Simple Email Service for Unitrade
// This service simulates email sending for development and can be replaced with EmailJS

class SimpleEmailService {
    constructor() {
        this.isInitialized = true;
        console.log('Simple Email Service initialized');
    }

    async sendOrderNotification(orderData, sellerEmail) {
        try {
            console.log('📧 Sending order notification email...');
            console.log('To:', sellerEmail);
            console.log('Order Data:', orderData);

            // Simulate email sending
            const emailContent = this.generateEmailContent(orderData);
            
            // In a real implementation, this would send an actual email
            // For now, we'll just log it and show a success message
            console.log('📧 Email Content:');
            console.log(emailContent);
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show email content in a modal for testing
            this.showEmailPreview(emailContent, sellerEmail);
            
            return { 
                success: true, 
                message: 'Order notification sent successfully (simulated)',
                emailContent: emailContent
            };
        } catch (error) {
            console.error('Error sending order notification:', error);
            throw new Error('Failed to send order notification: ' + error.message);
        }
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

    showEmailPreview(emailContent, sellerEmail) {
        // Create a modal to show the email content
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">📧 Email Notification Sent</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
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
                    <pre class="text-sm whitespace-pre-wrap font-mono">${emailContent}</pre>
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

    async sendOrderConfirmation(orderData, buyerEmail) {
        try {
            console.log('📧 Sending order confirmation email...');
            console.log('To:', buyerEmail);
            console.log('Order Data:', orderData);

            // Simulate email sending
            const emailContent = this.generateConfirmationContent(orderData);
            
            console.log('📧 Confirmation Email Content:');
            console.log(emailContent);
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return { 
                success: true, 
                message: 'Order confirmation sent successfully (simulated)',
                emailContent: emailContent
            };
        } catch (error) {
            console.error('Error sending order confirmation:', error);
            throw new Error('Failed to send order confirmation: ' + error.message);
        }
    }

    generateConfirmationContent(orderData) {
        return `
📧 ORDER CONFIRMATION EMAIL
═══════════════════════════════════════════════════════════════

To: ${orderData.buyerEmail || 'buyer@example.com'}
Subject: Order Confirmation - ${orderData.productTitle || 'Product'}

Dear ${orderData.buyerName || 'Buyer'},

✅ Your order has been confirmed!

ORDER DETAILS:
───────────────────────────────────────────────────────────────
Product: ${orderData.productTitle || 'Product'}
Price: GHS ${orderData.totalPrice || orderData.productPrice || '0.00'}
Quantity: ${orderData.quantity || 1}
Total Amount: GHS ${(orderData.totalPrice || orderData.productPrice || 0) * (orderData.quantity || 1)}
Order ID: ${orderData.id || 'Unknown'}
Order Date: ${new Date().toLocaleDateString()}

NEXT STEPS:
───────────────────────────────────────────────────────────────
The seller will contact you soon to arrange pickup or delivery.
Please keep your contact information updated.

Thank you for using Unitrade!
═══════════════════════════════════════════════════════════════
        `;
    }
}

// Initialize simple email service
const emailService = new SimpleEmailService();

// Export for use in other scripts
window.EmailService = SimpleEmailService;
window.emailService = emailService;
