# Beer Game Website — Implementation Guide

**Goal**  
Ship a single-page, **snap‑scroll** research showcase that explains the LLM-powered Beer Game with interactive visualizations and **scroll‑reveal** animations. Features an **interactive supply chain explainer**, **Chart.js bullwhip visualization** with research data, and AI section with robot icons. End with an **embedded Hugging Face Space**. All content is editable from JSON with amber highlighting protection system.

**Design Philosophy:** Academic rigor with accessibility. Research-focused content over promotional language. Consistent color-coded visualizations across all sections. Mobile-first responsive design optimized for desktop.

---

## 1) Site TL;DR
- **Audience:** researchers and newcomers to Beer Game/supply chain concepts  
- **Style:** research-focused, clean, interactive, **scroll‑reveal** animations  
- **Tech:** vanilla HTML/CSS/JS + Chart.js. FontAwesome icons. No build system.  
- **Content:** Hero with beer emoji, Four Roles (2x2 grid), Interactive Supply Chain Explainer (400vh), Timeline, Bullwhip Chart (Chart.js), AI Research Questions with robots, Variables, Hugging Face embed
- **Key Features:** Amber highlighting system, role-specific color coding, content protection for highlighted titles

---

## 2) Page Structure (9 sections)
Current implementation with interactive elements:

1. **Hero** — Title with beer emoji 🍺, value prop, scroll hint + desktop recommendation  
2. **The Four Roles** — 2x2 grid on desktop, role-colored cards with amber highlighting  
3. **Interactive Supply Chain Explainer** — 400vh scrolling section with dynamic explanations  
4. **A Week in the Game** — 5-step timeline visualization  
5. **The Bullwhip Effect** — Chart.js visualization with research data + amber highlighting  
6. **AI Research Questions** — Supply chain diagram with colored robot icons + research questions  
7. **Key Variables** — Grid layout of supply chain metrics  
8. **Try It** — Hugging Face iframe embed  
9. **Credits** — Author information

---

## 3) Hero Section Design
Current implementation includes enhanced user guidance:

```html
<h1>The <span class="highlight-text">Beer Game</span> 🍺</h1>
<p>Can AI agents manage a classic supply chain exercise?</p>
<p class="scroll-hint">Keep scrolling to explore<br>
   <span class="desktop-hint">Best experienced on desktop</span></p>
```

**Key Features:**
- Beer emoji for visual appeal and thematic connection
- Amber highlighting on "Beer Game" 
- Desktop recommendation for optimal experience
- Encouraging scroll text

---

## 4) Role Colors + Consistent Mapping (Critical)
Use one consistent color per role across **all visualizations**: icons, charts, robots, cards, borders.

**Exact CSS variables from current implementation:**
```css
:root {
  --retailer: #60a5fa;     /* blue */
  --wholesaler: #a78bfa;   /* purple */
  --distributor: #f59e0b;  /* amber */
  --factory: #f87171;      /* red */
  --accent: #f59e0b;       /* amber for highlighting */
  --grid: rgba(255,255,255,.15);
}
```

**Applied to:**
- Role card borders and icons
- Chart.js line colors
- Robot icon colors in AI section
- Supply chain diagram icons
- All interactive visualizations

---

## 5) Interactive Supply Chain Explainer (Key Feature)
400vh scrolling section with sticky positioning and dynamic content:

```css
#supply-chain-explainer-section {
  height: 400vh;
  scroll-snap-align: start;
  position: relative;
}

.supply-chain-sticky-wrapper {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**Scroll-triggered explanations:**
- Factory, Wholesaler, Retailer, Customer individual explanations
- "Goods vs. Information" with arrow direction changes
- Positioned above icons to avoid overlap (top: 25%)
- Smooth fade-in animations

---

## 6) Chart.js Bullwhip Visualization
Replaced canvas implementation with Chart.js for better accessibility and styling:

**Dependencies:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

**Research Data (not synthetic):**
```javascript
const customerDemand = [8, 8, 8, 8, 12, 12, 12, 12, 8, 8, 8, 8, 12, 12, 12, 12, 8, 8, 8, 8];
const retailerOrders = [8, 8, 8, 16, 16, 12, 12, 8, 8, 8, 16, 16, 12, 12, 8, 8, 8, 8, 12, 12];
const wholesalerOrders = [8, 8, 12, 20, 20, 16, 8, 4, 8, 12, 20, 20, 16, 8, 4, 4, 8, 12, 16, 16];
const factoryOrders = [8, 10, 16, 24, 24, 16, 0, 0, 4, 12, 24, 28, 20, 4, 0, 0, 8, 16, 20, 20];
```

**Styling:**
- Role-specific colors from CSS variables
- 2-second animation with easeInOutQuad
- Gray background container matching draft1.html

---

## 7) AI Research Questions Section
Enhanced with visual supply chain + robot icons:

**Structure:**
```html
<div class="ai-supply-chain">
  <div class="ai-chain-node">
    <i class="fas fa-industry supply-chain-icon"></i>
    <i class="fas fa-robot robot-icon" data-role="factory"></i>
    <p>Factory</p>
  </div>
  <!-- arrows and other roles -->
</div>
```

**Robot Colors:** Match role colors exactly
**Questions:** Research-focused from high-level-description.md:
- Do LLMs exhibit the bullwhip effect?
- How does information sharing impact performance?
- Does reducing lead times improve coordination?
- Can LLMs balance inventory vs. backlog costs?

---

## 8) Content Management System
JSON-based content with protection for highlighted titles:

**Content Source:** `/content/content.en.json`
**Protected Elements:** Titles with highlighting are not overwritten by JSON:
```javascript
if (id === 'hero-title' || id === 'bullwhip-title' || id === 'roles-title' || id === 'aiq-title') {
    return; // Don't overwrite highlighted titles
}
```

**Why:** Preserves `<span class="highlight-text">` markup for amber highlighting

---

## 9) Responsive Design
Mobile-first approach with desktop optimizations:

**Four Roles Grid:**
```css
.roles-grid {
  grid-template-columns: 1fr; /* Mobile: single column */
}

@media (min-width: 768px) {
  .roles-grid {
    grid-template-columns: repeat(2, 1fr); /* Desktop: 2x2 */
    max-width: 900px;
  }
}
```

**Interactive Sections:** Arrows rotate 90deg on mobile for vertical flow

---

## 10) Animation System
Scroll-reveal with accessibility support:

```css
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity .4s ease, transform .4s ease;
}

@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal.in-view {
    transition: none;
    transform: none;
    opacity: 1;
  }
}
```

**Implementation:** IntersectionObserver with 0.2 threshold for smooth reveals

---

## 11) Development Notes

**No Build System:** Pure vanilla HTML/CSS/JS for simplicity
**Dependencies:** FontAwesome (icons), Chart.js (visualization), Inter font
**Content Editing:** Modify `/content/content.en.json` for text updates
**Color Changes:** Update CSS variables to maintain consistency across all visualizations
**Testing:** Best experienced on desktop due to interactive scroll behaviors

**Critical:** Always maintain color consistency across role visualizations and protect highlighted title markup when updating content system.