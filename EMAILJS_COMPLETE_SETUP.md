# Complete EmailJS Setup Guide for Real Email Notifications

## 🎯 **Goal**
Set up EmailJS to send **real emails** to seller inboxes when orders are placed.

## 🚀 **Step-by-Step Setup**

### **Step 1: Create EmailJS Account**
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click **"Sign Up"** and create a free account
3. Verify your email address

### **Step 2: Create Email Service**
1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (recommended for testing)
   - **Outlook** 
   - **Yahoo**
   - Or any other provider
4. Follow the setup instructions for your provider
5. **Copy the Service ID** (e.g., `service_abc123`)

### **Step 3: Create Email Templates**

#### **Template 1: Order Notification for Sellers**
1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Use this template:

**Template Name:** `order_notification`

**Subject:** `New Order Received - {{product_title}}`

**Content (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Order Received</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .order-details { background-color: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px; }
        .buyer-info { background-color: #e6fffa; padding: 20px; border: 1px solid #81e6d9; border-radius: 8px; margin-bottom: 20px; }
        .next-steps { background-color: #fef5e7; padding: 20px; border: 1px solid #f6ad55; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .footer { text-align: center; margin-top: 30px; color: #718096; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h2 style="color: #2d3748; margin: 0;">🎉 New Order Received!</h2>
        <p style="color: #4a5568; margin: 10px 0 0 0;">Someone has ordered your item on Unitrade</p>
    </div>
    
    <div class="order-details">
        <h3 style="color: #2d3748; margin-top: 0;">Order Details</h3>
        <table>
            <tr>
                <td><strong>Product:</strong></td>
                <td>{{product_title}}</td>
            </tr>
            <tr>
                <td><strong>Price:</strong></td>
                <td>GHS {{product_price}}</td>
            </tr>
            <tr>
                <td><strong>Quantity:</strong></td>
                <td>{{quantity}}</td>
            </tr>
            <tr>
                <td><strong>Total Amount:</strong></td>
                <td>GHS {{total_amount}}</td>
            </tr>
            <tr>
                <td><strong>Order ID:</strong></td>
                <td>{{order_id}}</td>
            </tr>
            <tr>
                <td><strong>Order Date:</strong></td>
                <td>{{order_date}}</td>
            </tr>
        </table>
    </div>
    
    <div class="buyer-info">
        <h3 style="color: #2d3748; margin-top: 0;">Buyer Information</h3>
        <table>
            <tr>
                <td><strong>Name:</strong></td>
                <td>{{buyer_name}}</td>
            </tr>
            <tr>
                <td><strong>Phone:</strong></td>
                <td>{{buyer_phone}}</td>
            </tr>
            <tr>
                <td><strong>Location:</strong></td>
                <td>{{buyer_location}}</td>
            </tr>
        </table>
    </div>
    
    <div class="next-steps">
        <h3 style="color: #2d3748; margin-top: 0;">Next Steps</h3>
        <p style="color: #4a5568; margin: 0;">Please contact the buyer to arrange pickup or delivery. You can find their contact information above.</p>
    </div>
    
    <div class="footer">
        <p>This email was sent from Unitrade - University Trading Platform</p>
    </div>
</body>
</html>
```

4. **Save the template** and **copy the Template ID** (e.g., `template_xyz789`)

#### **Template 2: Order Confirmation for Buyers (Optional)**
1. Create another template for buyer confirmations
2. Use similar structure but from buyer's perspective
3. **Copy the Template ID**

### **Step 4: Get Public Key**
1. Go to **"Account"** > **"General"**
2. **Copy your Public Key** (e.g., `user_abc123def456`)

### **Step 5: Update Configuration**
1. Open `js/real-email-service.js`
2. Replace these values:
   - `YOUR_PUBLIC_KEY` → Your actual public key
   - `YOUR_SERVICE_ID` → Your email service ID
   - `YOUR_TEMPLATE_ID` → Your order notification template ID
   - `YOUR_CONFIRMATION_TEMPLATE_ID` → Your confirmation template ID

### **Step 6: Update HTML Files**
Replace the email service in your HTML files:
```html
<!-- Change this: -->
<script src="js/simple-email-service.js"></script>

<!-- To this: -->
<script src="js/real-email-service.js"></script>
```

### **Step 7: Test Real Emails**
1. Open `test-email.html` in your browser
2. Fill in a **real email address** (yours)
3. Click "Send Test Order Notification"
4. Check your **actual email inbox**
5. You should receive the real email!

## 📧 **Email Template Variables**

These variables are available in your templates:
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

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **"EmailJS not initialized" error**
   - Check your public key is correct
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
   - Test with a real email address

5. **Emails going to spam**
   - Check spam folder
   - Add EmailJS to your email whitelist

### **Testing Steps:**
1. Use your own email address for testing
2. Check both inbox and spam folder
3. Verify all template variables are working
4. Test with different email providers

## 🎉 **Expected Result**

After setup:
- ✅ **Real emails sent** to seller inboxes
- ✅ **Professional email format** with all order details
- ✅ **Buyer contact information** included
- ✅ **No more console-only emails**
- ✅ **Sellers get instant notifications** in their actual email

## 📞 **Support**

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/
- Free tier: 200 emails/month (perfect for testing)

Once configured, sellers will receive **real emails** in their inboxes when orders are placed! 🚀
