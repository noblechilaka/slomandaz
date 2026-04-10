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

// ── EXTEND PRODUCTS LIBRARY (Only add/update specific methods) ──
window.ProductsLib = window.ProductsLib || { data: [], products: [] };

// Add or update specific methods without replacing the whole object
Object.assign(window.ProductsLib, {
  async loadProducts() {
    if (this.data.length > 0) return this.data;
    try {
      // Load products from Contentful instead of local JSON
      const SPACE = "msu81v2q0bom";
      const TOKEN = "PtLVHaTuvyaqqizfEjyaYtio7Mj-fwzkGpZH60pbE9Q";

      // Include parameter fetches linked assets (like images) in the same request
      const url = `https://cdn.contentful.com/spaces/${SPACE}/environments/master/entries?access_token=${TOKEN}&content_type=product&include=10`;

      const res = await fetch(url);
      const data = await res.json();

      // Transform Contentful response → Your Exact JSON Format
      const productsFromContentful = data.items.map((item) => {
        const f = item.fields;

        // Handle Image URL with multiple fallback options
        let imageUrl = "";

        // Option 1: Standard Contentful asset structure (with includes)
        if (
          f.image &&
          f.image.fields &&
          f.image.fields.file &&
          f.image.fields.file.url
        ) {
          imageUrl = `https:${f.image.fields.file.url}`;
        }
        // Option 2: Check if image is an array (multiple assets)
        else if (
          f.image &&
          Array.isArray(f.image) &&
          f.image[0] &&
          f.image[0].fields &&
          f.image[0].fields.file &&
          f.image[0].fields.file.url
        ) {
          imageUrl = `https:${f.image[0].fields.file.url}`;
        }
        // Option 3: Check if image has a direct URL property (if stored differently)
        else if (f.image && typeof f.image === "object" && f.image.url) {
          imageUrl = f.image.url.startsWith("http")
            ? f.image.url
            : `https:${f.image.url}`;
        }
        // Option 4: Direct URL as string (less common but possible)
        else if (typeof f.image === "string") {
          imageUrl = f.image.startsWith("http") ? f.image : `https:${f.image}`;
        }

        return {
          id: item.sys.id, // Contentful auto-ID
          name: f.name || "",
          slug: f.slug || "",
          price: f.price || 0,
          currency: f.currency || "NGN",
          image: imageUrl,
          alt: f.alt || f.name || "",
          category: f.category || "",
          condition: f.condition || "new",
          span: f.span || "span-1",
          height: f.height || "h-380",
          size: f.size || "",
          dimensions: f.dimensions || "",
          colors: Array.isArray(f.colors)
            ? f.colors
            : f.colors
            ? [f.colors]
            : [],
          description: f.description || "",
          inStock: f.inStock ?? true,
          stockCount: f.stockCount ?? 0,
        };
      });

      this.data = productsFromContentful;
      // Also update the products property that products.js uses
      this.products = this.data;
      window.allProducts = this.data;
      console.log("Products loaded in scripts.js:", this.data); // Debug log

      return this.data;
    } catch (err) {
      console.error("Failed to load products:", err);
      return [];
    }
  },

  updateCategoryCounts: function () {
    console.log("Updating category counts"); // Debug log
    // Use the products array that's consistent with the rest of the app
    const productsToCount = window.allProducts || this.products || this.data;
    console.log("Data used for counting:", productsToCount); // Debug log

    // Map data-cat to category (case-insensitive match)
    const catMap = {
      singles: "singles",
      complimentary: "complimentary",
      sofas: "sofas",
      beds: "beds",
      fittings: "fittings",
    };

    Object.entries(catMap).forEach(([dataCat, catLower]) => {
      console.log(`Processing category: ${dataCat}`); // Debug log
      const count = productsToCount.filter(
        (p) => p.category?.toLowerCase() === catLower
      ).length;
      console.log(`Count for ${dataCat}: ${count}`); // Debug log

      const countEl = document.querySelector(
        `[data-cat="${dataCat}"] .category-count`
      );
      console.log(`Element for ${dataCat}:`, countEl); // Debug log

      if (countEl) {
        countEl.textContent = `(${count})`;
        console.log(`${dataCat} category count: ${count}`); // Debug log
      }
    });
  },
});

(function () {
  const header = document.querySelector(".global-nav");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const SCROLL_THRESHOLD = 50; // px before collapsing

  let isCollapsed = false;
  let isMenuOpen = false;
  let scrollTicking = false;

  // ─── Handle Scroll ───
  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > SCROLL_THRESHOLD && !isCollapsed) {
      // Collapse the nav
      isCollapsed = true;
      isMenuOpen = false;
      header.classList.add("nav-collapsed");
      header.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    } else if (scrollY <= SCROLL_THRESHOLD && isCollapsed) {
      // Expand the nav (back at top)
      isCollapsed = false;
      isMenuOpen = false;
      header.classList.remove("nav-collapsed", "menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!scrollTicking) {
        requestAnimationFrame(function () {
          onScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  // ─── Menu Toggle Click ───
  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();

    if (!isCollapsed) return; // Only works when collapsed

    isMenuOpen = !isMenuOpen;
    header.classList.toggle("menu-open", isMenuOpen);
    menuToggle.setAttribute("aria-expanded", String(isMenuOpen));
  });

  // ─── Close menu when clicking outside ───
  document.addEventListener("click", function (e) {
    if (isMenuOpen && !header.contains(e.target)) {
      isMenuOpen = false;
      header.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  // ─── Close menu when a navlink is clicked ───
  navLinks.querySelectorAll(".navlink").forEach(function (link) {
    link.addEventListener("click", function () {
      if (isMenuOpen) {
        isMenuOpen = false;
        header.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // ─── Close menu on Escape key ───
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isMenuOpen) {
      isMenuOpen = false;
      header.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.focus();
    }
  });

  // ─── Initial state check (in case page loads already scrolled) ───
  onScroll();
})();