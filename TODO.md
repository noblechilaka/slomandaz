# Animation Fix Plan - Progress Tracker

- [x] 1. Create this TODO.md

## In Progress

- [ ] 2. Centralize GSAP/ScrollTrigger registration in js/scripts.js only

## In Progress

- [ ]

## Remaining

- [ ] 2. Centralize GSAP/ScrollTrigger registration in js/scripts.js only
- [ ] 3. Remove duplicate `gsap.registerPlugin(ScrollTrigger)` from ALL other JS files (animations.js, archive.js, products.js, category.js, cursor.js, services.js, process.js, contact.js, previews.js, stats.js)
- [ ] 4. Refactor each JS file to export `initModuleName()` functions with element existence checks
- [ ] 5. Update js/scripts.js: Single DOMContentLoaded → init queue calling all modules after Lenis ready + ScrollTrigger.refresh()
- [ ] 6. Update index.html: Add `defer=` to scripts after scripts.js; ensure scripts.js first
- [ ] 7. Add safety: GSAP ticker single instance, normalizeScroll(true), error logging
- [ ] 8. Test: open index.html, check console, mobile responsive, specific anims (hero parallax, archive reel, cursor, services hover)

## Testing Commands

```bash
open index.html  # Live preview
# Check console for GSAP warnings/duplicates
```

**Current Status:** Starting step 2 after this file creation.
