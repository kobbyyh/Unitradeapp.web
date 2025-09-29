# Quick Firebase Setup for Unitrade

## 🚀 Step-by-Step Setup (5 minutes)

### Step 1: Get Your Firebase Configuration
1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Select your project**: `unitrade-d74e9`
3. **Click the gear icon** (Project Settings)
4. **Scroll down to "Your apps"**
5. **Click on your web app** (or create one if you haven't)
6. **Copy the configuration object**

### Step 2: Update the Configuration
Replace the values in `firebase-config.js`:

```javascript
export const firebaseConfig = {
    apiKey: "AIzaSyB...", // Your actual API key
    authDomain: "unitrade-d74e9.firebaseapp.com",
    projectId: "unitrade-d74e9",
    storageBucket: "unitrade-d74e9.firebasestorage.app",
    messagingSenderId: "123456789012", // Your actual sender ID
    appId: "1:123456789012:web:abcdef..." // Your actual app ID
};
```

### Step 3: Enable Authentication
1. **In Firebase Console**, go to **"Authentication"**
2. **Click "Get started"**
3. **Go to "Sign-in method" tab**
4. **Enable "Email/Password"**
5. **Click "Save"**

### Step 4: Set Up Firestore
1. **Go to "Firestore Database"**
2. **Click "Create database"**
3. **Choose "Start in test mode"**
4. **Select a location**
5. **Click "Enable"**

## 🔧 What You Need to Provide

Please provide these values from your Firebase Console:

1. **API Key**: `apiKey: "AIzaSyB..."`
2. **Messaging Sender ID**: `messagingSenderId: "123456789012"`
3. **App ID**: `appId: "1:123456789012:web:abcdef..."`

## 📧 How Email Verification Will Work

### After Setup:
1. **User signs up** → Firebase creates account
2. **Firebase sends verification email** → User receives real email in inbox
3. **User clicks verification link** → Email gets verified
4. **User can login** → Access dashboard

### Before Setup (Current):
- Verification links show in browser popup
- No real emails are sent

## 🧪 Test the Setup

1. **Update `firebase-config.js`** with your actual values
2. **Open `buyer-signup.html`**
3. **Fill out the form and submit**
4. **Check your email inbox** for verification email
5. **Click the verification link**
6. **Try logging in**

## 🚨 Common Issues

### "Firebase: Error (auth/invalid-api-key)"
- **Solution**: Check your API key in the config
- **Check**: Make sure there are no extra spaces

### "Firebase: Error (auth/email-already-in-use)"
- **Solution**: User already exists, try logging in instead

### "Firebase: Error (auth/weak-password)"
- **Solution**: Password must be at least 6 characters

### Email verification not working
- **Check**: Spam folder
- **Check**: Firebase Authentication is enabled
- **Check**: Email/Password sign-in is enabled

## 📞 Need Help?

1. **Check Firebase Console** for error messages
2. **Open browser console** (F12) for detailed logs
3. **Verify all configuration values** are correct
4. **Make sure Authentication is enabled**

Once you provide the missing Firebase configuration values, I'll update all the files and the email verification will work properly!


