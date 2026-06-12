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

// ── PRODUCTS LIBRARY (Single Source of Truth) ──
window.ProductsLib = {
  data: [],
  products: [],
  loaded: false,
  loadPromise: null,

  async loadProducts() {
    // Return existing promise if already loading
    if (this.loadPromise) return this.loadPromise;

    // Return cached data if already loaded
    if (this.loaded && this.data.length > 0) {
      console.log("Using cached products:", this.data.length);
      return this.data;
    }

    // Create new load promise
    this.loadPromise = this._fetchProducts();
    return this.loadPromise;
  },

  async _fetchProducts() {
    try {
      const OPEN_SHEET_PRODUCTS_URL =
        "https://opensheet.elk.sh/1V_aY7C02cGRBpoq51k1KPIWoyvCf2MNKgiy4dz4XdSQ/Products";

      console.log("🔄 Fetching from OpenSheet...");
      const res = await fetch(OPEN_SHEET_PRODUCTS_URL);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const productsFromSheet = await res.json();
      console.log("📦 Raw OpenSheet data:", productsFromSheet?.length, "rows");

      const normalizeStringArray = (v) => {
        if (!v) return [];
        if (Array.isArray(v))
          return v.map((x) => String(x).trim()).filter(Boolean);
        if (typeof v === "string") {
          return v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return [String(v)];
      };

      // Map OpenSheet rows
      const products = (
        Array.isArray(productsFromSheet) ? productsFromSheet : []
      ).map((row, idx) => {
        const rawPrice = row.price ?? row.Price ?? 0;
        const priceNumber =
          Number(String(rawPrice).replace(/[^0-9.]/g, "")) || 0;

        const inStockRaw = row.inStock ?? row.InStock ?? true;
        const inStock =
          typeof inStockRaw === "boolean"
            ? inStockRaw
            : String(inStockRaw).toUpperCase() === "TRUE";

        const imageUrl = row.image ?? row["image "] ?? row.imageUrl ?? "";
        const colorsValue = row.colors ?? row.Colors ?? "";
        const colors = normalizeStringArray(colorsValue);

        const collectionsRaw =
          row.collections ??
          row.collection ??
          row.Collections ??
          row.Collection ??
          "";
        const collections = normalizeStringArray(collectionsRaw);

        return {
          id: row.id || row.ID || String(idx + 1),
          name: row.name || row.Name || "",
          slug: row.slug || row.Slug || "",
          price: priceNumber,
          currency: row.currency || row.Currency || "NGN",
          image: imageUrl,
          alt: row.alt || row.Alt || row.name || "",
          category: (row.category || row.Category || "").toLowerCase(),
          condition: (row.condition || row.Condition || "new").toLowerCase(),
          span: row.span || row.Span || "span-1",
          height: row.height || row.Height || "h-380",
          size: row.size || row.Size || "",
          dimensions: row.dimensions || row.Dimensions || "",
          colors,
          description: row.description || row.Description || "",
          inStock,
          stockCount:
            Number(row.stockCount ?? row.StockCount ?? row.stock ?? 0) || 0,
          collections: collections.map((c) => c.toLowerCase()), // Normalize to lowercase
        };
      });

      // Filter blank rows
      const cleanedProducts = products.filter(
        (p) => String(p.name ?? "").trim() !== ""
      );

      console.log("✅ Products cleaned:", cleanedProducts.length);

      // Sort so newest items appear on top.
      // Assumption: newly added items have higher `id` values.
      // (Also robust if `id` is missing/non-numeric.)
      const sortedProducts = [...cleanedProducts].sort((a, b) => {
        const aId = Number(a?.id);
        const bId = Number(b?.id);

        const aValid = Number.isFinite(aId);
        const bValid = Number.isFinite(bId);

        if (aValid && bValid) return bId - aId; // desc
        if (aValid && !bValid) return -1;
        if (!aValid && bValid) return 1;
        return 0; // keep original relative order for non-numeric ids
      });

      // Update all references
      this.data = sortedProducts;
      this.products = sortedProducts;
      window.allProducts = sortedProducts;
      this.loaded = true;

      console.log("✅ Products loaded globally:", this.data.length);

      return this.data;
    } catch (err) {
      console.error("❌ Failed to load products:", err);
      this.loadPromise = null; // Reset promise on error
      return [];
    }
  },

  updateCategoryCounts() {
    console.log("🔢 Updating category counts...");
    const productsToCount = this.products;

    if (!productsToCount.length) {
      console.warn("⚠️ No products available for counting");
      return;
    }

    const catMap = {
      singles: "singles",
      complimentary: "complimentary",
      sofas: "sofas",
      beds: "beds",
      fittings: "fittings",
    };

    Object.entries(catMap).forEach(([dataCat, catLower]) => {
      const count = productsToCount.filter(
        (p) => p.category === catLower
      ).length;

      const countEl = document.querySelector(
        `[data-cat="${dataCat}"] .category-count`
      );

      if (countEl) {
        countEl.textContent = `(${count})`;
        console.log(`✅ ${dataCat}: ${count}`);
      }
    });
  },
};

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

// MENU
{
  const select = (s) => document.querySelector(s);
  const selectAll = (s) => document.querySelectorAll(s);

  const burger = select("#menuToggle");
  const closeBtn = document.querySelector("#drawerClose");
  const drawer = select("#mobileDrawer");
  const drawerBg = select(".drawer-bg");
  const dLinks = selectAll(".d-link");
  const dMisc = document.querySelectorAll(
    ".drawer-label, .drawer-info, .drawer-footer"
  );

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
      { y: 20, opacity: 0, duration: 0.1, ease: "power2.out" },
      "-=0.6"
    )
    .to(
      closeBtn,
      { y: 0, opacity: 1, duration: 0.1, ease: "power2.out" },
      "-=0.6"
    );

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
  dLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
