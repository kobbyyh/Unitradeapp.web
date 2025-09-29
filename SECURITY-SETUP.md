# Security Setup Instructions

## ⚠️ IMPORTANT: Before pushing to GitHub

### 1. Create Environment File
Create a `.env` file in the root directory with your actual credentials:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_actual_firebase_api_key
FIREBASE_AUTH_DOMAIN=unitrade-d74e9.firebaseapp.com
FIREBASE_PROJECT_ID=unitrade-d74e9
FIREBASE_STORAGE_BUCKET=unitrade-d74e9.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_actual_twilio_account_sid
TWILIO_AUTH_TOKEN=your_actual_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### 2. Update All HTML Files
Replace hardcoded Firebase configs with:
```javascript
// Replace this in all HTML files:
const firebaseConfig = {
    apiKey: "AIzaSyBzyKtEKbUMt66t9Sfk_onbOcJNic_t5oc",
    // ... other config
};

// With this:
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "your_fallback_key",
    // ... other config
};
```

### 3. Update Backend
Update `api/twilio-whatsapp.js` to use environment variables:
```javascript
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
```

### 4. Files to Update
- All HTML files with Firebase config
- `api/twilio-whatsapp.js`
- `js/unified-notification-service.js`

### 5. Test Before Push
- Ensure all API keys are in environment variables
- Test that the app still works
- Verify no sensitive data is in the code

## Current Status: ⚠️ NOT READY FOR GITHUB
All API keys are currently hardcoded and exposed!