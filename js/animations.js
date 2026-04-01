// js/animations.js — ALL PAGE ANIMATIONS
// Handles: Hero, Categories, Services, Process, Contact, Footer, Stats

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // Wait a bit for Lenis to initialize first
  setTimeout(() => {
    initHeroAnimations();
    initCategoryAnimations();
    initServiceAnimations();
    initProcessAnimations();
    initContactAnimations();
    initFooterAnimations();
    initStatsCounter();
  }, 200);
});

// ═══════════════════════════════════════
// HERO ANIMATIONS
// ═══════════════════════════════════════
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  // Initial states
  gsap.set(
    ".hero__brand, .hero__descriptor, .mini-logo, .navlink, .hero__pager",
    {
      opacity: 0,
      y: 10,
    }
  );
  gsap.set(".hero__media", { scale: 1.08 });

  // Hero sequence
  tl.to(".hero__media", { scale: 1.04, duration: 1.8, ease: "power2.out" }, 0)
    .to(".mini-logo", { opacity: 1, y: 0, duration: 0.9 }, 0.1)
    .to(".navlink", { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.25)
    .to(".hero__pager", { opacity: 1, y: 0, duration: 0.9 }, 0.35)
    .to(".hero__brand", { opacity: 1, y: 0, duration: 1.1 }, 0.45)
    .to(".hero__descriptor", { opacity: 1, y: 0, duration: 1.0 }, 0.6);

  // Hero parallax on scroll
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
    opacity: 0,
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

// ═══════════════════════════════════════
// SERVICES ANIMATIONS
// ═══════════════════════════════════════
function initServiceAnimations() {
  const servicesSection = document.getElementById("services");
  if (!servicesSection) return;

  // Entrance animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.from(
            ".services-eyebrow",
            { opacity: 0, y: 12, duration: 0.7 },
            0.1
          )
            .from(
              ".services-headline",
              { opacity: 0, y: 30, duration: 0.9, ease: "expo.out" },
              0.15
            )
            .from(
              ".service-row",
              { opacity: 0, y: 24, stagger: 0.1, duration: 0.7 },
              0.35
            )
            .from(
              ".services-footer",
              { opacity: 0, y: 16, duration: 0.7 },
              0.85
            );

          observer.disconnect();
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(servicesSection);

  // Service row hover - sibling dimming
  const rows = document.querySelectorAll(".service-row");
  rows.forEach((row, i) => {
    row.addEventListener("mouseenter", () => {
      rows.forEach((r, j) => {
        if (i !== j) {
          gsap.to(r, { opacity: 0.55, duration: 0.4, ease: "power2.out" });
        }
      });
      gsap.to(row, { opacity: 1, duration: 0.3 });
    });

    row.addEventListener("mouseleave", () => {
      rows.forEach((r) => {
        gsap.to(r, { opacity: 1, duration: 0.45, ease: "power2.out" });
      });
    });
  });
}

// ═══════════════════════════════════════
// PROCESS ANIMATIONS
// ═══════════════════════════════════════
function initProcessAnimations() {
  const processSection = document.getElementById("process");
  if (!processSection) return;

  // Image clip reveals
  document.querySelectorAll(".step-image").forEach((el, i) => {
    gsap.from(el, {
      clipPath: "inset(100% 0% 0% 0%)",
      duration: 1.1,
      ease: "expo.inOut",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
      delay: i * 0.08,
    });
  });

  // Step lines draw in
  document.querySelectorAll(".step-line").forEach((line, i) => {
    gsap.from(line, {
      scaleX: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: line, start: "top 90%" },
      delay: i * 0.1 + 0.4,
    });
  });

  // Text stagger per step
  document.querySelectorAll(".step").forEach((step, i) => {
    gsap.from(
      step.querySelectorAll(".step-num, .step-name, .step-desc, .step-plus"),
      {
        opacity: 0,
        y: 18,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: step, start: "top 80%" },
        delay: i * 0.1 + 0.5,
      }
    );
  });

  // Image parallax
  document.querySelectorAll(".step-image").forEach((el) => {
    const img = el.querySelector("img");
    if (img) {
      gsap.to(img, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }
  });

  // Process footer
  gsap.from(".process-footer", {
    opacity: 0,
    y: 24,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: ".process-footer", start: "top 88%" },
  });
}

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

// ═══════════════════════════════════════
// STATS COUNTER
// ═══════════════════════════════════════
function initStatsCounter() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(el.getAttribute("data-count"));
    const holder = el.closest(".noden-about__stats");
    if (!holder) return;

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
}
