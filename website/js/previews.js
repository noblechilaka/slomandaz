// File: js/previews.js
// SITE-WIDE PREVIEW SYSTEM
// Handles floating thumbnails/text for Services, Products, CTAs
// Works alongside the cursor.js (dot + outline system)

document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTS
  const preview = document.getElementById("cursorPreview");
  const previewImg = document.getElementById("previewImg");
  const previewLabel = document.getElementById("previewLabel");

  if (!preview) return; // Exit if no preview element

  // STATES
  let currentTarget = null;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let previewX = mouseX;
  let previewY = mouseY;

  // MOUSE TRACKER (syncs with cursor.js render loop pattern)
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // RENDER LOOP (buttery positioning + fade)
  const renderPreview = () => {
    // Buttery lag follow (slower than dot, offset to right/top)
    previewX += (mouseX - previewX) * 0.12;
    previewY += (mouseY - previewY) * 0.12;
    gsap.set(preview, {
      x: previewX + 100, // Offset: sits to the right of cursor
      y: previewY - 40, // Slightly above
      opacity: currentTarget ? 1 : 0,
      scale: currentTarget ? 1 : 0.9,
    });

    requestAnimationFrame(renderPreview);
  };
  renderPreview();

  // HELPER: Populate preview with content
  const showPreview = (target) => {
    currentTarget = target;
    const type = target.dataset.previewType || "text";

    if (type === "image") {
      // SERVICES: Image thumbnail + label
      previewImg.src = target.dataset.preview || "";
      previewImg.style.opacity = 1;
      previewLabel.textContent = target.dataset.label || "";
      previewLabel.style.opacity = 1;
      preview.classList.add("preview-image"); // CSS class for image mode
    } else if (type === "text") {
      // PRODUCTS/CTAs: Text only (name + status/action)
      previewImg.style.opacity = 0; // Hide image
      previewLabel.textContent =
        target.dataset.previewText ||
        target.querySelector(".product-name")?.textContent ||
        "Explore";
      previewLabel.style.opacity = 1;
      preview.classList.remove("preview-image"); // Text mode
    }

    // Smooth entrance
    gsap.fromTo(
      preview,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }
    );
  };

  const hidePreview = () => {
    currentTarget = null;
    gsap.to(preview, {
      scale: 0.9,
      opacity: 0,
      duration: 0.35,
      ease: "power2.inOut",
    });
  };

  // 1. SERVICES (Image Thumbnails)
  const serviceRows = document.querySelectorAll(".service-row");
  serviceRows.forEach((row) => {
    row.dataset.previewType = "image"; // Mark as image type
    row.addEventListener("mouseenter", () => showPreview(row));
    row.addEventListener("mouseleave", hidePreview);
  });

  // 2. PRODUCTS (Text: Name + Status)
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    // Auto-generate preview text from existing content
    const name = card.querySelector(".product-name")?.textContent || "";
    const status = card.querySelector(".product-status")?.textContent || "";
    card.dataset.previewText = `${name} — ${status}`;
    card.dataset.previewType = "text";

    card.addEventListener("mouseenter", () => showPreview(card));
    card.addEventListener("mouseleave", hidePreview);
  });

  // 3. CTAs (Action Text)
  const ctaSelectors = [
    ".hero-cta",
    ".archive-cta",
    ".services-cta",
    ".process-cta",
    ".contact-cta",
    ".quiet-exit-cta",
    ".navlink",
  ];
  ctaSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((cta) => {
      // Custom text per CTA (or use data-preview-text attribute for overrides)
      const defaultText =
        cta.textContent.trim().toLowerCase().includes("send") ||
        cta.textContent.trim().toLowerCase().includes("inquiry")
          ? "Send Message"
          : cta.textContent.trim().toLowerCase().includes("project")
          ? "Start Project"
          : "Explore";

      cta.dataset.previewText = cta.dataset.previewText || defaultText;
      cta.dataset.previewType = "text";

      cta.addEventListener("mouseenter", () => showPreview(cta));
      cta.addEventListener("mouseleave", hidePreview);
    });
  });

  // 4. CATEGORY ITEMS (Bonus: Fits your site)
  const categoryItems = document.querySelectorAll(".category-item");
  categoryItems.forEach((item) => {
    const text = item.querySelector(".category-text")?.textContent || "";
    item.dataset.previewText = `${text} →`;
    item.dataset.previewType = "text";

    item.addEventListener("mouseenter", () => showPreview(item));
    item.addEventListener("mouseleave", hidePreview);
  });

  // TOUCH DEVICE SUPPORT (Hide preview)
  if ("ontouchstart" in window) {
    preview.style.display = "none";
  }
});
