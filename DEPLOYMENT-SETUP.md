# 🚀 Deployment Setup Guide

## ⚠️ **IMPORTANT: Before Deploying**

### **1. Set Up Real Credentials**

After cloning the repository, you need to set up your real API credentials:

#### **A. Create Environment File**
Create `config.env` in the root directory:
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

#### **B. Create Secure Config File**
Create `js/secure-config.js`:
```javascript
window.SECURE_CONFIG = {
    firebase: {
        apiKey: "AIzaSyBzyKtEKbUMt66t9Sfk_onbOcJNic_t5oc",
        authDomain: "unitrade-d74e9.firebaseapp.com",
        projectId: "unitrade-d74e9",
        storageBucket: "unitrade-d74e9.appspot.com",
        messagingSenderId: "619229942843",
        appId: "1:619229942843:web:8eced8b46057a24b04f81e",
        measurementId: "G-6DPM2BCY97"
    },
    twilio: {
        accountSid: "YOUR_TWILIO_ACCOUNT_SID_HERE",
        authToken: "YOUR_TWILIO_AUTH_TOKEN_HERE",
        whatsappFrom: "whatsapp:+14155238886"
    }
};
```

### **2. Start the Backend**
```bash
cd api
node twilio-whatsapp.js
```

### **3. Open the Website**
Open `index.html` in your browser or serve it with a local server.

---

## 🔐 **Security Notes**

- ✅ **No credentials in GitHub** - All sensitive data is in local files
- ✅ **Environment variables** - Backend uses config.env
- ✅ **Secure config** - Frontend uses secure-config.js
- ✅ **GitHub protection** - Push protection prevents accidental exposure

---

## 📁 **Files Structure**

```
UnitradeWebsite/
├── js/
│   ├── secure-config.js          # Real API keys (NOT in GitHub)
│   └── config-template.js        # Template (in GitHub)
├── api/
│   └── twilio-whatsapp.js        # Backend with placeholders
├── config.env                    # Real credentials (NOT in GitHub)
└── .gitignore                    # Excludes sensitive files
```

---

## 🚀 **Ready to Deploy!**

The repository is now safe to push to GitHub with no exposed credentials!
