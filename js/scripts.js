// Lenis smooth scroll initialization
function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

gsap.utils.toArray(".noden-about__stats [data-count]").forEach((el) => {
  const target = Number(el.getAttribute("data-count"));
  const holder = el.closest(".noden-about__stats");

  let obj = { v: 0 };
  ScrollTrigger.create({
    trigger: holder,
    start: "top 80%",
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        v: target,
        duration: 2.3,
        ease: "power1.out",
        onUpdate: () => {
          el.textContent = Math.round(obj.v);
        },
      });
    },
  });
});

document.addEventListener('DOMContentLoaded', initLenis);
