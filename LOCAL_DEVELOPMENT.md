# Local Development Guide

## 🚀 Quick Start for Local Development

### **Option 1: Using Mock API (Easiest)**

1. **Open any HTML file** in your browser (e.g., `buyer-orders.html`)
2. **The mock API will automatically activate** for local development
3. **All API calls will work** with simulated data
4. **No setup required** - just open and test!

### **Option 2: Using Vercel CLI (Full Backend)**

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Navigate to project directory**:
```bash
cd UnitradeWebsite
```

3. **Install dependencies**:
```bash
npm install
```

4. **Set up environment variables** (create `.env.local`):
```env
FIREBASE_PROJECT_ID=unitrade-d74e9
FIREBASE_CLIENT_EMAIL=your-service-account-email@unitrade-d74e9.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

5. **Run local development server**:
```bash
vercel dev
```

6. **Open** `http://localhost:3000` in your browser

## 🔧 How the Mock API Works

The mock API automatically detects when you're running locally and provides:

- ✅ **Simulated order management** - Create, read, update, delete orders
- ✅ **Simulated notifications** - Seller notifications for new orders
- ✅ **Realistic responses** - Same format as the real API
- ✅ **Data persistence** - Data persists during your session
- ✅ **No setup required** - Works immediately

## 📱 Testing Features

### **Order Management**
- Create orders with any buyer/seller IDs
- Cancel orders (buyers)
- Update order status (sellers)
- View order history

### **Notifications**
- Sellers receive notifications for new orders
- Mark notifications as read/unread
- Delete notifications

### **Test Pages**
- `api-test.html` - Complete API testing interface
- `test-cancel-order.html` - Order cancellation testing
- `seller-notifications.html` - Seller notification dashboard

## 🚨 Troubleshooting

### **Common Issues:**

1. **404 Errors on API calls**
   - Make sure you're using the mock API (included in HTML files)
   - Check browser console for mock API activation message

2. **Data not persisting**
   - Mock API data only persists during the browser session
   - Refresh the page to reset data

3. **Firebase Auth Issues**
   - Firebase authentication still works normally
   - Only the order/notification APIs use the mock system

### **Switching Between Local and Production:**

- **Local development**: Uses mock API automatically
- **Production (Vercel)**: Uses real Firebase backend
- **No code changes needed** - automatic detection

## 🎯 Next Steps

1. **Test locally** with the mock API
2. **Deploy to Vercel** for production testing
3. **Set up Firebase** for real data persistence
4. **Configure environment variables** in Vercel dashboard

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify the mock API is loading (look for "🔧 Using Mock API" message)
3. Try refreshing the page
4. Check that all script files are loading correctly

