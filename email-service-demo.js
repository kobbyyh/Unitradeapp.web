// Demo Email Service for Unitrade Web Platform
// This version shows verification links in alerts for immediate testing
// Use email-service.js for production with real email sending

class EmailService {
    constructor() {
        console.log('Using demo email service - emails will be shown in alerts');
    }

    // Send verification email (demo version)
    async sendVerificationEmail(userEmail, userName, verificationLink) {
        try {
            console.log('Sending verification email to:', userEmail);
            console.log('Verification link:', verificationLink);
            
            // Simulate email sending delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show verification link in alert for demo
            alert(`📧 DEMO MODE: Email would be sent to ${userEmail}\n\nVerification Link:\n${verificationLink}\n\nClick the link above to verify your email.`);
            
            console.log('Demo verification email sent successfully!');
            return { success: true };
            
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw error;
        }
    }

    // Generate verification link
    generateVerificationLink(userId, userEmail) {
        const baseUrl = window.location.origin;
        const verificationToken = this.generateToken(userId, userEmail);
        return `${baseUrl}/verify-email.html?token=${verificationToken}&email=${encodeURIComponent(userEmail)}`;
    }

    // Generate a simple verification token
    generateToken(userId, userEmail) {
        const timestamp = Date.now();
        const data = `${userId}-${userEmail}-${timestamp}`;
        return btoa(data); // Base64 encode
    }

    // Verify token
    verifyToken(token, email) {
        try {
            const decoded = atob(token);
            const parts = decoded.split('-');
            const tokenEmail = parts[1];
            const timestamp = parseInt(parts[2]);
            
            // Check if token is not older than 24 hours
            const now = Date.now();
            const tokenAge = now - timestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (tokenAge > maxAge) {
                return { valid: false, error: 'Token expired' };
            }
            
            if (tokenEmail !== email) {
                return { valid: false, error: 'Invalid token' };
            }
            
            return { valid: true, userId: parts[0] };
        } catch (error) {
            return { valid: false, error: 'Invalid token format' };
        }
    }
}

// Create global instance
window.emailService = new EmailService();


