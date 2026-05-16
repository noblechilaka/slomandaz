/**
 * SLOMANDAZ - MASTER SCRIPT
 * Combined Lenis, GSAP, Contentful, and Hardcore Menu
 */

// 1. REGISTER GSAP
gsap.registerPlugin(ScrollTrigger);

// 2. SMOOTH SCROLL (LENIS)
const initLenis = () => {
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const lenis = new Lenis({
    duration: isTouch ? 0.8 : 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: isTouch,
    autoRaf: false,
  });

  window.lenis = lenis;
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
};
initLenis();

// 3. PRODUCTS LIBRARY (CONTENTFUL)
window.ProductsLib = window.ProductsLib || { data: [], products: [] };
Object.assign(window.ProductsLib, {
  async loadProducts() {
    if (this.data.length > 0) return this.data;
    try {
      const SPACE = "msu81v2q0bom";
      const TOKEN = "PtLVHaTuvyaqqizfEjyaYtio7Mj-fwzkGpZH60pbE9Q";
      const url = `https://cdn.contentful.com/spaces/${SPACE}/environments/master/entries?access_token=${TOKEN}&content_type=product&include=10`;

      const res = await fetch(url);
      const data = await res.json();

      this.data = data.items.map((item) => {
        const f = item.fields;
        let img = "";
        if (f.image?.fields?.file?.url)
          img = `https:${f.image.fields.file.url}`;
        return {
          id: item.sys.id,
          name: f.name || "",
          price: f.price || 0,
          image: img,
          category: f.category || "",
          inStock: f.inStock ?? true,
        };
      });

      window.allProducts = this.data;
      return this.data;
    } catch (err) {
      console.error("Contentful Error:", err);
      return [];
    }
  },

  updateCategoryCounts() {
    const categories = [
      "singles",
      "complimentary",
      "sofas",
      "beds",
      "fittings",
    ];
    categories.forEach((cat) => {
      const count = (window.allProducts || []).filter(
        (p) => p.category?.toLowerCase() === cat
      ).length;
      const el = document.querySelector(`[data-cat="${cat}"] .category-count`);
      if (el) el.textContent = `(${count})`;
    });
  },
});

// 4. NAVIGATION SCROLL CLASS
window.addEventListener(
  "scroll",
  () => {
    document.body.classList.toggle("scrolled", window.scrollY > 50);
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
     ).to(
  closeBtn,
  {
    y: 0,
    opacity: 1,
    duration: 0.1,
    ease: "power2.out",
  },
  "-=0.6"
)
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
