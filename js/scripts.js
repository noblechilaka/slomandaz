// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Minimal Lenis + ScrollTrigger controller
(function initSmoothScrollController() {
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const lenis = new Lenis({
    duration: isTouchDevice ? 0.8 : 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: isTouchDevice,
    touchMultiplier: isTouchDevice ? 2.2 : 1.6,
    lerp: isTouchDevice ? 0.09 : 0.1,
    autoRaf: false,
  });

  window.lenis = lenis;
  window.refreshSmoothScroll = () => ScrollTrigger.refresh();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  window.addEventListener("load", () => {
    lenis.resize();
    ScrollTrigger.refresh();
  });
})();

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

// Navbar scroll transparency
let navScrollTicking = false;
function handleNavScroll() {
  const scrolled = window.scrollY > 0;
  document.body.classList.toggle("scrolled", scrolled);
  navScrollTicking = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!navScrollTicking) {
      requestAnimationFrame(handleNavScroll);
      navScrollTicking = true;
    }
  },
  { passive: true }
);

// 5. THE HARDCORE MENU (GSAP + LENIS INTEGRATION)
// We wrap this in a block to keep variables clean and avoid conflicts
{
  const select = (s) => document.querySelector(s);
  const selectAll = (s) => document.querySelectorAll(s);

  // Define Elements
  const burger = select("#menuToggle");
  const closeBtn = document.querySelector("#drawerClose");
  const drawer = select("#mobileDrawer");
  const drawerBg = select(".drawer-bg");
  const dLinks = selectAll(".d-link");
  const dMisc = document.querySelectorAll(
    ".drawer-label, .drawer-info, .drawer-footer"
  );

  let menuOpen = false;

  // Create the Animation Timeline
  const menuTimeline = gsap.timeline({ paused: true, reversed: true });

  menuTimeline
    .set(drawer, { visibility: "visible", pointerEvents: "all" })
    .to(drawerBg, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.2,
      ease: "expo.inOut",
    })
    .from(
      dLinks,
      {
        y: 100,
        rotate: 5,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "expo.out",
      },
      "-=0.5"
    )
    .from(
      dMisc,
      {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.6"
    )
    .from(
      closeBtn,
      {
        y: 20,
        opacity: 0,

        duration: 0.1,
        ease: "power2.out",
      },
      "-=0.6"
    )
    .to(
      closeBtn,
      {
        y: 0,
        opacity: 1,
        duration: 0.1,
        ease: "power2.out",
      },
      "-=0.6"
    );
  // Toggle Function
  const openMenu = () => {
    menuTimeline.play();
    window.lenis?.stop();
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menuTimeline.reverse();
    window.lenis?.start();
    document.body.style.overflow = "";
  };

  burger?.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);

  // Close when clicking a link
  dLinks.forEach((link) => link.addEventListener("click", closeMenu));

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOpen) toggleMenu();
  });
}

// 6. REFRESH ON LOAD
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
