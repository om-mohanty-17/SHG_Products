// ==========================================
// Product Data
// ==========================================
const productsData = [
    {
        id: 1,
        name: "Handwoven Cotton Saree",
        category: "textiles",
        categoryDisplay: "Textiles & Garments",
        price: 1899,
        description: "Beautiful handwoven cotton saree with traditional patterns. Made by skilled artisans from rural communities. Each piece is unique and tells a story of craftsmanship passed down through generations.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=500&fit=crop",
        badge: "Bestseller"
    },
    {
        id: 2,
        name: "Terracotta Pottery Set",
        category: "handicrafts",
        categoryDisplay: "Handicrafts",
        price: 849,
        description: "Handcrafted terracotta pottery set including plates, bowls, and cups. Made using traditional methods and natural clay. Perfect for sustainable dining and adds rustic charm to your home.",
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop",
        badge: "Eco-Friendly"
    },
    {
        id: 3,
        name: "Organic Honey Jar",
        category: "food",
        categoryDisplay: "Food Products",
        price: 450,
        description: "Pure organic honey collected from local beekeepers. Rich in natural nutrients and free from additives. Supports sustainable beekeeping practices and local communities.",
        image: "https://5.imimg.com/data5/SELLER/Default/2024/6/426310461/YB/NW/PA/183776947/whatsapp-image-2024-06-10-at-22-16-06-1-1-500x500.jpeg",
        badge: "Organic"
    },
    {
        id: 4,
        name: "Natural Soap Collection",
        category: "beauty",
        categoryDisplay: "Beauty & Wellness",
        price: 599,
        description: "Set of 4 handmade natural soaps with essential oils. Free from harmful chemicals and perfect for sensitive skin. Made using traditional cold-press methods by women artisans.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwixjLYtozWaMW7TxftFnIvkLa-66tG_q39w&s&fit=crop",
        badge: "Handmade"
    },
    {
        id: 5,
        name: "Bamboo Home Decor Set",
        category: "decor",
        categoryDisplay: "Home Decor",
        price: 1250,
        description: "Elegant bamboo home decor set including photo frames, coasters, and decorative pieces. Sustainable and stylish additions to your living space.",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&h=500&fit=crop",
        badge: "Sustainable"
    },
    {
        id: 6,
        name: "Traditional Embroidered Dupatta",
        category: "textiles",
        categoryDisplay: "Textiles & Garments",
        price: 799,
        description: "Beautiful embroidered dupatta with intricate traditional designs. Perfect accessory to complement ethnic wear. Each piece showcases the skill of our talented artisans.",
        image: "https://assets0.mirraw.com/images/6585003/5bee58a654d2d95a3d4e037e_zoom.jpg?1544111291&fit=crop",
        badge: "New"
    },
    {
        id: 7,
        name: "Jute Shopping Bags (Set of 3)",
        category: "handicrafts",
        categoryDisplay: "Handicrafts",
        price: 349,
        description: "Eco-friendly jute shopping bags in three sizes. Durable, reusable, and perfect for reducing plastic usage. Handcrafted with reinforced handles.",
        image: "https://images-static.nykaa.com/media/catalog/product/e/1/e1c4023EBLGB043_1.jpg?tr=w-500&fit=crop",
        badge: "Eco-Friendly"
    },
    {
        id: 8,
        name: "Herbal Tea Assortment",
        category: "food",
        categoryDisplay: "Food Products",
        price: 425,
        description: "Collection of 6 organic herbal teas sourced from local farms. Includes green tea, chamomile, ginger, tulsi, and mint. Rich in antioxidants and natural healing properties.",
        image: "https://cdn11.bigcommerce.com/s-8466dwhhql/images/stencil/original/image-manager/tea-samplers-sq.jpg",
        badge: "Organic"
    },
    {
        id: 9,
        name: "Ayurvedic Hair Oil",
        category: "beauty",
        categoryDisplay: "Beauty & Wellness",
        price: 375,
        description: "Traditional ayurvedic hair oil made with 15+ natural herbs and oils. Promotes hair growth, reduces hair fall, and adds natural shine. Chemical-free formula.",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop",
        badge: "Natural"
    },
    {
        id: 10,
        name: "Macramé Wall Hanging",
        category: "decor",
        categoryDisplay: "Home Decor",
        price: 1150,
        description: "Handmade macramé wall hanging with intricate knotwork. Adds bohemian charm to any room. Made with natural cotton cord by skilled artisans.",
        image: "https://www.decorcorner.in/cdn/shop/collections/0042_copy.jpg?v=1695320360",
        badge: "Trending"
    }
];

// ==========================================
// Cart Functions (using localStorage)
// ==========================================
function getCart() {
    const cart = localStorage.getItem('shgCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('shgCart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    
    // Reload cart page if on cart page
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        
        // Update display if on cart page
        if (window.location.pathname.includes('cart.html')) {
            loadCart();
        }
    }
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function clearCart() {
    localStorage.removeItem('shgCart');
    updateCartCount();
}

// ==========================================
// Product Display Functions
// ==========================================
function createProductCard(product) {
    return `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.categoryDisplay}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description.substring(0, 100)}...</p>
                <div class="product-footer">
                    <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    // Show first 6 products on homepage
    const featuredProducts = productsData.slice(0, 6);
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

// ==========================================
// Product Detail Modal
// ==========================================
function showProductDetail(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-product">
            <div class="modal-product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="modal-product-details">
                <div class="modal-product-category">${product.categoryDisplay}</div>
                <h2>${product.name}</h2>
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="modal-product-price">₹${product.price.toLocaleString('en-IN')}</div>
                <p class="modal-product-description">${product.description}</p>
                <button class="btn btn-primary" onclick="addToCart(${product.id}); closeProductModal();" style="width: 100%; margin-bottom: 1rem;">
                    Add to Cart
                </button>
                <button class="btn btn-secondary" onclick="closeProductModal()" style="width: 100%;">
                    Continue Shopping
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ==========================================
// Search Functionality
// ==========================================
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        return;
    }
    
    // Redirect to products page with search query
    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
}

// Allow search on Enter key
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
});

// ==========================================
// Notification System
// ==========================================
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: var(--font-body);
        font-weight: 500;
    `;
    notification.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==========================================
// Initialize on page load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});