// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis smooth scroll
// Check if device supports touch for mobile optimizations
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

const lenis = new Lenis({
  duration: isTouchDevice ? 0.8 : 1.2, // Faster on mobile for better responsiveness
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: isTouchDevice ? 3 : 2, // More sensitive on touch devices
  lerp: isTouchDevice ? 0.08 : 0.1, // Lower lerp on mobile for smoother feel
  smoothTouch: isTouchDevice, // Enable smooth touch on mobile
  maxDuration: isTouchDevice ? 1.5 : 2,
});

// Integrate Lenis with GSAP ScrollTrigger
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

window.initCategoryAnimations = initCategoryAnimations || (() => {
  // Auto-init if function exists globally
  if (typeof initCategoryAnimations === 'function') initCategoryAnimations();
});

// ── EXTEND PRODUCTS LIBRARY (Only add/update specific methods) ──
window.ProductsLib = window.ProductsLib || { data: [] };

// Add or update specific methods without replacing the whole object
Object.assign(window.ProductsLib, {
  async loadProducts() {
    if (this.data.length > 0) return this.data;
    try {
      const res = await fetch("data/products.json");
      this.data = await res.json();
      // Also update the products property that products.js uses
      if (!this.hasOwnProperty('products')) {
        this.products = this.data;
      } else {
        this.products = this.data;
      }
      return this.data;
    } catch (err) {
      console.error("Failed to load products:", err);
      return [];
    }
  },

  updateCategoryCounts() {
    // Map data-cat to category (lowercase match products.json)
    const catMap = {
      'singles': 'singles',
      'complimentary': 'complimentary', 
      'sofas': 'sofas',
      'beds': 'beds',
      'fittings': 'fittings'
    };
    
    Object.entries(catMap).forEach(([dataCat, catLower]) => {
      const count = this.data.filter(p => p.category.toLowerCase() === catLower).length;
      const countEl = document.querySelector(`[data-cat="${dataCat}"] .category-count`);
      if (countEl) {
        countEl.textContent = `(${count})`;
      }
    });
  }
});