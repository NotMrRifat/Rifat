/* ============================================================
   RIFAT HASSAN PORTFOLIO — MAIN ENGINE v4.2
   Mobile Sidebar + Lenis Smooth Scroll to Section + Data Engine
   ============================================================ */

(function () {
  'use strict';

  /* ── Performance Detection ─────────────────────────────── */
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
  const isLowEnd = isMobile || (navigator.deviceMemory && navigator.deviceMemory < 4);
  const PARTICLE_COUNT = isLowEnd ? 35 : 75;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Core State ────────────────────────────────────────── */
  let mouse = { x: 0, y: 0, nx: 0, ny: 0 };
  let prevScrollY = 0;
  let lenis = null;
  let threeScene = null;
  let isTabVisible = true;

  /* ─────────────────────────────────────────────────────── */
  /* ── TAB VISIBILITY OPTIMIZATION ───────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
    if (threeScene && threeScene.clock) {
      if (isTabVisible) {
        threeScene.clock.start();
      } else {
        threeScene.clock.stop();
      }
    }
  });

  /* ─────────────────────────────────────────────────────── */
  /* ── LOADING SCREEN ────────────────────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    const bar = loader.querySelector('.loader-bar');
    const pct = loader.querySelector('.loader-pct');
    const txt = loader.querySelector('.loader-text');

    const msgs = [
      'Initializing neural network...',
      'Loading 3D engine & shaders...',
      'Injecting cyber glass components...',
      'Loading skills, projects & bots...',
      'Ready for launch...',
    ];

    let progress = 0;
    let msgIdx = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress > 100) progress = 100;

      if (bar) bar.style.width = progress + '%';
      if (pct) pct.textContent = Math.floor(progress) + '%';

      const newMsgIdx = Math.floor((progress / 100) * msgs.length);
      if (newMsgIdx !== msgIdx && newMsgIdx < msgs.length) {
        msgIdx = newMsgIdx;
        if (txt) txt.textContent = msgs[msgIdx];
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.style.overflow = '';
          triggerHeroAnimation();
        }, 300);
      }
    }, 40);

    document.body.style.overflow = 'hidden';
  }

  /* ─────────────────────────────────────────────────────── */
  /* ── THREE.JS BACKGROUND SCENE ─────────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  function initThree() {
    if (prefersReducedMotion || typeof THREE === 'undefined') {
      initFallbackParticles();
      return;
    }
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) { initFallbackParticles(); return; }

    try {
      const renderer = new THREE.WebGLRenderer({
        canvas, antialias: !isLowEnd, alpha: true, powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1 : 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 30;

      /* Particle Geometry */
      const geo = new THREE.BufferGeometry();
      const count = PARTICLE_COUNT * 20;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);

      const palette = [
        [0, 0.96, 1],       // Cyan
        [0.66, 0.33, 0.97],  // Purple
        [0.23, 0.51, 0.96],  // Blue
        [0, 1, 0.53],       // Green
      ];

      for (let i = 0; i < count; i++) {
        const r = 40 + Math.random() * 35;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3]     = c[0];
        colors[i * 3 + 1] = c[1];
        colors[i * 3 + 2] = c[2];
        sizes[i] = Math.random() * 1.6 + 0.4;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const mat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vAlpha;
          uniform float time;
          void main() {
            vColor = color;
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            float dist = length(mvPos.xyz);
            vAlpha = smoothstep(75.0, 12.0, dist) * 0.75;
            gl_PointSize = size * (320.0 / -mvPos.z);
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float alpha = (1.0 - d * 2.0) * vAlpha;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true, vertexColors: true, depthWrite: false,
      });

      const particles = new THREE.Points(geo, mat);
      scene.add(particles);

      /* Wireframe Geometric Shapes */
      if (!isLowEnd) {
        const wireObjects = [];
        const shapes = [
          new THREE.IcosahedronGeometry(2.2, 0),
          new THREE.OctahedronGeometry(1.8, 0),
          new THREE.TetrahedronGeometry(1.6, 0),
        ];
        const wireMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.12 });
        const purMat  = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.10 });

        const placements = [
          { pos: [-18, 8, -10], mat: wireMat, speed: 0.0035 },
          { pos: [16, -6, -15], mat: purMat,  speed: 0.0028 },
          { pos: [-8, -12, -8], mat: wireMat, speed: 0.0050 },
        ];

        placements.forEach(({ pos, mat: m, speed }, i) => {
          const mesh = new THREE.Mesh(shapes[i], m);
          mesh.position.set(...pos);
          mesh.userData = { speed, offset: i * 2 };
          scene.add(mesh);
          wireObjects.push(mesh);
        });

        scene.userData.wireObjects = wireObjects;
      }

      let frameId;
      const clock = new THREE.Clock();

      function animate() {
        frameId = requestAnimationFrame(animate);
        if (!isTabVisible) return;

        const elapsed = clock.getElapsedTime();
        mat.uniforms.time.value = elapsed;

        particles.rotation.y = elapsed * 0.012;
        particles.rotation.x = elapsed * 0.006;

        camera.position.x += (mouse.nx * 3.5 - camera.position.x) * 0.03;
        camera.position.y += (-mouse.ny * 1.8 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        if (scene.userData.wireObjects) {
          scene.userData.wireObjects.forEach((obj) => {
            obj.rotation.x += obj.userData.speed;
            obj.rotation.y += obj.userData.speed * 0.7;
            obj.position.y += Math.sin(elapsed + obj.userData.offset) * 0.008;
          });
        }

        renderer.render(scene, camera);
      }
      animate();
      threeScene = { renderer, scene, camera, particles, clock, frameId };

      let resizeTimeout;
      window.addEventListener('resize', () => {
        if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
        resizeTimeout = requestAnimationFrame(() => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        });
      }, { passive: true });

    } catch (e) {
      console.warn('Three.js fallback activated:', e);
      initFallbackParticles();
    }
  }

  /* ─────────────────────────────────────────────────────── */
  /* ── 2D CANVAS FALLBACK PARTICLES ──────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  function initFallbackParticles() {
    const cv = document.getElementById('ptcl');
    if (!cv) return;
    const cx = cv.getContext('2d');
    let W = cv.width = innerWidth;
    let H = cv.height = innerHeight;

    window.addEventListener('resize', () => { W = cv.width = innerWidth; H = cv.height = innerHeight; }, { passive: true });

    const pts = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      c: Math.random() > 0.5 ? '0,245,255' : '168,85,247',
      a: Math.random() * 0.5 + 0.1,
    }));

    function draw() {
      if (!isTabVisible) { requestAnimationFrame(draw); return; }
      cx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(${p.c},${p.a})`; cx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ─────────────────────────────────────────────────────── */
  /* ── CUSTOM CURSOR ─────────────────────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  function initCursor() {
    const cur = document.getElementById('cur');
    const curR = document.getElementById('curR');
    if (!cur || !curR) return;

    let rx = 0, ry = 0;
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ny = (e.clientY / window.innerHeight) * 2 - 1;
      cur.style.left = e.clientX + 'px';
      cur.style.top  = e.clientY + 'px';
    }, { passive: true });

    function animateCursorRing() {
      rx += (mouse.x - rx) * 0.12;
      ry += (mouse.y - ry) * 0.12;
      curR.style.left = rx + 'px';
      curR.style.top  = ry + 'px';
      requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .glass-card, .pcard, .bcard, .bot-card, .biz-card, .tool-card, [data-cursor-hover]')) {
        document.body.classList.add('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
      }
    }, { passive: true });

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'), { passive: true });
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'), { passive: true });
  }

  /* ─────────────────────────────────────────────────────── */
  /* ── LENIS SMOOTH SCROLL ENGINE & ANCHOR SMOOTH SCROLL ─── */
  /* ─────────────────────────────────────────────────────── */
  function initLenis() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
      });

      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        function singleRaf(time) {
          lenis.raf(time);
          requestAnimationFrame(singleRaf);
        }
        requestAnimationFrame(singleRaf);
      }

      /* ── Anchor Smooth Scroll on Nav Button Click (Desktop/PC) ── */
      document.querySelectorAll('a[href^="#"], a[href*="index.html#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          const hashIndex = href.indexOf('#');
          if (hashIndex === -1) return;

          const targetId = href.substring(hashIndex);
          if (targetId === '#' || targetId === '') return;

          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            window.cMM(); // Close mobile menu if open

            if (lenis) {
              lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
            } else {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      });

    } catch (e) {
      console.warn('Lenis scroll setup note:', e);
    }
  }

  /* ─────────────────────────────────────────────────────── */
  /* ── GSAP REVEAL ANIMATIONS ────────────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.stitle').forEach(el => {
      gsap.fromTo(el,
        { y: 35, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
        }
      );
    });
  }

  /* ─────────────────────────────────────────────────────── */
  /* ── DYNAMIC DATA RENDERERS ────────────────────────────── */
  /* ─────────────────────────────────────────────────────── */

  /* 1. Render Skills Arsenal with Filters */
  function renderSkills(filterKey = 'all') {
    const container = document.querySelector('.sgrid');
    if (!container || typeof PORTFOLIO_DATA === 'undefined') return;

    const filtered = PORTFOLIO_DATA.skills.filter(s => filterKey === 'all' || s.cat === filterKey);

    const categories = {
      code: { name: 'Programming & Core Frameworks', items: [] },
      web: { name: '3D Graphics & Creative Dev', items: [] },
      ai: { name: 'AI, Bots & Workflow Automation', items: [] },
      tools: { name: 'Tools & Cloud Infrastructure', items: [] }
    };

    filtered.forEach(s => {
      if (categories[s.cat]) {
        categories[s.cat].items.push(s);
      }
    });

    let html = '';
    Object.keys(categories).forEach(catKey => {
      const cat = categories[catKey];
      if (cat.items.length > 0) {
        html += `
          <div class="scat glass-card" data-cat="${catKey}">
            <div class="ctit">${cat.name}</div>
            <div class="sklist">
              ${cat.items.map(s => `
                <div>
                  <div class="smeta">
                    <span class="sname">${s.icon} ${s.name}</span>
                    <span class="spct">${s.pct}%</span>
                  </div>
                  <div class="sbg"><div class="sbar" data-w="${s.pct}"></div></div>
                  <div style="font-size:11px;color:var(--txtd);margin-top:4px">${s.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    });

    container.innerHTML = html;

    setTimeout(() => {
      document.querySelectorAll('.sbar').forEach(b => { b.style.width = b.dataset.w + '%'; });
    }, 100);
  }

  /* 2. Render Free AI & Developer Tools */
  function renderTools(filterKey = 'all', searchQuery = '') {
    const container = document.getElementById('tools-container');
    if (!container || typeof PORTFOLIO_DATA === 'undefined') return;

    const query = searchQuery.toLowerCase().trim();
    const filtered = PORTFOLIO_DATA.tools.filter(tool => {
      const matchCat = filterKey === 'all' || tool.catKey === filterKey;
      const matchSearch = !query || tool.title.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });

    container.innerHTML = filtered.map(t => `
      <div class="tool-card glass-card">
        <span class="tool-status ${t.status}">${t.statusLabel}</span>
        <div>
          <div class="pico">${t.icon}</div>
          <div class="tool-cat">${t.category}</div>
          <h3 class="ptit">${t.title}</h3>
          <p class="pdesc">${t.description}</p>
        </div>
        <div>
          <div class="pstack">
            ${t.techStack.map(st => `<span class="stk">${st}</span>`).join('')}
          </div>
          <a href="${t.openUrl}" class="pb pbl">${t.btnText}</a>
        </div>
      </div>
    `).join('');

    initCardTilt();
  }

  /* 3. Render Projects Grid */
  function renderProjects(filterKey = 'all', searchQuery = '') {
    const container = document.getElementById('projects-container');
    if (!container || typeof PORTFOLIO_DATA === 'undefined') return;

    const query = searchQuery.toLowerCase().trim();
    const filtered = PORTFOLIO_DATA.projects.filter(p => {
      const matchCat = filterKey === 'all' || p.category === filterKey;
      const matchSearch = !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });

    container.innerHTML = filtered.map(p => `
      <div class="pcard glass-card" data-cat="${p.category}">
        <div class="pico">${p.icon}</div>
        <h3 class="ptit">${p.title}</h3>
        <p class="pdesc">${p.description}</p>
        ${p.challenges ? `<div style="font-size:11px;color:var(--cyan);margin-bottom:8px"><strong>Challenge:</strong> ${p.challenges}</div>` : ''}
        ${p.solutions ? `<div style="font-size:11px;color:var(--txtd);margin-bottom:12px"><strong>Solution:</strong> ${p.solutions}</div>` : ''}
        <div class="pstack">
          ${p.tags.map(t => `<span class="stk">${t}</span>`).join('')}
        </div>
        <div class="pbtns">
          <a href="${p.liveUrl}" class="pb pbl">▶ Demo</a>
          <a href="${p.codeUrl}" class="pb pbs">&lt;/&gt; Source</a>
          <a href="${p.caseStudyUrl}" class="pb pbs">Case Study</a>
        </div>
      </div>
    `).join('');

    initCardTilt();
  }

  /* 4. Render Bots Grid */
  function renderBots(filterKey = 'all', searchQuery = '') {
    const container = document.getElementById('bots-container');
    if (!container || typeof PORTFOLIO_DATA === 'undefined') return;

    const query = searchQuery.toLowerCase().trim();
    const filtered = PORTFOLIO_DATA.bots.filter(b => {
      const matchCat = filterKey === 'all' || b.catKey === filterKey;
      const matchSearch = !query || b.name.toLowerCase().includes(query) || b.description.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });

    container.innerHTML = filtered.map(b => `
      <div class="bot-card glass-card" data-bot-cat="${b.catKey}">
        <div class="bot-header">
          <div class="bot-icon">${b.icon}</div>
          <div>
            <h3 class="bot-name">${b.name}</h3>
            <div class="bot-cat">${b.category}</div>
          </div>
          <span class="bot-status ${b.statusClass}">${b.statusText}</span>
        </div>
        <p class="bot-desc">${b.description}</p>
        <ul class="bot-features">
          ${b.features.map(f => `<li><svg class="icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--cyan)"><polyline points="20 6 9 17 4 12"/></svg>${f}</li>`).join('')}
        </ul>
        ${b.roadmap ? `<div style="font-size:11px;color:var(--pur);margin-bottom:12px"><strong>Roadmap:</strong> ${b.roadmap}</div>` : ''}
        <div class="bot-tech">
          ${b.tech.map(t => `<span>${t}</span>`).join('')}
        </div>
        <div class="bot-btns">
          <a href="${b.demoUrl}" class="bot-btn primary">Demo</a>
          <a href="${b.telegramUrl}" class="bot-btn secondary">Telegram</a>
        </div>
      </div>
    `).join('');

    initCardTilt();
  }

  /* ─────────────────────────────────────────────────────── */
  /* ── TYPEWRITER ─────────────────────────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  function initTypewriter() {
    const tw = document.getElementById('tw');
    if (!tw) return;
    const phrases = [
      'Full Stack Web Developer',
      'AI Automation Builder',
      'Telegram Bot Developer',
      'Three.js Creative Developer',
      'n8n Workflow Engineer',
      'Vibe Coder & Tech Innovator',
    ];
    let pi = 0, ci = 0, del = false;

    function type() {
      const ph = phrases[pi];
      if (!del) {
        tw.textContent = ph.slice(0, ++ci);
        if (ci === ph.length) { del = true; setTimeout(type, 2200); return; }
      } else {
        tw.textContent = ph.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(type, del ? 45 : 80);
    }
    type();
  }

  /* ─────────────────────────────────────────────────────── */
  /* ── HERO ANIMATION ─────────────────────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  function triggerHeroAnimation() {
    if (typeof gsap === 'undefined') return;
    const tl = gsap.timeline({ delay: 0.1 });
    tl.from('.hbadge',  { y: -18, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('.hname',   { y: 35,  opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
      .from('.hsub',    { y: 18,  opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
      .from('.hdesc',   { y: 18,  opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .from('.hctas',   { y: 18,  opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .from('.socrow',  { y: 15,  opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .from('.hstats',  { y: 15,  opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .from('.awrap',   { scale: 0.82, opacity: 0, duration: 1.1, ease: 'elastic.out(1, 0.5)' }, '-=0.9');
  }

  /* ─────────────────────────────────────────────────────── */
  /* ── NAVBAR & MOBILE SIDEBAR DRAWER ─────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  function initNav() {
    const nb = document.getElementById('nb');
    if (!nb) return;

    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      nb.classList.toggle('scrolled', sy > 40);
      if (sy > prevScrollY + 6 && sy > 220) {
        nb.classList.add('hidden');
      } else if (sy < prevScrollY - 6) {
        nb.classList.remove('hidden');
      }
      prevScrollY = sy;
    }, { passive: true });
  }

  /* Toggle Mobile Drawer & Backdrop Overlay */
  window.tMM = function () {
    const mm = document.getElementById('mm');
    const overlay = document.getElementById('mm-overlay');
    mm?.classList.toggle('open');
    overlay?.classList.toggle('open');
  };

  /* Close Mobile Drawer */
  window.cMM = function () {
    const mm = document.getElementById('mm');
    const overlay = document.getElementById('mm-overlay');
    mm?.classList.remove('open');
    overlay?.classList.remove('open');
  };

  /* ─────────────────────────────────────────────────────── */
  /* ── STAT COUNTERS ─────────────────────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  function initCounters() {
    function countUp(id, target, suffix = '', isFloat = false) {
      const el = document.getElementById(id);
      if (!el) return;
      let n = 0;
      const step = target / 80;
      const timer = setInterval(() => {
        n += step;
        if (n >= target) { n = target; clearInterval(timer); }
        el.textContent = isFloat ? n.toFixed(2) : Math.floor(n) + suffix;
      }, 16);
    }

    const hero = document.getElementById('hero');
    if (!hero) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          countUp('c1', 15, '+');
          countUp('c2', 28, '+');
          countUp('c3', 5, '+');
          countUp('c4', 5, '', true);
        }, 300);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(hero);
  }

  /* ─────────────────────────────────────────────────────── */
  /* ── MOUSE GLOW & TILT ─────────────────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  function initCardGlow() {
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.glass-card, .pcard, .bot-card, .biz-card, .tool-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          const mx = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
          const my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
          card.style.setProperty('--mx', mx + '%');
          card.style.setProperty('--my', my + '%');
        }
      });
    }, { passive: true });
  }

  function initCardTilt() {
    if (isLowEnd || prefersReducedMotion) return;
    document.querySelectorAll('.pcard, .bot-card, .biz-card, .tool-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rx = (y / rect.height * -8).toFixed(2);
        const ry = (x / rect.width  *  8).toFixed(2);
        card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      }, { passive: true });
    });
  }

  /* ─────────────────────────────────────────────────────── */
  /* ── FILTER & SEARCH ATTACHMENTS ───────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  function initFilterEvents() {
    const sfBtns = document.querySelectorAll('.sf-btn');
    sfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sfBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSkills(btn.dataset.filter);
      });
    });

    const toolBtns = document.querySelectorAll('[data-tool-filter]');
    const toolSearch = document.getElementById('tool-search');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTools(btn.dataset.toolFilter, toolSearch ? toolSearch.value : '');
      });
    });
    if (toolSearch) {
      toolSearch.addEventListener('input', () => {
        const activeBtn = document.querySelector('[data-tool-filter].active');
        renderTools(activeBtn ? activeBtn.dataset.toolFilter : 'all', toolSearch.value);
      });
    }

    const projBtns = document.querySelectorAll('[data-proj-filter]');
    const projSearch = document.getElementById('proj-search');
    projBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        projBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(btn.dataset.projFilter, projSearch ? projSearch.value : '');
      });
    });
    if (projSearch) {
      projSearch.addEventListener('input', () => {
        const activeBtn = document.querySelector('[data-proj-filter].active');
        renderProjects(activeBtn ? activeBtn.dataset.projFilter : 'all', projSearch.value);
      });
    }

    const botBtns = document.querySelectorAll('[data-bot-filter]');
    const botSearch = document.getElementById('bot-search');
    botBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        botBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderBots(btn.dataset.botFilter, botSearch ? botSearch.value : '');
      });
    });
    if (botSearch) {
      botSearch.addEventListener('input', () => {
        const activeBtn = document.querySelector('[data-bot-filter].active');
        renderBots(activeBtn ? activeBtn.dataset.botFilter : 'all', botSearch.value);
      });
    }
  }

  /* ─────────────────────────────────────────────────────── */
  /* ── BUSINESS CARD EXPAND ─────────────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  function initBizExpand() {
    document.querySelectorAll('.biz-card[data-expandable]').forEach(card => {
      card.addEventListener('click', () => {
        const wasExpanded = card.classList.contains('expanded');
        document.querySelectorAll('.biz-card').forEach(c => c.classList.remove('expanded'));
        if (!wasExpanded) card.classList.add('expanded');
      });
    });
  }

  /* ─────────────────────────────────────────────────────── */
  /* ── CONTACT FORM ENGINE (FUTURE-READY) ───────────────── */
  /* ─────────────────────────────────────────────────────── */
  function showToast(msg, isError = false) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = isError ? 
      `<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#ff6464"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> ${msg}` : 
      `<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--grn)"><polyline points="20 6 9 17 4 12"/></svg> ${msg}`;
    
    toast.style.borderColor = isError ? 'rgba(255,100,100,0.4)' : 'rgba(0,255,136,0.4)';
    toast.style.color = isError ? '#ff6464' : 'var(--grn)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3800);
  }

  window.sendMsg = function () {
    const n = document.getElementById('fn')?.value?.trim();
    const e = document.getElementById('fe')?.value?.trim();
    const s = document.getElementById('fs')?.value?.trim();
    const m = document.getElementById('fm')?.value?.trim();

    if (!n || !e || !m) { showToast('Please complete all required fields.', true); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { showToast('Please enter a valid email address.', true); return; }

    const sub = s || 'Project Inquiry via Portfolio';
    const body = `Name: ${n}\nEmail: ${e}\n\n${m}`;
    window.location.href = `mailto:md.rifat@myself.com?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
    showToast('Opening default email client...');
  };

  window.copyEmail = function (btn) {
    navigator.clipboard.writeText('md.rifat@myself.com').then(() => {
      btn.innerHTML = `<svg class="icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      btn.classList.add('copied');
      setTimeout(() => { 
        btn.innerHTML = `<svg class="icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Email`;
        btn.classList.remove('copied'); 
      }, 2200);
    });
  };

  /* ─────────────────────────────────────────────────────── */
  /* ── INITIALIZATION ────────────────────────────────────── */
  /* ─────────────────────────────────────────────────────── */
  function init() {
    initLoader();
    initThree();
    initCursor();
    initLenis();
    initGSAP();
    initTypewriter();
    initNav();
    initCounters();
    initCardGlow();
    initCardTilt();
    
    renderSkills();
    renderTools();
    renderProjects();
    renderBots();
    
    initFilterEvents();
    initBizExpand();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();