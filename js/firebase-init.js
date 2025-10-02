// Firebase Initialization Utility
// This prevents duplicate Firebase app initialization errors

window.firebaseUtils = {
    initialized: false,
    app: null,
    auth: null,
    db: null
};

// Initialize Firebase safely
window.initializeFirebase = async function(firebaseConfig) {
    if (window.firebaseUtils.initialized && window.firebaseUtils.app) {
        return {
            app: window.firebaseUtils.app,
            auth: window.firebaseUtils.auth,
            db: window.firebaseUtils.db
        };
    }

    try {
        // Try to get existing app first
        const { getApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const app = getApp();
        
        // Get auth and db from existing app
        const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const auth = getAuth(app);
        const db = getFirestore(app);
        
        // Store references
        window.firebaseUtils.app = app;
        window.firebaseUtils.auth = auth;
        window.firebaseUtils.db = db;
        window.firebaseUtils.initialized = true;
        
        return { app, auth, db };
        
    } catch (error) {
        // No existing app, create new one
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        
        // Store references
        window.firebaseUtils.app = app;
        window.firebaseUtils.auth = auth;
        window.firebaseUtils.db = db;
        window.firebaseUtils.initialized = true;
        
        return { app, auth, db };
    }
};









