// js/animations.js — GLOBAL ANIMATION CONTROLLER
// Handles: Hero, Categories, About, Services, Process, Contact, Footer
// Philosophy: Quiet, Smooth, Buttery, Non-destructive

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // Wait for layout to stabilize before animating
  setTimeout(() => {
    initAnimations();
  }, 100);
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
  initAboutPageAnimations(); // Added new function for about page animations
}

// ────────────────────────────────────────────────
// 1. HERO TIMELINE (Immediate Load)
// ────────────────────────────────────────────────
function initHeroTimeline() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  // Set initial states invisibly
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

  // Sequence: Media Zoom -> Nav/Logo -> Branding -> Descriptor
  tl.to(".hero__media", { scale: 1.04, duration: 1.8, ease: "power2.out" }, 0)
    .to(".mini-logo", { opacity: 1, y: 0, duration: 0.9 }, 0.1)
    .to(".navlink", { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.25)
    .to(".hero__pager", { opacity: 1, y: 0, duration: 0.9 }, 0.35)
    .to(".hero__brand", { opacity: 1, y: 0, duration: 1.1 }, 0.45)
    .to(".hero__descriptor", { opacity: 1, y: 0, duration: 1.0 }, 0.6);

  // Subtle Parallax on Scroll
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

// ────────────────────────────────────────────────
// 2. CATEGORY PARALLAX (Mouse Follow)
// ────────────────────────────────────────────────
function initCategoryAnimations() {
  const frameLeft = document.querySelector(".frame-left");
  const frameRight = document.querySelector(".frame-right");
  if (!frameLeft || !frameRight) return;

  let mouseX = 0,
    mouseY = 0;
  let curX = 0,
    curY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  function animate() {
    // Ease towards mouse position (slower factor = smoother/buttier)
    curX += (mouseX - curX) * 0.05;
    curY += (mouseY - curY) * 0.05;

    // Apply transforms
    gsap.set(frameLeft, { x: curX * 30, y: curY * 30 });
    gsap.set(frameRight, { x: -curX * 30, y: -curY * 30 });

    requestAnimationFrame(animate);
  }
  animate();
}

// ────────────────────────────────────────────────
// 3. CATEGORY TEXT REVEAL (Scroll Trigger)
// ────────────────────────────────────────────────
function initCategoryReveal() {
  const section = document.querySelector(".category-section");
  if (!section) return;

  gsap.from(".category-item", {
    y: 20,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".category-section",
      start: "top 75%",
    },
  });
}

// ────────────────────────────────────────────────
// 4. ABOUT SECTION (Grid Reveal)
// ────────────────────────────────────────────────
function initAboutReveal() {
  const title = document.querySelector(".noden-about__title");
  const intro = document.querySelector(".noden-about__intro");
  const images = document.querySelectorAll(".noden-about__img");

  if (!title) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".noden-about",
      start: "top 75%",
    },
  });

  tl.from(title, { y: 40, opacity: 0, duration: 1, ease: "power2.out" })
    .from(
      intro,
      { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    )
    .from(
      images,
      { y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: "power2.out" },
      "-=0.6"
    );
}

// ────────────────────────────────────────────────
// NEW FUNCTION: ABOUT PAGE ANIMATIONS
// ────────────────────────────────────────────────
function initAboutPageAnimations() {
  // Check if we're on the about page by looking for about-specific elements
  const isAboutPage = document.querySelector('.about-top') || 
                     document.querySelector('.mosaic') || 
                     document.querySelector('.savoir') || 
                     document.querySelector('.details');
  
  if (!isAboutPage) return; // Only run on about page

  // Apply inset style animations to containers in the about page
  // Targeting mosaic containers, wide image container, and detail image containers
  const mosaicContainers = document.querySelectorAll('.tile');
  const wideImageContainers = document.querySelectorAll('.wide-image');
  const detailImageContainers = document.querySelectorAll('.small-photo, .details__bigPhoto');

  // Apply inset animations to mosaic containers
  mosaicContainers.forEach((container, i) => {
    gsap.from(container, {
      clipPath: "inset(100% 0 0 0)",
      duration: 1.2,
      ease: "expo.inOut",
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
      },
      delay: i * 0.1
    });
    
    // Add parallax effect to images inside mosaic containers
    const img = container.querySelector('img');
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

  // Apply inset animations to wide image containers
  wideImageContainers.forEach((container, i) => {
    gsap.from(container, {
      clipPath: "inset(100% 0 0 0)",
      duration: 1.2,
      ease: "expo.inOut",
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
      },
      delay: i * 0.1
    });
    
    // Add parallax effect to images inside wide image containers
    const img = container.querySelector('img');
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

  // Apply inset animations to detail image containers
  detailImageContainers.forEach((container, i) => {
    gsap.from(container, {
      clipPath: "inset(100% 0 0 0)",
      duration: 1.2,
      ease: "expo.inOut",
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
      },
      delay: i * 0.1
    });
    
    // Add parallax effect to images inside detail image containers
    const img = container.querySelector('img');
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

  // Apply different animations to other containers on the about page
  // For example, the savoir section wide image container
  const savoirContainers = document.querySelectorAll('.savoir .wide-image');
  savoirContainers.forEach((container, i) => {
    gsap.from(container, {
      rotation: 5,
      scale: 1.2,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
      },
      delay: 0.2
    });
    
    // Add parallax effect to images inside savoir containers
    const img = container.querySelector('img');
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
}

// ────────────────────────────────────────────────
// 5. STATS COUNTER (Number Crunch)
// ────────────────────────────────────────────────
function initStatsCounter() {
  const statsContainer = document.querySelector(".noden-about__stats");
  if (!statsContainer) return;

  const counters = statsContainer.querySelectorAll("[data-count]");

  counters.forEach((el) => {
    const target = Number(el.dataset.count);
    let obj = { v: 0 };

    ScrollTrigger.create({
      trigger: statsContainer,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target,
          duration: 2.5,
          ease: "power1.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.v);
          },
        });
      },
    });
  });
}

// ────────────────────────────────────────────────
// 6. SERVICES SECTION (Entrance + Hover Effects)
// ────────────────────────────────────────────────
function initServicesEntrance() {
  const section = document.getElementById("services");
  if (!section) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
    },
  });

  tl.from(".services-eyebrow", { opacity: 0, y: 10, duration: 0.7 }, 0)
    .from(
      ".services-headline",
      { opacity: 0, y: 25, duration: 0.9, ease: "expo.out" },
      0.15
    )
    .from(
      ".service-row",
      { opacity: 0, y: 20, stagger: 0.08, duration: 0.7, ease: "power2.out" },
      0.3
    )
    .from(".services-footer", { opacity: 0, y: 15, duration: 0.7 }, 0.8);
}

function initServicesHover() {
  const rows = document.querySelectorAll(".service-row");
  if (rows.length === 0) return;

  rows.forEach((row, i) => {
    row.addEventListener("mouseenter", () => {
      // Dim siblings slightly
      rows.forEach((r, j) => {
        if (i !== j) {
          gsap.to(r, { opacity: 0.55, duration: 0.4, ease: "power2.out" });
        }
      });
      // Highlight active
      gsap.to(row, { opacity: 1, duration: 0.3 });
    });

    row.addEventListener("mouseleave", () => {
      // Reset siblings
      rows.forEach((r) =>
        gsap.to(r, { opacity: 1, duration: 0.45, ease: "power2.out" })
      );
    });
  });
}

// ────────────────────────────────────────────────
// 7. PROCESS SECTION (Complex Sequencing)
// ────────────────────────────────────────────────
function initProcessReveal() {
  const steps = document.querySelectorAll(".step");
  if (steps.length === 0) return;

  steps.forEach((step, i) => {
    const imgWrap = step.querySelector(".step-image");
    const textEls = step.querySelectorAll(
      ".step-num, .step-name, .step-desc, .step-plus"
    );

    if (!imgWrap) return;

    // 1. Image Clip Path Reveal
    gsap.from(imgWrap, {
      clipPath: "inset(100% 0 0 0)",
      duration: 1.2,
      ease: "expo.inOut",
      scrollTrigger: {
        trigger: step,
        start: "top 85%",
      },
    });

    // 2. Text Stagger In (after image starts opening)
    gsap.from(textEls, {
      opacity: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: step,
        start: "top 80%",
      },
      delay: i * 0.1,
    });

    // 3. Image Parallax Scrub
    const img = imgWrap.querySelector("img");
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

// ────────────────────────────────────────────────
// 8. CONTACT FORM (Lines & Fade)
// ────────────────────────────────────────────────
function initContactReveal() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  // Headlines
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

  // Form Lines (Draw effect)
  gsap.from(".form-line", {
    scaleX: 0,
    transformOrigin: "left",
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: form,
      start: "top 85%",
    },
  });

  // Button Micro-interaction
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

// ────────────────────────────────────────────────
// 9. FOOTER (Clean Fade Up)
// ────────────────────────────────────────────────
function initFooterReveal() {
  const footer = document.querySelector(".site-footer");
  if (!footer) return;

  gsap.from(".footer-column", {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: footer,
      start: "top 85%",
    },
  });

  gsap.from(".copyright", {
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".footer-bottom",
      start: "top 90%",
    },
  });
}