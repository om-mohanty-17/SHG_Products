// ==========================================
// Products Page Functionality
// ==========================================

let currentProducts = [...productsData];
let activeFilters = {
    categories: ['all'],
    priceRange: 'all'
};

// ==========================================
// Load All Products
// ==========================================
function loadAllProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        currentProducts = productsData.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.categoryDisplay.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // Update search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = searchQuery;
        }
    } else {
        currentProducts = [...productsData];
    }
    
    displayProducts();
}

// ==========================================
// Display Products
// ==========================================
function displayProducts() {
    const container = document.getElementById('productsGrid');
    const countElement = document.getElementById('productCount');
    
    if (!container) return;
    
    if (currentProducts.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        if (countElement) {
            countElement.textContent = 'No products found';
        }
        return;
    }
    
    container.innerHTML = currentProducts.map(product => createProductCard(product)).join('');
    
    if (countElement) {
        countElement.textContent = `Showing ${currentProducts.length} product${currentProducts.length !== 1 ? 's' : ''}`;
    }
}

// ==========================================
// Filter Products
// ==========================================
function filterProducts() {
    // Get checked categories
    const categoryCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const checkedCategories = [];
    
    categoryCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkedCategories.push(checkbox.value);
        }
    });
    
    activeFilters.categories = checkedCategories.length > 0 ? checkedCategories : ['all'];
    
    // Get selected price range
    const priceRadios = document.querySelectorAll('.filter-option input[type="radio"][name="price"]');
    priceRadios.forEach(radio => {
        if (radio.checked) {
            activeFilters.priceRange = radio.value;
        }
    });
    
    // Apply filters
    currentProducts = productsData.filter(product => {
        // Category filter
        const categoryMatch = activeFilters.categories.includes('all') || 
                            activeFilters.categories.includes(product.category);
        
        // Price filter
        let priceMatch = true;
        if (activeFilters.priceRange !== 'all') {
            if (activeFilters.priceRange === '0-500') {
                priceMatch = product.price < 500;
            } else if (activeFilters.priceRange === '500-1000') {
                priceMatch = product.price >= 500 && product.price <= 1000;
            } else if (activeFilters.priceRange === '1000-2000') {
                priceMatch = product.price >= 1000 && product.price <= 2000;
            } else if (activeFilters.priceRange === '2000+') {
                priceMatch = product.price > 2000;
            }
        }
        
        return categoryMatch && priceMatch;
    });
    
    // Check if search query exists in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        currentProducts = currentProducts.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.categoryDisplay.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    displayProducts();
}

// ==========================================
// Sort Products
// ==========================================
function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    const sortValue = sortSelect.value;
    
    switch(sortValue) {
        case 'price-low':
            currentProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            currentProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            currentProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // Reset to original order
            const ids = currentProducts.map(p => p.id);
            currentProducts = productsData.filter(p => ids.includes(p.id));
    }
    
    displayProducts();
}

// ==========================================
// Reset Filters
// ==========================================
function resetFilters() {
    // Reset checkboxes
    const categoryCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    categoryCheckboxes.forEach((checkbox, index) => {
        checkbox.checked = index === 0; // Only check "All Products"
    });
    
    // Reset radio buttons
    const priceRadios = document.querySelectorAll('.filter-option input[type="radio"][name="price"]');
    priceRadios.forEach((radio, index) => {
        radio.checked = index === 0; // Only check "All Prices"
    });
    
    // Reset sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = 'default';
    }
    
    // Clear search from URL
    window.history.pushState({}, '', 'products.html');
    
    // Clear search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reload products
    activeFilters = {
        categories: ['all'],
        priceRange: 'all'
    };
    currentProducts = [...productsData];
    displayProducts();
}

// ==========================================
// Handle "All Products" checkbox
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const categoryCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.value === 'all') {
                // If "All" is checked, uncheck others
                if (checkbox.checked) {
                    categoryCheckboxes.forEach(cb => {
                        if (cb.value !== 'all') {
                            cb.checked = false;
                        }
                    });
                }
            } else {
                // If any specific category is checked, uncheck "All"
                if (checkbox.checked) {
                    categoryCheckboxes.forEach(cb => {
                        if (cb.value === 'all') {
                            cb.checked = false;
                        }
                    });
                }
                
                // If no categories are checked, check "All"
                const anyChecked = Array.from(categoryCheckboxes).some(cb => 
                    cb.value !== 'all' && cb.checked
                );
                if (!anyChecked) {
                    categoryCheckboxes.forEach(cb => {
                        if (cb.value === 'all') {
                            cb.checked = true;
                        }
                    });
                }
            }
        });
    });
});