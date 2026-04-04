// js/products.js
// Removed duplicate registerPlugin call

// Global state references
let currentProductIndex = -1;
let selectedColor = null; // Stores the clicked color name

// Extend ProductsLib with additional functionality
window.ProductsLib = window.ProductsLib || { data: [], products: [] };

// Add or update specific methods without replacing the whole object
Object.assign(window.ProductsLib, {
  async loadProducts() {
    if (this.data && this.data.length > 0) {
      this.products = this.data;
      return this.products;
    }
    try {
      const response = await fetch("data/products.json");
      const data = await response.json();
      this.products = data;
      this.data = data;
      window.allProducts = data;
      return data;
    } catch (error) {
      console.error("Failed to load products:", error);
      return [];
    }
  },

  generateGridProducts: function(gridEl, products = null, onCardClick = null) {
    const prods = products || this.products;
    gridEl.innerHTML = "";

    prods.forEach((product) => {
      const globalIndex = this.products.indexOf(product);

      const card = document.createElement("article");
      card.className = `archive-item ${product.span} ${product.height} reveal`;
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
        <div class="archive-item-img">
          <img src="${product.image}" alt="${product.alt}" loading="lazy" />
          <button class="archive-add-btn" onclick="quickAddToCart('${product.id}')">
            Add to Bag
          </button>
        </div>
        <div class="archive-item-info">
          <span class="archive-item-name">${product.name}</span>
          <span class="archive-item-price">₦${product.price.toLocaleString()}</span>
        </div>
      `;
      gridEl.appendChild(card);
    });
  },

  initFilters: function(gridEl, filtersSelector = ".filter") {
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

      gsap.to(gridEl.querySelectorAll(".archive-item"), {
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
            gridEl.querySelectorAll(".archive-item"),
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
  }
});