// Twilio WhatsApp Service for Unitrade
// Frontend service to call Twilio backend API

class TwilioWhatsAppService {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3001/api'; // Change this to your deployed backend URL
        this.isInitialized = true;
        
        // Load Twilio config from public config if available
        if (window.TWILIO_CONFIG) {
            this.config = window.TWILIO_CONFIG;
        }
    }

    // Send WhatsApp notification to seller
    async sendOrderNotification(sellerPhoneNumber, orderData) {
        try {
            // Format phone number for Ghana (+233)
            let formattedPhone = sellerPhoneNumber;
            
            // Remove any spaces, dashes, or special characters
            formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, '');
            
            if (formattedPhone.startsWith('+233')) {
                // Already has +233, use as is
            } else if (formattedPhone.startsWith('233')) {
                // Has 233 but missing +, add it
                formattedPhone = '+' + formattedPhone;
            } else if (formattedPhone.startsWith('0')) {
                // Ghana local format (0241234567 -> +233241234567)
                formattedPhone = '+233' + formattedPhone.substring(1);
            } else {
                // Any other format, assume it's a local Ghana number
                formattedPhone = '+233' + formattedPhone;
            }
            
            console.log('📱 Sending WhatsApp notification to:', formattedPhone);
            
            const response = await fetch(`${this.apiBaseUrl}/send-whatsapp-notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sellerPhoneNumber: formattedPhone,
                    orderData: orderData
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ WhatsApp notification sent successfully:', result);
            return result;

        } catch (error) {
            console.error('❌ Error sending WhatsApp notification:', error);
            throw new Error(`Failed to send WhatsApp notification: ${error.message}`);
        }
    }

    // Send WhatsApp notification using template
    async sendOrderNotificationTemplate(sellerPhoneNumber, orderData) {
        try {
            console.log('📱 Sending WhatsApp template notification to:', sellerPhoneNumber);
            
            const response = await fetch(`${this.apiBaseUrl}/send-whatsapp-template`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sellerPhoneNumber: sellerPhoneNumber,
                    orderData: orderData
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ WhatsApp template notification sent successfully:', result);
            return result;

        } catch (error) {
            console.error('❌ Error sending WhatsApp template notification:', error);
            throw new Error(`Failed to send WhatsApp template notification: ${error.message}`);
        }
    }

    // Test WhatsApp functionality
    async testWhatsApp(phoneNumber) {
        try {
            // Format phone number for Ghana (+233)
            let formattedPhone = phoneNumber;
            
            // Remove any spaces, dashes, or special characters
            formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, '');
            
            if (formattedPhone.startsWith('+233')) {
                // Already has +233, use as is
            } else if (formattedPhone.startsWith('233')) {
                // Has 233 but missing +, add it
                formattedPhone = '+' + formattedPhone;
            } else if (formattedPhone.startsWith('0')) {
                // Ghana local format (0241234567 -> +233241234567)
                formattedPhone = '+233' + formattedPhone.substring(1);
            } else {
                // Any other format, assume it's a local Ghana number
                formattedPhone = '+233' + formattedPhone;
            }
            
            console.log('📱 Testing WhatsApp notification to:', formattedPhone);
            
            const response = await fetch(`${this.apiBaseUrl}/test-whatsapp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: formattedPhone
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ WhatsApp test sent successfully:', result);
            return result;

        } catch (error) {
            console.error('❌ Error sending WhatsApp test:', error);
            throw new Error(`Failed to send WhatsApp test: ${error.message}`);
        }
    }

    // Check if backend is running
    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('❌ Backend health check failed:', error);
            return false;
        }
    }
}

// Create global instance
const twilioWhatsAppService = new TwilioWhatsAppService();
window.twilioWhatsAppService = twilioWhatsAppService;
