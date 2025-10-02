# 🔥 Firebase Cloud Messaging Setup Guide

## Overview
This guide will help you set up Firebase Cloud Messaging (FCM) for seller notifications in your Unitrade app.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: "Unitrade"
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Cloud Messaging
1. In your Firebase project, go to "Project Settings" (gear icon)
2. Click on "Cloud Messaging" tab
3. Note down your **Server Key** (you'll need this later)

### Step 3: Add Web App
1. In Project Settings, click "Add app" → Web (</>) icon
2. Enter app nickname: "Unitrade Web"
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase config object

### Step 4: Generate VAPID Key
1. In Cloud Messaging tab, click "Generate key pair"
2. Copy the **VAPID key** (starts with "B...")

### Step 5: Update Configuration Files

#### Update `firebase-messaging-sw.js`:
```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

#### Update `js/fcm-service.js`:
```javascript
const token = await this.messaging.getToken({
    vapidKey: 'YOUR_VAPID_KEY_HERE' // Replace with your VAPID key
});
```

#### Update `test-fcm.html`:
```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

## 🧪 Testing

### Test FCM Setup
1. Open `test-fcm.html` in your browser
2. Click "Initialize FCM"
3. Click "Request Permission" when prompted
4. Click "Send Test Notification"
5. Check if you receive a notification

### Test with Real Orders
1. Start your backend: `cd api && node twilio-whatsapp.js`
2. Open seller dashboard
3. Place a test order
4. Check if seller receives notification

## 🔧 Integration with Order Flow

### Add to Seller Pages
Add this to your seller dashboard and other seller pages:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"></script>

<!-- FCM Service -->
<script src="js/fcm-service.js"></script>
```

### Trigger Notifications on Order
When an order is placed, call:

```javascript
// Send FCM notification to seller
fetch('/api/send-fcm-notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        sellerUserId: sellerId,
        orderData: orderData
    })
});
```

## 📱 How It Works

### Foreground Notifications
- When seller has your app open
- Notifications appear as browser notifications
- Click to navigate to order details

### Background Notifications
- When seller has app closed or in background
- Notifications appear in system notification area
- Click to open app and navigate to order

## 🛠️ Troubleshooting

### Common Issues

1. **"Firebase not loaded"**
   - Check if Firebase scripts are loaded
   - Verify internet connection

2. **"Permission denied"**
   - User needs to manually allow notifications
   - Check browser notification settings

3. **"Token not generated"**
   - Check VAPID key configuration
   - Verify Firebase project setup

4. **"Notifications not showing"**
   - Check browser notification permissions
   - Verify service worker is registered

### Debug Steps
1. Open browser DevTools → Console
2. Check for error messages
3. Verify Firebase config is correct
4. Test with `test-fcm.html` first

## 🎯 Next Steps

1. **Set up Firebase project** (5 minutes)
2. **Update config files** (2 minutes)
3. **Test with test page** (2 minutes)
4. **Integrate with order flow** (10 minutes)
5. **Test with real orders** (5 minutes)

## 💡 Pro Tips

- **Test on different browsers** (Chrome, Firefox, Safari)
- **Test on mobile devices** for better experience
- **Use HTTPS** for production (required for notifications)
- **Monitor delivery rates** in Firebase Console

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [FCM Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Service Worker Guide](https://developers.google.com/web/fundamentals/primers/service-workers)

---

**Total setup time: ~15 minutes** ⏱️
**Cost: FREE** 💰
**Result: Real-time seller notifications** 🎉
