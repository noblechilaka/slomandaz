document.addEventListener("DOMContentLoaded", async () => {
  // Get loader and grid elements
  const archiveLoader = document.getElementById("archiveLoader");
  const grid = document.getElementById("archiveGrid");

  try {
    // Show loader immediately on page load
    archiveLoader.classList.remove("hidden");

    // Wait for ProductsLib to load
    if (!window.ProductsLib) await new Promise((r) => setTimeout(r, 200));
    await window.ProductsLib.loadProducts();

    const products = window.ProductsLib.products;
    console.log("Products loaded:", products);

    if (!products || products.length === 0) {
      // Show empty state if no products
      grid.innerHTML = `
        <div style="text-align:center; padding: 60px 20px; color: var(--text-muted);">
          No products available at this time.
        </div>
      `;
      archiveLoader.classList.add("hidden");
      afterArchiveRender();
      return;
    }

    // Group products (your existing logic)
    const collections = {
      new: products.filter(
        (p) =>
          p.collections?.includes("new") || p.condition?.toLowerCase() === "new"
      ),
      best: products.filter(
        (p) =>
          p.collections?.includes("bestseller") ||
          p.condition?.toLowerCase() === "bestseller"
      ),
      sale: products.filter(
        (p) =>
          p.collections?.includes("discounted") ||
          p.condition?.toLowerCase() === "discounted"
      ),
    };

    // Update tab counts (your existing logic)
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

    // Render grid (your existing logic)
    function renderGrid(key) {
      const items = collections[key] || collections.new;
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
      images.forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", afterArchiveRender, { once: true });
          img.addEventListener("error", afterArchiveRender, { once: true });
        }
      });

      afterArchiveRender();
    }

    // Initial render
    renderGrid("new");

    // Tab click handlers (your existing logic)
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document
          .querySelectorAll(".tab")
          .forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        renderGrid(tab.dataset.tab);
      });
    });

    // Hide loader after successful render
    archiveLoader.classList.add("hidden");
    afterArchiveRender();
  } catch (error) {
    console.error("Archive load error:", error);
    // Show error state
    grid.innerHTML = `
      <div style="text-align:center; padding: 60px 20px; color: var(--text-muted);">
        Failed to load products. Please refresh the page or try again later.
      </div>
    `;
    archiveLoader.classList.add("hidden");
  }

  // Your existing grid click handler
  grid.addEventListener("click", (e) => {
    const item = e.target.closest(".archive-item");
    if (item && !e.target.classList.contains("archive-add-btn")) {
      const id = item.dataset.id;
      window.location.href = `products.html?id=${id}`;
    }
  });
});
