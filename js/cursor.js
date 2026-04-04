// js/cursor.js — CURSOR SYSTEM ONLY
// Handles: Dot, Outline, Service Preview

(function () {
  "use strict";

  // Exit for touch devices
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

  // Wait for GSAP
  if (typeof gsap === "undefined") {
    setTimeout(() => arguments.callee(), 100);
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const dot = document.querySelector(".cursor-dot");
    const outline = document.querySelector(".cursor-outline");

    if (!dot || !outline) return;

    // Create preview element for services
    const preview = document.createElement("div");
    preview.className = "service-preview";
    preview.innerHTML =
      '<img class="preview-img" src="" alt=""><span class="preview-label"></span>';
    document.body.appendChild(preview);

    const previewImg = preview.querySelector(".preview-img");
    const previewLabel = preview.querySelector(".preview-label");

    // Mouse position
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX,
      dotY = mouseY;
    let outlineX = mouseX,
      outlineY = mouseY;
    let previewX = mouseX,
      previewY = mouseY;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Render loop
    function render() {
      dotX += (mouseX - dotX) * 0.4;
      dotY += (mouseY - dotY) * 0.4;
      outlineX += (mouseX - outlineX) * 0.12;
      outlineY += (mouseY - outlineY) * 0.12;
      previewX += (mouseX - previewX) * 0.08;
      previewY += (mouseY - previewY) * 0.08;

      gsap.set(dot, { x: dotX, y: dotY });
      gsap.set(outline, { x: outlineX, y: outlineY });
      gsap.set(preview, { x: previewX + 90, y: previewY - 60 });

      requestAnimationFrame(render);
    }
    render();

    // Interactive elements
    const interactiveSelectors = [
      "a",
      "button",
      ".navlink",
      ".tab",
      ".filter",
      ".category-item",
      ".hero-cta",
      ".archive-cta",
      ".services-cta",
      ".process-cta",
      ".contact-cta",
      ".learn-more",
      ".footer-column a",
      ".mini-logo",
    ].join(", ");

    // Text elements
    const textSelectors = "p, h1, h2, h3, h4, h5, h6, .hero__descriptor";

    // Event delegation
    document.addEventListener("mouseover", (e) => {
      // Check for service row (preview)
      const serviceRow = e.target.closest(".service-row");
      if (serviceRow) {
        const src = serviceRow.dataset.preview;
        const label = serviceRow.dataset.label || "";
        previewImg.src = src;
        previewLabel.textContent = label;
        gsap.to(preview, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        });
        gsap.to(dot, {
          scale: 2.5,
          backgroundColor: "#B87333",
          duration: 0.35,
        });
        gsap.to(outline, { opacity: 0, duration: 0.3 });
        return;
      }

      // Check for interactive
      if (e.target.closest(interactiveSelectors)) {
        gsap.to(dot, { opacity: 0, duration: 0.2 });
        gsap.to(outline, {
          width: 56,
          height: 56,
          borderColor: "rgba(184, 115, 51, 0.5)",
          backgroundColor: "rgba(184, 115, 51, 0.08)",
          duration: 0.4,
          ease: "power3.out",
        });
        return;
      }

      // Check for text
      if (e.target.closest(textSelectors)) {
        gsap.to(dot, { opacity: 0, duration: 0.2 });
        gsap.to(outline, {
          width: 3,
          height: 24,
          borderRadius: "2px",
          borderColor: "#141414",
          backgroundColor: "#141414",
          duration: 0.3,
        });
        return;
      }

      // Default
      resetCursor();
    });

    document.addEventListener("mouseout", (e) => {
      // Hide preview when leaving service row
      if (e.target.closest(".service-row")) {
        gsap.to(preview, {
          opacity: 0,
          scale: 0.92,
          duration: 0.35,
          ease: "power2.inOut",
        });
        gsap.to(dot, { scale: 1, backgroundColor: "#141414", duration: 0.3 });
      }

      // Reset when leaving interactive or text
      if (
        e.target.closest(interactiveSelectors) ||
        e.target.closest(textSelectors)
      ) {
        resetCursor();
      }
    });

    function resetCursor() {
      gsap.to(dot, {
        opacity: 1,
        scale: 1,
        backgroundColor: "#141414",
        duration: 0.3,
      });
      gsap.to(outline, {
        width: 40,
        height: 40,
        borderRadius: "50%",
        borderColor: "rgba(20, 20, 20, 0.15)",
        backgroundColor: "transparent",
        opacity: 0.6,
        duration: 0.4,
        ease: "power3.out",
      });
    }

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
      gsap.to(dot, { opacity: 0, duration: 0.2 });
      gsap.to(outline, { opacity: 0, duration: 0.2 });
    });

    document.addEventListener("mouseenter", () => {
      gsap.to(dot, { opacity: 1, duration: 0.2 });
      gsap.to(outline, { opacity: 0.6, duration: 0.2 });
    });

    // Hide default cursor
    document.body.style.cursor = "none";
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    console.log("✓ Cursor initialized");
  });
})();
