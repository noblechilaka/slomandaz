document.addEventListener("DOMContentLoaded", async () => {
  const archiveLoader = document.getElementById("archiveLoader");
  const grid = document.getElementById("archiveGrid");

  try {
    archiveLoader.classList.remove("hidden");

    await window.ProductsLib.loadProducts();
    const products = window.ProductsLib.products;

    console.log("📦 Archive products loaded:", products.length);

    if (!products || products.length === 0) {
      grid.innerHTML = `
        <div style="text-align:center; padding: 60px 20px; color: var(--text-muted);">
          No products available at this time.
        </div>
      `;
      archiveLoader.classList.add("hidden");
      return;
    }

    // SMART FILTERING with AUTO-ASSIGNMENT
    const filterByTag = (tag) => {
      return products.filter((p) => {
        // Has collections array with the tag
        if (p.collections?.includes(tag)) return true;
        // Has condition field matching the tag
        if (p.condition === tag) return true;
        // FALLBACK: If product has NO collections at all, assign to "new"
        if (tag === "new" && (!p.collections || p.collections.length === 0)) {
          console.log(
            `📌 Auto-assigned "${p.name}" to New Arrivals (no collections)`
          );
          return true;
        }
        return false;
      });
    };

    const collections = {
      new: filterByTag("new"),
      best: filterByTag("bestseller"),
      sale: filterByTag("discounted"),
    };

    console.log("📊 Collections:", {
      new: collections.new.length,
      best: collections.best.length,
      sale: collections.sale.length,
      untagged: products.filter(
        (p) => !p.collections || p.collections.length === 0
      ).length,
    });

    // EMERGENCY FALLBACK: If all tabs are empty, distribute products
    if (
      collections.new.length === 0 &&
      collections.best.length === 0 &&
      collections.sale.length === 0
    ) {
      console.warn("⚠️ No tagged products - distributing all products evenly");
      // Put everything in "new" as default
      collections.new = products;
      collections.best = []; // Keep these empty to show they need tagging
      collections.sale = [];
    }

    // Update tab counts
    document.querySelectorAll(".tab").forEach((tab) => {
      const key = tab.dataset.tab;
      const count = collections[key]?.length || 0;
      const sup = tab.querySelector("sup");
      if (sup) sup.textContent = `(${count})`;
    });

    function afterArchiveRender() {
      requestAnimationFrame(() => {
        window.runArchiveReveal?.();
        window.refreshSmoothScroll?.();
      });
    }

    function renderGrid(key) {
      const items = collections[key] || [];

      if (items.length === 0) {
        grid.innerHTML = `
          <div style="text-align:center; padding: 60px 20px; color: var(--text-muted);">
            <p style="font-size: 1.1em; margin-bottom: 10px;">No products in this collection yet.</p>
            <p style="font-size: 0.9em; opacity: 0.7;">Check back soon or browse other categories.</p>
          </div>
        `;
        afterArchiveRender();
        return;
      }

      grid.innerHTML = items
        .map(
          (product) => `
        <article class="archive-item" data-id="${product.id}">
          <div class="archive-item-img">
            <img src="${product.image}" alt="${product.alt}" loading="lazy" />
            <button class="archive-add-btn" onclick="quickAddToCart('${
              product.id
            }')">
              Add to Bag
            </button>
          </div>
          <div class="archive-item-info">
            <span class="archive-item-name">${product.name}</span>
            <span class="archive-item-price">₦${product.price.toLocaleString()}</span>
          </div>
        </article>
      `
        )
        .join("");

      const images = grid.querySelectorAll("img");
      let loadedCount = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        afterArchiveRender();
        return;
      }

      images.forEach((img) => {
        const checkLoaded = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            afterArchiveRender();
          }
        };

        if (img.complete) {
          checkLoaded();
        } else {
          img.addEventListener("load", checkLoaded, { once: true });
          img.addEventListener("error", checkLoaded, { once: true });
        }
      });
    }

    // Initial render
    renderGrid("new");

    // Tab switching
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document
          .querySelectorAll(".tab")
          .forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        renderGrid(tab.dataset.tab);
      });
    });

    archiveLoader.classList.add("hidden");

    // Quick add to cart
    window.quickAddToCart = (id) => {
      const product = window.ProductsLib.products.find((p) => p.id === id);
      if (!product) {
        console.error("Product not found:", id);
        return;
      }

      if (typeof window.addToCart !== "function") {
        console.error("addToCart function not found - is cart.js loaded?");
        return;
      }

      window.addToCart({
        ...product,
        selectedColor: product.colors?.[0] || "Standard",
      });

      const btn = event?.target;
      if (btn) {
        const originalText = btn.textContent;
        const originalBg = btn.style.background;
        btn.style.background = "#4ade80";
        btn.textContent = "Added!";
        setTimeout(() => {
          btn.style.background = originalBg;
          btn.textContent = originalText;
        }, 1200);
      }
    };
  } catch (error) {
    console.error("❌ Archive load error:", error);
    grid.innerHTML = `
      <div style="text-align:center; padding: 60px 20px; color: var(--text-muted);">
        Failed to load products. Please refresh.
        <br><small style="opacity: 0.6;">${error.message}</small>
      </div>
    `;
    archiveLoader.classList.add("hidden");
  }

  // Click handler for product cards
  grid.addEventListener("click", (e) => {
    const item = e.target.closest(".archive-item");
    if (item && !e.target.classList.contains("archive-add-btn")) {
      const id = item.dataset.id;
      window.location.href = `/products/index.html?id=${id}`;
    }
  });
});
