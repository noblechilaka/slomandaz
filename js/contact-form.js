// Universal Form Compiler - WhatsApp/Email Popup
window.FormCompiler = {
  init(formId, options = {}) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.compileAndShowPopup(form, options);
    });
  },

  // Add this to the existing forms.js (enhanced compiler)
  compileAndShowPopup(form, options = {}) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const messageLines = [];

    // Page context
    if (options.pageTitle) messageLines.push(`Page: ${options.pageTitle}`);

    // Name (fallback to any text input)
    const nameField = data.name || data.fullName || "";
    if (nameField) messageLines.push(`Name: ${nameField}`);

    // Email
    const emailField = data.email || data.emailAddress || "";
    if (emailField) messageLines.push(`Email: ${emailField}`);

    // Phone (optional)
    const phoneField = data.phone || data.tel || "";
    if (phoneField) messageLines.push(`Phone: ${phoneField}`);

    // Message (fallback to any textarea or third input)
    const messageField = data.message || data.project || data.comments || "";
    if (messageField) {
      messageLines.push(`Message: ${messageField}`);
    }

    // Only required: at least name + email/message
    if (!nameField && !emailField && !messageField) {
      alert("Please fill at least name and email/message.");
      return;
    }

    const fullMessage = messageLines.join("\n\n");
    this.showSendOptions(fullMessage, options);
  },

  showSendOptions(message, options = {}) {
    // Remove existing popup
    document.querySelector(".send-popup")?.remove();

    const popup = document.createElement("div");
    popup.className = "send-popup";
    popup.innerHTML = `
      <div class="send-popup__container">
        <div class="send-popup__header">
          <h3>Send Inquiry</h3>
          <button class="send-popup__close">&times;</button>
        </div>
        <div class="send-popup__preview">
          <div class="preview-title">Your Message Preview:</div>
          <div class="preview-message">${message.replace(/\n/g, "<br>")}</div>
        </div>
        <div class="send-popup__actions">
          <a href="https://wa.me/2348000000000?text=${encodeURIComponent(
            message
          )}" 
             class="send-btn whatsapp" target="_blank" rel="noopener">
            📱 WhatsApp
          </a>
          <a href="mailto:hello@noden.com?subject=New%20Inquiry&body=${encodeURIComponent(
            message
          )}" 
             class="send-btn email" target="_blank" rel="noopener">
            ✉️ Email
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(popup);

    // GSAP entrance
    gsap.fromTo(
      popup,
      { scale: 0.8, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
    );

    // Close handlers
    popup.querySelector(".send-popup__close").onclick = () => this.closePopup();
    popup.onclick = (e) => {
      if (e.target === popup) this.closePopup();
    };
  },

  closePopup() {
    const popup = document.querySelector(".send-popup");
    if (popup) {
      gsap.to(popup, {
        scale: 0.8,
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => popup.remove(),
      });
    }
  },
};

// ESC key closes popup
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    window.FormCompiler.closePopup();
  }
});
