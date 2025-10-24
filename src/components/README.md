HomePortable — portable hero component

What this provides

- `HomePortable.vue` — a self-contained, portable Vue 3 component with scoped CSS for the hero section.
- `index.js` — convenience export.

Minimal files to copy to another project

1. `HomePortable.vue` (copy into your new project's `src/components` or any folder)
2. Put the hero image at `/assets/images/car.svg` or pass your own image path via the `mainPhoto` prop.
3. Put the dots background image at `/images/dots.png` in the new project's public/static folder (or update the URL in the component CSS).

Props

- `mainPhoto` (String) — image path, default: `/assets/images/car.svg`
- `themeColor` (String) — button color, default: `#407BFF`
- `heroHeading` (String) — heading text
- `buttonTry` (String) — CTA text

Optional enhancements to copy along with the component

- AOS (animations): install via `npm i aos` and in your `main.js` import and init:

  import AOS from 'aos'
  import 'aos/dist/aos.css'
  AOS.init()

  Or copy the original `public/js/aos.js` and `public/css/aos.css` and include them in your index.html.

- Smooth scroll: the component uses `a.smoothscroll`. Add a small handler in `main.js` if your app doesn't provide one already:

  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a.smoothscroll[href^="#"]')
    if (!a) return
    e.preventDefault()
    const id = a.getAttribute('href').slice(1)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  })

Usage example

import { HomePortable } from '@/lib/landing'

components: { HomePortable }

<HomePortable :mainPhoto="'/assets/images/car.svg'" :themeColor="'#FF6A00'" />

Notes

- The component includes a compact set of CSS rules to mimic the original hero. It intentionally avoids pulling in the whole template stylesheet and fonts, making it easy to drop into different projects.
- If you want exact parity with the original template (fonts, utilities), copy `public/css/style.css`, fonts and JS files as well.
