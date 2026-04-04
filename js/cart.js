// js/cart.js - COMPLETE REWRITE WITH SMART LOGIC

document.addEventListener("DOMContentLoaded", () => {
  // Selectors
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

  // --- 1. CORE FUNCTIONS ---

  function updateCartUI() {
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    // Badge
    if (countBadge) {
      countBadge.textContent = totalQty;
      countBadge.style.display = totalQty > 0 ? "flex" : "none";
    }

    // Checkout State
    if (cart.length === 0) {
      checkoutBtn.disabled = true;
      checkoutBtn.style.background = "rgba(20, 20, 20, 0.2)";
      checkoutBtn.style.cursor = "not-allowed";
    } else {
      checkoutBtn.disabled = false;
      checkoutBtn.style.background = "var(--ink)";
      checkoutBtn.style.color = "#fff";
      checkoutBtn.style.cursor = "pointer";
    }

    // Render List
    itemsContainer.innerHTML = "";

    if (cart.length === 0) {
      itemsContainer.appendChild(emptyState);
      emptyState.style.display = "block";
      totalEl.textContent = "₦0";
      return;
    }

    emptyState.style.display = "none";

    cart.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "cart-item-card";

      const subtotal = item.price * item.qty;

      // New Structure with +/- Buttons
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div>
            <div class="cart-item-name">${item.name}</div>
            ${
              item.color
                ? `<div class="cart-item-meta">Color: ${item.color}</div>`
                : ""
            }
            ${
              item.condition
                ? `<div class="cart-item-meta">Condition: ${item.condition}</div>`
                : ""
            }
          </div>
          
          <div class="cart-item-actions">
             <!-- Subtotal -->
             <span class="cart-item-price">₦${subtotal.toLocaleString()}</span>
             
             <!-- Qty Controls -->
             <div class="cart-item-qty-wrapper">
               <button onclick="updateCartItemQty(${index}, -1)" class="btn-qty">-</button>
               <span class="cart-qty-text">${item.qty}</span>
               <button onclick="updateCartItemQty(${index}, 1)" class="btn-qty">+</button>
             </div>

             <!-- Remove Btn moved here -->
             <button onclick="removeFromCart(${index})" class="btn-remove" style="margin-left: auto;">Remove</button>
          </div>
        </div>
      `;
      itemsContainer.appendChild(card);
    });

    totalEl.textContent = `₦${totalPrice.toLocaleString()}`;
  }

  // Global Add Function
  window.addToCart = (productData) => {
    // Find matching ID AND Color
    const existing = cart.find(
      (item) =>
        item.id === productData.id && item.color === productData.selectedColor
    );

    if (existing) {
      // Increment Qty
      existing.qty++;
    } else {
      // Push new object with qty: 1
      cart.push({
        id: productData.id,
        name: productData.name,
        price: parseFloat(productData.price),
        image: productData.image,
        color: productData.selectedColor || "Standard",
        condition: productData.condition || "New",
        qty: 1,
      });
    }

    saveAndRefresh();
    // Optional: Open cart immediately
    // if(!isOpen) toggleCart();
  };

  // Global Remove Function
  window.removeFromCart = (indexToRemove) => {
    cart.splice(indexToRemove, 1);
    saveAndRefresh();
  };

  // Global Update Quantity Function (+ / -)
  window.updateCartItemQty = (index, change) => {
    const item = cart[index];
    if (!item) return;

    const newQty = item.qty + change;

    if (newQty <= 0) {
      removeFromCart(index); // Remove if zero
    } else {
      item.qty = newQty;
      saveAndRefresh();
    }
  };

  function saveAndRefresh() {
    localStorage.setItem("nodenCart", JSON.stringify(cart));
    updateCartUI();
  }

  // --- EVENTS ---
  btnOpen.onclick = toggleCart;
  btnClose.onclick = closeCart;
  overlay.onclick = closeCart;

  function toggleCart() {
    isOpen = !isOpen;
    if (isOpen) openCart();
    else closeCart();
  }

  function openCart() {
    drawer.style.right = "0";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    drawer.style.right = "-100%";
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    setTimeout(() => (document.body.style.overflow = ""), 400);
  }

  // WhatsApp Generation
  checkoutBtn.onclick = () => {
    const companyPhone = "2348034550910";

    const lines = cart
      .map((item) => {
        const sub = item.price * item.qty;
        return `• ${item.name} (x${item.qty})\n   ₦${sub.toLocaleString()} [${
          item.condition
        }]`;
      })
      .join("\n");

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    const message = `*NEW ORDER — SLOMANDAZ*\n\n${lines}\n\n*TOTAL: ₦${total.toLocaleString()}*\n\nI would like to proceed.`;

    const url = `https://wa.me/${companyPhone}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  updateCartUI();
});
