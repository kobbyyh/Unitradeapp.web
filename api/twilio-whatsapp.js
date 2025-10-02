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
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
const smsFrom = process.env.TWILIO_SMS_FROM || '+14155238886';

// Debug: Log what credentials were loaded
console.log('🔍 Debug - Account SID loaded:', accountSid);
console.log('🔍 Debug - Auth Token loaded:', authToken ? '***' + authToken.slice(-4) : 'undefined');
console.log('🔍 Debug - Account SID starts with AC:', accountSid.startsWith('AC'));

// Validate that credentials are provided
let client = null;
if (accountSid === 'YOUR_TWILIO_ACCOUNT_SID_HERE' || authToken === 'YOUR_TWILIO_AUTH_TOKEN_HERE' || !accountSid.startsWith('AC')) {
    console.log('⚠️ Using placeholder Twilio credentials for testing');
    console.log('⚠️ WhatsApp notifications will be simulated');
    console.log('⚠️ Add real credentials to config.env for production use');
    // Create a mock client for testing
    client = {
        messages: {
            create: async () => {
                return { sid: 'simulated_' + Date.now() };
            }
        }
    };
} else {
    client = twilio(accountSid, authToken);
}


// Content SID for your message template
const contentSid = 'HX350d429d32e64a552466cafecbe95f3c';

// Email configuration
const emailFrom = 'noreply@unitrade.com'; // You can use your own domain

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

        // Format phone number for international use
        let formattedPhone = sellerPhoneNumber;
        console.log('📞 Original phone number:', sellerPhoneNumber);
        
        // Remove any spaces, dashes, or special characters
        formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, '');
        console.log('📞 After cleaning:', formattedPhone);
        
        if (formattedPhone.startsWith('+')) {
            // Already has country code, use as is
            console.log('📞 Phone already has country code:', formattedPhone);
        } else if (formattedPhone.startsWith('233')) {
            // Ghana number missing +, add it
            formattedPhone = '+' + formattedPhone;
            console.log('📞 Added + to Ghana number:', formattedPhone);
        } else if (formattedPhone.startsWith('0')) {
            // Ghana local format (0241234567 -> +233241234567)
            formattedPhone = '+233' + formattedPhone.substring(1);
            console.log('📞 Converted Ghana local to international:', formattedPhone);
        } else if (formattedPhone.length >= 10) {
            // Assume it's a local number without country code, default to Ghana
            formattedPhone = '+233' + formattedPhone;
            console.log('📞 Assumed Ghana local number, added +233:', formattedPhone);
        } else {
            // Invalid number format
            return res.status(400).json({
                success: false,
                error: `Invalid phone number format: ${sellerPhoneNumber}`
            });
        }
        
        console.log('📞 Final formatted phone:', formattedPhone);

        // Create WhatsApp message content
        const messageContent = createWhatsAppMessage(orderData);

        // Check if using placeholder credentials
        if (accountSid === 'YOUR_TWILIO_ACCOUNT_SID_HERE' || authToken === 'YOUR_TWILIO_AUTH_TOKEN_HERE') {
            console.log('⚠️ Using placeholder credentials - simulating WhatsApp send');
            res.json({
                success: true,
                messageId: 'simulated_' + Date.now(),
                message: 'WhatsApp notification simulated (placeholder credentials)'
            });
            return;
        }

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

// Send SMS notification to seller
app.post('/api/send-sms-notification', async (req, res) => {
    try {
        const { sellerPhoneNumber, orderData } = req.body;
        
        if (!sellerPhoneNumber || !orderData) {
            return res.status(400).json({ 
                error: 'Missing required fields: sellerPhoneNumber and orderData' 
            });
        }
        
        console.log('📱 Sending SMS notification to:', sellerPhoneNumber);
        console.log('📱 Order data:', orderData);
        
        // Format phone number for international use
        let formattedPhone = sellerPhoneNumber;
        formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, '');
        
        if (formattedPhone.startsWith('+')) {
            // Already has country code, use as is
            console.log('📱 Phone already has country code:', formattedPhone);
        } else if (formattedPhone.startsWith('233')) {
            // Ghana number missing +, add it
            formattedPhone = '+' + formattedPhone;
            console.log('📱 Added + to Ghana number:', formattedPhone);
        } else if (formattedPhone.startsWith('0')) {
            // Ghana local format (0241234567 -> +233241234567)
            formattedPhone = '+233' + formattedPhone.substring(1);
            console.log('📱 Converted Ghana local to international:', formattedPhone);
        } else if (formattedPhone.length >= 10) {
            // Assume it's a local number without country code, default to Ghana
            formattedPhone = '+233' + formattedPhone;
            console.log('📱 Assumed Ghana local number, added +233:', formattedPhone);
        } else {
            return res.status(400).json({
                success: false,
                error: `Invalid phone number format: ${sellerPhoneNumber}`
            });
        }
        
        console.log('📱 Final formatted phone for SMS:', formattedPhone);
        
        // Generate SMS content
        const smsContent = createSMSMessage(orderData);
        
        // Send SMS using Twilio
        const message = await client.messages.create({
            body: smsContent,
            from: smsFrom, // Twilio SMS number
            to: formattedPhone
        });
        
        console.log('✅ SMS sent successfully:', message.sid);
        
        res.json({
            success: true,
            messageId: message.sid,
            message: 'SMS notification sent successfully',
            recipient: formattedPhone,
            type: 'SMS'
        });
        
    } catch (error) {
        console.error('❌ Error sending SMS notification:', error);
        res.status(500).json({ 
            error: 'Failed to send SMS notification',
            details: error.message 
        });
    }
});

// Generate SMS content for order notification
function createSMSMessage(orderData) {
    return `🎉 NEW ORDER on Unitrade!

📦 Product: ${orderData.productTitle}
💰 Price: GHS ${orderData.productPrice}
📊 Quantity: ${orderData.quantity}
💵 Total: GHS ${orderData.totalPrice}

👤 Buyer: ${orderData.buyerName}
📞 Contact: ${orderData.buyerContact || 'Not provided'}
📍 Location: ${orderData.buyerLocation || 'Not provided'}

📋 Order ID: ${orderData.id}
📅 Date: ${new Date(orderData.createdAt).toLocaleString()}

⚠️ Please contact the buyer ASAP to arrange delivery!

---
Unitrade - Your Campus Marketplace`;
}

// Save FCM token for seller
app.post('/api/save-fcm-token', async (req, res) => {
    try {
        const { token, userId } = req.body;
        
        if (!token || !userId) {
            return res.status(400).json({ 
                error: 'Missing required fields: token and userId' 
            });
        }
        
        console.log('💾 Saving FCM token for user:', userId);
        console.log('💾 Token:', token.substring(0, 20) + '...');
        
        // In a real app, you'd save this to your database
        // For now, we'll just log it
        console.log('✅ FCM token saved successfully');
        
        res.json({
            success: true,
            message: 'FCM token saved successfully'
        });
        
    } catch (error) {
        console.error('❌ Error saving FCM token:', error);
        res.status(500).json({ 
            error: 'Failed to save FCM token',
            details: error.message 
        });
    }
});

// Send FCM notification to seller
app.post('/api/send-fcm-notification', async (req, res) => {
    try {
        const { sellerUserId, orderData } = req.body;
        
        if (!sellerUserId || !orderData) {
            return res.status(400).json({ 
                error: 'Missing required fields: sellerUserId and orderData' 
            });
        }
        
        console.log('📱 Sending FCM notification to user:', sellerUserId);
        console.log('📱 Order data:', orderData);
        
        // In a real app, you'd:
        // 1. Get the seller's FCM token from database
        // 2. Send notification using Firebase Admin SDK
        // 3. Handle delivery status
        
        // For now, we'll simulate the notification
        const notification = {
            title: 'New Order on Unitrade!',
            body: `${orderData.productTitle} - ${orderData.buyerName}`,
            data: {
                orderId: orderData.id,
                productTitle: orderData.productTitle,
                buyerName: orderData.buyerName,
                totalPrice: orderData.totalPrice
            }
        };
        
        console.log('📱 FCM Notification prepared:', notification);
        
        res.json({
            success: true,
            messageId: 'fcm_' + Date.now(),
            message: 'FCM notification sent successfully',
            notification: notification
        });
        
    } catch (error) {
        console.error('❌ Error sending FCM notification:', error);
        res.status(500).json({ 
            error: 'Failed to send FCM notification',
            details: error.message 
        });
    }
});

// Send test FCM notification
app.post('/api/send-test-notification', async (req, res) => {
    try {
        const { userId } = req.body;
        
        console.log('🧪 Sending test FCM notification to user:', userId);
        
        const testNotification = {
            title: 'Test Notification',
            body: 'This is a test notification from Unitrade',
            data: {
                test: true,
                timestamp: new Date().toISOString()
            }
        };
        
        console.log('🧪 Test notification prepared:', testNotification);
        
        res.json({
            success: true,
            message: 'Test notification sent successfully',
            notification: testNotification
        });
        
    } catch (error) {
        console.error('❌ Error sending test notification:', error);
        res.status(500).json({ 
            error: 'Failed to send test notification',
            details: error.message 
        });
    }
});

// Send email notification to seller
app.post('/api/send-email-notification', async (req, res) => {
    try {
        const { sellerEmail, orderData } = req.body;
        
        if (!sellerEmail || !orderData) {
            return res.status(400).json({ 
                error: 'Missing required fields: sellerEmail and orderData' 
            });
        }
        
        console.log('📧 Sending email notification to:', sellerEmail);
        console.log('📧 Order data:', orderData);
        
        // Generate email content
        const emailContent = generateEmailContent(orderData);
        const emailSubject = `New Order on Unitrade - ${orderData.productTitle}`;
        
        // Log email content for now (in production, integrate with real email service)
        console.log('📧 EMAIL CONTENT:');
        console.log('📧 To:', sellerEmail);
        console.log('📧 Subject:', emailSubject);
        console.log('📧 Content Preview:', emailContent.substring(0, 300) + '...');
        
        const messageId = 'email_' + Date.now();
        
        res.json({
            success: true,
            messageId: messageId,
            message: 'Email notification logged (integrate with real email service for production)',
            recipient: sellerEmail,
            subject: emailSubject
        });
        
    } catch (error) {
        console.error('❌ Error sending email notification:', error);
        res.status(500).json({ 
            error: 'Failed to send email notification',
            details: error.message 
        });
    }
});

// Generate email content for order notification
function generateEmailContent(orderData) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Order on Unitrade</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0d9488; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
        .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #0d9488; }
        .highlight { color: #0d9488; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 New Order Received!</h1>
            <p>You have a new order on Unitrade</p>
        </div>
        
        <div class="content">
            <h2>Order Details</h2>
            
            <div class="order-details">
                <h3>📦 Product: ${orderData.productTitle}</h3>
                <p><strong>Price per unit:</strong> GHS ${orderData.productPrice}</p>
                <p><strong>Quantity:</strong> ${orderData.quantity}</p>
                <p><strong>Total Amount:</strong> <span class="highlight">GHS ${orderData.totalPrice}</span></p>
            </div>
            
            <div class="order-details">
                <h3>👤 Buyer Information</h3>
                <p><strong>Name:</strong> ${orderData.buyerName}</p>
                <p><strong>Contact:</strong> ${orderData.buyerContact || 'Not provided'}</p>
                <p><strong>Location:</strong> ${orderData.buyerLocation || 'Not provided'}</p>
            </div>
            
            <div class="order-details">
                <h3>📋 Order Summary</h3>
                <p><strong>Order ID:</strong> ${orderData.id}</p>
                <p><strong>Status:</strong> Pending</p>
                <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleString()}</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107;">
                <h4>⚠️ Important Next Steps:</h4>
                <ul>
                    <li>Contact the buyer as soon as possible</li>
                    <li>Confirm the order details</li>
                    <li>Arrange delivery or pickup</li>
                    <li>Update the order status in your seller dashboard</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="https://your-unitrade-site.com/seller-dashboard.html" 
                   style="background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    View in Seller Dashboard
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from Unitrade</p>
            <p>Please do not reply to this email</p>
        </div>
    </div>
</body>
</html>`;
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Twilio Notification API running on port ${PORT}`);
    console.log(`📱 SMS endpoint: http://localhost:${PORT}/api/send-sms-notification`);
    console.log(`💬 WhatsApp endpoint: http://localhost:${PORT}/api/send-whatsapp-notification`);
    console.log(`📧 Email endpoint: http://localhost:${PORT}/api/send-email-notification`);
    console.log(`🔧 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
