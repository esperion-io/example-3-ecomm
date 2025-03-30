// Shopping cart state
let cart = [];
let cartTotal = 0;

// DOM Elements
const productModal = document.getElementById('productModal');
const cartModal = document.getElementById('cartModal');
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.querySelector('.cart-count');
const closeModals = document.querySelectorAll('.close-modal');

// Product data (in a real app, this would come from a backend)
const products = {
    1: {
        name: 'Floral Summer Dress',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&auto=format&fit=crop&q=60',
        description: 'A beautiful floral dress perfect for summer days. Made from sustainable materials.'
    },
    2: {
        name: 'Linen Blazer',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=60',
        description: 'Classic linen blazer that combines style with comfort. Perfect for any occasion.'
    },
    3: {
        name: 'Silk Scarf',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=60',
        description: 'Elegant silk scarf with a unique pattern. Adds a touch of luxury to any outfit.'
    },
    4: {
        name: 'Leather Tote Bag',
        price: 249.99,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=60',
        description: 'Handcrafted leather tote bag with multiple compartments. Perfect for everyday use.'
    },
    5: {
        name: 'Gold Necklace',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&auto=format&fit=crop&q=60',
        description: 'Delicate gold necklace with a modern design. A timeless piece for any wardrobe.'
    },
    6: {
        name: 'Designer Sunglasses',
        price: 159.99,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=60',
        description: 'Stylish designer sunglasses with UV protection. A must-have accessory.'
    }
};

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Product card click handler
document.querySelectorAll('.product-card, .accessory-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('add-to-cart')) {
            const productId = card.dataset.productId;
            openProductModal(productId);
        }
    });
});

// Open product modal
function openProductModal(productId) {
    const product = products[productId];
    const modalImage = productModal.querySelector('.modal-image img');
    const modalTitle = productModal.querySelector('.modal-title');
    const modalPrice = productModal.querySelector('.modal-price');

    modalImage.src = product.image;
    modalTitle.textContent = product.name;
    modalPrice.textContent = `$${product.price.toFixed(2)}`;

    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal handlers
closeModals.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        productModal.classList.remove('active');
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === productModal || e.target === cartModal) {
        productModal.classList.remove('active');
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Size selection
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Quantity controls
const quantityInput = document.querySelector('.quantity-controls input');
document.querySelector('.quantity-btn.minus').addEventListener('click', () => {
    if (quantityInput.value > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
});

document.querySelector('.quantity-btn.plus').addEventListener('click', () => {
    if (quantityInput.value < 10) {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    }
});

// Add to cart functionality
document.querySelectorAll('.add-to-cart, .add-to-cart-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = btn.closest('.product-card, .accessory-card')?.dataset.productId;
        if (productId) {
            const product = products[productId];
            const quantity = parseInt(quantityInput?.value || 1);
            const size = document.querySelector('.size-btn.active')?.textContent || 'M';

            addToCart(product, quantity, size);
            updateCartCount();
            showAddToCartAnimation(btn);
        }
    });
});

// Add item to cart
function addToCart(product, quantity, size) {
    const existingItem = cart.find(item => 
        item.name === product.name && item.size === size
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity,
            size
        });
    }

    updateCartTotal();
}

// Update cart total
function updateCartTotal() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show add to cart animation
function showAddToCartAnimation(button) {
    button.innerHTML = 'Added to Cart!';
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        button.innerHTML = 'Add to Cart';
        button.style.backgroundColor = '#333';
    }, 2000);
}

// Cart icon click handler
cartIcon.addEventListener('click', () => {
    updateCartDisplay();
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Update cart display
function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Size: ${item.size}</p>
                <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" onclick="updateCartItemQuantity('${item.name}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" onclick="updateCartItemQuantity('${item.name}', 1)">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    document.querySelector('.total-amount').textContent = `$${cartTotal.toFixed(2)}`;
}

// Update cart item quantity
window.updateCartItemQuantity = function(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        updateCartTotal();
        updateCartCount();
        updateCartDisplay();
    }
};

// Checkout button handler
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Thank you for your purchase! This is a demo site, so no actual checkout will occur.');
    cart = [];
    updateCartCount();
    updateCartDisplay();
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
}); 