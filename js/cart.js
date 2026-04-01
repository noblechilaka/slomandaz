// js/cart.js - SLIDE IN CART & WHATSAPP CHECKOUT

document.addEventListener("DOMContentLoaded", () => {
  // --- SELECTORS ---
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  const btnOpen = document.getElementById("cartBtn");
  const btnClose = document.getElementById("closeCartBtn");
  const itemsContainer = document.getElementById("cartItemsContainer");
  const totalEl = document.getElementById("cartTotal");
  const countBadge = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const emptyState = document.getElementById("emptyState");

  let isOpen = false;
  let cart = JSON.parse(localStorage.getItem("nodenCart")) || [];

  // --- INIT ---
  updateCartUI();

  // --- EVENTS ---

  // Open/Close
  btnOpen.onclick = toggleCart;
  btnClose.onclick = closeCart;
  overlay.onclick = closeCart;

  // Toggle Function
  function toggleCart() {
    isOpen = !isOpen;
    if (isOpen) openCart();
    else closeCart();
  }

  function openCart() {
    drawer.style.right = "0";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    gsap.to([drawer, overlay], { autoAlpha: 1, duration: 0 }); // GSAP help for clean entry
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    drawer.style.right = "-100%";
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    setTimeout(() => (document.body.style.overflow = ""), 400);
  }

  // Global Expose for Products Modal
  window.addToCart = (productIndex) => {
    const product = window.allProducts[productIndex];

    // Simple check if product already exists
    const existing = cart.find((item) => item.id === product.id);
    if (existing) return; // Prevent duplicates in simple logic

    cart.push({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      condition: product.condition,
    });

    saveAndRefresh();

    // If modal is open, maybe show small confirmation?
    // For now, we just update storage.
  };

  // Remove Item
  window.removeFromCart = (indexToRemove) => {
    cart.splice(indexToRemove, 1);
    saveAndRefresh();
  };

  function saveAndRefresh() {
    localStorage.setItem("nodenCart", JSON.stringify(cart));
    updateCartUI();
  }

  // Render UI
  function updateCartUI() {
    // Count Badge
    if (cart.length > 0) {
      countBadge.style.display = "block";
      countBadge.textContent = cart.length;
      checkoutBtn.disabled = false;
      checkoutBtn.style.background = "#1a1a1a";
      checkoutBtn.style.cursor = "pointer";
    } else {
      countBadge.style.display = "none";
      checkoutBtn.disabled = true;
      checkoutBtn.style.background = "#ccc";
      checkoutBtn.style.cursor = "not-allowed";
    }

    // Items List
    itemsContainer.innerHTML = "";

    if (cart.length === 0) {
      itemsContainer.appendChild(emptyState);
      emptyState.style.display = "block";
      totalEl.textContent = "$0";
      return;
    }

    emptyState.style.display = "none";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;

      const el = document.createElement("div");
      el.style.cssText =
        "display:flex; gap:16px; margin-bottom:20px; align-items:flex-start; animation: fadeIn 0.3s ease forwards;";

      el.innerHTML = `
        <img src="${
          item.image
        }" style="width:60px; height:60px; object-fit:cover; border-radius:2px;">
        <div style="flex:1;">
          <div style="font-size:14px; font-weight:500; margin-bottom:4px; line-height:1.3;">${
            item.name
          }</div>
          <div style="font-size:12px; color:#888; margin-bottom:8px;">Condition: ${
            item.condition
          }</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:600;">$${item.price.toLocaleString()}</span>
            <button onclick="removeFromCart(${index})" style="border:none; background:none; color:#d9534f; font-size:12px; cursor:pointer; text-decoration:underline;">Remove</button>
          </div>
        </div>
      `;
      itemsContainer.appendChild(el);
    });

    totalEl.textContent = `$${total.toLocaleString()}`;
  }

  // WHATSAPP GENERATION
  checkoutBtn.onclick = () => {
    const companyPhone = "2348000000000"; // REPLACE WITH REAL NUMBER

    const lines = cart
      .map((item) => {
        return `• ${item.name} ($${item.price.toLocaleString()}) [${
          item.condition
        }]`;
      })
      .join("\n");

    const total = cart.reduce((sum, i) => sum + i.price, 0);

    const message = `*NEW ORDER REQUEST — NODEN®*\n\n${lines}\n\n*TOTAL: $${total.toLocaleString()}*\n\nI would like to proceed with this selection.`;

    const url = `https://wa.me/${companyPhone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");

    // Optional: Clear cart after sending
    // cart = [];
    // localStorage.removeItem('nodenCart');
    // updateCartUI();
    // closeCart();
  };
});
