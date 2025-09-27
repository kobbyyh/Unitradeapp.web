# Unitrade Web Platform - Troubleshooting Guide

## 🔧 Common Issues & Solutions

### Issue 1: "Start Selling" Button Goes to Dashboard Instead of Login

**Problem**: Clicking "Start Selling" takes you directly to the seller dashboard instead of the login page.

**Cause**: You have a user session already logged in from previous testing.

**Solution**: 
1. On the seller login page, click "Clear Session & Start Fresh" button
2. Or manually clear your browser's localStorage:
   - Open browser console (F12)
   - Type: `localStorage.clear()`
   - Press Enter
   - Refresh the page

### Issue 2: Favicon Not Showing

**Problem**: The Unitrade logo doesn't appear in the browser tab.

**Solution**: 
1. **Hard refresh** the page (Ctrl+F5 or Cmd+Shift+R)
2. **Clear browser cache**:
   - Chrome: Settings > Privacy > Clear browsing data
   - Firefox: Settings > Privacy > Clear Data
3. **Check if the image exists**: Navigate to `../assets/app_logo.png` in your browser

### Issue 3: Email Verification Link Not Working

**Problem**: Clicking the verification link doesn't work.

**Solution**:
1. **Copy the full link** from the alert popup
2. **Paste it in a new tab** (don't click it directly)
3. **Make sure you're using the same browser** where you signed up
4. **Check browser console** for any errors (F12)

### Issue 4: Login Not Working

**Problem**: Can't log in after creating an account.

**Solution**:
1. **Make sure you verified your email** first
2. **Use the exact email** you used during signup
3. **Clear session** and try again
4. **Check if account exists** in browser console:
   - F12 > Console
   - Type: `localStorage.getItem('currentUser')`
   - Press Enter

### Issue 5: Dashboard Access Denied

**Problem**: Getting redirected to login when trying to access dashboard.

**Solution**:
1. **Complete the signup process** first
2. **Verify your email** using the verification link
3. **Make sure you're logged in** (check localStorage)
4. **Use the correct user type** (buyer vs seller)

## 🧪 Testing Checklist

### Before Testing:
- [ ] Clear browser localStorage: `localStorage.clear()`
- [ ] Hard refresh all pages (Ctrl+F5)
- [ ] Check that `../assets/app_logo.png` exists

### Test Flow:
1. [ ] Go to home page
2. [ ] Click "Start Selling" → Should go to seller login page
3. [ ] Click "Start Buying" → Should go to buyer login page
4. [ ] Test signup process
5. [ ] Test email verification
6. [ ] Test login process
7. [ ] Test dashboard access

### Verify Fixes:
- [ ] Favicon shows on all pages
- [ ] "Start Selling" goes to login page
- [ ] "Start Buying" goes to login page
- [ ] Email verification works
- [ ] Login/logout works properly

## 🚨 Emergency Reset

If everything is broken, use this emergency reset:

```javascript
// Open browser console (F12) and run:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

This will clear all data and restart the application.

## 📞 Still Having Issues?

1. **Check browser console** for error messages (F12)
2. **Try a different browser** (Chrome, Firefox, Safari)
3. **Disable browser extensions** temporarily
4. **Check file paths** - make sure all files are in the correct locations

## 🔍 Debug Information

To help debug issues, check these in browser console:

```javascript
// Check if user is logged in
console.log('Logged in:', localStorage.getItem('isLoggedIn'));
console.log('User data:', localStorage.getItem('currentUser'));

// Check if files are loading
console.log('Page loaded:', document.title);
console.log('Favicon:', document.querySelector('link[rel="icon"]').href);
```

## ✅ Success Indicators

You know everything is working when:
- ✅ Favicon appears in browser tab
- ✅ "Start Selling" goes to seller login page
- ✅ "Start Buying" goes to buyer login page
- ✅ Signup creates account and shows verification link
- ✅ Verification link works and redirects to dashboard
- ✅ Login works with existing accounts
- ✅ Logout clears session and redirects to home
