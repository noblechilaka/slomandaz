// ═══════════════════════════════════════
// CATEGORY ANIMATIONS
// ═══════════════════════════════════════
function initCategoryAnimations() {
  const items = document.querySelectorAll(".category-item");
  const frameLeft = document.querySelector(".frame-left");
  const frameRight = document.querySelector(".frame-right");

  if (!items.length || !frameLeft || !frameRight) return;

  // Initial stagger reveal
  gsap.from(".category-item", {
    y: 20,
    opacity: 1,
    duration: 1,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".category-section",
      start: "top 80%",
    },
  });

  // Image swap on hover
  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const cat = item.getAttribute("data-cat");

      items.forEach((i) => i.classList.remove("is-active"));
      item.classList.add("is-active");

      const catIndex = Array.from(items).findIndex(
        (i) => i.getAttribute("data-cat") === cat
      );

      frameLeft.querySelectorAll(".layer").forEach((l, idx) => {
        l.classList.toggle("active", idx === catIndex);
      });

      frameRight.querySelectorAll(".layer").forEach((l, idx) => {
        l.classList.toggle("active", idx === catIndex);
      });
    });
  });

  // Mouse parallax
  let mouseX = 0,
    mouseY = 0;
  let currentX = 0,
    currentY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  function animateParallax() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    gsap.set(frameLeft, { x: currentX * 40, y: currentY * 40 });
    gsap.set(frameRight, { x: -currentX * 40, y: -currentY * 40 });

    requestAnimationFrame(animateParallax);
  }
  animateParallax();
}
