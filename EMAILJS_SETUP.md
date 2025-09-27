# EmailJS Setup Guide for Unitrade

## 🚀 Quick Setup

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Copy the Service ID** (you'll need this)

### 3. Create Email Templates

#### Template 1: Order Notification for Sellers
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

**Subject:** `New Order Received - {{product_title}}`

**Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Order Received</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #2d3748; margin: 0;">🎉 New Order Received!</h2>
        <p style="color: #4a5568; margin: 10px 0 0 0;">Someone has ordered your item on Unitrade</p>
    </div>
    
    <div style="background-color: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #2d3748; margin-top: 0;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Product:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">{{product_title}}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Price:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">GHS {{product_price}}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Quantity:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">{{quantity}}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Total Amount:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">GHS {{total_amount}}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Order ID:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">{{order_id}}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0;"><strong>Order Date:</strong></td>
                <td style="padding: 8px 0;">{{order_date}}</td>
            </tr>
        </table>
    </div>
    
    <div style="background-color: #e6fffa; padding: 20px; border: 1px solid #81e6d9; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #2d3748; margin-top: 0;">Buyer Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #81e6d9;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #81e6d9;">{{buyer_name}}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #81e6d9;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #81e6d9;">{{buyer_phone}}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0;"><strong>Location:</strong></td>
                <td style="padding: 8px 0;">{{buyer_location}}</td>
            </tr>
        </table>
    </div>
    
    <div style="background-color: #fef5e7; padding: 20px; border: 1px solid #f6ad55; border-radius: 8px;">
        <h3 style="color: #2d3748; margin-top: 0;">Next Steps</h3>
        <p style="color: #4a5568; margin: 0;">Please contact the buyer to arrange pickup or delivery. You can find their contact information above.</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #718096; font-size: 14px;">
        <p>This email was sent from Unitrade - University Trading Platform</p>
    </div>
</body>
</html>
```

4. **Save the template** and **copy the Template ID**

#### Template 2: Order Confirmation for Buyers (Optional)
1. Create another template for buyer confirmations
2. Use similar structure but from buyer's perspective
3. **Copy the Template ID**

### 4. Get Public Key
1. Go to **Account** > **General**
2. **Copy your Public Key**

### 5. Update Configuration
1. Open `js/email-service.js`
2. Replace the following values:
   - `YOUR_PUBLIC_KEY` with your EmailJS public key
   - `YOUR_SERVICE_ID` with your email service ID
   - `YOUR_TEMPLATE_ID` with your order notification template ID
   - `YOUR_CONFIRMATION_TEMPLATE_ID` with your confirmation template ID

### 6. Test the Setup
1. Open `email-test.html` in your browser
2. Fill in the test form
3. Click "Send Test Email"
4. Check if you receive the email

## 📧 Email Template Variables

The following variables are available in your email templates:

- `{{to_email}}` - Recipient email address
- `{{seller_name}}` - Seller's name
- `{{buyer_name}}` - Buyer's name
- `{{buyer_phone}}` - Buyer's phone number
- `{{buyer_location}}` - Buyer's location/address
- `{{product_title}}` - Product name
- `{{product_price}}` - Product price
- `{{quantity}}` - Quantity ordered
- `{{total_amount}}` - Total amount
- `{{order_id}}` - Order ID
- `{{order_date}}` - Order date

## 🚨 Troubleshooting

### Common Issues:

1. **"EmailJS not initialized" error**
   - Check if your public key is correct
   - Make sure the EmailJS script is loading

2. **"Service not found" error**
   - Verify your service ID is correct
   - Check if the service is active

3. **"Template not found" error**
   - Verify your template ID is correct
   - Check if the template is published

4. **Emails not being sent**
   - Check browser console for errors
   - Verify email service configuration
   - Check spam folder

### Support:
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/