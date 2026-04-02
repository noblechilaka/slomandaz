// archive.js — Clean vertical mosaic (replaces old horizontal scroll)

document.addEventListener("DOMContentLoaded", async () => {
  // Wait for ProductsLib
  if (!window.ProductsLib) {
    await new Promise((r) => setTimeout(r, 200));
  }
  await window.ProductsLib.loadProducts();

  const grid = document.getElementById("archiveGrid");
  if (!grid) return;

  const products = window.ProductsLib.products;

  // Group products by collection
  const collections = {
    new: products.filter(
      (p) => p.collections?.includes("new") || p.condition === "new"
    ),
    best: products.filter(
      (p) =>
        p.collections?.includes("bestseller") || p.condition === "bestseller"
    ),
    sale: products.filter(
      (p) =>
        p.collections?.includes("discounted") || p.condition === "discounted"
    ),
  };

  // Update tab counts
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    const key = tab.dataset.tab;
    const list = collections[key] || [];
    const sup = tab.querySelector("sup");
    if (sup) sup.textContent = `(${list.length})`;
  });

  // Render grid
  function renderGrid(key) {
    const items = collections[key] || collections.new;

    grid.innerHTML = items
      .map(
        (product) => `
      <article class="archive-item" data-id="${product.id}">
        <div class="archive-item-img">
          <img src="${product.image}" alt="${product.alt}" loading="lazy" />
        </div>
        <div class="archive-item-info">
          <span class="archive-item-name">${product.name}</span>
          <span class="archive-item-price">$${product.price}</span>
        </div>
      </article>
    `
      )
      .join("");

    // Animate new items in
    gsap.fromTo(
      ".archive-item",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power2.out",
      }
    );
  }

  // Initial render
  renderGrid("new");

  // Tab clicks
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderGrid(tab.dataset.tab);
    });
  });

  // Item clicks → products page
  grid.addEventListener("click", (e) => {
    const item = e.target.closest(".archive-item");
    if (item) {
      const id = item.dataset.id;
      window.location.href = `products.html?id=${id}`;
    }
  });
});
