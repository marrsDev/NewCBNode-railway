// cookieConsent.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking cookie consent status');
    
    // Check if user has already made a choice
    const cookieConsent = document.getElementById('cookie-consent');
    const consentGiven = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        console.error('Cookie consent banner element not found!');
        return;
    }
    
    // If no choice has been made, show the consent banner
    if (!consentGiven) {
        console.log('No consent decision found, showing banner');
        cookieConsent.style.display = 'block';
    } else {
        console.log('Consent already given:', consentGiven);
        cookieConsent.style.display = 'none';
        
        // If cookies were rejected, ensure cart cookie is cleared
        if (consentGiven === 'rejected') {
            console.log('Maintaining cookie rejection state');
            document.cookie = 'cartId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
    }
});

// Function to handle cookie acceptance - attached to window for global access
window.acceptCookies = function() {
    console.log('User accepted cookies');
    localStorage.setItem('cookieConsent', 'accepted');
    const cookieConsent = document.getElementById('cookie-consent');
    
    if (cookieConsent) {
        cookieConsent.style.display = 'none';
    }
    
    console.log('Cookies accepted - cart functionality enabled');
}

// Function to handle cookie rejection - attached to window for global access
window.rejectCookies = function() {
    console.log('User rejected cookies');
    localStorage.setItem('cookieConsent', 'rejected');
    const cookieConsent = document.getElementById('cookie-consent');
    
    if (cookieConsent) {
        cookieConsent.style.display = 'none';
    }
    
    // Clear any existing cookies if rejected
    document.cookie = 'cartId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log('Cookies rejected - cart cookie cleared');
}
