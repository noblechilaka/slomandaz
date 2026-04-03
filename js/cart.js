// js/cart.js - FIXED & UPGRADED
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
  // Load once from storage
  let cart = JSON.parse(localStorage.getItem("nodenCart")) || [];

  // --- CORE FUNCTIONS ---

  function updateCartUI() {
    // Calculate Total Quantity & Price
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    // Update Badge
    if (countBadge) {
      countBadge.textContent = totalQty;
      countBadge.style.display = totalQty > 0 ? "flex" : "none";
    }

    // Enable/Disable Checkout
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

      // Logic: Subtotal per item line
      const subtotal = item.price * item.qty;

      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div>
            <div class="cart-item-name">${item.name}</div>
            <!-- NEW: Show Color If Available -->
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
             <span class="cart-item-price">₦${subtotal.toLocaleString()}</span>
             
             <button onclick="removeFromCart(${index})" class="btn-remove">Remove</button>
          </div>
        </div>
      `;
      itemsContainer.appendChild(card);
    });

    totalEl.textContent = `₦${totalPrice.toLocaleString()}`;
  }

  // --- GLOBAL EXPOSED FUNCTION (Called by Products.js) ---
  window.addToCart = (productData) => {
    // Check if this specific item (ID + Color) exists
    const existing = cart.find(
      (item) =>
        item.id === productData.id && item.color === productData.selectedColor
    );

    if (existing) {
      // If exists, just increment quantity
      existing.qty++;
    } else {
      // If new, add object
      cart.push({
        id: productData.id,
        name: productData.name,
        price: parseFloat(productData.price),
        image: productData.image,
        color: productData.selectedColor,
        condition: productData.condition || "New",
        qty: 1, // Initial Qty
      });
    }

    saveAndRefresh();
    // Optional: Open cart immediately?
    // if(!isOpen) toggleCart();
  };

  // Exposed Remove Function
  window.removeFromCart = (indexToRemove) => {
    cart.splice(indexToRemove, 1);
    saveAndRefresh();
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
    const companyPhone = "2348000000000";

    const lines = cart
      .map((item) => {
        const sub = item.price * item.qty;
        return `• ${item.name} (x${item.qty})\n   ₦${sub.toLocaleString()} [${
          item.condition
        }]`;
      })
      .join("\n");

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    const message = `*NEW ORDER — NODEN®*\n\n${lines}\n\n*TOTAL: ₦${total.toLocaleString()}*\n\nI would like to proceed.`;

    const url = `https://wa.me/${companyPhone}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");

    // Clear cart logic here if desired
  };

  updateCartUI();
});
