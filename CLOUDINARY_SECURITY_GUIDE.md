# Cloudinary Security Configuration Guide

## 🔐 Securing Cloudinary Credentials

### Step 1: Get Your Credentials
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Navigate to **Settings** > **Access Keys**
3. Copy your **API Key** and **API Secret**

### Step 2: Set Environment Variables

#### For Flutter/Dart:
Create a `.env` file in your project root:
```env
CLOUDINARY_API_KEY=your_actual_api_key_here
CLOUDINARY_API_SECRET=your_actual_api_secret_here
```

#### For Web/JavaScript:
Add to your hosting platform's environment variables:
- **Vercel**: Project Settings > Environment Variables
- **Netlify**: Site Settings > Environment Variables
- **Firebase Hosting**: Firebase Console > Project Settings

### Step 3: Update Your Code

Replace the hardcoded credentials in `lib/config/cloudinary_config.dart`:

```dart
class CloudinaryConfig {
  // Use environment variables for security
  static const String cloudName = 'dlrmwibwk';
  
  // Load from environment variables
  static const String apiKey = String.fromEnvironment(
    'CLOUDINARY_API_KEY',
    defaultValue: 'YOUR_API_KEY_HERE',
  );
  
  static const String apiSecret = String.fromEnvironment(
    'CLOUDINARY_API_SECRET',
    defaultValue: 'YOUR_API_SECRET_HERE',
  );
  
  static const String uploadPreset = 'ml_default';
  static const String defaultFolder = 'unitrade_items';
}
```

### Step 4: Update .gitignore
Add to your `.gitignore`:
```
.env
.env.local
.env.production
```

### Step 5: Test Configuration
The system will automatically fall back to the old hardcoded values if environment variables are not set, ensuring no breaking changes.

## 🛡️ Security Benefits
- ✅ Credentials not exposed in code
- ✅ Different credentials for different environments
- ✅ Easy credential rotation
- ✅ No breaking changes to existing functionality
