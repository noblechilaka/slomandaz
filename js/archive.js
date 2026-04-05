// archive.js — Upgraded with Quick Add Overlay

document.addEventListener("DOMContentLoaded", async () => {
  try {
    if (!window.ProductsLib) await new Promise((r) => setTimeout(r, 200));
    await window.ProductsLib.loadProducts();

    const grid = document.getElementById("archiveGrid");
    if (!grid) {
      console.warn("Archive grid element not found");
      return;
    }

    const products = window.ProductsLib.products;
    console.log("Products loaded:", products); // Debug log
    
    if (!products || products.length === 0) {
      console.warn("No products found");
      return;
    }

    // Group products
    const collections = {
      new: products.filter(
        (p) => p.collections?.includes("new") || p.condition?.toLowerCase() === "new"
      ),
      best: products.filter(
        (p) =>
          p.collections?.includes("bestseller") || p.condition?.toLowerCase() === "bestseller"
      ),
      sale: products.filter(
        (p) =>
          p.collections?.includes("discounted") || p.condition?.toLowerCase() === "discounted"
      ),
    };
    
    console.log("Collections:", collections); // Debug log

    // Update Tab Counts
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => {
      const key = tab.dataset.tab;
      const list = collections[key] || [];
      console.log(`Tab ${key} count: ${list.length}`); // Debug log
      const sup = tab.querySelector("sup");
      if (sup) sup.textContent = `(${list.length})`;
    });

    // Render Grid Function
    function renderGrid(key) {
      const items = collections[key] || collections.new;
      console.log(`Rendering ${items.length} items for ${key} collection`); // Debug log

      grid.innerHTML = items
        .map(
          (product) => `
      <article class="archive-item" data-id="${product.id}">
        <div class="archive-item-img">
          <img src="${product.image}" alt="${product.alt}" loading="lazy" />
          
          <!-- NEW BUTTON OVERLAY -->
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

      gsap.fromTo(
        ".archive-item",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: "power2.out" }
      );
    }

    // Initial Render
    renderGrid("new");

    // Tab Clicks
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        renderGrid(tab.dataset.tab);
      });
    });

    // Fallback: Clicking the Card still redirects to products.html
    grid.addEventListener("click", (e) => {
      const item = e.target.closest(".archive-item");
      if (item && !e.target.classList.contains("archive-add-btn")) {
        const id = item.dataset.id;
        window.location.href = `products.html?id=${id}`;
      }
    });
  } catch (error) {
    console.error("Error in archive script:", error);
  }
});

// GLOBAL HELPER FOR THE BUTTON CLICK
window.quickAddToCart = (id) => {
  try {
    // Find the full product data from our loaded library
    const product = window.ProductsLib.products.find((p) => p.id == id);

    if (product && window.addToCart) {
      window.addToCart({
        ...product,
        selectedColor:
          product.colors && product.colors[0] ? product.colors[0] : "Standard",
      });

      // Optional: Give visual feedback on the button itself
      const clickedBtn = event.target;
      const originalText = clickedBtn.innerText;
      clickedBtn.innerText = "Added!";
      clickedBtn.style.background = "var(--ink)";
      clickedBtn.style.color = "#fff";

      setTimeout(() => {
        clickedBtn.innerText = originalText;
        clickedBtn.style.background = "rgba(255, 255, 255, 0.95)";
        clickedBtn.style.color = "var(--ink)";
      }, 1500);
    }
  } catch (error) {
    console.error("Error in quick add to cart:", error);
  }
};