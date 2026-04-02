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

// ── PRODUCTS LIBRARY (Unified API) ──
window.ProductsLib = {
  data: [],
  async loadProducts() {
    if (this.data.length > 0) return this.data;
    try {
      const res = await fetch("data/products.json");
      this.data = await res.json();
      return this.data;
    } catch (err) {
      console.error("Failed to load products:", err);
      return [];
    }
  },
};
