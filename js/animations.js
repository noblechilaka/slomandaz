gsap.registerPlugin(ScrollTrigger);

// ---------- Hero entrance (calm, cinematic) ----------
const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

gsap.set(".hero__brand, .hero__descriptor, .mini-logo, .navlink, .tool, .hero__pager", { opacity: 0, y: 10 });
gsap.set(".hero__media", { scale: 1.08 });

tl.to(".hero__media", { scale: 1.04, duration: 1.8, ease: "power2.out" }, 0)
  .to(".mini-logo", { opacity: 1, y: 0, duration: .9 }, 0.1)
  .to(".tool", { opacity: 1, y: 0, duration: .9, stagger: .06 }, 0.2)
  .to(".navlink", { opacity: 1, y: 0, duration: .9, stagger: .05 }, 0.25)
  .to(".hero__pager", { opacity: 1, y: 0, duration: .9 }, 0.35)
  .to(".hero__brand", { opacity: 1, y: 0, duration: 1.1 }, 0.45)
  .to(".hero__descriptor", { opacity: 1, y: 0, duration: 1.0 }, 0.6);

// ---------- Subtle scroll parallax on hero media ----------
gsap.to(".hero__media", {
  y: 60,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

// ---------- Tabs micro-interaction ----------
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("is-active"));
    tab.classList.add("is-active");
  });
});



// ---------- Product rail reveal ----------
gsap.from(".card, .tile", {
  opacity: 0,
  y: 18,
  duration: 1.1,
  stagger: 0.08,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".band",
    start: "top 85%"
  }
});


  // DOM Elements FOR CATEGORIES
  const items = document.querySelectorAll('.category-item');
  const frameLeft = document.querySelector('.frame-left');
  const frameRight = document.querySelector('.frame-right');

  
  // 1. Initial Stagger Reveal for Text
  gsap.to(".category-item", {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.1,
    ease: "power2.out"
  });


  // 2. Image Swap Logic (Soft Opacity Only)
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const cat = item.getAttribute('data-cat');
      
      // Remove is-active from all text
      items.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');

      // Handle Left Frame
      const leftLayers = frameLeft.querySelectorAll('.layer');
      leftLayers.forEach((l, index) => {
        // Assuming order matches list order. 
        // In production, use data attributes like data-cat="chair"
        if(index === Array.from(items).findIndex(i => i.getAttribute('data-cat') === cat)) {
          l.classList.add('active');
        } else {
          l.classList.remove('active');
        }
      });

      // Handle Right Frame (Same logic)
      const rightLayers = frameRight.querySelectorAll('.layer');
      rightLayers.forEach((l, index) => {
        if(index === Array.from(items).findIndex(i => i.getAttribute('data-cat') === cat)) {
          l.classList.add('active');
        } else {
          l.classList.remove('active');
        }
      });
    });
  });

  // 3. Smooth Mouse Parallax (Inertial)
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  function animate() {
    // Ease towards mouse position (0.05 factor makes it very smooth/laggy)
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    // Apply transform:
    // Left moves with mouse (x + y)
    // Right moves against mouse (-x -y)
    gsap.set(frameLeft, { x: currentX * 40, y: currentY * 40 });
    gsap.set(frameRight, { x: -currentX * 40, y: -currentY * 40 });

    requestAnimationFrame(animate);
  }
  animate();

  /* ════════════════════════════════════════
   GSAP — CURSOR & MAGNETIC PREVIEW
════════════════════════════════════════ */

const cursorDot    = document.getElementById('cursorDot');
const cursorPreview = document.getElementById('cursorPreview');
const previewImg   = document.getElementById('previewImg');
const previewLabel = document.getElementById('previewLabel');
const rows         = document.querySelectorAll('.service-row');

// Live mouse position
let mouseA = window.innerWidth / 2;
let mouseB = window.innerHeight / 2;

// Tracked positions for spring
let dotX = mouseA, dotY = mouseB;
let preX = mouseA, preY = mouseB;

document.addEventListener('mousemove', e => {
  mouseA = e.clientX;
  mouseB = e.clientY;
});

// ── Render loop — spring physics ──
function renderLoop() {
  // Cursor dot — snappy
  dotX += (mouseA - dotX) * 0.45;
  dotY += (mouseB - dotY) * 0.45;
  gsap.set(cursorDot, { x: dotX, y: dotY });

  // Preview card — buttery lag
  preX += (mouseA - preX) * 0.085;
  preY += (mouseB - preY) * 0.085;
  gsap.set(cursorPreview, {
    x: preX + 90,   // offset so it sits beside cursor
    y: preY - 60
  });

  requestAnimationFrame(renderLoop);
}
renderLoop();

// ── Row hover — show/hide preview ──
rows.forEach(row => {
  const imgSrc = row.dataset.preview;
  const label  = row.dataset.label;

  row.addEventListener('mouseenter', () => {
    previewImg.src   = imgSrc;
    previewLabel.textContent = label;

    gsap.killTweensOf(cursorPreview);
    gsap.to(cursorPreview, {
      opacity: 1,
      scale: 1,
      duration: 0.45,
      ease: 'power3.out'
    });

    // Cursor dot grows
    gsap.to(cursorDot, {
      scale: 2.5,
      backgroundColor: '#B87333',
      duration: 0.35,
      ease: 'power2.out'
    });
  });

  row.addEventListener('mouseleave', () => {
    gsap.to(cursorPreview, {
      opacity: 0,
      scale: 0.92,
      duration: 0.35,
      ease: 'power2.inOut'
    });

    gsap.to(cursorDot, {
      scale: 1,
      backgroundColor: '#1a1a18',
      duration: 0.3,
      ease: 'power2.out'
    });
  });
});

/* ════════════════════════════════════════
   GSAP — ENTRANCE ANIMATIONS
════════════════════════════════════════ */

// Observer-based reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      playEntrance();
      observer.disconnect();
    }
  });
}, { threshold: 0.15 });

observer.observe(document.getElementById('services'));

function playEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }});

  // Section counter
  tl.from('.section-counter', {
    opacity: 0,
    y: 20,
    duration: 0.8
  }, 0);

  // Eyebrow
  tl.from('.services-eyebrow', {
    opacity: 0,
    y: 12,
    duration: 0.7
  }, 0.1);

  // Headline — word by word
  tl.from('.services-headline', {
    opacity: 0,
    y: 30,
    duration: 0.9,
    ease: 'expo.out'
  }, 0.15);

  // Rows stagger
  tl.from('.service-row', {
    opacity: 0,
    y: 24,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power2.out'
  }, 0.35);

  // Footer
  tl.from('.services-footer', {
    opacity: 0,
    y: 16,
    duration: 0.7
  }, 0.85);
}

/* ════════════════════════════════════════
   COPPER LINE — GSAP-BOOSTED HOVER
════════════════════════════════════════ */

// We layer on a subtle scale effect to active row's siblings
rows.forEach((row, i) => {
  row.addEventListener('mouseenter', () => {
    rows.forEach((r, j) => {
      if (i !== j) {
        gsap.to(r, {
          opacity: 0.55,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    });
    gsap.to(row, {
      opacity: 1,
      duration: 0.3
    });
  });

  row.addEventListener('mouseleave', () => {
    rows.forEach(r => {
      gsap.to(r, {
        opacity: 1,
        duration: 0.45,
        ease: 'power2.out'
      });
    });
  });
});

// PROCESS-SECTION

/* ── Image clip reveals ── */
document.querySelectorAll('.step-image').forEach((el, i) => {
  gsap.from(el, {
    clipPath: 'inset(100% 0% 0% 0%)',
    duration: 1.1,
    ease: 'expo.inOut',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%'
    },
    delay: i * 0.08
  });
});

/* ── Step lines draw in ── */
document.querySelectorAll('.step-line').forEach((line, i) => {
  gsap.from(line, {
    scaleX: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: line, start: 'top 90%' },
    delay: i * 0.1 + 0.4
  });
});

/* ── Text stagger per step ── */
document.querySelectorAll('.step').forEach((step, i) => {
  gsap.from(step.querySelectorAll('.step-num, .step-name, .step-desc, .step-plus'), {
    opacity: 0,
    y: 18,
    stagger: 0.08,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: step, start: 'top 80%' },
    delay: i * 0.1 + 0.5
  });
});

// /* ── Footer ── */
// gsap.from('.process-footer > *', {
//   opacity: 0,
//   y: 24,
//   stagger: 0.15,
//   duration: 0.9,
//   ease: 'power3.out',
//   scrollTrigger: { trigger: '.process-footer', start: 'top 88%' }
// });

/* ── Subtle image parallax ── */
document.querySelectorAll('.step-image').forEach(el => {
  gsap.to(el.querySelector('img'), {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  });
});


/* ─────────────────────────
   HEADLINE ENTRANCE
───────────────────────── */
gsap.from(".contact-headline span", {
  y:80,
  opacity:0,
  stagger:0.15,
  duration:1.2,
  ease:"expo.out",
  scrollTrigger:{
    trigger:".contact",
    start:"top 80%"
  }
});

/* ─────────────────────────
   FORM LINES DRAW IN
───────────────────────── */
gsap.from(".form-line", {
  scaleX:0,
  duration:1,
  stagger:0.15,
  ease:"power3.out",
  scrollTrigger:{
    trigger:".contact-form",
    start:"top 85%"
  }
});

/* ─────────────────────────
   FOCUS INTERACTION
───────────────────────── */
document.querySelectorAll(".form-input").forEach(input => {

  const accent = input.parentElement.querySelector(".form-accent");

  input.addEventListener("focus", () => {
    gsap.to(accent, {
      width:"100%",
      duration:0.4,
      ease:"power3.out"
    });
  });

  input.addEventListener("blur", () => {
    if(!input.value){
      gsap.to(accent, {
        width:"0%",
        duration:0.4,
        ease:"power3.inOut"
      });
    }
  });

});

/* ─────────────────────────
   BUTTON MICRO MOTION
───────────────────────── */
const button = document.querySelector(".contact-button");

button.addEventListener("mouseenter", () => {
  gsap.to(button, {
    x:6,
    duration:0.3,
    ease:"power2.out"
  });
});

button.addEventListener("mouseleave", () => {
  gsap.to(button, {
    x:0,
    duration:0.3,
    ease:"power2.out"
  });
});


// FOOTER
gsap.from(".footer-column", {
  y: 40,
  opacity: 0,
  stagger: 0.15,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: { trigger: ".site-footer", start: "top 85%" },
});

gsap.from(".copyright", {
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: { trigger: ".footer-bottom", start: "top 95%" },
});