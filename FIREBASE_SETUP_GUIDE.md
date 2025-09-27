# Firebase Setup Guide for Unitrade Web Platform

## 🚀 Quick Setup (10 minutes)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "Unitrade Web"
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### Step 3: Set Up Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Enable"

### Step 4: Get Firebase Configuration
1. Go to "Project Settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (`</>`)
4. Enter app nickname: "Unitrade Web"
5. Click "Register app"
6. **Copy the Firebase configuration object**

### Step 5: Update Configuration in Code
Replace the placeholder config in these files:
- `buyer-signup.html`
- `seller-signup.html`
- `buyer-login.html`
- `seller-login.html`
- `email-verification.html`
- `buyer-dashboard.html`
- `seller-dashboard.html`

```javascript
// Replace this placeholder:
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// With your actual Firebase config:
const firebaseConfig = {
    apiKey: "AIzaSyB...",
    authDomain: "unitrade-web-12345.firebaseapp.com",
    projectId: "unitrade-web-12345",
    storageBucket: "unitrade-web-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

## 🔧 Detailed Configuration

### Authentication Setup
1. **Email/Password**: Already enabled
2. **Email Verification**: Automatically enabled
3. **Password Reset**: Automatically enabled

### Firestore Security Rules
Replace the default rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all authenticated users
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        resource.data.sellerId == request.auth.uid;
    }
    
    // Orders are readable by buyer and seller
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.buyerId == request.auth.uid || 
         resource.data.sellerId == request.auth.uid);
    }
  }
}
```

### Email Templates (Optional)
1. Go to "Authentication" → "Templates"
2. Customize email verification template
3. Add your branding and custom message

## 🧪 Testing the Setup

### Test 1: Signup Flow
1. Open `buyer-signup.html`
2. Fill out the form
3. Submit the form
4. **Check your email inbox** for verification email
5. Click the verification link
6. Should redirect to buyer dashboard

### Test 2: Login Flow
1. Go to `buyer-login.html`
2. Enter email and password
3. Click "Login"
4. Should redirect to buyer dashboard

### Test 3: Email Verification
1. After signup, check email inbox
2. Look for email from Firebase
3. Click "Verify email" button
4. Should redirect to dashboard

## 🚨 Troubleshooting

### Common Issues:

#### 1. "Firebase: Error (auth/invalid-api-key)"
- **Solution**: Check your API key in Firebase config
- **Check**: Make sure there are no extra spaces or quotes

#### 2. "Firebase: Error (auth/email-already-in-use)"
- **Solution**: User already exists, try logging in instead
- **Check**: Use the login page instead of signup

#### 3. "Firebase: Error (auth/weak-password)"
- **Solution**: Password must be at least 6 characters
- **Check**: Update password validation in forms

#### 4. "Firebase: Error (auth/user-not-found)"
- **Solution**: User doesn't exist, sign up first
- **Check**: Use signup page to create account

#### 5. Email verification not working
- **Check**: Spam folder
- **Check**: Firebase Authentication settings
- **Check**: Email templates in Firebase Console

### Debug Mode:
Add this to your browser console to see detailed logs:
```javascript
// Enable Firebase debug mode
localStorage.setItem('firebase:debug', '*');
```

## 📧 Email Verification Flow

### How it works:
1. **User signs up** → Firebase creates account
2. **Firebase sends email** → User receives verification email
3. **User clicks link** → Firebase verifies email
4. **User logs in** → Can access dashboard

### Email Content:
Firebase sends emails with this structure:
```
Subject: Verify your email for Unitrade Web

Hello [User Name],

Please verify your email address by clicking the link below:

[Verify Email Button]

If you didn't create an account, you can ignore this email.

Best regards,
The Unitrade Team
```

## 🔒 Security Best Practices

1. **Use HTTPS**: Always serve your website over HTTPS
2. **Set up proper Firestore rules**: Don't use test mode in production
3. **Enable App Check**: Add App Check for additional security
4. **Monitor usage**: Check Firebase Console for unusual activity
5. **Regular backups**: Set up Firestore backups

## 📱 Mobile Considerations

- **Email clients**: Test on different email apps
- **Link handling**: Ensure verification links work on mobile
- **Responsive design**: Make sure forms work on mobile

## 🎯 Production Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Security rules configured
- [ ] Firebase config updated in all files
- [ ] Email verification tested
- [ ] Login flow tested
- [ ] Dashboard access tested
- [ ] HTTPS enabled
- [ ] Domain added to authorized domains

## 📞 Support

- **Firebase Documentation**: [https://firebase.google.com/docs](https://firebase.google.com/docs)
- **Firebase Support**: [https://firebase.google.com/support](https://firebase.google.com/support)
- **Unitrade Issues**: Check the troubleshooting guide

## 🚀 Quick Start Commands

```bash
# 1. Create Firebase project at console.firebase.google.com
# 2. Enable Authentication and Firestore
# 3. Get Firebase config
# 4. Update all HTML files with your config
# 5. Test the complete flow!
```

Once configured, users will receive real verification emails from Firebase and the complete authentication flow will work properly!

