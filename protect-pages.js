// Script to add authentication guards to all protected pages
// Run this to automatically protect all pages

const protectedPages = [
    // Buyer pages
    'buyer-dashboard.html',
    'buyer-orders.html',
    'profile-settings.html',
    
    // Seller pages
    'seller-dashboard.html',
    'seller-my-listings.html',
    'seller-post-item.html',
    'seller-profile-settings.html',
    'seller-notifications-dashboard.html',
    
    // Feature pages
    'product-details.html',
    'messages.html'
];

// Function to add auth guard to a page
function addAuthGuardToPage(pagePath, userType) {
    console.log(`Adding auth guard to ${pagePath} for ${userType}`);
    
    // This would be implemented by modifying each file
    // For now, we'll do it manually for each page
}

// Export for manual use
window.protectedPages = protectedPages;
