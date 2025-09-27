# Quick Email Setup for Unitrade

## 🚀 Current Status: DEMO MODE

**Right now**: Verification links are shown in alert popups (demo mode)  
**To fix**: Set up EmailJS to send real emails to user inboxes

## ⚡ Quick Fix (2 minutes)

### Option 1: Use Demo Mode (Immediate)
- **Current setup**: Already working with demo mode
- **What happens**: Users see verification link in alert popup
- **Good for**: Testing the platform immediately

### Option 2: Set Up Real Emails (5 minutes)

1. **Go to [EmailJS.com](https://www.emailjs.com/)**
2. **Sign up for free account**
3. **Create email service** (Gmail/Outlook)
4. **Create email template** (copy from EMAILJS_SETUP.md)
5. **Get your credentials**:
   - Service ID
   - Template ID  
   - Public Key
6. **Update `email-service.js`** with your credentials
7. **Change script references** from `email-service-demo.js` to `email-service.js`

## 🔄 How to Switch to Real Emails

### Step 1: Update Script References
In these files, change:
```html
<!-- FROM: -->
<script src="email-service-demo.js"></script>

<!-- TO: -->
<script src="email-service.js"></script>
```

Files to update:
- `buyer-signup.html`
- `seller-signup.html` 
- `email-verification.html`

### Step 2: Configure EmailJS
1. Open `email-service.js`
2. Replace these values:
   ```javascript
   this.serviceId = 'your-service-id';
   this.templateId = 'your-template-id';
   this.publicKey = 'your-public-key';
   ```

### Step 3: Test
1. Sign up for a new account
2. Check your email inbox
3. Click the verification link

## 📧 What Users Will See

### Demo Mode (Current):
```
Account created successfully!

A verification email has been sent to user@email.com.

Please check your inbox and click the verification link to complete your registration.

[Alert popup shows the actual verification link]
```

### Real Email Mode (After setup):
```
Account created successfully!

A verification email has been sent to user@email.com.

Please check your inbox and click the verification link to complete your registration.

[User receives actual email in their inbox]
```

## 🎯 Benefits of Real Email Setup

✅ **Professional**: Users get real emails in their inbox  
✅ **Reliable**: No need to copy links from popups  
✅ **Secure**: Verification links are sent privately  
✅ **User-friendly**: Standard email verification flow  
✅ **Scalable**: Works for any number of users  

## 🚨 Troubleshooting

### If emails still show in alerts:
1. **Check**: Are you using `email-service-demo.js`?
2. **Fix**: Switch to `email-service.js` and configure EmailJS

### If EmailJS setup fails:
1. **Fallback**: Keep using demo mode for testing
2. **Alternative**: Use a different email service
3. **Help**: Check EMAILJS_SETUP.md for detailed instructions

## 📋 Quick Checklist

- [ ] Platform works in demo mode ✅
- [ ] EmailJS account created
- [ ] Email service configured  
- [ ] Email template created
- [ ] Credentials updated in code
- [ ] Script references changed
- [ ] Real emails tested

## 🎉 Success!

Once configured, users will receive verification emails like this:

```
Subject: Verify Your Unitrade Account

Hello John Doe,

Welcome to Unitrade! Please verify your email address to complete your registration.

Click the link below to verify your account:
https://yourwebsite.com/verify-email.html?token=abc123&email=john@email.com

This link will expire in 24 hours.

Best regards,
Unitrade Team
```

The platform is now ready for production use with real email verification!

