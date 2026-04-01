// Global Utils & Smooth Scroll
const initLenis = () => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  // Single loop for everything
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
};

// Data Loader (Shared by everyone)
window.ProductsLib = {
  data: [],
  async init() {
    if (this.data.length > 0) return this.data;
    const res = await fetch("data/products.json");
    this.data = await res.json();
    return this.data;
  },
};

document.addEventListener("DOMContentLoaded", initLenis);
