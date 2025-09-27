// Email Service for Unitrade Web Platform
// This service handles email verification and other email communications

class EmailService {
    constructor() {
        // EmailJS configuration - Replace with your actual EmailJS credentials
        this.serviceId = 'service_unitrade'; // Replace with your EmailJS service ID
        this.templateId = 'template_verification'; // Replace with your EmailJS template ID
        this.publicKey = 'your-emailjs-public-key'; // Replace with your EmailJS public key
        
        // Initialize EmailJS
        this.initializeEmailJS();
    }

    // Initialize EmailJS
    initializeEmailJS() {
        // Load EmailJS script if not already loaded
        if (typeof emailjs === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => {
                emailjs.init(this.publicKey);
            };
            document.head.appendChild(script);
        } else {
            emailjs.init(this.publicKey);
        }
    }

    // Send verification email using EmailJS
    async sendVerificationEmail(userEmail, userName, verificationLink) {
        try {
            console.log('Sending verification email to:', userEmail);
            console.log('Verification link:', verificationLink);
            
            // Wait for EmailJS to be ready
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS not loaded yet. Please try again.');
            }

            // Prepare email template parameters
            const templateParams = {
                to_email: userEmail,
                to_name: userName,
                verification_link: verificationLink,
                from_name: 'Unitrade Team',
                app_name: 'Unitrade',
                current_year: new Date().getFullYear()
            };

            // Send email using EmailJS
            const response = await emailjs.send(
                this.serviceId,
                this.templateId,
                templateParams
            );

            console.log('Verification email sent successfully!', response);
            return { success: true, response };
            
        } catch (error) {
            console.error('Error sending verification email:', error);
            
            // Fallback: Show the verification link in alert if email fails
            const fallbackMessage = `Email service temporarily unavailable.\n\nPlease use this verification link:\n${verificationLink}`;
            alert(fallbackMessage);
            
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
