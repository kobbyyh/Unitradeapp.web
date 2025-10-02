class CloudinaryConfig {
  // Use environment variables for security
  // These will be loaded from .env file or environment
  
  // Your cloud name (this is public and safe)
  static const String cloudName = 'dlrmwibwk';
  
  // API Key - Load from environment variable
  static const String apiKey = String.fromEnvironment(
    'CLOUDINARY_API_KEY',
    defaultValue: 'YOUR_API_KEY_HERE', // Fallback for development
  );
  
  // API Secret - Load from environment variable
  static const String apiSecret = String.fromEnvironment(
    'CLOUDINARY_API_SECRET',
    defaultValue: 'YOUR_API_SECRET_HERE', // Fallback for development
  );
  
  // Upload Preset - This can be public for unsigned uploads
  static const String uploadPreset = 'ml_default';
  
  // Folder name for organizing uploads
  static const String defaultFolder = 'unitrade_items';
  
  // Validate configuration
  static bool get isConfigured {
    return apiKey != 'YOUR_API_KEY_HERE' && 
           apiSecret != 'YOUR_API_SECRET_HERE';
  }
  
  // Get configuration status for debugging
  static Map<String, dynamic> get configStatus {
    return {
      'cloudName': cloudName,
      'apiKey': apiKey.substring(0, 8) + '...', // Show only first 8 chars
      'apiSecret': apiSecret.substring(0, 8) + '...', // Show only first 8 chars
      'uploadPreset': uploadPreset,
      'isConfigured': isConfigured,
    };
  }
}
