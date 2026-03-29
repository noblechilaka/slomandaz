// File: js/cursor.js

// GSAP and Lenis should be initialized before this script runs.
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");
  const body = document.body;

  // Hide cursor on touch devices
  if ("ontouchstart" in window) {
    cursorDot.style.display = "none";
    cursorOutline.style.display = "none";
    return; // Exit script if touch device
  }

  let mouseX = 0,
    mouseY = 0;
  let dotX = 0,
    dotY = 0;
  let outlineX = 0,
    outlineY = 0;

  // 1. MOUSE POSITION LISTENER
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // 2. THE RENDER LOOP (The engine for the buttery effect)
  const render = () => {
    // Dot position (snappy)
    dotX += (mouseX - dotX) * 0.6;
    dotY += (mouseY - dotY) * 0.6;
    gsap.set(cursorDot, { x: dotX, y: dotY });

    // Outline position (buttery lag)
    outlineX += (mouseX - outlineX) * 0.1;
    outlineY += (mouseY - outlineY) * 0.1;
    gsap.set(cursorOutline, { x: outlineX, y: outlineY });

    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  // 3. STATE CHANGE HANDLERS (The brain)
  const addState = (state) => body.classList.add(state);
  const removeState = (state) => body.classList.remove(state);

  // --- Pointer State ---
  const pointerElements = document.querySelectorAll(
    "a, button, .tab, .product-card, .category-item, .quiet-exit-cta, .navlink, .tool, .hero-cta, .archive-cta, .process-cta, .contact-cta"
  );
  pointerElements.forEach((el) => {
    el.addEventListener("mouseenter", () => addState("cursor-pointer"));
    el.addEventListener("mouseleave", () => removeState("cursor-pointer"));
  });

  // --- Text State ---
  const textElements = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, .hero__descriptor, .product-name, .copyright"
  );
  textElements.forEach((el) => {
    el.addEventListener("mouseenter", () => addState("cursor-text"));
    el.addEventListener("mouseleave", () => removeState("cursor-text"));
  });

  // --- Drag State ---
  const dragElement = document.querySelector(".reel-wrapper");
  if (dragElement) {
    dragElement.addEventListener("mouseenter", () => addState("cursor-drag"));
    dragElement.addEventListener("mouseleave", () =>
      removeState("cursor-drag")
    );
  }

  // --- Service Section Special Preview ---
  // This ensures your previous cursor logic takes priority
  const serviceRows = document.querySelectorAll(".service-row");
  if (serviceRows.length > 0) {
    serviceRows.forEach((row) => {
      row.addEventListener("mouseenter", () => addState("cursor-services"));
      row.addEventListener("mouseleave", () => removeState("cursor-services"));
    });

    // Make sure to adapt your existing services cursor JS to use the .cursor-preview element
    // and hide the global one, as we've done in the CSS with `body.cursor-services`.
    // Your original services JS for the preview image will still work perfectly alongside this.
  }
});
