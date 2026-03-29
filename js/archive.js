// Archive Product Reel Animation
gsap.registerPlugin(ScrollTrigger);

const track = document.getElementById('reelTrack');

// ==========================================
// 1. PINNED HORIZONTAL SCROLL
// ==========================================

// Calculate how far to move left
const getScrollAmount = () => {
  const trackWidth = track.scrollWidth;
  const windowWidth = window.innerWidth;
  // Move left by (track width - window width) + some padding
  return -(trackWidth - windowWidth); 
};

let mainScrollTrigger; // Store reference to main scroll trigger
let mainTween; // Store reference to main tween

// Initialize the main horizontal scroll
function initMainHorizontalScroll() {
  // Kill the existing trigger if it exists
  if (mainScrollTrigger) {
    mainScrollTrigger.kill();
  }
  
  // Update the tween with the new track dimensions
  gsap.set(track, {x: 0}); // Reset position before calculating
  
  const scrollAmount = getScrollAmount();
  mainTween = gsap.to(track, {
    x: scrollAmount,
    ease: "none", // Linear is crucial for direct scroll mapping
    duration: 1,  // Duration doesn't matter much with ScrollTrigger scrub
    onUpdate: () => {
      // Update any ongoing calculations if needed
    }
  });

  mainScrollTrigger = ScrollTrigger.create({
    trigger: "#archive",
    start: "top top",
    end: () => `+=${Math.abs(scrollAmount)}`, // Make scroll distance match movement
    pin: ".archive-sticky",
    animation: mainTween,
    scrub: 1, // Smoothness (1s lag). Higher = smoother but less direct.
    invalidateOnRefresh: true, // Recalculate on resize
    anticipatePin: 1
  });
  
  return mainTween;
}

// ==========================================
// 2. SOFT MASK REVEAL & LABEL FADE
// ==========================================

// Function to set up card animations
function setupCardAnimations() {
  // Remove existing scroll triggers for cards to prevent duplicates
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger && trigger.trigger.closest('.product-card')) {
      trigger.kill();
    }
  });

  // Wait a bit to ensure main scroll trigger is set up
  setTimeout(() => {
    const cards = document.querySelectorAll('.product-card');
    
    // Verify that we have a main scroll trigger and tween
    const animationToUse = mainTween;
    
    // We use ScrollTrigger for each card individually to detect when it hits center
    cards.forEach((card) => {
      const mask = card.querySelector('.card-reveal-mask');
      
      // Reset mask initially
      gsap.set(mask, { x: '-100%' });
      // Note: We don't remove the 'revealed' class since we always show the card info
      
      if (animationToUse) {
        ScrollTrigger.create({
          trigger: card,
          animation: animationToUse, // Use the main animation
          start: "left center",      // When left edge of card hits center of viewport
          end: "right center",       // When right edge leaves center
          onEnter: () => revealCard(card, mask),
          onEnterBack: () => revealCard(card, mask),
          onLeave: () => hideCard(card, mask),
          onLeaveBack: () => hideCard(card, mask)
        });
      }
    });
  }, 50);
}

function revealCard(card, mask) {
  // We still add the revealed class for any other potential effects
  card.classList.add('revealed');
  
  // Animate mask sliding away to the right
  gsap.to(mask, {
    x: '100%',
    duration: 1.2,
    ease: "power2.out"
  });

  // Slight zoom out on image for depth
  gsap.to(card.querySelector('.card-image'), {
    scale: 1.0,
    duration: 1.4,
    ease: "power2.out"
  });
}

function hideCard(card, mask) {
  // We still remove the revealed class when card scrolls out
  card.classList.remove('revealed');
  
  // Reset mask to left
  gsap.set(mask, { x: '-100%' });
  
  // Reset image zoom
  gsap.set(card.querySelector('.card-image'), { scale: 1.15 });
}

// Wait for products to be loaded and then set up tab functionality
document.addEventListener('DOMContentLoaded', async () => {
  // Ensure products are loaded by waiting for ProductsLib to be available
  if (typeof window.ProductsLib === 'undefined') {
    // If ProductsLib isn't loaded yet, wait a bit and try again
    setTimeout(async () => {
      await initializeArchiveTabs();
    }, 100);
  } else {
    await initializeArchiveTabs();
  }
});

async function initializeArchiveTabs() {
  // Ensure products are loaded
  if (!window.ProductsLib.products || window.ProductsLib.products.length === 0) {
    await window.ProductsLib.loadProducts();
  }
  
  // Define product categories based on conditions
  const products = window.ProductsLib.products;
  
  const newProducts = products.filter(p => p.condition === 'new');
  const bestsellers = products.filter(p => p.condition === 'bestseller'); 
  const discounted = products.filter(p => p.condition === 'discounted');
  
  // Update the counts dynamically based on conditions
  updateCounts(newProducts.length, bestsellers.length, discounted.length);
  
  // Set up tab listeners
  setupTabListeners(newProducts, bestsellers, discounted);
  
  // Initialize with new arrival products since that tab is active by default
  updateReelWithProductsAndCTA(track, newProducts);
  
  // Update the product cards with actual product data
  const productCards = track.querySelectorAll('.product-card');
  productCards.forEach((card, idx) => {
    const product = newProducts[idx];
    
    if (product) {
      card.querySelector('.card-image').src = product.image;
      card.querySelector('.card-image').alt = product.alt;
      card.querySelector('.product-name').textContent = product.name;
      
      // Update status based on the product's condition
      const statusElement = card.querySelector('.product-status');
      statusElement.textContent = product.condition.charAt(0).toUpperCase() + product.condition.slice(1);
      statusElement.className = 'product-status'; // Reset classes
      statusElement.classList.add(product.condition);
    }
  });
  
  // Initialize the main horizontal scroll AFTER content is added
  initMainHorizontalScroll();
  
  // Wait a bit for layout to settle, then set up animations for the initial cards
  setTimeout(() => {
    setupCardAnimations();
    
    // Refresh the main scroll trigger after initial setup
    ScrollTrigger.refresh();
  }, 150);
}

// Function to update reel with products and CTA
function updateReelWithProductsAndCTA(trackEl, productsToShow) {
  trackEl.innerHTML = ''; // Clear the track
  
  // Add product cards
  productsToShow.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.productId = product.id; // Store product ID for clicking
    card.dataset.previewText = `${product.name} — ${product.condition ? product.condition.charAt(0).toUpperCase() + product.condition.slice(1) : 'New'}`;
    card.innerHTML = `
      <div class="card-image-mask">
        <div class="card-reveal-mask"></div>
        <img src="${product.image}" alt="${product.alt}" class="card-image" />
      </div>
      <div class="card-info">
        <span class="product-name">${product.name}</span>
        <span class="product-status ${product.condition || 'new'}">${product.condition ? product.condition.charAt(0).toUpperCase() + product.condition.slice(1) : 'New'}</span>
      </div>
    `;
    
    // Add click handler to redirect to products page with product ID
    card.addEventListener('click', () => {
      window.location.href = `products.html?id=${product.id}`;
    });
    
    trackEl.appendChild(card);
  });
  
  // Add the View Catalog CTA at the end
  const cta = document.createElement('a');
  cta.href = 'products.html';
  cta.className = 'archive-cta';
  cta.textContent = 'View Catalog';
  trackEl.appendChild(cta);
}

function updateCounts(newCount, bestsellerCount, discountCount) {
  // Update the count displays in the tabs
  document.querySelector('.tab:nth-child(1) sup').textContent = `(${newCount})`;
  document.querySelector('.tab:nth-child(2) sup').textContent = `(${bestsellerCount})`;
  document.querySelector('.tab:nth-child(3) sup').textContent = `(${discountCount})`;
}

function setupTabListeners(newProducts, bestsellers, discounted) {
  const tabs = document.querySelectorAll('.tab');
  
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Determine which products to show based on the clicked tab
      let productsToShow;
      if (index === 0) { // New arrival
        productsToShow = newProducts;
      } else if (index === 1) { // Bestsellers
        productsToShow = bestsellers;
      } else if (index === 2) { // Discounted
        productsToShow = discounted;
      }
      
      // Update the reel with products and CTA
      updateReelWithProductsAndCTA(track, productsToShow);
      
      // Update the product cards with actual product data
      const productCards = track.querySelectorAll('.product-card');
      productCards.forEach((card, idx) => {
        const product = productsToShow[idx];
        
        if (product) {
          card.querySelector('.card-image').src = product.image;
          card.querySelector('.card-image').alt = product.alt;
          card.querySelector('.product-name').textContent = product.name;
          
          // Update status based on the product's condition
          const statusElement = card.querySelector('.product-status');
          statusElement.textContent = product.condition.charAt(0).toUpperCase() + product.condition.slice(1);
          statusElement.className = 'product-status'; // Reset classes
          statusElement.classList.add(product.condition);
        }
      });
      
      // Refresh the main horizontal scroll after content changes
      initMainHorizontalScroll();
      
      // Refresh animations for the new cards
      setTimeout(() => {
        setupCardAnimations();
      }, 100);
      
      // Final refresh to ensure everything is properly positioned
      ScrollTrigger.refresh();
    });
  });
}