// ═══════════════════════════════════════
// FOOTER ANIMATIONS
// ═══════════════════════════════════════
function initFooterAnimations() {
  const footer = document.querySelector(".site-footer");
  if (!footer) return;

  gsap.from(".footer-column", {
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: footer, start: "top 85%" },
  });

  gsap.from(".copyright", {
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".footer-bottom", start: "top 95%" },
  });
}
