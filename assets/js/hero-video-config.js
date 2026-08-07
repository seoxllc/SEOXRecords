/**
 * SEOX Records — Hero background video configuration
 * =========================================================================
 * This is the ONLY file you need to touch to swap the hero background
 * for a real video. Fill in exactly ONE of the three options below and
 * reload the page. Leave all three blank to keep the built-in generative
 * "castle courtyard" canvas animation.
 *
 * If more than one is filled in, priority is: youtube > url > local
 * =========================================================================
 */

window.SEOX_HERO_VIDEO = {

  // ---- OPTION 1 — LOCAL FILE -------------------------------------------
  // Drop a video file anywhere in the project (assets/videos/ is the usual
  // spot) and point to it here with a relative path. This is the most
  // reliable option — no network dependency, full control over cropping,
  // looping and the dark overlay on top of it.
  //
  //   local: "assets/videos/vid.mp4",
  //
  local: "assets/vid.mp4",

  // ---- OPTION 2 — DIRECT VIDEO URL --------------------------------------
  // A direct link to an .mp4 or .webm file hosted anywhere on the internet
  // (Cloudinary, AWS S3/CloudFront, Bunny/Backblaze, a Vimeo "direct file"
  // link, your own server, etc). It must point straight at a video file,
  // not a webpage — right-click a video and "Copy video address" is a
  // quick way to check, or open the link directly in a browser tab and
  // confirm it plays with no surrounding page.
  //
  //   url: "https://cdn.example.com/videos/hero-bg.mp4",
  //
  url: "",

  // ---- OPTION 3 — YOUTUBE LINK -------------------------------------------
  // Paste any youtube.com/watch, youtu.be, or /shorts link and it's
  // embedded automatically as a muted, looping background.
  //
  //   youtube: "https://youtu.be/XXXXXXXXXXX",
  //
  // Worth knowing before you use this one:
  //  - YouTube's own player briefly shows its UI/branding on load before
  //    settling into the background — options 1 and 2 don't have this.
  //  - Playback quality and buffering are controlled by YouTube, not by
  //    this site, so it can look softer or stutter on a slow connection.
  //  - It only works for content you're actually allowed to embed —
  //    YouTube's embed player respects each video's own embedding
  //    permission, so a small number of videos can't be used this way.
  //  - For a genuinely crisp, reliable hero, options 1 or 2 (an actual
  //    video file) will always look and perform better than an embed.
  //
 
  youtube: "",

};
