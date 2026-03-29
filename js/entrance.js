// // NODEN ENTRANCE ANIMATION SYSTEM v1.0
// // Global scroll-based animations for all elements

// gsap.registerPlugin(ScrollTrigger);

// class NodenEntrance {
//   constructor() {
//     this.reduceMotion = window.matchMedia(
//       "(prefers-reduced-motion: reduce)"
//     ).matches;

//     // SPEC EASES
//     gsap.defaults({
//       ease: 'cubic-bezier(0.16, 1, 0.3, 1)'  // Standard (base)
//     });
//     this.STANDARD = 'cubic-bezier(0.16, 1, 0.3, 1)';
//     this.GENTLE = 'cubic-bezier(0.25, 1, 0.5, 1)';
//     this.SNAPPY = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
//     this.DECELERATE = 'cubic-bezier(0, 0, 0.2, 1)';

//     this.init();
//   }

//   init() {
//     if (this.reduceMotion) {
//       this.disableAnimations();
//       return;
//     }

//     this.setupGlobals();
//     this.setupPageSpecific();
//     this.setupParallax();
//   }

//   // ─────────────────────────────────────────────
//   // GLOBAL ELEMENT ANIMATIONS
//   // ─────────────────────────────────────────────
//   setupGlobals() {
//     // HEADERS/TEXTS: Slide up from mask (inset bottom→top)
//     gsap.utils.toArray("h1, h2, h3, p").forEach((elem) => {
//       if (elem.closest("[data-no-animate]") || elem.querySelector('.word')) return;  // Skip paras already split

//       ScrollTrigger.create({
//         trigger: elem,
//         start: 'top 88%',
//         once: true,
//         onEnter: () => gsap.fromTo(elem, 
//           { clipPath: "inset(100% 0% 0% 0%)" }, 
//           { 
//             clipPath: "inset(0% 0% 0% 0%)",
//             duration: 1.0,
//             ease: this.STANDARD
//           }
//         )
//       });
//     });

//     // 2. PARAGRAPHS (word-by-word)
//     gsap.utils.toArray("p").forEach((para) => {
//       if (para.closest("[data-no-animate]") || para.children.length > 0) return;

//       const words = para.textContent.split(" ");
//       para.innerHTML = words
//         .map(
//           (word) =>
//             `<span class="word" style="display:inline-block; opacity:0; transform:translateY(10px)">${word}</span>`
//         )
//         .join(" ");

//       gsap.to(para.querySelectorAll(".word"), {
//         opacity: 1,
//         y: 0,
//         stagger: 0.025,
//         duration: 0.4,
//         ease: this.GENTLE,
//         scrollTrigger: {
//           trigger: para,
//           start: "top 90%",
//           once: true,
//         },
//       });
//     });

//     // IMAGES: Inset completion animation (bottom clip→full)
//     gsap.utils
//       .toArray("img:not(.hero__media):not([data-no-animate])")
//       .forEach((img) => {
//         // Skip if already in a card with animation or figure
//         if (img.closest(".p-card, .product-card, .service-row, figure")) return;

//         gsap.fromTo(img, 
//           { clipPath: "inset(100% 0% 0% 0%)" },
//           {
//             clipPath: "inset(0%)",
//             duration: 1.0,
//             ease: this.STANDARD,
//             scrollTrigger: {
//               trigger: img,
//               start: "top 85%",
//               once: true,
//             },
//           }
//         );
//       });

//     // SPEC G: Images within figure/frame scale 1.04→1 decelerate 1.2s top85%
//     gsap.utils.toArray('figure img:not(.hero__media img)').forEach((img) => {
//       if (img.closest('.p-card, .product-card')) return;
//       gsap.fromTo(img, 
//         { scale: 1.04 },
//         {
//           scale: 1,
//           duration: 1.2,
//           ease: this.DECELERATE,
//           scrollTrigger: {
//             trigger: img.parentElement,
//             start: 'top 85%',
//             once: true
//           }
//         }
//       );
//     });

//     // SPEC C: Section labels/kickers fade y+8 gentle 0.6s top90%
//     gsap.utils.toArray('.section-label, [class*="kicker"], [class*="eyebrow"]').forEach((label) => {
//       gsap.fromTo(label,
//         { opacity: 0, y: 8 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.6,
//           ease: this.GENTLE,
//           scrollTrigger: {
//             trigger: label,
//             start: 'top 90%',
//             once: true
//           }
//         }
//       );
//     });

//     // 4. BUTTONS/CTAs (line draw + fade)
//     gsap.utils.toArray('button, .cta, [role="button"]').forEach((btn) => {
//       gsap.fromTo(btn, 
//         { opacity: 0, scale: 0.92 }, 
//         {
//           opacity: 1,
//           scale: 1,
//           duration: 0.5,
//           ease: this.SNAPPY,
//           scrollTrigger: {
//             trigger: btn,
//             start: "top 90%",
//             once: true,
//           },
//         }
//       );
//     });

//     // 5. DIVIDERS/LINES
//     gsap.utils
//       .toArray('[class*="divider"], [class*="line"], hr')
//       .forEach((line) => {
//         gsap.fromTo(line, 
//           { scaleX: 0, transformOrigin: "left center" }, 
//           {
//             scaleX: 1,
//             duration: 0.8,
//             ease: this.STANDARD,
//             scrollTrigger: {
//               trigger: line,
//               start: "top 90%",
//               once: true,
//             },
//           }
//         );
//       });

//     // 6. FOOTER SECTIONS
//     gsap.utils
//       .toArray(".footer-column")  // SPEC: columns
//       .forEach((footerSection, i) => {
//         gsap.fromTo(footerSection, 
//           { opacity: 0, y: 14 }, 
//           {
//             opacity: 1,
//             y: 0,
//             duration: 0.7,
//             ease: this.GENTLE,
//             scrollTrigger: {
//               trigger: footerSection,
//               start: "top 92%",
//               once: true,
//             },
//             delay: i * 0.1
//           }
//         );
//       });
//   }

//   // ─────────────────────────────────────────────
//   // PAGE-SPECIFIC ANIMATIONS
//   // ─────────────────────────────────────────────
//   setupPageSpecific() {
//     const page = document.body.dataset.page || this.detectPage();

//     switch (page) {
//       case "home":
//         this.animateHomePage();
//         break;
//       case "products":
//         this.animateProductsPage();
//         break;
//       case "about":
//         this.animateAboutPage();
//         break;
//       case "services":
//         this.animateServicesPage();
//         break;
//       case "contact":
//         this.animateContactPage();
//         break;
//     }
//   }

//   detectPage() {
//     if (document.querySelector(".hero")) return "home";
//     if (document.querySelector("#productGrid")) return "products";
//     if (document.querySelector(".about-top")) return "about";
//     if (document.querySelector(".services-section")) return "services";
//     if (document.querySelector(".contact-hero")) return "contact";
//     return "default";
//   }

//   // ─────────────────────────────────────────────
//   // HOME PAGE ANIMATIONS
//   // ─────────────────────────────────────────────
//   animateHomePage() {
//     // SPEC Hero A: Page load 0.4s delay, char-by-char y+16px standard 0.5s stagger 0.03s
//     const heroTitle = document.querySelector(".hero__brand");
//     if (heroTitle && !heroTitle.hasChildNodes()) {  // Avoid re-split
//       const text = heroTitle.textContent;
//       heroTitle.innerHTML = text
//         .split("")
//         .map(
//           (char) =>
//             `<span style="display:inline-block; opacity:0; transform:translateY(16px)">${char === ' ' ? '&nbsp;' : char}</span>`
//         )
//         .join("");

//       gsap.to(heroTitle.querySelectorAll("span"), {
//         opacity: 1,
//         y: 0,
//         stagger: 0.03,
//         duration: 0.5,
//         ease: this.STANDARD,
//         delay: 0.4
//       });
//     }

//     // Archive section - staggered cards
//     // SPEC E: Product cards grid fade scale0.96 0.8s standard stagger0.06 top85%
//     gsap.utils.toArray(".product-card, .p-card").forEach((card, i) => {
//       gsap.fromTo(card, 
//         { opacity: 0, scale: 0.96 },
//         {
//           opacity: 1,
//           scale: 1,
//           duration: 0.8,
//           ease: this.STANDARD,
//           scrollTrigger: {
//             trigger: card,
//             start: "top 85%",
//             once: true,
//           },
//           delay: i * 0.06
//         }
//       );
//     });

//     // Category section - alternating sides
//     gsap.utils.toArray(".category-item").forEach((item, i) => {
//       const x = i % 2 === 0 ? -20 : 20;
//       gsap.from(item, {
//         opacity: 0,
//         x: x,
//         duration: 0.7,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: item,
//           start: "top 90%",
//           once: true,
//         },
//         delay: i * 0.15,
//       });
//     });

//     // About section mosaic
//     gsap.utils.toArray(".mosaic__grid > *").forEach((el, i) => {
//       gsap.from(el, {
//         opacity: 0,
//         y: 40,
//         duration: 1.0,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: el,
//           start: "top 85%",
//           once: true,
//         },
//         delay: i * 0.2,
//       });
//     });
//   }

//   // ─────────────────────────────────────────────
//   // PRODUCTS PAGE ANIMATIONS
//   // ─────────────────────────────────────────────
//   animateProductsPage() {
//     // Products header
//     const productsTitle = document.querySelector(".products-title");
//     if (productsTitle) {
//       gsap.from(productsTitle, {
//         clipPath: "inset(0% 100% 0% 0%)",
//         duration: 1.2,
//         ease: "expo.inOut",
//         delay: 0.2,
//       });
//     }

//     // Filters - slide in from top
//     gsap.utils.toArray(".filter").forEach((filter, i) => {
//       gsap.from(filter, {
//         opacity: 0,
//         y: -20,
//         duration: 0.6,
//         ease: "power2.out",
//         delay: 0.3 + i * 0.1,
//       });
//     });

//     // Grid - progressive reveal
//     const grid = document.getElementById("productGrid");
//     if (grid) {
//       ScrollTrigger.create({
//         trigger: grid,
//         start: "top 80%",
//         onEnter: () => {
//           gsap.from(".p-card", {
//             opacity: 0,
//             y: 40,
//             scale: 0.9,
//             stagger: 0.08,
//             duration: 0.8,
//             ease: "back.out(1.7)",
//           });
//         },
//         once: true,
//       });
//     }
//   }

//   // ─────────────────────────────────────────────
//   // ABOUT PAGE ANIMATIONS
//   // ─────────────────────────────────────────────
//   animateAboutPage() {
//     // Title and intro
//     const aboutTitle = document.querySelector(".about-title");
//     if (aboutTitle) {
//       gsap.from(aboutTitle, {
//         opacity: 0,
//         y: 30,
//         duration: 1.0,
//         ease: "power3.out",
//       });
//     }

//     // Mosaic grid - complex stagger
//     const tiles = document.querySelectorAll(".tile");
//     tiles.forEach((tile, i) => {
//       gsap.from(tile, {
//         opacity: 0,
//         scale: 0.8,
//         rotation: i % 2 === 0 ? -5 : 5,
//         duration: 1.2,
//         ease: "back.out(1.4)",
//         scrollTrigger: {
//           trigger: tile,
//           start: "top 85%",
//           once: true,
//         },
//         delay: i * 0.15,
//       });
//     });

//     // Stats counter
//     // SPEC J: Stats count-up 1.8s gentle top88%, preserve + suffix
//     gsap.utils.toArray("[data-count]").forEach((stat) => {
//       const target = parseInt(stat.dataset.count);
//       const suffixEl = stat.nextElementSibling;  // + sibling
//       const hasSuffix = suffixEl && suffixEl.classList.contains('noden-about__plus');

//       let obj = { v: 0 };
//       ScrollTrigger.create({
//         trigger: stat.closest('.noden-about__stats'),
//         start: "top 88%",
//         once: true,
//         onEnter: () => gsap.to(obj, {
//           v: target,
//           duration: 1.8,
//           ease: this.GENTLE,
//           snap: { v: 1 },
//           onUpdate: () => stat.textContent = Math.ceil(obj.v) + (hasSuffix ? '+' : '')
//         })
//       });
//     });

//     // Sections - fade up
//     gsap.utils.toArray(".section").forEach((section) => {
//       gsap.from(section, {
//         opacity: 0,
//         y: 50,
//         duration: 1.0,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: section,
//           start: "top 85%",
//           once: true,
//         },
//       });
//     });
//   }

//   // ─────────────────────────────────────────────
//   // SERVICES PAGE ANIMATIONS
//   // ─────────────────────────────────────────────
//   animateServicesPage() {
//     // SPEC K: Service rows x -12px alt, 0.8s standard stagger 0.1s top85%
//     gsap.utils.toArray(".service-row").forEach((row, i) => {
//       const x = i % 2 === 0 ? -12 : 12;

//       gsap.fromTo(row, 
//         { opacity: 0, x },
//         {
//           opacity: 1,
//           x: 0,
//           duration: 0.8,
//           ease: this.STANDARD,
//           scrollTrigger: {
//             trigger: row,
//             start: "top 85%",
//             once: true,
//           },
//           delay: i * 0.1
//         }
//       );
//     });

//     // Process steps keep existing (close match)
//     gsap.utils.toArray(".step").forEach((step, i) => {
//       gsap.from(step, {
//         opacity: 0,
//         y: 60,
//         scale: 0.95,
//         duration: 1.0,
//         ease: this.STANDARD,  // Align ease
//         scrollTrigger: {
//           trigger: step,
//           start: "top 85%",
//           once: true,
//         },
//         delay: i * 0.2,
//       });
//     });
//   }

//   // ─────────────────────────────────────────────
//   // CONTACT PAGE ANIMATIONS
//   // ─────────────────────────────────────────────
//   animateContactPage() {
//     // Contact hero - split text
//     const contactTitle = document.querySelector(".about-title");
//     if (contactTitle) {
//       const words = contactTitle.textContent.split(" ");
//       contactTitle.innerHTML = words
//         .map(
//           (word) =>
//             `<span style="display:inline-block; opacity:0; transform:translateX(-20px)">${word}</span>`
//         )
//         .join(" ");

//       gsap.to(contactTitle.querySelectorAll("span"), {
//         opacity: 1,
//         x: 0,
//         stagger: 0.1,
//         duration: 0.8,
//         ease: "power3.out",
//         delay: 0.3,
//       });
//     }

//     // Contact tiles - grid reveal
//     gsap.utils.toArray(".contactTile").forEach((tile, i) => {
//       gsap.from(tile, {
//         opacity: 0,
//         y: 30,
//         scale: 0.9,
//         duration: 0.8,
//         ease: "back.out(1.4)",
//         scrollTrigger: {
//           trigger: tile,
//           start: "top 85%",
//           once: true,
//         },
//         delay: i * 0.15,
//       });
//     });

//     // Form fields - staggered fade
//     gsap.utils.toArray(".field").forEach((field, i) => {
//       gsap.from(field, {
//         opacity: 0,
//         y: 20,
//         duration: 0.6,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: field,
//           start: "top 90%",
//           once: true,
//         },
//         delay: 0.5 + i * 0.1,
//       });
//     });

//     // Submit button - pulse animation
//     const submitBtn = document.querySelector(".circleCta");
//     if (submitBtn) {
//       gsap.from(submitBtn, {
//         scale: 0.8,
//         opacity: 0,
//         duration: 1.0,
//         ease: "elastic.out(1, 0.5)",
//         scrollTrigger: {
//           trigger: submitBtn,
//           start: "top 90%",
//           once: true,
//         },
//       });
//     }
//   }

//   // ─────────────────────────────────────────────
//   // UTILITY METHODS
//   // ─────────────────────────────────────────────
//   disableAnimations() {
//     // SPEC 7: Reduced motion - all final state instant
//     gsap.set("*", {
//       opacity: 1,
//       y: 0,
//       x: 0,
//       scale: 1,
//       rotation: 0,
//       clipPath: "inset(0%)",
//       willChange: "auto"
//     });
//   }

//   // ─────────────────────────────────────────────
//   // PARALLAX SPEC 6
//   // ─────────────────────────────────────────────
//   setupParallax() {
//     gsap.utils.toArray('[data-phase]').forEach(marker => {
//       gsap.to(marker, {
//         yPercent: -30,
//         ease: "none",
//         scrollTrigger: {
//           trigger: marker,
//           start: "top bottom",
//           end: "bottom top",
//           scrub: 0.3
//         }
//       });
//     });
//     gsap.utils.toArray('img[data-parallax="foreground"]').forEach(img => {
//       gsap.to(img, {
//         yPercent: -15,
//         ease: "none",
//         scrollTrigger: {
//           trigger: img,
//           start: "top bottom",
//           end: "bottom top",
//           scrub: true
//         }
//       });
//     });
//   }
// }

// // Initialize when DOM is ready
// document.addEventListener("DOMContentLoaded", () => {
//   window.nodenEntrance = new NodenEntrance();
// });
