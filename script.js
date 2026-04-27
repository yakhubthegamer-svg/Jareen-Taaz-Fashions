// Initialize Lucide Icons
lucide.createIcons();

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.scroll-reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Mobile Menu Toggle (Simplified interaction)
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    // Basic mobile menu behavior - can be expanded to a full sidebar
    if(navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = '0 10px 10px rgba(0,0,0,0.1)';
        
        // Ensure links are dark on white background
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.style.color = '#333';
            link.style.padding = '10px 0';
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if(targetElement) {
            // Adjust for fixed header
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
            window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
            });
            
            // Close mobile menu if open
            if(window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Modal Logic
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
        document.body.style.overflow = 'auto';
    }
}

// View All Designs Logic
const viewAllBtn = document.getElementById('view-all-btn');
if(viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
        const hiddenDesigns = document.querySelectorAll('.hidden-design');
        let isHidden = false;
        
        hiddenDesigns.forEach(design => {
            if(design.style.display === 'none') {
                design.style.display = 'block';
                isHidden = true;
                // Trigger reflow for animation if needed
                void design.offsetWidth;
                design.style.animation = 'fadeInUp 0.8s forwards';
            } else {
                design.style.display = 'none';
                isHidden = false;
            }
        });
        
        if(isHidden) {
            viewAllBtn.textContent = 'Show Less';
        } else {
            viewAllBtn.textContent = 'View All Designs';
        }
    });
}

// --- Cart Logic ---
let cart = [];

const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartIconBtn = document.getElementById('cart-icon');
const cartCountDisplay = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPriceDisplay = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = 'auto';
}

cartIconBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountDisplay.textContent = totalItems;
    
    // Update items list
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #999; margin-top: 50px;">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            let itemPrice = 40; // Default price
            
            const itemTotal = itemPrice * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div style="color: var(--primary-color); font-weight: 600; margin-top: 5px;">KD ${itemPrice}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="quantity-controls" style="display: flex; align-items: center; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;">
                        <button onclick="updateQuantity(${index}, -1)" style="padding: 5px 10px; border: none; background: #f5f5f5; cursor: pointer;">-</button>
                        <span style="padding: 5px 10px; font-weight: bold; background: #fff; min-width: 25px; text-align: center;">${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" style="padding: 5px 10px; border: none; background: #f5f5f5; cursor: pointer;">+</button>
                    </div>
                    <span class="remove-item" onclick="removeFromCart(${index})" style="cursor:pointer; color:#ff4d4f;"><i data-lucide="trash-2" style="width: 18px; height: 18px;"></i></span>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
    
    cartTotalPriceDisplay.textContent = `KD ${total}`;
    lucide.createIcons();
}

// Ensure updateQuantity is in global scope
window.updateQuantity = function(index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        cart.splice(index, 1);
    }
    updateCartUI();
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Attach event listeners to all Add to Cart buttons
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const itemName = decodeURIComponent(e.target.getAttribute('data-name'));
        
        // Check if item already exists
        const existingItem = cart.find(i => i.name === itemName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: itemName, quantity: 1 });
        }
        
        // Show visual feedback
        const originalText = e.target.textContent;
        e.target.textContent = 'Added to Cart!';
        e.target.style.backgroundColor = '#4caf50';
        e.target.style.borderColor = '#4caf50';
        e.target.style.color = '#fff';
        
        setTimeout(() => {
            e.target.textContent = originalText;
            e.target.style.backgroundColor = '';
            e.target.style.borderColor = '';
            e.target.style.color = '';
            // Close the product modal and open the cart
            const modal = e.target.closest('.modal');
            if(modal) {
                modal.style.display = 'none';
            }
            openCart();
        }, 1000);
        
        updateCartUI();
    });
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    let message = "Hello Jareen Taaz, I would like to order the following items:%0A%0A";
    let total = 0;
    
    cart.forEach((item, i) => {
        let price = 40;
        let itemTotal = price * item.quantity;
        total += itemTotal;
        message += `${i + 1}. ${item.name} (x${item.quantity}) - KD ${itemTotal}%0A`;
    });
    
    message += `%0A*Total: KD ${total}*`;
    
    window.open(`https://wa.me/96568682475?text=${message}`, '_blank');
});

// Initial UI render
updateCartUI();

// --- Search Logic ---
const searchIcon = document.getElementById('search-icon');
const searchOverlay = document.getElementById('search-overlay');
const closeSearch = document.getElementById('close-search');
const searchInput = document.getElementById('search-input');
const galleryItems = document.querySelectorAll('.gallery-item');
const viewAllBtnContainer = document.querySelector('.view-all-container');

document.body.addEventListener('click', (e) => {
    if (e.target.closest('#search-icon')) {
        searchOverlay.style.display = searchOverlay.style.display === 'none' ? 'block' : 'none';
        if(searchOverlay.style.display === 'block') {
            searchInput.focus();
        }
    } else if (e.target.closest('#close-search')) {
        searchOverlay.style.display = 'none';
        searchInput.value = '';
        // Reset gallery view
        galleryItems.forEach(item => {
            if(item.classList.contains('hidden-design') && viewAllBtn.textContent === 'View All Designs') {
                item.style.display = 'none';
            } else {
                item.style.display = 'block';
            }
        });
        if(viewAllBtnContainer) viewAllBtnContainer.style.display = 'block';
    }
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    if(query.trim() === '') {
        // Reset to default
        galleryItems.forEach(item => {
            if(item.classList.contains('hidden-design') && viewAllBtn.textContent === 'View All Designs') {
                item.style.display = 'none';
            } else {
                item.style.display = 'block';
            }
        });
        if(viewAllBtnContainer) viewAllBtnContainer.style.display = 'block';
        return;
    }
    
    // Hide view all button when searching
    if(viewAllBtnContainer) viewAllBtnContainer.style.display = 'none';
    
    galleryItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const desc = item.querySelector('p').textContent.toLowerCase();
        
        if(title.includes(query) || desc.includes(query)) {
            item.style.display = 'block';
            item.style.animation = 'none'; // remove animation for instant filtering
        } else {
            item.style.display = 'none';
        }
    });
});

