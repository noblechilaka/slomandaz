// js/products.js — WITH FIXED MODAL + FILTER CLICK + JSON FIELDS

// BLACKBOXAI FIXED: No duplicate registerPlugin
// Products grid/modal now modular

// --------------------
// CART + MODAL STATE (FIX #1)
// --------------------
let currentProductIndex = -1;
let selectedColor = null;
let cart = JSON.parse(localStorage.getItem("nodenCart") || "[]");

// Products Library - Reusable across pages
window.ProductsLib = {
  products: [],
  async loadProducts() {
    try {
      const response = await fetch("data/products.json");
      this.products = await response.json();
      
      window.productsData = this.products; // For modal
      return this.products;
    } catch (error) {
      console.error("Failed to load products:", error);
      return [];
    }
  },

  updateCategoryCounts(catListEl) {
    if (!catListEl || !catListEl.querySelectorAll) return;

    const categories = {};
    this.products.forEach((p) => {
      const cat = p.category.toLowerCase();
      categories[cat] = (categories[cat] || 0) + 1;
    });

    catListEl.querySelectorAll(".category-count").forEach((sup) => {
      const item = sup.closest(".category-item");
      const cat = item.dataset.cat;
      sup.textContent = `(${categories[cat] || 0})`;
    });
  },

  generateReelProducts(reelTrackEl, count = 6) {
    reelTrackEl.innerHTML = "";
    const sample = this.products.slice(0, count);
    sample.forEach((product) => {
      const card = document.createElement("article");
      card.className = "product-card";
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
      reelTrackEl.appendChild(card);
    });
  },

  generateGridProducts(gridEl, products = null, onCardClick = null) {
    const prods = products || this.products;
    gridEl.innerHTML = "";

    prods.forEach((product) => {
      // FIX #2: pass GLOBAL INDEX (not filtered index)
      const globalIndex = this.products.indexOf(product);

      const card = document.createElement("article");
      card.className = `p-card ${product.span} ${product.height} reveal`;
      card.dataset.cat = product.category.toLowerCase();
      card.dataset.previewText = `${product.name} — $${product.price}`;
      card.dataset.productIndex = globalIndex;

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
            <span class="p-card__price">$${product.price}</span>
            <span class="product-status ${product.condition || 'new'}">${product.condition ? product.condition.charAt(0).toUpperCase() + product.condition.slice(1) : 'New'}</span>
          </div>
        </div>
      `;

      gridEl.appendChild(card);
    });
  },

  initFilters(gridEl, filtersSelector = ".filter") {
    const filters = Array.from(document.querySelectorAll(filtersSelector));

    window.setActiveFilter = (filterKey) => {
      // Visual active state
      filters.forEach((f) =>
        f.classList.toggle(
          "is-active",
          f.dataset.filter?.toLowerCase() === filterKey.toLowerCase()
        )
      );

      const filterLower = filterKey.toLowerCase();
      let filteredProds;

      if (filterLower === "all") {
        filteredProds = this.products;
      } else if (["new", "bestseller", "discounted"].includes(filterLower)) {
        // Filter by condition
        filteredProds = this.products.filter(
          (p) => p.condition.toLowerCase() === filterLower
        );
      } else {
        // Filter by category
        filteredProds = this.products.filter(
          (p) => p.category.toLowerCase() === filterLower
        );
      }

      // Smooth transition + regenerate
      gsap.to(gridEl.querySelectorAll(".p-card"), {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        onComplete: () => {
          // IMPORTANT: pass click handler so modal works after filtering
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

      // Update URL without reload
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
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.setActiveFilter(f.dataset.filter);
        }
      });
    });
  },

  initAnimations() {
    const learnMore = document.querySelector(".learn-more");
    if (!learnMore) return;

    learnMore.addEventListener("mouseenter", () => {
      gsap.to(learnMore.querySelector(".arrow"), {
        x: 8,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    learnMore.addEventListener("mouseleave", () => {
      gsap.to(learnMore.querySelector(".arrow"), {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  },
};

// Helper function to determine condition by index
function getConditionByIndex(index) {
  // This is not needed since we now have the condition in the data
}

// ===============================
// MODAL (FIXED)
// ===============================

function ensureModalExists() {
  let backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) return backdrop;

  backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal-container" role="dialog" aria-modal="true" aria-label="Product details">
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
          <div class="modal-field">
            <div class="modal-label">Size</div>
            <div class="modal-value" id="modalSize"></div>
          </div>
          <div class="modal-field">
            <div class="modal-label">Dimensions</div>
            <div class="modal-value" id="modalDimensions"></div>
          </div>
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
  const products = window.productsData || [];
  const product = products[index];
  if (!product) return;

  currentProductIndex = index;
  const backdrop = ensureModalExists();

  // Fill fields
  backdrop.querySelector("#modalHeroImg").src = product.image;
  backdrop.querySelector("#modalHeroImg").alt = product.alt || product.name;
  backdrop.querySelector("#modalTitle").textContent = product.name;
  backdrop.querySelector("#modalPrice").textContent = `$${product.price}`;
  backdrop.querySelector("#modalSize").textContent = product.size || "";
  backdrop.querySelector("#modalDimensions").textContent = product.dimensions || "";

  // Colours
  const colorsWrap = backdrop.querySelector("#modalColors");
  colorsWrap.innerHTML = "";
  selectedColor = (product.colors && product.colors[0]) || null;

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

  // Button
  const btn = backdrop.querySelector("#addToCartBtn");
  btn.textContent = "Add to Cart";
  btn.classList.remove("added");

  setModalOpen(true);

  // Subtle animation
  gsap.fromTo(backdrop.querySelector(".modal-container"),
    { y: 10, opacity: 0, scale: 0.98 },
    { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
  );
};

// Wire close actions once
document.addEventListener("click", (e) => {
  const backdrop = document.querySelector(".modal-backdrop.active");
  if (!backdrop) return;

  if (e.target.closest(".modal-close")) window.closeProductModal();
  if (e.target === backdrop) window.closeProductModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") window.closeProductModal();
});

// Add to cart
document.addEventListener("click", (e) => {
  const btn = e.target.closest("#addToCartBtn");
  if (!btn) return;
  if (currentProductIndex < 0) return;

  const product = (window.productsData || [])[currentProductIndex];
  if (!product) return;

  // Check if product is in stock
  if (!product.inStock || product.stockCount <= 0) {
    alert("This product is currently out of stock.");
    return;
  }

  // Check if this product with this color is already in cart
  const existingItemIndex = cart.findIndex(
    item => item.id === currentProductIndex && item.color === selectedColor
  );

  if (existingItemIndex >= 0) {
    // Increase quantity
    cart[existingItemIndex].qty += 1;
  } else {
    // Add new item
    cart.push({
      id: currentProductIndex,
      name: product.name,
      price: product.price,
      qty: 1,
      color: selectedColor,
      image: product.image
    });
  }

  localStorage.setItem("nodenCart", JSON.stringify(cart));

  btn.textContent = "Added!";
  btn.classList.add("added");

  gsap.fromTo(btn, { scale: 1 }, { scale: 0.98, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" });
  
  // Dispatch custom event to update cart badge if exists
  window.dispatchEvent(new Event('cartUpdated'));
});

// INSIDE js/products.js -> click listener of #addToCartBtn

modal.querySelector('#addToCartBtn').onclick = () => {
  // ... previous code to set state/color ...

  // Call the new centralized cart function instead of pushing directly
  if(window.addToCart) {
     window.addToCart(currentProductIndex);
     
     // Visual feedback in modal
     const btn = modal.querySelector('#addToCartBtn');
     btn.textContent = "Added!";
     btn.classList.add('added');
     setTimeout(() => {
       btn.textContent = "Add to Cart";
       btn.classList.remove('added');
     }, 2000);
  }
};