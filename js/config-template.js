// Configuration Template - This file WILL be committed to GitHub
// Copy this to secure-config.js and add your actual API keys

window.SECURE_CONFIG = {
    firebase: {
        apiKey: "YOUR_FIREBASE_API_KEY_HERE",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "your-sender-id",
        appId: "your-app-id",
        measurementId: "your-measurement-id"
    },
    twilio: {
        accountSid: "YOUR_TWILIO_ACCOUNT_SID_HERE",
        authToken: "YOUR_TWILIO_AUTH_TOKEN_HERE",
        whatsappFrom: "whatsapp:+14155238886"
    }
};
