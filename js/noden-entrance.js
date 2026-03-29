// // SPEC G: Figure images scale breath - add to globals after images
//     gsap.utils.toArray('figure img:not(.hero__media img, .hero__media):not([data-no-animate])').forEach((img) => {
//       if (img.closest('.card, .p-card, .product-card, .service-row')) return;
//       gsap.fromTo(img, 
//         { scale: 1.04 },
//         {
//           scale: 1.0,
//           duration: 1.2,
//           ease: this.DECELERATE,
//           scrollTrigger: {
//             trigger: img.closest('figure'),
//             start: 'top 85%',
//             once: true
//           }
//         }
//       );
//     });

//     // SPEC C: Section labels/kickers fade rise y+8px gentle 0.6s top90%
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
//   }

//   // ─────────────────────────────────────────────
//   // PARALLAX SPEC 6
//   // ─────────────────────────────────────────────
//   setupParallax() {
//     // Background markers (PHASE _ 01) - 0.3x scroll negative Y scrub0.3
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

//     // Foreground images -0.15y scrub
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
