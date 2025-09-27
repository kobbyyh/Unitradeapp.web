# Firebase Setup Guide for Unitrade Web

This guide will help you set up Firebase authentication and Firestore database for the Unitrade web platform.

## Prerequisites

1. A Google account
2. Access to Firebase Console
3. Your Flutter app's Firebase project (if you want to use the same project)

## Step 1: Firebase Project Setup

### Option A: Use Existing Flutter Project
If you already have a Firebase project for your Flutter app:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your existing project
3. Skip to Step 2

### Option B: Create New Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "Unitrade" (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Click on **Email/Password**
3. Enable the first option: "Email/Password"
4. Click **Save**

## Step 3: Set up Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (you can change rules later)
4. Select a location close to your users
5. Click **Done**

## Step 4: Configure Security Rules

1. In Firestore Database, go to **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products can be read by authenticated users, written by sellers
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || resource.data.sellerId == request.auth.uid);
    }
    
    // Universities collection (read-only for authenticated users)
    match /universities/{universityId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write
    }
  }
}
```

3. Click **Publish**

## Step 5: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Add app** and select **Web** (</> icon)
4. Enter app nickname: "Unitrade Web"
5. Check "Also set up Firebase Hosting" (optional)
6. Click **Register app**
7. Copy the configuration object

## Step 6: Update Configuration in Code

Replace the Firebase configuration in all HTML files:

1. Open each HTML file that uses Firebase
2. Find the `firebaseConfig` object
3. Replace with your actual configuration:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "your-actual-app-id"
};
```

## Step 7: Test the Integration

1. Open `index.html` in a web browser
2. Try creating a new account
3. Check if the user appears in Firebase Authentication
4. Check if user data appears in Firestore Database

## Step 8: Set up Email Templates (Optional)

1. Go to **Authentication** > **Templates**
2. Customize the email verification template
3. Add your branding and messaging

## Step 9: Configure CORS (If needed)

If you encounter CORS issues:
1. Go to **Authentication** > **Settings** > **Authorized domains**
2. Add your domain (e.g., `localhost` for development)
3. Add your production domain when ready

## Data Structure

The web app expects the following Firestore collections:

### Users Collection
```javascript
{
  uid: "firebase-user-id",
  fullName: "John Doe",
  email: "john@university.edu",
  userType: "buyer" | "seller",
  studentId: "12345678", // for buyers
  username: "johndoe", // for sellers
  schoolID: "12345678", // for sellers
  phone: "+1234567890",
  hostel: "Hostel A", // for sellers
  emailVerified: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Products Collection
```javascript
{
  title: "Product Title",
  description: "Product description",
  price: 25.00,
  category: "Books",
  status: "active" | "pending" | "sold",
  sellerId: "firebase-user-id",
  imageUrl: "https://...",
  views: 0,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Troubleshooting

### Common Issues:

1. **CORS Error**: Add your domain to authorized domains in Firebase Console
2. **Permission Denied**: Check Firestore security rules
3. **User Not Found**: Ensure user data is saved to Firestore after registration
4. **Email Not Sending**: Check spam folder, verify email templates

### Debug Mode:
- Open browser developer tools
- Check console for error messages
- Verify Firebase configuration is correct

## Next Steps

1. Set up Firebase Hosting for production deployment
2. Configure custom domain
3. Set up monitoring and analytics
4. Implement additional features like image upload to Firebase Storage

## Support

For Firebase-specific issues, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
