# Secure Deployment Guide

## 🔒 Security Overview

### ✅ What's Public (Safe to expose):
- **Firebase API Key**: `AIzaSyBzyKtEKbUMt66t9Sfk_onbOcJNic_t5oc`
- **Firebase Project ID**: `unitrade-d74e9`
- **Firebase Auth Domain**: `unitrade-d74e9.firebaseapp.com`

### 🔐 What's Private (Never expose):
- **Twilio Account SID**: `ACb030224630e5dd82978f5c6f6ab9a190`
- **Twilio Auth Token**: `68e2d7d09d69f2c2c43a0c7e750e4986`
- **Twilio WhatsApp From**: `whatsapp:+14155238886`

## 🚀 Deployment Steps

### 1. Make Repository Public
- Go to GitHub repository settings
- Change visibility to **Public**
- This enables GitHub Pages

### 2. Set Up Backend Server (For Twilio)
You need to deploy the backend server separately to handle Twilio:

#### Option A: Deploy to Railway/Render/Heroku
1. Create account on Railway, Render, or Heroku
2. Connect your GitHub repository
3. Set environment variables:
   ```
   TWILIO_ACCOUNT_SID=ACb030224630e5dd82978f5c6f6ab9a190
   TWILIO_AUTH_TOKEN=68e2d7d09d69f2c2c43a0c7e750e4986
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   ```
4. Deploy the `api/` folder

#### Option B: Use Vercel Functions
1. Deploy to Vercel
2. Add environment variables in Vercel dashboard
3. Update frontend to use Vercel API endpoints

### 3. Update Frontend API URL
In `js/twilio-whatsapp-service.js`, change:
```javascript
this.apiBaseUrl = 'https://your-backend-url.com/api';
```

### 4. Deploy Frontend
- GitHub Pages will automatically deploy from the public repository
- Your site will be available at: `https://kobbyyh.github.io/Unitrade-Web/`

## 🛡️ Security Features

### Firebase Security Rules
- Items: Public read, authenticated write
- Users: Only access own data
- Orders: Only access own orders
- Notifications: Only access own notifications

### Backend Security
- Twilio credentials stored in environment variables
- No sensitive data in frontend code
- API endpoints protected by CORS

## 📁 File Structure
```
UnitradeWebsite/
├── js/
│   ├── firebase-config-public.js  ✅ Safe to commit
│   └── twilio-whatsapp-service.js ✅ Safe to commit
├── api/
│   ├── twilio-whatsapp.js         ✅ Safe to commit
│   ├── config.env                 ❌ Never commit (in .gitignore)
│   └── env-example.txt            ✅ Safe to commit
└── .gitignore                     ✅ Excludes sensitive files
```

## 🔧 Local Development
1. Copy `api/env-example.txt` to `api/config.env`
2. Add your real Twilio credentials to `config.env`
3. Run backend: `cd api && node twilio-whatsapp.js`
4. Open frontend in browser

## ✅ Security Checklist
- [ ] Repository is public (for GitHub Pages)
- [ ] Firebase API keys are in public config
- [ ] Twilio credentials are in backend only
- [ ] Backend server is deployed separately
- [ ] Environment variables are set on backend
- [ ] Frontend points to deployed backend
- [ ] Firebase Security Rules are configured
