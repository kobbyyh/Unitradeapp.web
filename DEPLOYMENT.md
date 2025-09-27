# Unitrade Website - Vercel Deployment Guide

## 🚀 Quick Setup

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Install Dependencies
```bash
cd UnitradeWebsite
npm install
```

### 3. Set up Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `unitrade-d74e9`
3. Go to **Project Settings** > **Service Accounts**
4. Click **"Generate new private key"**
5. Download the JSON file
6. Copy the values to your environment variables

### 4. Environment Variables

Create a `.env.local` file with:
```env
FIREBASE_PROJECT_ID=unitrade-d74e9
FIREBASE_CLIENT_EMAIL=your-service-account-email@unitrade-d74e9.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### 5. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
vercel login
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set environment variables in Vercel dashboard
4. Deploy!

### 6. Update Your Frontend

Update your HTML files to use the new API:

```html
<!-- Add this to your HTML head -->
<script src="js/api-client.js"></script>

<!-- Example usage -->
<script>
// Create an order
async function createOrder() {
  try {
    const orderData = {
      buyerId: 'user123',
      sellerId: 'seller456',
      productId: 'product789',
      quantity: 2,
      totalPrice: 50.00,
      shippingAddress: '123 Main St, City, State'
    };
    
    const result = await api.createOrder(orderData);
    console.log('Order created:', result);
  } catch (error) {
    console.error('Error creating order:', error);
  }
}

// Get all orders
async function loadOrders() {
  try {
    const result = await api.getOrders();
    console.log('Orders:', result.orders);
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}
</script>
```

## 🔧 API Endpoints

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order (automatically creates notification for seller)
- `PUT /api/orders` - Update order status
- `DELETE /api/orders` - Delete order

### Notifications
- `GET /api/notifications?sellerId=ID` - Get notifications for a seller
- `POST /api/notifications` - Create new notification
- `PUT /api/notifications` - Mark notification as read
- `DELETE /api/notifications` - Delete notification

### Example API Calls

```javascript
// Get all orders
const orders = await api.getOrders();

// Create order
const newOrder = await api.createOrder({
  buyerId: 'user123',
  sellerId: 'seller456',
  productId: 'product789',
  quantity: 1,
  totalPrice: 25.00,
  shippingAddress: '123 Main St'
});

// Update order status
await api.updateOrderStatus('order123', 'shipped');

// Delete order
await api.deleteOrder('order123');

// Get notifications for a seller
const notifications = await api.getNotifications('seller456');

// Mark notification as read
await api.markNotificationAsRead('notification123');

// Delete notification
await api.deleteNotification('notification123');
```

## 🛠️ Development

### Local Development
```bash
vercel dev
```

This will start a local server at `http://localhost:3000`

### Testing
```bash
# Test the API locally
curl http://localhost:3000/api/orders
```

## 📝 Notes

- The backend uses Firebase Admin SDK for secure database access
- All API endpoints include CORS headers for cross-origin requests
- Orders are automatically timestamped when created
- The API returns consistent JSON responses with success/error status

## 🚨 Troubleshooting

### Common Issues:

1. **Firebase Authentication Error**
   - Check your service account credentials
   - Ensure environment variables are set correctly

2. **CORS Issues**
   - The API includes CORS headers, but make sure you're calling from the correct domain

3. **Order Not Found**
   - Check if the order ID exists in Firebase
   - Verify the order collection name matches

### Support
If you encounter issues, check the Vercel function logs in your dashboard.
