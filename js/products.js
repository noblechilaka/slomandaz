// js/products.js
// Removed duplicate registerPlugin call

// Global state references
let currentProductIndex = -1;
let selectedColor = null; // Stores the clicked color name

// Products Library Logic
window.ProductsLib = {
  products: [],

  async loadProducts() {
    try {
      const response = await fetch("data/products.json");
      this.products = await response.json();

      // Create an indexed lookup for easier access later
      window.allProducts = this.products;

      return this.products;
    } catch (error) {
      console.error("Failed to load products:", error);
      return [];
    }
  },

  generateGridProducts(gridEl, products = null, onCardClick = null) {
    const prods = products || this.products;
    gridEl.innerHTML = "";

    prods.forEach((product) => {
      const globalIndex = this.products.indexOf(product);

      const card = document.createElement("article");
      card.className = `p-card ${product.span} ${product.height} reveal`;
      card.dataset.cat = product.category.toLowerCase();
      card.dataset.previewText = `${
        product.name
      } — ₦${product.price.toLocaleString()}`;
      card.dataset.productIndex = globalIndex;

      // Pass index to open modal
      if (onCardClick) {
        card.addEventListener("click", () => onCardClick(globalIndex));
      }

      card.innerHTML = `
        <div class="p-card__media">
          <img alt="${product.alt}" src="${product.image}" loading="lazy" />
        </div>
        <div class="p-card__caption">
          <span class="p-card__name">${product.name}</span>
          <div>
            <span class="p-card__price">₦${product.price.toLocaleString()}</span>
            <span class="product-status ${product.condition || "new"}">${
        product.condition || "new"
      }</span>
          </div>
        </div>
      `;
      gridEl.appendChild(card);
    });
  },

  initFilters(gridEl, filtersSelector = ".filter") {
    // ... (Keep your existing filter logic exactly as it was) ...
    const filters = Array.from(document.querySelectorAll(filtersSelector));

    window.setActiveFilter = (filterKey) => {
      filters.forEach((f) =>
        f.classList.toggle(
          "is-active",
          f.dataset.filter?.toLowerCase() === filterKey.toLowerCase()
        )
      );
      const filterLower = filterKey.toLowerCase();
      let filteredProds;

      if (filterLower === "all") filteredProds = this.products;
      else if (["new", "bestseller", "discounted"].includes(filterLower))
        filteredProds = this.products.filter(
          (p) => p.condition.toLowerCase() === filterLower
        );
      else
        filteredProds = this.products.filter(
          (p) => p.category.toLowerCase() === filterLower
        );

      gsap.to(gridEl.querySelectorAll(".p-card"), {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        onComplete: () => {
          this.generateGridProducts(gridEl, filteredProds, (globalIndex) =>
            window.openProductModal?.(globalIndex)
          );
          gsap.fromTo(
            gridEl.querySelectorAll(".p-card"),
            { opacity: 0, y: 30, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(1.7)",
              onComplete: () => ScrollTrigger.refresh(),
            }
          );
        },
      });

      localStorage.setItem("activeFilter", filterKey);
      const newUrl = new URL(window.location);
      if (filterLower === "all") newUrl.searchParams.delete("filter");
      else newUrl.searchParams.set("filter", filterLower);
      window.history.replaceState({}, "", newUrl);
    };

    filters.forEach((f) => {
      f.addEventListener("click", () =>
        window.setActiveFilter(f.dataset.filter)
      );
      f.addEventListener("keydown", (e) => {
        if (e.key === "Enter") window.setActiveFilter(f.dataset.filter);
      });
    });
  },
};

// Modal Logic
function ensureModalExists() {
  let backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) return backdrop;

  backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal-container" role="dialog" aria-modal="true">
      <div class="modal-left">
        <img id="modalHeroImg" src="" alt="">
      </div>
      <div class="modal-right">
        <div class="modal-top">
          <div>
            <div class="modal-title" id="modalTitle"></div>
            <div class="modal-price" id="modalPrice"></div>
          </div>
          <button class="modal-close" type="button" aria-label="Close">&times;</button>
        </div>
        <div class="modal-grid">
          <div class="modal-field"><div class="modal-label">Size</div><div class="modal-value" id="modalSize"></div></div>
          <div class="modal-field"><div class="modal-label">Dimensions</div><div class="modal-value" id="modalDimensions"></div></div>
        </div>
        <div class="modal-colors-title">Available Colours</div>
        <div class="modal-colors" id="modalColors"></div>
        <button class="modal-cta" type="button" id="addToCartBtn">Add to Cart</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
  return backdrop;
}

function setModalOpen(open) {
  const backdrop = ensureModalExists();
  if (open) backdrop.classList.add("active");
  else backdrop.classList.remove("active");
}

window.closeProductModal = () => {
  setModalOpen(false);
  currentProductIndex = -1;
  selectedColor = null;
};

window.openProductModal = (index) => {
  const products = window.allProducts; // Use the global populated array
  const product = products[index];
  if (!product) return;

  currentProductIndex = index;
  const backdrop = ensureModalExists();

  backdrop.querySelector("#modalHeroImg").src = product.image;
  backdrop.querySelector("#modalTitle").textContent = product.name;
  backdrop.querySelector(
    "#modalPrice"
  ).textContent = `₦${product.price.toLocaleString()}`;
  backdrop.querySelector("#modalSize").textContent = product.size || "";
  backdrop.querySelector("#modalDimensions").textContent =
    product.dimensions || "";

  const colorsWrap = backdrop.querySelector("#modalColors");
  colorsWrap.innerHTML = "";

  // Default first color or empty
  selectedColor = (product.colors && product.colors[0]) || "Standard";

  (product.colors || []).forEach((c, i) => {
    const chip = document.createElement("div");
    chip.className = "color-chip" + (i === 0 ? " active" : "");
    chip.textContent = c;
    chip.addEventListener("click", () => {
      colorsWrap.querySelector(".active")?.classList.remove("active");
      chip.classList.add("active");
      selectedColor = c;
    });
    colorsWrap.appendChild(chip);
  });

  const btn = backdrop.querySelector("#addToCartBtn");
  btn.textContent = "Add to Cart";
  btn.classList.remove("added");
  setModalOpen(true);

  gsap.fromTo(
    backdrop.querySelector(".modal-container"),
    { y: 10, opacity: 0, scale: 0.98 },
    { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
  );
};

// Wire listeners
document.addEventListener("click", (e) => {
  const backdrop = document.querySelector(".modal-backdrop.active");
  if (!backdrop) return;
  if (e.target.closest(".modal-close") || e.target === backdrop)
    window.closeProductModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") window.closeProductModal();
});

// --- CRITICAL FIX FOR ADD TO CART ---
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("#addToCartBtn");
  if (!btn) return;
  if (currentProductIndex < 0) return;

  const products = window.allProducts;
  if (!products) await window.ProductsLib.loadProducts();

  const product = products[currentProductIndex];
  if (!product) return;

  if (!product.inStock || product.stockCount <= 0) {
    alert("Out of Stock.");
    return;
  }

  // FIX: Send full object including the currently selected color
  if (window.addToCart) {
    window.addToCart({
      ...product,
      selectedColor: selectedColor,
    });

    // Feedback Animation
    btn.textContent = "Added!";
    btn.classList.add("added");
    gsap.fromTo(
      btn,
      { scale: 1 },
      { scale: 0.98, duration: 0.1, yoyo: true, repeat: 1 }
    );

    // FIX: Auto-Close Modal
    setTimeout(() => {
      window.closeProductModal();
      btn.textContent = "Add to Cart";
      btn.classList.remove("added");
    }, 1000);
  }
});
