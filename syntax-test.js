// Test the JavaScript syntax from buyer-dashboard.html
async function initializeApp() {
    // Firebase configuration - Load from public config
    const firebaseConfig = window.FIREBASE_CONFIG;

    // Initialize Firebase safely
    let app, auth, db;
    try {
        const firebaseInit = await window.initializeFirebase(firebaseConfig);
        app = firebaseInit.app;
        auth = firebaseInit.auth;
        db = firebaseInit.db;
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        document.getElementById('productsContainer').innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">Firebase Error</h3>
                <p class="text-gray-500">Failed to initialize Firebase: ${error.message}</p>
            </div>
        `;
        return;
    }

    // Check if Firebase initialized successfully
    if (!auth || !db) {
        console.error('Firebase not initialized properly');
        return;
    }

    // Check authentication state
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log('User is signed in:', user);
            
            // Check if email is verified (temporarily disabled for testing)
            // if (!user.emailVerified) {
            //     alert('Please verify your email before accessing the dashboard. Check your inbox for the verification link.');
            //     window.location.href = 'email-verification.html';
            //     return;
            // }
            
            await loadUserData(user);
            loadProducts();
        } else {
            console.log('User is signed out');
            window.location.href = 'buyer-login.html';
        }
    });

    // Load user data
    async function loadUserData(user) {
        // Get user data from Firestore to get the actual name
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', user.email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                document.getElementById('userName').textContent = userData.name || user.displayName || 'Buyer';
            } else {
                document.getElementById('userName').textContent = user.displayName || 'Buyer';
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            document.getElementById('userName').textContent = user.displayName || 'Buyer';
        }
    }

    // Load products from Firestore
    async function loadProducts() {
        try {
            console.log('🔄 Loading products from Firestore...');
            console.log('Database reference:', db);
            
            // Load all items first without filters to see what's in the database
            const productsRef = collection(db, 'items');
            const allItemsSnapshot = await getDocs(productsRef);
            console.log('Total items in database:', allItemsSnapshot.size);
            
            const productsContainer = document.getElementById('productsContainer');
            productsContainer.innerHTML = '';

            if (allItemsSnapshot.empty) {
                console.log('No items found in database');
                productsContainer.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-600 mb-2">No items available</h3>
                        <p class="text-gray-500">Check back later for new listings!</p>
                    </div>
                `;
                return;
            }

            // Log all items to see their structure
            allItemsSnapshot.forEach((doc) => {
                const product = doc.data();
                console.log('Item in database:', doc.id, product);
            });

            // Filter items manually for now
            const availableItems = [];
            allItemsSnapshot.forEach((doc) => {
                const product = doc.data();
                // Check if item is available and not sold
                if (product.isAvailable !== false && product.isSold !== true) {
                    availableItems.push({ id: doc.id, ...product });
                }
            });

            console.log('Available items after filtering:', availableItems.length);

            if (availableItems.length === 0) {
                console.log('No available items found after filtering');
                productsContainer.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-600 mb-2">No items available</h3>
                        <p class="text-gray-500">Check back later for new listings!</p>
                    </div>
                `;
                return;
            }

            // Display the available items
            availableItems.forEach((product) => {
                console.log('Processing product:', product);
                const productCard = createProductCard(product, product.id);
                productsContainer.appendChild(productCard);
            });
            
            console.log('Products loaded successfully');
        } catch (error) {
            console.error('Error loading products:', error);
            const productsContainer = document.getElementById('productsContainer');
            productsContainer.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">Error loading products</h3>
                    <p class="text-gray-500">Error: ${error.message}</p>
                </div>
            `;
        }
    }

    // Create product card
    function createProductCard(product, productId) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 cursor-pointer';
        card.onclick = () => window.location.href = `product-details.html?id=${productId}`;
        
        // Handle images
        let imageHtml = '';
        if (product.imageUrls && product.imageUrls.length > 0) {
            imageHtml = `<img src="${product.imageUrls[0]}" alt="${product.title}" class="w-full h-48 object-cover rounded-lg mb-4">`;
        } else if (product.imageUrl) {
            imageHtml = `<img src="${product.imageUrl}" alt="${product.title}" class="w-full h-48 object-cover rounded-lg mb-4">`;
        } else {
            imageHtml = `<div class="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center"><i class="fas fa-image text-4xl text-gray-400"></i></div>`;
        }
        
        card.innerHTML = `
            ${imageHtml}
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${product.title || 'Untitled Item'}</h3>
            <p class="text-sm text-gray-500 mb-2">${product.category || 'Uncategorized'}</p>
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description || 'No description available'}</p>
            <div class="flex justify-between items-center">
                <span class="text-xl font-bold text-teal-600">GHS ${product.price || 0}</span>
                <span class="text-sm text-gray-500">${product.paymentMethod || 'Momo'}</span>
            </div>
        `;
        
        return card;
    }

    // Show all products
    function showAllProducts() {
        const productCards = document.querySelectorAll('#productsContainer > div');
        productCards.forEach(card => {
            card.style.display = 'block';
        });
    }
    
    // Filter products by specific category
    function filterProductsByCategory(category) {
        const productCards = document.querySelectorAll('#productsContainer > div');
        
        productCards.forEach(card => {
            const categoryElement = card.querySelector('.text-sm.text-gray-500');
            if (categoryElement && categoryElement.textContent === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Start the application
initializeApp();
