// js/animations.js — unified scroll animation controller

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  initAnimations();
});

window.addEventListener("load", () => {
  window.refreshSmoothScroll?.();
});

function initAnimations() {
  initHeroTimeline();
  initCategoryAnimations();
  initCategoryReveal();
  initAboutReveal();
  initStatsCounter();
  initServicesEntrance();
  initServicesHover();
  initProcessReveal();
  initContactReveal();
  initFooterReveal();
  initAboutPageAnimations();
  initArchiveReveal();
}

function revealTo(targets, options = {}) {
  const elements = gsap.utils.toArray(targets);
  if (!elements.length) return null;

  const {
    trigger = elements[0],
    start = "top 82%",
    y = 30,
    stagger = 0,
    duration = 0.9,
    ease = "power2.out",
    clearProps = "opacity,transform",
  } = options;

  gsap.set(elements, { opacity: 0, y });

  return gsap.to(elements, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease,
    clearProps,
    scrollTrigger: {
      trigger,
      start,
      once: true,
    },
  });
}

function clipReveal(target, options = {}) {
  if (!target) return null;

  const {
    trigger = target,
    start = "top 85%",
    duration = 1.1,
    ease = "expo.out",
    clearProps = "clipPath",
  } = options;

  gsap.set(target, { clipPath: "inset(100% 0 0 0)" });

  return gsap.to(target, {
    clipPath: "inset(0% 0 0 0)",
    duration,
    ease,
    clearProps,
    scrollTrigger: {
      trigger,
      start,
      once: true,
    },
  });
}

// 1. HERO
function initHeroTimeline() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  gsap.set(
    [
      ".hero__brand",
      ".hero__descriptor",
      ".mini-logo",
      ".navlink",
      ".hero__pager",
    ],
    { opacity: 0, y: 10 }
  );

  gsap.set(".hero__media", { scale: 1.08 });

  tl.to(".hero__media", { scale: 1.04, duration: 1.8 }, 0)
    .to(".mini-logo", { opacity: 1, y: 0, duration: 0.9 }, 0.1)
    .to(".navlink", { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.25)
    .to(".hero__pager", { opacity: 1, y: 0, duration: 0.9 }, 0.35)
    .to(".hero__brand", { opacity: 1, y: 0, duration: 1.1 }, 0.45)
    .to(".hero__descriptor", { opacity: 1, y: 0, duration: 1 }, 0.6);

  gsap.to(".hero__media", {
    y: 60,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

// 2. CATEGORY PARALLAX
function initCategoryAnimations() {
  const frameLeft = document.querySelector(".frame-left");
  const frameRight = document.querySelector(".frame-right");
  if (!frameLeft || !frameRight) return;

  let mouseX = 0;
  let mouseY = 0;
  let curX = 0;
  let curY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  function animate() {
    curX += (mouseX - curX) * 0.05;
    curY += (mouseY - curY) * 0.05;

    gsap.set(frameLeft, { x: curX * 30, y: curY * 30 });
    gsap.set(frameRight, { x: -curX * 30, y: -curY * 30 });

    requestAnimationFrame(animate);
  }

  animate();
}

// 3. CATEGORY REVEAL
function initCategoryReveal() {
  const section = document.querySelector(".category-section");
  if (!section) return;

  revealTo(".category-item", {
    trigger: section,
    start: "top 75%",
    y: 20,
    stagger: 0.1,
    duration: 1,
  });
}

// 4. ABOUT SECTION
function initAboutReveal() {
  const section = document.querySelector(".noden-about");
  if (!section) return;

  revealTo(".noden-about__title", {
    trigger: section,
    start: "top 75%",
    y: 40,
    duration: 1,
  });

  revealTo(".noden-about__intro", {
    trigger: section,
    start: "top 77%",
    y: 24,
    duration: 0.9,
  });

  revealTo(".noden-about__img", {
    trigger: section,
    start: "top 79%",
    y: 30,
    stagger: 0.15,
    duration: 1,
  });

  revealTo(".noden-about__goal", {
    trigger: section,
    start: "top 82%",
    y: 24,
    duration: 0.9,
  });
}

// 5. STATS COUNTER
function initStatsCounter() {
  const statsContainer = document.querySelector(".noden-about__stats");
  if (!statsContainer) return;

  const counters = statsContainer.querySelectorAll("[data-count]");

  ScrollTrigger.create({
    trigger: statsContainer,
    start: "top 85%",
    once: true,
    onEnter: () => {
      counters.forEach((el) => {
        const target = Number(el.dataset.count);
        const obj = { value: 0 };

        gsap.to(obj, {
          value: target,
          duration: 2.2,
          ease: "power1.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.value);
          },
        });
      });
    },
  });
}

// 6. SERVICES
function initServicesEntrance() {
  const section = document.getElementById("services");
  if (!section) return;

  revealTo(".services-eyebrow", {
    trigger: section,
    start: "top 72%",
    y: 14,
    duration: 0.7,
  });

  revealTo(".services-headline", {
    trigger: section,
    start: "top 72%",
    y: 28,
    duration: 0.9,
    ease: "expo.out",
  });

  revealTo(".service-row", {
    trigger: section,
    start: "top 70%",
    y: 22,
    stagger: 0.08,
    duration: 0.75,
  });

  revealTo(".services-footer", {
    trigger: section,
    start: "top 68%",
    y: 16,
    duration: 0.7,
  });
}

function initServicesHover() {
  const rows = document.querySelectorAll(".service-row");
  if (!rows.length) return;

  rows.forEach((row, i) => {
    row.addEventListener("mouseenter", () => {
      rows.forEach((r, j) => {
        if (i !== j) {
          gsap.to(r, { opacity: 0.55, duration: 0.4, ease: "power2.out" });
        }
      });
      gsap.to(row, { opacity: 1, duration: 0.3, ease: "power2.out" });
    });

    row.addEventListener("mouseleave", () => {
      rows.forEach((r) => {
        gsap.to(r, { opacity: 1, duration: 0.45, ease: "power2.out" });
      });
    });
  });
}

// 7. PROCESS
function initProcessReveal() {
  const steps = document.querySelectorAll(".step");
  if (!steps.length) return;

  steps.forEach((step) => {
    const imgWrap = step.querySelector(".step-image");
    const textEls = step.querySelectorAll(
      ".step-num, .step-name, .step-desc, .step-plus"
    );
    const img = imgWrap?.querySelector("img");

    clipReveal(imgWrap, {
      trigger: step,
      start: "top 85%",
      duration: 1.2,
      ease: "expo.inOut",
    });

    revealTo(textEls, {
      trigger: step,
      start: "top 80%",
      y: 20,
      stagger: 0.08,
      duration: 0.8,
    });

    if (img) {
      gsap.to(img, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: imgWrap,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }
  });
}

// 8. CONTACT
function initContactReveal() {
  const section = document.querySelector(".contact");
  const form = document.querySelector(".contact-form");
  if (!section || !form) return;

  revealTo(".contact-headline span", {
    trigger: section,
    start: "top 80%",
    y: 80,
    stagger: 0.15,
    duration: 1.1,
    ease: "expo.out",
  });

  gsap.set(".form-line", { scaleX: 0, transformOrigin: "left center" });

  gsap.to(".form-line", {
    scaleX: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out",
    clearProps: "transform",
    scrollTrigger: {
      trigger: form,
      start: "top 85%",
      once: true,
    },
  });

  const cta = document.querySelector(".contact-cta");
  if (cta) {
    cta.addEventListener("mouseenter", () =>
      gsap.to(cta, { x: 8, duration: 0.4, ease: "power2.out" })
    );
    cta.addEventListener("mouseleave", () =>
      gsap.to(cta, { x: 0, duration: 0.3, ease: "power2.out" })
    );
  }
}

// 9. FOOTER
function initFooterReveal() {
  const footer = document.querySelector(".site-footer, .footer");
  if (!footer) return;

  revealTo(footer.querySelectorAll(".footer-column"), {
    trigger: footer,
    start: "top 85%",
    y: 30,
    stagger: 0.1,
    duration: 0.8,
  });

  revealTo(".copyright", {
    trigger: footer.querySelector(".footer-bottom") || footer,
    start: "top 90%",
    y: 16,
    duration: 0.8,
  });
}

// 10. ABOUT PAGE
function initAboutPageAnimations() {
  const isAboutPage =
    document.querySelector(".about-top") ||
    document.querySelector(".mosaic") ||
    document.querySelector(".savoir") ||
    document.querySelector(".details");

  if (!isAboutPage) return;

  revealTo(".about-title", {
    trigger: ".about-top",
    start: "top 78%",
    y: 36,
    duration: 1,
  });

  revealTo(".about-intro", {
    trigger: ".about-top",
    start: "top 80%",
    y: 24,
    duration: 0.9,
  });

  document
    .querySelectorAll(".tile, .wide-image, .small-photo, .details__bigPhoto")
    .forEach((container) => {
      clipReveal(container, {
        trigger: container,
        start: "top 85%",
        duration: 1.15,
        ease: "expo.inOut",
      });

      const img = container.querySelector("img");
      if (img) {
        gsap.to(img, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    });

  revealTo(".mosaic__goal", {
    trigger: ".mosaic",
    start: "top 82%",
    y: 24,
    duration: 0.9,
  });

  revealTo(".savoir .h2, .savoir .sub", {
    trigger: ".savoir",
    start: "top 80%",
    y: 24,
    stagger: 0.08,
    duration: 0.9,
  });

  revealTo(".details__title, .details .sub, .details__caption", {
    trigger: ".details",
    start: "top 82%",
    y: 24,
    stagger: 0.08,
    duration: 0.9,
  });
}

// 11. ARCHIVE PRODUCTS
function initArchiveReveal() {
  const grid = document.getElementById("archiveGrid");
  if (!grid) return;

  window.runArchiveReveal = () => {
    const items = grid.querySelectorAll(".archive-item");
    if (!items.length) return;

    gsap.killTweensOf(items);
    gsap.set(items, { opacity: 0, y: 24 });

    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power2.out",
      clearProps: "opacity,transform",
    });

    window.refreshSmoothScroll?.();
  };
}
