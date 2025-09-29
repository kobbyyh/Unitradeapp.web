// Twilio Configuration Template
// Copy this file to twilio-config-secure.js and add your actual API keys
const twilioConfig = {
    accountSid: "YOUR_TWILIO_ACCOUNT_SID_HERE",
    authToken: "YOUR_TWILIO_AUTH_TOKEN_HERE",
    whatsappFrom: "whatsapp:+14155238886"
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = twilioConfig;
} else {
    window.twilioConfig = twilioConfig;
}
