# Teddy Virtue Mythos - Project Plan

## Overview
A handdrawn storybook web app where teddy bears and creatures on shelves tell virtue-cultivating stories. Hover/tap to preview, click to read full story.

---

## Pages

### 1. Library Page (Home)
- Full-screen shelf background (handdrawn PNG)
- Responsive grid of teddies placed on shelves
- Virtue filter in corner
- Teddies have idle animation (subtle CSS bobbing/breathing)

### 2. Story Page
- Same or simpler background
- Teddy positioned in corner (still slightly animated)
- Large speech bubble containing story text
- Back navigation element
- (Future: audio play button)

---

## Interactions

| Trigger | Desktop | Mobile |
|---------|---------|--------|
| Idle | Subtle breathing/bob animation | Same |
| Preview | Hover → teddy perks up + bubble appears | Tap → same |
| Enter story | Click | Second tap |
| Exit story | Click back arrow | Same |

**Animation details:**
- Hover delay: ~300ms before bubble appears (prevents flicker while browsing)
- Teddy state change: swap PNG src (idle → hover) + slight scale up
- Bubble entrance: fade + gentle scale from 0.8 → 1
- Page transition: bubble "expands" to fill screen, or crossfade

---

## Assets Needed (Procreate Checklist)

### Backgrounds
- [ ] Shelf background - desktop ratio (wider)
- [ ] Shelf background - mobile ratio (taller) — OR one that works for both

### Teddies (per story)
- [ ] Idle state PNG (sitting, eyes normal)
- [ ] Hover state PNG (perked up, eyes bright/wide)
- Note: One unique teddy per story, designed to match the story's theme

### UI Elements
- [ ] Small speech bubble (for preview on hover)
- [ ] Large speech bubble (story container) — can tile/stretch?
- [ ] Toggle buttons for virtue filter
- [ ] Back arrow / return element
- [ ] Optional: decorative corners, dividers

### Typography
- Start with handwriting font, upgrade to actual handwritten PNGs for select stories later

---

## Data Structure

```json
{
  "virtues": ["courage", "kindness", "patience", "honesty", "perseverance"],
  "stories": [
    {
      "id": "the-brave-little-bear",
      "title": "The Brave Little Bear",
      "preview": "A story about finding courage in unexpected places...",
      "content": "Full story text here...",
      "virtue": "courage",
      "teddy": {
        "name": "Theodore",
        "idleImage": "/assets/teddies/theodore-idle.png",
        "hoverImage": "/assets/teddies/theodore-hover.png"
      }
    }
  ]
}
```

Each story contains its own teddy info — simple 1:1 pairing.

---

## File Structure

```
/
├── index.html          # Library page
├── story.html          # Story page (or dynamic via JS)
├── css/
│   └── styles.css      # All styles + animations
├── js/
│   └── app.js          # Interactions, filtering, transitions
├── assets/
│   ├── backgrounds/
│   ├── teddies/
│   ├── bubbles/
│   └── ui/
└── data/
    └── stories.json
```

---

## Responsive Behavior

- CSS Grid with `auto-fill` and `minmax()` for teddy placement
- Teddies maintain consistent size, fewer per row on narrow screens
- Shelf background may need to tile or have separate mobile version
- Filter UI repositions (corner on desktop, top bar on mobile?)

---

## Technical Notes

- **No framework** — vanilla HTML/CSS/JS for simplicity
- **CSS animations** for idle bobbing, hover transitions
- **View Transitions API** for smooth page switches (with fallback)
- **Lazy loading** via `loading="lazy"` on teddy images
- **Accessibility**: Story text as actual text (not image), aria labels on teddies

---

## Decisions Made

1. **Preview bubble**: Shows both title (as header) + teaser line underneath
2. **Teddy-story pairing**: One unique teddy per story. Thoughtfully design each teddy to relate to its story's theme.
3. **Filter UI**: Toggle buttons row — all virtues visible, tap to filter
4. **Story text**: Start with handwriting font, upgrade to actual handwritten PNGs for select stories later

---

## Implementation Order

1. Set up project structure + placeholder assets
2. Build library page with responsive teddy grid
3. Add hover/tap interactions + preview bubble
4. Build story page with teddy + bubble layout
5. Implement page transitions
6. Add virtue filtering
7. Polish animations + test on mobile
8. Swap in real handdrawn assets
