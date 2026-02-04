// ==========================================
// Cart Page Functionality
// ==========================================

// ==========================================
// Load Cart Items
// ==========================================
function loadCart() {
    const cart = getCart();
    const container = document.getElementById('cartItemsContainer');
    const emptyCart = document.getElementById('emptyCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.style.display = 'none';
        emptyCart.style.display = 'block';
        if (checkoutBtn) checkoutBtn.disabled = true;
        updateOrderSummary(cart);
        return;
    }
    
    container.style.display = 'block';
    emptyCart.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    container.innerHTML = cart.map(item => createCartItem(item)).join('');
    updateOrderSummary(cart);
}

// ==========================================
// Create Cart Item HTML
// ==========================================
function createCartItem(item) {
    return `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <div class="cart-item-category">${item.categoryDisplay}</div>
                <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">−</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `;
}

// ==========================================
// Quantity Controls
// ==========================================
function increaseQuantity(productId) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        updateQuantity(productId, item.quantity + 1);
    }
}

function decreaseQuantity(productId) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (item.quantity > 1) {
            updateQuantity(productId, item.quantity - 1);
        } else {
            if (confirm('Remove this item from cart?')) {
                removeFromCart(productId);
            }
        }
    }
}

// ==========================================
// Update Order Summary
// ==========================================
function updateOrderSummary(cart) {
    const itemCountElement = document.getElementById('itemCount');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    // Calculate totals
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Shipping: Free for orders above ₹1000, otherwise ₹50
    const shipping = subtotal >= 1000 ? 0 : (subtotal > 0 ? 50 : 0);
    
    // Tax: 5% of subtotal
    const tax = subtotal * 0.05;
    
    // Total
    const total = subtotal + shipping + tax;
    
    // Update display
    if (itemCountElement) {
        itemCountElement.textContent = itemCount;
    }
    if (subtotalElement) {
        subtotalElement.textContent = `₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    if (shippingElement) {
        shippingElement.textContent = shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    if (taxElement) {
        taxElement.textContent = `₹${tax.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    if (totalElement) {
        totalElement.textContent = `₹${total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    // Store for checkout
    window.orderSummary = {
        itemCount,
        subtotal,
        shipping,
        tax,
        total
    };
}

// ==========================================
// Promo Code (Optional Feature)
// ==========================================
function applyPromo() {
    const promoInput = document.getElementById('promoInput');
    const promoCode = promoInput ? promoInput.value.trim().toUpperCase() : '';
    
    // Sample promo codes
    const promoCodes = {
        'SHG10': 10,  // 10% discount
        'UBA15': 15,  // 15% discount
        'WELCOME20': 20  // 20% discount
    };
    
    if (promoCodes[promoCode]) {
        const discount = promoCodes[promoCode];
        showNotification(`Promo code applied! ${discount}% discount added.`);
        
        // Apply discount to total
        const cart = getCart();
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountAmount = subtotal * (discount / 100);
        const shipping = subtotal >= 1000 ? 0 : 50;
        const tax = (subtotal - discountAmount) * 0.05;
        const total = subtotal - discountAmount + shipping + tax;
        
        // Update display
        const totalElement = document.getElementById('total');
        if (totalElement) {
            totalElement.innerHTML = `
                <div style="text-decoration: line-through; font-size: 0.875rem; color: var(--text-light);">
                    ₹${(subtotal + shipping + (subtotal * 0.05)).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
                ₹${total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            `;
        }
        
        // Store discount for checkout
        window.orderSummary.discount = discountAmount;
        window.orderSummary.promoCode = promoCode;
        window.orderSummary.total = total;
        
        if (promoInput) {
            promoInput.value = '';
        }
    } else if (promoCode) {
        showNotification('Invalid promo code. Please try again.');
    }
}

// ==========================================
// Proceed to Checkout
// ==========================================
function proceedToCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Show checkout modal
    showCheckoutConfirmation();
    
    // Clear cart
    clearCart();
    
    // Reload cart page
    setTimeout(() => {
        loadCart();
    }, 100);
}

// ==========================================
// Checkout Confirmation Modal
// ==========================================
function showCheckoutConfirmation() {
    const modal = document.getElementById('checkoutModal');
    const orderDetails = document.getElementById('orderDetails');
    
    if (!modal || !orderDetails) return;
    
    const summary = window.orderSummary || {};
    const orderNumber = 'SHG' + Date.now().toString().slice(-8);
    
    orderDetails.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <p style="font-size: 0.875rem; color: var(--text-secondary);">Order Number</p>
            <p style="font-size: 1.25rem; font-weight: 600; color: var(--primary-color);">${orderNumber}</p>
        </div>
        <div class="order-detail-row">
            <span>Items:</span>
            <span>${summary.itemCount || 0}</span>
        </div>
        <div class="order-detail-row">
            <span>Subtotal:</span>
            <span>₹${(summary.subtotal || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        ${summary.discount ? `
        <div class="order-detail-row">
            <span>Discount (${summary.promoCode}):</span>
            <span style="color: #27ae60;">-₹${summary.discount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        ` : ''}
        <div class="order-detail-row">
            <span>Shipping:</span>
            <span>${summary.shipping === 0 ? 'FREE' : '₹' + (summary.shipping || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        <div class="order-detail-row">
            <span>Tax:</span>
            <span>₹${(summary.tax || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        <div class="order-detail-row">
            <span>Total:</span>
            <span>₹${(summary.total || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); text-align: center;">
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0;">
                💚 Your purchase has supported ${summary.itemCount || 0} artisan families
            </p>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// ==========================================
// Initialize Cart Page
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Allow promo code submission on Enter key
    const promoInput = document.getElementById('promoInput');
    if (promoInput) {
        promoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyPromo();
            }
        });
    }
});