# OneSignal Setup Guide for Seller Notifications

## 🎯 **Goal**
Set up OneSignal to send **push notifications** to sellers when their items are ordered.

## 🚀 **Step-by-Step Setup**

### **Step 1: Create OneSignal Account**
1. Go to [OneSignal.com](https://onesignal.com/)
2. Click **"Sign Up"** and create a free account
3. Verify your email address

### **Step 2: Create New App**
1. In OneSignal dashboard, click **"New App/Website"**
2. Choose **"Web Push"** as the platform
3. Enter app details:
   - **App Name:** Unitrade
   - **Website URL:** Your website URL (e.g., `https://yourdomain.com`)
   - **Default Notification Icon URL:** `https://img.icons8.com/color/96/000000/shopping-cart.png`
4. Click **"Create"**

### **Step 3: Get Your Credentials**
1. Go to **Settings** > **Keys & IDs**
2. **Copy these values:**
   - **App ID** (e.g., `12345678-1234-1234-1234-123456789012`)
   - **REST API Key** (e.g., `ABC123DEF456...`)
   - **Sender ID** (e.g., `123456789012`)

### **Step 4: Configure Web Push**
1. Go to **Settings** > **Web Push**
2. **Upload your website icon** (optional)
3. **Set notification settings:**
   - **Default Title:** Unitrade
   - **Default Message:** You have a new notification
   - **Action Button Text:** View
4. **Save settings**

### **Step 5: Update Configuration**
1. Open `js/onesignal-service.js`
2. Replace these values:
   ```javascript
   this.appId = 'YOUR_ONESIGNAL_APP_ID'; // Your App ID
   this.apiKey = 'YOUR_ONESIGNAL_API_KEY'; // Your REST API Key
   this.senderId = 'YOUR_ONESIGNAL_SENDER_ID'; // Your Sender ID
   ```

### **Step 6: Test Notifications**
1. Open `onesignal-test.html` in your browser
2. **Allow notifications** when prompted
3. **Enter a seller ID** for testing
4. **Click "Send Test Notification"**
5. **Check if you receive the notification**

## 📱 **How It Works**

### **When a Buyer Places an Order:**
1. **Order is saved** to Firebase
2. **OneSignal sends push notification** to the seller
3. **Seller receives notification** on their device/browser
4. **Seller can click notification** to view order details

### **Notification Content:**
- **Title:** "🎉 New Order Received!"
- **Message:** "John Doe ordered 'iPhone 13 Pro' for GHS 1200.00"
- **Data:** Complete order and buyer information
- **Actions:** "View Order" and "Contact Buyer" buttons

## 🔧 **Integration Steps**

### **1. Add OneSignal to HTML Files**
Add this to your HTML files (before closing `</body>` tag):
```html
<script src="js/onesignal-service.js"></script>
```

### **2. Update Order Creation**
In your order creation code, add:
```javascript
// After creating order in Firebase
try {
    await oneSignalService.sendOrderNotification(orderData, sellerId);
    console.log('Push notification sent to seller');
} catch (error) {
    console.error('Error sending notification:', error);
}
```

### **3. Subscribe Users**
When users log in, subscribe them to notifications:
```javascript
try {
    await oneSignalService.subscribeUser(userId);
    console.log('User subscribed to notifications');
} catch (error) {
    console.error('Error subscribing user:', error);
}
```

## 📊 **Notification Features**

### **For Sellers:**
- ✅ **Instant push notifications** when items are ordered
- ✅ **Order details** in notification
- ✅ **Buyer contact information** included
- ✅ **Action buttons** to view order or contact buyer
- ✅ **Works on all devices** (mobile, desktop, tablet)

### **For Buyers:**
- ✅ **Order confirmation** notifications
- ✅ **Status updates** when order is processed
- ✅ **Direct links** to order details

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **"OneSignal not initialized" error**
   - Check your App ID is correct
   - Make sure OneSignal script is loading

2. **Notifications not received**
   - Check if user allowed notifications
   - Verify seller ID is correct
   - Check browser notification permissions

3. **"Failed to send notification" error**
   - Check your API key is correct
   - Verify the seller ID exists
   - Check OneSignal dashboard for errors

4. **Notifications not showing**
   - Check browser notification settings
   - Make sure notifications are enabled
   - Test with different browsers

### **Testing Steps:**
1. **Allow notifications** in your browser
2. **Use real seller IDs** for testing
3. **Check OneSignal dashboard** for delivery status
4. **Test on different devices** and browsers

## 📱 **Expected Results**

After setup:
- ✅ **Sellers receive push notifications** instantly when orders are placed
- ✅ **Rich notifications** with order details and buyer information
- ✅ **Action buttons** for quick responses
- ✅ **Works across all devices** and browsers
- ✅ **No email setup required** - just push notifications

## 🎉 **Benefits of OneSignal**

- ✅ **Free tier** - 30,000 notifications/month
- ✅ **Cross-platform** - Works on web, mobile, desktop
- ✅ **Rich notifications** - Images, buttons, custom data
- ✅ **Easy setup** - No complex email configuration
- ✅ **Real-time** - Instant delivery
- ✅ **Reliable** - High delivery rates

## 📞 **Support**

- OneSignal Documentation: https://documentation.onesignal.com/
- OneSignal Support: https://onesignal.com/support
- Free tier: 30,000 notifications/month

Once configured, sellers will receive **instant push notifications** when their items are ordered! 🚀

