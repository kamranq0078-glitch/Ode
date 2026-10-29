# For Daddy (Sheikh Mohammad Abdullah) — An Ode for Ainain 🤍

A single-page, mobile-first tribute website created as a sacred, gentle gift for Ainain in remembrance of her beloved grandfather ("Daddy"), Sheikh Mohammad Abdullah.

Designed like a warm, quiet room she can step into from Bangalore whenever she misses him and Kashmir. Grief softened by love, like sitting beside him on a winter evening with warm noon chai.

---

## 🎧 Assets & Audio

- **Daddy's Voice (`assets/naat.mp3`)**: The sacred centerpiece of the site — the naat Daddy sang in his final days. It has already been set up in `assets/naat.mp3` (with a root `Naat.mp3` fallback).

---

## 🏛️ Personal Memories Included

1. **A Proud & Steadfast Man**: His deep self-respect, quiet stature, and honorable demeanor — yet always the first to show up whenever anyone was in need.
2. **Chocolates at the Window**: Every single day, knocking on Ainain's window to hand out chocolates to her and all the kids.
3. **From HMT to Sopore**: His weekly journeys to attend the Ijtimas, fiercely independent, never asking for a ride or help, walking his path with quiet devotion.
4. **Always Giving, Never Asking**: His boundless shelter for Ainain and his family.
5. **A Letter for Ainain**: An intimate handwritten message speaking to her grief in Bangalore, reminding her that Daddy's strength and love live on in her.
6. **A Dua for Maghfirat**: Arabic prayer for his elevation in Jannah, with an interactive, softly glowing *Ameen 🤲* button.

---

## 🚀 How to Run Locally

You can run the lightweight local server anytime:

```bash
# In the Ode directory:
python3 -m http.server 8000
```
Then visit:
```
http://localhost:8000
```

To preview without tapping the opening gate:
```
http://localhost:8000/#entered
```

---

## 🌸 Design & Features

- **Warm Dusk & Candlelight Palette**: Deep Kashmiri midnight green (`#071110`, `#0b1817`), soft warm gold (`#e5c387`), saffron/amber (`#d97d36`), cream/ivory (`#f8f4ec`), and pashmina rose (`#c97b83`).
- **Opening Gate**: Dark room with a gently flickering diya flame. Tap to begin authorizes mobile audio autoplay smoothly on iOS Safari & Android Chrome.
- **Custom Sacred Audio Player**: Tactile gold controls, live soundwave equalizer, draggable/touch progress scrubber, ±10s skips, volume/mute, and background pulse.
- **Page Visibility API**: Automatically pauses audio if she switches tabs or locks her phone screen.
- **Sticky Mini Audio Bar**: Glides in when scrolling past the main player so she can control audio from anywhere without losing her reading place.
- **Drifting Chinar Leaves & Diya Embers**: Gentle, lightweight canvas particle effect. Respects `prefers-reduced-motion` and includes a subtle "Ambiance" toggle in the header.
- **Keepsake Journal ("Who He Was")**: Styled like treasured diary pages with deckle folds and Kashmiri motifs.
- **Parchment Letter**: The emotional core, rendered in natural handwriting font (`Caveat`) with a vintage Kashmiri post stamp.
- **Sacred Dua & Ameen**: Arabic prayer for his Maghfirat, transliteration, English translation, and a glowing "Ameen 🤲" button that saves her prayer in `localStorage`.
- **Zero Heavy Frameworks**: Pure HTML5, CSS3, and Vanilla JavaScript. Fast, lightweight, and responsive down to 320px/375px mobile screens.
