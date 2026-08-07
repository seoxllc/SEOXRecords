/* ==========================================================================
   SEOX RECORDS — main.js
   Lenis smooth scroll + GSAP reveals + generative "colonnade flight" hero
   scene (canvas) + nav / menu / counters / forms / filters.
   ========================================================================== */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Loader
     --------------------------------------------------------------------- */
  window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    if (loader) {
      setTimeout(() => loader.classList.add("is-hidden"), 400);
    }
  });

  /* ---------------------------------------------------------------------
     Lenis smooth scroll
     --------------------------------------------------------------------- */
  let lenis;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (window.gsap && window.gsap.ticker) {
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------------------------------------------------------------------
     Navbar: scroll state + mobile menu
     --------------------------------------------------------------------- */
  const nav = document.querySelector(".nav");
  const burger = document.querySelector(".nav-burger");
  const mobileMenu = document.querySelector(".mobile-menu");

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const isOpen = burger.classList.toggle("is-open");
      mobileMenu.classList.toggle("is-open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        burger.classList.remove("is-open");
        mobileMenu.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      })
    );
  }

  /* ---------------------------------------------------------------------
     Mark active nav link
     --------------------------------------------------------------------- */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
  });

  /* ---------------------------------------------------------------------
     GSAP reveal animations
     --------------------------------------------------------------------- */
  if (window.gsap) {
    gsap.registerPlugin(window.ScrollTrigger);

    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    gsap.utils.toArray(".reveal-blur").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    gsap.utils.toArray(".reveal-scale").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    // staggered children reveal
    document.querySelectorAll("[data-stagger]").forEach((group) => {
      const items = group.children;
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: group, start: "top 85%" },
      });
    });

    // hero entrance
    const heroTl = gsap.timeline({ delay: reduceMotion ? 0 : 0.6 });
    if (document.querySelector(".hero-kicker")) {
      heroTl
        .from(".hero-kicker", { opacity: 0, y: 12, duration: 0.8, ease: "power2.out" })
        .from(".hero-title", { opacity: 0, y: 40, duration: 1.1, ease: "power3.out" }, "-=0.5")
        .from(".hero-sub", { opacity: 0, y: 20, duration: 0.9, ease: "power3.out" }, "-=0.7")
        .from(".hero-desc", { opacity: 0, y: 16, duration: 0.8 }, "-=0.6")
        .from(".hero-actions", { opacity: 0, y: 16, duration: 0.8 }, "-=0.6");
    }

    // page-hero entrance (interior pages)
    if (document.querySelector(".page-hero")) {
      gsap.from(".page-hero .eyebrow, .page-hero h1, .page-hero .lede", {
        opacity: 0, y: 24, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.3,
      });
    }

    // parallax on hero scene
    if (document.querySelector(".hero-scene") && !reduceMotion) {
      gsap.to(".hero-scene", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }
  }

  /* ---------------------------------------------------------------------
     Counters
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-counter]").forEach((el) => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || "";
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const obj = { val: 0 };

    const run = () => {
      gsap.to(obj, {
        val: target,
        duration: 2.2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = obj.val.toFixed(decimals) + suffix;
        },
      });
    };

    if (window.gsap && window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: run,
      });
    } else {
      el.textContent = target.toFixed(decimals) + suffix;
    }
  });

  /* ---------------------------------------------------------------------
     Magnetic buttons
     --------------------------------------------------------------------- */
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 0.5, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
      });
    });
  }

  /* ---------------------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------------------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      item.classList.toggle("is-open", !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + "px" : null;
    });
  });

  /* ---------------------------------------------------------------------
     Filter chips (artists / music pages)
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const chips = group.querySelectorAll(".chip");
    const targetSelector = group.dataset.filterGroup;
    const items = document.querySelectorAll(targetSelector);

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        const val = chip.dataset.value;
        items.forEach((item) => {
          const match = val === "all" || item.dataset.genre === val || item.dataset.year === val;
          item.style.display = match ? "" : "none";
        });
      });
    });
  });

  /* search box filter */
  document.querySelectorAll("[data-search-target]").forEach((input) => {
    const targetSelector = input.dataset.searchTarget;
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll(targetSelector).forEach((item) => {
        const name = (item.dataset.name || item.textContent).toLowerCase();
        item.style.display = name.includes(q) ? "" : "none";
      });
    });
  });

  /* ---------------------------------------------------------------------
     Form handling (submission / contact / newsletter)

     Two delivery paths, both optional and safe to combine:

     1) EMAIL — if the <form> has a real "action" URL (e.g. a Formspree
        endpoint: https://formspree.io/f/xxxxxxx), the form POSTs there so
        the submission arrives by email. Until you add a real endpoint the
        form simply falls back to the local save below.

     2) LOCAL ADMIN COPY — if the <form> has [data-store="submissions"],
        every submission is also saved to this browser's localStorage so
        it shows up on admin.html. This only works on the same browser/
        device the form was submitted from — it is a convenience for
        testing, NOT a substitute for the email path above. See README.md.
     --------------------------------------------------------------------- */
  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const original = btn ? btn.innerHTML : "";
      if (btn) {
        btn.innerHTML = "Sending…";
        btn.disabled = true;
      }

      const formData = new FormData(form);
      const action = form.getAttribute("action");
      const hasRealEndpoint = action && action.trim() !== "" && action.trim() !== "#";

      // 1) Try emailing out via the form's action endpoint (e.g. Formspree)
      if (hasRealEndpoint) {
        try {
          await fetch(action, {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" },
          });
        } catch (err) {
          // fails silently — local save below still preserves the submission
        }
      }

      // 2) Save a local copy for the admin page
      if (form.dataset.store === "submissions") {
        try {
          const entry = { id: Date.now(), receivedAt: new Date().toISOString(), fields: {} };
          formData.forEach((value, key) => {
            if (entry.fields[key]) {
              entry.fields[key] = [].concat(entry.fields[key], value);
            } else {
              entry.fields[key] = value;
            }
          });
          const existing = JSON.parse(localStorage.getItem("seox_submissions") || "[]");
          existing.unshift(entry);
          localStorage.setItem("seox_submissions", JSON.stringify(existing));
        } catch (err) {
          console.warn("Could not save submission locally:", err);
        }
      }

      setTimeout(() => {
        const note = form.querySelector(".form-note") || document.createElement("p");
        note.className = "form-note mono-label";
        note.style.marginTop = "18px";
        note.textContent = "Received. We'll be in touch shortly.";
        if (!form.contains(note)) form.appendChild(note);
        if (btn) {
          btn.innerHTML = original;
          btn.disabled = false;
        }
        form.reset();
        const dynamicArtists = form.querySelector("[data-artist-fields]");
        if (dynamicArtists) dynamicArtists.dispatchEvent(new Event("seox:reset"));
      }, 700);
    });
  });

  /* ---------------------------------------------------------------------
     Submission page — dynamic "number of artists" field groups (1–4)
     --------------------------------------------------------------------- */
  const artistCountSelect = document.getElementById("artistCount");
  const artistFieldsWrap = document.querySelector("[data-artist-fields]");

  function artistGroupTemplate(index) {
    return `
      <div class="card artist-field-group" style="padding:24px; margin-top:${index === 1 ? 18 : 16}px;">
        <div class="mono-label" style="margin-bottom:16px;">Artist ${index}</div>
        <div class="form-grid">
          <div class="field"><label for="artistName${index}">Artist Name</label><input id="artistName${index}" name="artist_${index}_name" type="text" required></div>
          <div class="field"><label for="spotify${index}">Spotify Profile</label><input id="spotify${index}" name="artist_${index}_spotify" type="url" placeholder="https://open.spotify.com/artist/…"></div>
          <div class="field"><label for="appleMusic${index}">Apple Music Link</label><input id="appleMusic${index}" name="artist_${index}_apple_music" type="url" placeholder="https://music.apple.com/artist/…"></div>
          <div class="field"><label for="instagram${index}">Instagram</label><input id="instagram${index}" name="artist_${index}_instagram" type="text" placeholder="@handle"></div>
          <div class="field"><label for="tiktok${index}">TikTok</label><input id="tiktok${index}" name="artist_${index}_tiktok" type="text" placeholder="@handle"></div>
        </div>
      </div>`;
  }

  function renderArtistFields(count) {
    if (!artistFieldsWrap) return;
    let html = "";
    for (let i = 1; i <= count; i++) html += artistGroupTemplate(i);
    artistFieldsWrap.innerHTML = html;
  }

  if (artistCountSelect && artistFieldsWrap) {
    renderArtistFields(parseInt(artistCountSelect.value || "1", 10));
    artistCountSelect.addEventListener("change", () => {
      renderArtistFields(parseInt(artistCountSelect.value, 10));
    });
    artistFieldsWrap.addEventListener("seox:reset", () => {
      artistCountSelect.value = "1";
      renderArtistFields(1);
    });
  }

  /* ---------------------------------------------------------------------
     Hero background loader
     Reads window.SEOX_HERO_VIDEO (set in assets/js/hero-video-config.js)
     and tries, in order: YouTube embed -> direct video URL -> local video
     file -> generative canvas fallback ("castle courtyard" scene).
     Edit assets/js/hero-video-config.js to plug in your own video —
     nothing in this file needs to change.
     --------------------------------------------------------------------- */
  const sceneEl = document.querySelector(".hero-scene");
  if (sceneEl) {
    const video = sceneEl.querySelector("video");
    const canvas = sceneEl.querySelector("canvas");
    const ytWrap = sceneEl.querySelector(".hero-yt-bg");
    const cfg = window.SEOX_HERO_VIDEO || {};

    // Always start with the animated canvas scene as an immediate, flash-free
    // placeholder — real video/YouTube (if configured) swaps in on top once
    // it's actually ready to play, so there's never a blank/black moment.
    if (canvas) initCastleScene(canvas);

    function extractYouTubeId(url) {
      if (!url) return null;
      const patterns = [
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      ];
      for (const re of patterns) {
        const m = url.match(re);
        if (m) return m[1];
      }
      return null;
    }

    const ytId = extractYouTubeId(cfg.youtube);

    if (ytId && ytWrap) {
      // Option 3: YouTube link -> muted, looping background embed.
      const iframe = document.createElement("iframe");
      iframe.src =
        `https://www.youtube.com/embed/${ytId}` +
        `?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0` +
        `&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`;
      iframe.title = "Hero background video";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allow", "autoplay; encrypted-media");
      iframe.setAttribute("allowfullscreen", "");
      iframe.addEventListener(
        "load",
        () => {
          ytWrap.style.display = "block";
          if (canvas) canvas.style.display = "none";
        },
        { once: true }
      );
      ytWrap.appendChild(iframe);
    } else if ((cfg.url && cfg.url.trim()) || (cfg.local && cfg.local.trim())) {
      // Option 1 / 2: direct video file, remote URL takes priority over local.
      const src = (cfg.url && cfg.url.trim()) || cfg.local.trim();
      if (video) {
        const sourceEl = document.createElement("source");
        sourceEl.src = src;
        sourceEl.type = src.endsWith(".webm") ? "video/webm" : "video/mp4";
        video.appendChild(sourceEl);
        video.addEventListener(
          "loadeddata",
          () => {
            video.style.display = "block";
            if (canvas) canvas.style.display = "none";
          },
          { once: true }
        );
        // On error, do nothing further — the canvas scene started above stays put.
        video.load();
      }
    }
  }

  function initCastleScene(canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr;
    let raf;
    let t = 0;

    let groundY;
    const walkers = [];
    let cart = null;
    let nextWalkerAt = 0;
    let nextCartAt = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      groundY = h * 0.78;
    }

    function spawnWalker() {
      const dir = Math.random() > 0.5 ? 1 : -1;
      const kind = Math.random() > 0.6 ? "guard" : "wanderer";
      walkers.push({
        kind,
        dir,
        x: dir === 1 ? -40 : w + 40,
        y: groundY + (kind === "guard" ? -6 : 0) + Math.random() * 8,
        speed: (kind === "guard" ? 0.35 : 0.22) + Math.random() * 0.12,
        scale: 0.85 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      });
    }

    function spawnCart() {
      const dir = Math.random() > 0.5 ? 1 : -1;
      cart = {
        dir,
        x: dir === 1 ? -140 : w + 140,
        speed: 0.28,
        scale: 0.9 + Math.random() * 0.3,
      };
    }

    function reset() {
      walkers.length = 0;
      cart = null;
      nextWalkerAt = t + 40;
      nextCartAt = t + 420;
    }

    // ---- static castle skyline (drawn once per resize onto an offscreen layer) ----
    let skyline = null;
    function buildSkyline() {
      skyline = document.createElement("canvas");
      skyline.width = w;
      skyline.height = h;
      const sctx = skyline.getContext("2d");

      function drawLayer(baseY, amp, toneAlpha, towerCount, seedOffset) {
        sctx.fillStyle = `rgba(230,224,210,${toneAlpha})`;
        sctx.beginPath();
        sctx.moveTo(0, h);
        sctx.lineTo(0, baseY);
        const segW = w / towerCount;
        for (let i = 0; i <= towerCount; i++) {
          const seed = Math.sin(i * 12.9898 + seedOffset) * 43758.5453;
          const rnd = seed - Math.floor(seed);
          const wallY = baseY + rnd * amp * 0.3;
          const x0 = i * segW;
          sctx.lineTo(x0, wallY);
          // occasional tower with a peaked roof
          if (rnd > 0.55 && i < towerCount) {
            const towerW = segW * 0.34;
            const towerX = x0 + segW * 0.3;
            const towerH = amp * (0.6 + rnd * 0.7);
            sctx.lineTo(towerX, wallY);
            sctx.lineTo(towerX, wallY - towerH);
            sctx.lineTo(towerX + towerW / 2, wallY - towerH - towerW * 0.55);
            sctx.lineTo(towerX + towerW, wallY - towerH);
            sctx.lineTo(towerX + towerW, wallY);
          }
        }
        sctx.lineTo(w, baseY);
        sctx.lineTo(w, h);
        sctx.closePath();
        sctx.fill();
      }

      // sky gradient — peaceful dusk, kept within the monochrome/fog palette
      const sky = sctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#050505");
      sky.addColorStop(0.55, "#0b0a09");
      sky.addColorStop(1, "#000000");
      sctx.fillStyle = sky;
      sctx.fillRect(0, 0, w, h);

      // soft moon / horizon glow
      const glow = sctx.createRadialGradient(w * 0.72, h * 0.22, 4, w * 0.72, h * 0.22, w * 0.28);
      glow.addColorStop(0, "rgba(232,226,210,0.16)");
      glow.addColorStop(1, "rgba(232,226,210,0)");
      sctx.fillStyle = glow;
      sctx.fillRect(0, 0, w, h);
      sctx.beginPath();
      sctx.fillStyle = "rgba(240,236,224,0.55)";
      sctx.arc(w * 0.72, h * 0.22, Math.max(6, w * 0.012), 0, Math.PI * 2);
      sctx.fill();

      // stars
      for (let i = 0; i < 70; i++) {
        const sx = (Math.sin(i * 91.7) * 0.5 + 0.5) * w;
        const sy = (Math.sin(i * 53.3) * 0.5 + 0.5) * h * 0.5;
        const r = Math.random() * 0.9 + 0.2;
        sctx.beginPath();
        sctx.fillStyle = `rgba(255,255,255,${0.15 + Math.random() * 0.35})`;
        sctx.arc(sx, sy, r, 0, Math.PI * 2);
        sctx.fill();
      }

      // distant hills
      drawLayer(h * 0.62, h * 0.05, 0.045, 1, 5);

      // far castle silhouette
      drawLayer(groundY - h * 0.02, h * 0.24, 0.09, 8, 12);

      // near castle wall / towers (bigger, closer)
      drawLayer(groundY, h * 0.34, 0.16, 5, 40);

      // ground / courtyard
      const groundGrad = sctx.createLinearGradient(0, groundY, 0, h);
      groundGrad.addColorStop(0, "rgba(20,19,17,1)");
      groundGrad.addColorStop(1, "rgba(0,0,0,1)");
      sctx.fillStyle = groundGrad;
      sctx.fillRect(0, groundY, w, h - groundY);

      // subtle cobblestone lines
      sctx.strokeStyle = "rgba(255,255,255,0.03)";
      sctx.lineWidth = 1;
      for (let i = 0; i < 14; i++) {
        const ly = groundY + (h - groundY) * (i / 14);
        sctx.beginPath();
        sctx.moveTo(0, ly);
        sctx.lineTo(w, ly);
        sctx.stroke();
      }
    }

    // ---- simple silhouette figures ----
    function drawWalker(wk) {
      const bob = Math.sin(t * 0.12 + wk.phase) * 2;
      const s = wk.scale;
      const x = wk.x;
      const y = wk.y + bob;
      const legSwing = Math.sin(t * 0.18 + wk.phase) * 5 * s;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(wk.dir, 1);
      ctx.fillStyle = `rgba(8,8,8,0.88)`;

      // legs
      ctx.fillRect(-3 * s, 10 * s, 3 * s, 12 * s + legSwing * 0.3);
      ctx.fillRect(1 * s, 10 * s, 3 * s, 12 * s - legSwing * 0.3);
      // body
      ctx.fillRect(-5 * s, -6 * s, 10 * s, 18 * s);
      // head
      ctx.beginPath();
      ctx.arc(0, -10 * s, 4.2 * s, 0, Math.PI * 2);
      ctx.fill();

      if (wk.kind === "guard") {
        // small spear silhouette
        ctx.fillRect(6 * s, -22 * s, 1.4 * s, 34 * s);
      } else {
        // robe hem flare for wandering "minister"
        ctx.beginPath();
        ctx.moveTo(-5 * s, 12 * s);
        ctx.lineTo(-8 * s, 22 * s);
        ctx.lineTo(5 * s, 22 * s);
        ctx.lineTo(5 * s, 12 * s);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    function drawCart(c) {
      const s = c.scale;
      const x = c.x;
      const y = groundY + 6;
      const wheelSpin = t * 0.15;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(c.dir, 1);
      ctx.fillStyle = "rgba(6,6,6,0.9)";
      // cart bed
      ctx.fillRect(-22 * s, -14 * s, 44 * s, 12 * s);
      // side rail
      ctx.fillRect(-22 * s, -20 * s, 44 * s, 3 * s);
      // wheels
      [-14 * s, 12 * s].forEach((wx) => {
        ctx.save();
        ctx.translate(wx, 0);
        ctx.rotate(wheelSpin);
        ctx.strokeStyle = "rgba(6,6,6,0.9)";
        ctx.lineWidth = Math.max(1, 1.4 * s);
        ctx.beginPath();
        ctx.arc(0, 0, 7 * s, 0, Math.PI * 2);
        ctx.stroke();
        for (let sp = 0; sp < 4; sp++) {
          const a = (sp / 4) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * 7 * s, Math.sin(a) * 7 * s);
          ctx.stroke();
        }
        ctx.restore();
      });
      ctx.restore();
    }

    function draw() {
      t += 1;
      ctx.clearRect(0, 0, w, h);

      if (skyline) ctx.drawImage(skyline, 0, 0);

      // sparse population — spawn occasionally, not a crowd
      if (t > nextWalkerAt && walkers.length < 3) {
        spawnWalker();
        nextWalkerAt = t + 260 + Math.random() * 320;
      }
      if (t > nextCartAt && !cart) {
        spawnCart();
        nextCartAt = t + 900 + Math.random() * 600;
      }

      walkers.forEach((wk) => (wk.x += wk.speed * wk.dir));
      for (let i = walkers.length - 1; i >= 0; i--) {
        if (walkers[i].x < -60 || walkers[i].x > w + 60) walkers.splice(i, 1);
      }
      walkers
        .slice()
        .sort((a, b) => a.scale - b.scale)
        .forEach(drawWalker);

      if (cart) {
        cart.x += cart.speed * cart.dir;
        drawCart(cart);
        if (cart.x < -160 || cart.x > w + 160) cart = null;
      }

      // gentle vignette
      const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 0.95);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.45)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    }

    resize();
    buildSkyline();
    reset();

    if (!reduceMotion) {
      draw();
    } else {
      draw();
      cancelAnimationFrame(raf);
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        buildSkyline();
      }, 150);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduceMotion) {
        draw();
      }
    });
  }

  /* ---------------------------------------------------------------------
     Current year in footer
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
