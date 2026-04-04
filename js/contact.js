// ═══════════════════════════════════════
// CONTACT ANIMATIONS
// ═══════════════════════════════════════
function initContactAnimations() {
  const contactSection = document.querySelector(".contact");
  if (!contactSection) return;

  // Headline entrance
  gsap.from(".contact-headline span", {
    y: 80,
    opacity: 0,
    stagger: 0.15,
    duration: 1.2,
    ease: "expo.out",
    scrollTrigger: {
      trigger: ".contact",
      start: "top 80%",
    },
  });

  // Form lines draw in
  gsap.from(".form-line", {
    scaleX: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-form",
      start: "top 85%",
    },
  });

  // Form input focus effects
  document.querySelectorAll(".form-input").forEach((input) => {
    const accent = input.parentElement.querySelector(".form-accent");
    if (!accent) return;

    input.addEventListener("focus", () => {
      gsap.to(accent, { width: "100%", duration: 0.4, ease: "power3.out" });
    });

    input.addEventListener("blur", () => {
      if (!input.value) {
        gsap.to(accent, { width: "0%", duration: 0.4, ease: "power3.inOut" });
      }
    });
  });

  // CTA button hover
  const ctaBtn = document.querySelector(".contact-cta");
  if (ctaBtn) {
    ctaBtn.addEventListener("mouseenter", () => {
      gsap.to(ctaBtn, { x: 6, duration: 0.3, ease: "power2.out" });
    });
    ctaBtn.addEventListener("mouseleave", () => {
      gsap.to(ctaBtn, { x: 0, duration: 0.3, ease: "power2.out" });
    });
  }
}
