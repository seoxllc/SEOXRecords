# SEOX Records — Website

A cinematic, dark, minimal record label site. Pure HTML/CSS/vanilla JS — no build step, no frameworks. Deploys directly to GitHub Pages.

## What changed in this revision

- **Removed** `artists.html` and `music.html` (and every nav/footer link to them). The homepage no longer has "Featured Artists" / "Latest Releases" grids — it's a shorter, more focused scroll: Hero → Stats → Featured Song → Playlists → Why SEOX → Artist Dashboard → Distribution → About preview.
- **Removed** the scroll-hint (mouse icon) under the hero, and the large glow blob that sat at the top of every interior page's header — that was very likely the "half-visible thing" reported; if something else is still showing, point it out and I'll dig further.
- **New hero scene.** Swapped the dark "flying through columns" animation for a calmer, peaceful **castle courtyard at dusk** — a guard walking a slow patrol, a robed figure or two wandering past occasionally, a cart rolling through now and then. Sparse, not crowded. Still built as a generative `<canvas>` scene (see below) so the site ships with zero video weight.
- **Submission form rebuilt**: SoundCloud → **Apple Music Link**, new genre list (Electronic, Funk, Phonk, Hardtekk, Angelcore, Melodic Techno, Future Bass, House, Other), and a **"Number of Artists" selector (1–4)** — picking 2+ dynamically renders a field group (Name, Spotify, Apple Music, Instagram, TikTok) per artist.
- **New: `admin.html`** — a simple, unlinked page for reviewing submissions. See below for how it works and its real limitations.

## Hero scene — plugging in your own video (local or from the internet)

By default the hero uses a generative `<canvas>` "castle courtyard" scene, drawn live in the browser — zero video weight, zero setup.

To swap it for a real video, open **`assets/js/hero-video-config.js`** — it's the only file you need to touch — and fill in exactly one of:

- **`local`** — a relative path to a video file you've added to the project (e.g. drop a file at `assets/videos/hero-bg.mp4` and set `local: "assets/videos/hero-bg.mp4"`).
- **`url`** — a direct link to an `.mp4`/`.webm` file hosted anywhere on the internet (Cloudinary, S3, your own server, a Vimeo "direct file" link, etc). It must point straight at the video file itself, not a webpage.
- **`youtube`** — any `youtube.com` or `youtu.be` link. It gets embedded automatically as a muted, looping background. Handy for quickly trying out a video, but a real file (`local`/`url`) will always look crisper and more reliable — YouTube's own player briefly shows its UI before settling in, and playback quality is out of this site's control.

Whichever one you fill in, reload the page and it takes over automatically — the canvas scene stays as an instant, flash-free placeholder underneath until the real video is actually ready to play, and quietly stays in place if a video fails to load (e.g. a broken URL) instead of leaving a blank screen.

## Submission form → getting replies

Because this is a static site (no server), a submitted form can't "call home" on its own. Two options are wired in, and you can use either or both:

**1. Email (recommended, works across every device/visitor)**
Sign up for a free form backend like [Formspree](https://formspree.io) (or similar), create a form, and paste your endpoint into the `action=""` attribute near the top of the `<form>` in `submission.html`:

```html
<form data-form data-store="submissions" action="https://formspree.io/f/xxxxxxx" method="POST">
```

Every submission will then land straight in your inbox.

**2. `admin.html` — local review page**
Visit `yoursite.com/admin.html` (it's intentionally not linked from the nav or footer). Sign in with:

- Username: `owner`
- Password: `lowkey`

**Important limitation:** this is a plain client-side gate — the password lives in the page's HTML/JS source, so it keeps out casual visitors but is not real security, and it should not be relied on for sensitive data. It also only shows submissions made *on that same browser/device* (it reads `localStorage`), so it won't show you submissions from other people's visits unless you also set up the email option above. Treat it as a handy local test/preview tool, and treat email (option 1) as your actual inbox.

## Structure

```
index.html               Homepage
about.html                Story, mission, vision, values, timeline, FAQ
playlists.html             Every official playlist, full-size embeds
submission.html            Guidelines + demo submission form
contact.html                Department contacts + map placeholder
admin.html                   Unlinked local submissions viewer (see above)
privacy.html / terms.html
404.html
assets/
  css/style.css            Full design system (tokens, components)
  js/main.js                 Lenis, GSAP reveals, hero scene, counters, forms
  js/hero-video-config.js     ← edit this to plug in a real hero video
  images/ videos/ icons/ fonts/
robots.txt / sitemap.xml
```

## Libraries (via CDN, no install needed)

- **GSAP + ScrollTrigger** — reveals, counters, parallax
- **Lenis** — smooth scroll
- **Font Awesome 6** — icons
- **Google Fonts** — Space Grotesk (display), Inter (body), JetBrains Mono (data/labels)

## Placeholder content

- **Release/song artwork** and the featured-song photo use royalty-free Unsplash placeholders — swap for real artwork before launch.
- **Spotify embeds** point to real public tracks/playlists as stand-ins for SEOX's actual catalogue.
- **Roster stats, dashboard numbers, department emails** are illustrative — replace with real data.

## Deploying to GitHub Pages

1. Push this folder's contents to the root of a GitHub repo (or `/docs`).
2. In the repo's Settings → Pages, set the source branch/folder.
3. Update `<link rel="canonical">`, Open Graph URLs, `robots.txt` and `sitemap.xml` to your real domain.
4. Set up the Formspree endpoint in `submission.html` (see above) if you want submissions by email.

## Accessibility & performance notes

- Respects `prefers-reduced-motion` (disables Lenis, GSAP heavy motion, and freezes the hero canvas on one frame).
- All images use `loading="lazy"` except above-the-fold hero content.
- Visible focus states on all interactive elements.
- Semantic landmarks (`header`, `nav`, `section`, `footer`, `article`) throughout.
