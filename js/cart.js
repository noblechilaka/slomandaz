// Cart page logic
document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
  
  document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);
});

function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem('nodenCart') || '[]');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartBadgeEl = document.getElementById('cartBadge');
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  
  cartBadgeEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Your cart is empty</p>';
    cartTotalEl.style.display = 'none';
    placeOrderBtn.style.display = 'none';
    return;
  }
  
  let total = 0;
  cartItemsEl.innerHTML = cart.map((item, index) => {
    total += item.price * item.qty;
    return `
      <div class="cart-item" style="display: flex; gap: 20px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--divider);">
        <img src="${item.image || ''}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
        <div style="flex: 1;">
          <h3 style="margin: 0 0 4px 0; font-size: 18px;">${item.name}</h3>
          <p style="margin: 0 0 4px 0; color: var(--text-muted);">Color: ${item.color}</p>
          <div style="display: flex; gap: 12px; align-items: center;">
            <span style="font-weight: 500;">$${item.price.toLocaleString()}</span>
            <span>Qty: ${item.qty}</span>
            <button onclick="removeFromCart(${index})" style="background: none; border: 1px solid var(--divider); padding: 4px 12px; border-radius: 4px; cursor: pointer;">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  cartTotalEl.innerHTML = `<strong>Total: $${total.toLocaleString()}</strong>`;
  cartTotalEl.style.display = 'block';
  placeOrderBtn.style.display = 'block';
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('nodenCart') || '[]');
  cart.splice(index, 1);
  localStorage.setItem('nodenCart', JSON.stringify(cart));
  updateCartDisplay();
}

function placeOrder() {
  const cart = JSON.parse(localStorage.getItem('nodenCart') || '[]');
  if (cart.length === 0) return;
  
  // Compile order message
  const lines = cart.map(item => {
    const subtotal = item.price * item.qty;
    return `${item.qty}x ${item.name} (${item.color}) - $${subtotal.toLocaleString()}`;
  });
  
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const message = `*NEW ORDER — NODEN®*

${lines.join('\n\n')}

*Total: $${total.toLocaleString()}*

Send to company WhatsApp.`.replace(/\n/g, '%0A');
  
  const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`; // Replace with real number
  window.open(whatsappUrl, '_blank');
  
  // Clear cart
  localStorage.removeItem('nodenCart');
  
  // Show confirmation
  document.getElementById('orderConfirm').style.display = 'block';
  document.getElementById('cartItems').innerHTML = '<p style="text-align: center; color: var(--text-muted);">Order placed successfully!</p>';
  updateCartDisplay();
}

