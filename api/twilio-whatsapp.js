// Twilio WhatsApp API for Unitrade Seller Notifications
// Backend API to send WhatsApp messages to sellers when orders are placed

const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load environment variables
require('dotenv').config({ path: './config.env' });

// Twilio Configuration - Load from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_ACCOUNT_SID_HERE';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_AUTH_TOKEN_HERE';

// Validate that credentials are provided
if (accountSid === 'YOUR_TWILIO_ACCOUNT_SID_HERE' || authToken === 'YOUR_TWILIO_AUTH_TOKEN_HERE') {
    console.error('❌ Twilio credentials not found!');
    console.error('Please create a .env file with your Twilio credentials.');
    console.error('See env-example.txt for reference.');
    process.exit(1);
}
const client = twilio(accountSid, authToken);

// WhatsApp number from Twilio
const whatsappFrom = 'whatsapp:+14155238886';

// Content SID for your message template
const contentSid = 'HX350d429d32e64a552466cafecbe95f3c';

// Send WhatsApp notification to seller
app.post('/api/send-whatsapp-notification', async (req, res) => {
    try {
        const { 
            sellerPhoneNumber, 
            orderData 
        } = req.body;

        // Validate required fields
        if (!sellerPhoneNumber || !orderData) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: sellerPhoneNumber and orderData'
            });
        }

        // Format phone number for Ghana (+233)
        let formattedPhone = sellerPhoneNumber;
        console.log('📞 Original phone number:', sellerPhoneNumber);
        
        // Remove any spaces, dashes, or special characters
        formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, '');
        
        if (formattedPhone.startsWith('+233')) {
            // Already has +233, use as is
            console.log('📞 Already has +233:', formattedPhone);
        } else if (formattedPhone.startsWith('233')) {
            // Has 233 but missing +, add it
            formattedPhone = '+' + formattedPhone;
            console.log('📞 Added + to 233:', formattedPhone);
        } else if (formattedPhone.startsWith('0')) {
            // Ghana local format (0241234567 -> +233241234567)
            formattedPhone = '+233' + formattedPhone.substring(1);
            console.log('📞 Converted from 0 format:', formattedPhone);
        } else {
            // Any other format, assume it's a local Ghana number
            formattedPhone = '+233' + formattedPhone;
            console.log('📞 Added +233 to local number:', formattedPhone);
        }
        
        console.log('📞 Final formatted phone for Ghana:', formattedPhone);

        // Create WhatsApp message content
        const messageContent = createWhatsAppMessage(orderData);

        // Send WhatsApp message
        const message = await client.messages.create({
            from: whatsappFrom,
            to: `whatsapp:${formattedPhone}`,
            body: messageContent
        });

        console.log('✅ WhatsApp message sent successfully:', message.sid);
        
        res.json({
            success: true,
            messageId: message.sid,
            message: 'WhatsApp notification sent successfully'
        });

    } catch (error) {
        console.error('❌ Error sending WhatsApp notification:', error);
        
        res.status(500).json({
            success: false,
            error: error.message,
            details: 'Failed to send WhatsApp notification'
        });
    }
});

// Send WhatsApp notification using content template
app.post('/api/send-whatsapp-template', async (req, res) => {
    try {
        const { 
            sellerPhoneNumber, 
            orderData 
        } = req.body;

        // Validate required fields
        if (!sellerPhoneNumber || !orderData) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: sellerPhoneNumber and orderData'
            });
        }

        // Format phone number
        let formattedPhone = sellerPhoneNumber;
        if (!formattedPhone.startsWith('+')) {
            if (formattedPhone.startsWith('0')) {
                formattedPhone = '+233' + formattedPhone.substring(1);
            } else if (formattedPhone.startsWith('233')) {
                formattedPhone = '+' + formattedPhone;
            } else {
                formattedPhone = '+233' + formattedPhone;
            }
        }

        // Create content variables for template
        const contentVariables = JSON.stringify({
            "1": orderData.productTitle || 'Unknown Product',
            "2": `GHS ${orderData.productPrice || orderData.totalPrice || '0.00'}`,
            "3": orderData.buyerName || 'Unknown Buyer',
            "4": orderData.buyerPhone || orderData.buyerContact || 'Not provided',
            "5": orderData.buyerLocation || orderData.shippingAddress || 'Not provided',
            "6": new Date().toLocaleString()
        });

        // Send WhatsApp message using template
        const message = await client.messages.create({
            from: whatsappFrom,
            contentSid: contentSid,
            contentVariables: contentVariables,
            to: `whatsapp:${formattedPhone}`
        });

        console.log('✅ WhatsApp template message sent successfully:', message.sid);
        
        res.json({
            success: true,
            messageId: message.sid,
            message: 'WhatsApp template notification sent successfully'
        });

    } catch (error) {
        console.error('❌ Error sending WhatsApp template notification:', error);
        
        res.status(500).json({
            success: false,
            error: error.message,
            details: 'Failed to send WhatsApp template notification'
        });
    }
});

// Test endpoint
app.post('/api/test-whatsapp', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'Phone number is required'
            });
        }

        const testOrderData = {
            productTitle: 'Test Product',
            productPrice: 100,
            quantity: 1,
            totalPrice: 100,
            buyerName: 'Test Buyer',
            buyerPhone: '1234567890',
            buyerLocation: 'Test Location'
        };

        // Send test message
        const message = await client.messages.create({
            from: whatsappFrom,
            to: `whatsapp:${phoneNumber}`,
            body: `🧪 TEST MESSAGE from Unitrade\n\nThis is a test WhatsApp notification for order: ${testOrderData.productTitle}`
        });

        res.json({
            success: true,
            messageId: message.sid,
            message: 'Test WhatsApp message sent successfully'
        });

    } catch (error) {
        console.error('❌ Error sending test WhatsApp:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Twilio WhatsApp API is running',
        timestamp: new Date().toISOString()
    });
});

// Helper function to create WhatsApp message content
function createWhatsAppMessage(orderData) {
    const orderDate = new Date().toLocaleString();
    
    return `🎉 *NEW ORDER RECEIVED!*

📦 *Product:* ${orderData.productTitle || 'Unknown Product'}
💰 *Price:* GHS ${orderData.productPrice || orderData.totalPrice || '0.00'}
📊 *Quantity:* ${orderData.quantity || 1}
📅 *Order Date:* ${orderDate}

👤 *Buyer Information:*
• Name: ${orderData.buyerName || 'Not provided'}
• Phone: ${orderData.buyerPhone || orderData.buyerContact || 'Not provided'}
• Location: ${orderData.buyerLocation || orderData.shippingAddress || 'Not provided'}

⚠️ *Important:* Please contact the buyer as soon as possible to arrange delivery or pickup!


---
*This is an automated notification from Unitrade*`;
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Twilio WhatsApp API running on port ${PORT}`);
    console.log(`📱 WhatsApp notifications ready for sellers`);
});

module.exports = app;
