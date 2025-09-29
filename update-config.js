// Script to update all HTML files with secure configuration
const fs = require('fs');
const path = require('path');

const htmlFiles = [
    'seller-my-listings.html',
    'seller-notifications-dashboard.html',
    'seller-post-item.html',
    'buyer-orders.html',
    'seller-messages.html',
    'seller-profile-settings.html',
    'messages.html',
    'profile-settings.html',
    'email-verification.html',
    'seller-signup.html',
    'buyer-signup.html',
    'seller-login.html',
    'buyer-login.html',
    'index.html'
];

const secureConfigScript = '    <!-- Load secure configuration first -->\n    <script src="js/secure-config.js"></script>\n    \n';

const firebaseConfigTemplate = `        // Firebase configuration - Load from secure config
        const firebaseConfig = window.SECURE_CONFIG?.firebase || {
            apiKey: "YOUR_FIREBASE_API_KEY_HERE",
            authDomain: "your-project.firebaseapp.com",
            projectId: "your-project-id",
            storageBucket: "your-project.appspot.com",
            messagingSenderId: "your-sender-id",
            appId: "your-app-id",
            measurementId: "your-measurement-id"
        };`;

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add secure config script before Firebase SDK
        if (content.includes('<!-- Firebase SDK -->')) {
            content = content.replace('<!-- Firebase SDK -->', secureConfigScript + '<!-- Firebase SDK -->');
        }
        
        // Replace Firebase config
        const firebaseConfigRegex = /const firebaseConfig = \{[^}]+\};/s;
        if (firebaseConfigRegex.test(content)) {
            content = content.replace(firebaseConfigRegex, firebaseConfigTemplate);
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
});

console.log('All files updated successfully!');
