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

    const whatsappSVG = `
      <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" focusable="false" style="vertical-align:middle;margin-right:6px;">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.65.87 5.1 2.36 7.1L4 29l7.13-2.33A12.93 12.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22.917c-2.1 0-4.17-.62-5.92-1.8l-.42-.26-4.23 1.38 1.38-4.12-.27-.43A9.93 9.93 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.27-.48.09-.19.04-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43s1.03 2.82 1.18 3.02c.15.2 2.03 3.1 4.92 4.22.69.27 1.23.43 1.65.55.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/>
      </svg>
    `;

    const emailSVG = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" style="vertical-align:middle;margin-right:6px;">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"/>
      </svg>
    `;

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
          <a href="https://wa.me/2348034550910?text=${encodeURIComponent(
            message
          )}" 
             class="send-btn whatsapp" target="_blank" rel="noopener">
             ${whatsappSVG} WhatsApp
          </a>
          <a href="mailto:chilakaanayo91@gmail.com?subject=New%20Inquiry&body=${encodeURIComponent(
            message
          )}" 
             class="send-btn email" target="_blank" rel="noopener">
            ${emailSVG} Email
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
