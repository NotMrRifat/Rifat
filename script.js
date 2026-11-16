/* ============================================================
   OMAR FARUK MIAH PORTFOLIO — MAIN ENGINE v5.0
   Premium Interactive Experience — Three.js · GSAP · Lenis
   ============================================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════ */
  /* ── PERFORMANCE DETECTION ──────────────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
  const isLowEnd = isMobile || (navigator.deviceMemory && navigator.deviceMemory < 4);
  const PARTICLE_COUNT = isLowEnd ? 35 : 75;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Utility: Throttle ──────────────────────────────────── */
  function throttle(fn, ms) {
    let last = 0, timer = null;
    return function () {
      const now = Date.now();
      const args = arguments;
      const ctx = this;
      if (now - last >= ms) {
        last = now;
        fn.apply(ctx, args);
      } else {
        clearTimeout(timer);
        timer = setTimeout(function () {
          last = Date.now();
          fn.apply(ctx, args);
        }, ms - (now - last));
      }
    };
  }

  /* ── Utility: Lerp ──────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ── Core State ─────────────────────────────────────────── */
  let mouse = { x: 0, y: 0, nx: 0, ny: 0 };
  let prevScrollY = 0;
  let lenis = null;
  let threeScene = null;
  let isTabVisible = true;
  let cleanupFns = [];

  /* ══════════════════════════════════════════════════════════ */
  /* ── TAB VISIBILITY OPTIMIZATION ────────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  document.addEventListener('visibilitychange', function () {
    isTabVisible = !document.hidden;
    if (threeScene && threeScene.clock) {
      if (isTabVisible) {
        threeScene.clock.start();
      } else {
        threeScene.clock.stop();
      }
    }
  });

  /* ══════════════════════════════════════════════════════════ */
  /* ── LOADING SCREEN ─────────────────────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;
    var bar = loader.querySelector('.loader-bar');
    var pct = loader.querySelector('.loader-pct');
    var txt = loader.querySelector('.loader-text');

    var msgs = [
      'Initializing neural core...',
      'Loading 3D universe...',
      'Assembling creative matrix...',
      'Calibrating scroll engine...',
      'Welcome to the universe...',
    ];

    var progress = 0;
    var msgIdx = 0;
    var interval = setInterval(function () {
      progress += Math.random() * 25 + 10;
      if (progress > 100) progress = 100;

      if (bar) bar.style.width = progress + '%';
      if (pct) pct.textContent = Math.floor(progress) + '%';

      var newMsgIdx = Math.floor((progress / 100) * msgs.length);
      if (newMsgIdx !== msgIdx && newMsgIdx < msgs.length) {
        msgIdx = newMsgIdx;
        if (txt) txt.textContent = msgs[msgIdx];
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(function () {
          loader.classList.add('hidden');
          document.body.style.overflow = '';
          triggerHeroAnimation();
        }, 280);
      }
    }, 35);

    document.body.style.overflow = 'hidden';
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── ENHANCED THREE.JS HERO SCENE ───────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initThree() {
    if (prefersReducedMotion || typeof THREE === 'undefined') {
      initFallbackParticles();
      return;
    }
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) { initFallbackParticles(); return; }

    try {
      var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: !isLowEnd,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1 : 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 30;

      /* ── Particle System ── */
      var geo = new THREE.BufferGeometry();
      var count = PARTICLE_COUNT * 20;
      var positions = new Float32Array(count * 3);
      var colors = new Float32Array(count * 3);
      var sizes = new Float32Array(count);

      var palette = [
        [0, 0.96, 1],        // Cyan
        [0.66, 0.33, 0.97],   // Purple
        [0.23, 0.51, 0.96],   // Blue
        [0, 1, 0.53],        // Green
      ];

      for (var i = 0; i < count; i++) {
        var r = 40 + Math.random() * 35;
        var theta = Math.random() * Math.PI * 2;
        var phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        var c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3]     = c[0];
        colors[i * 3 + 1] = c[1];
        colors[i * 3 + 2] = c[2];
        sizes[i] = Math.random() * 1.6 + 0.4;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      var mat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: [
          'attribute float size;',
          'attribute vec3 color;',
          'varying vec3 vColor;',
          'varying float vAlpha;',
          'uniform float time;',
          'void main() {',
          '  vColor = color;',
          '  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);',
          '  float dist = length(mvPos.xyz);',
          '  vAlpha = smoothstep(75.0, 12.0, dist) * 0.75;',
          '  gl_PointSize = size * (320.0 / -mvPos.z);',
          '  gl_Position = projectionMatrix * mvPos;',
          '}'
        ].join('\n'),
        fragmentShader: [
          'varying vec3 vColor;',
          'varying float vAlpha;',
          'void main() {',
          '  float d = length(gl_PointCoord - vec2(0.5));',
          '  if (d > 0.5) discard;',
          '  float alpha = (1.0 - d * 2.0) * vAlpha;',
          '  gl_FragColor = vec4(vColor, alpha);',
          '}'
        ].join('\n'),
        transparent: true, vertexColors: true, depthWrite: false,
      });

      var particles = new THREE.Points(geo, mat);
      scene.add(particles);

      /* ── Wireframe Geometric Shapes ── */
      if (!isLowEnd) {
        var wireObjects = [];
        var shapes = [
          new THREE.IcosahedronGeometry(2.2, 0),
          new THREE.OctahedronGeometry(1.8, 0),
          new THREE.TetrahedronGeometry(1.6, 0),
        ];
        var wireMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.12 });
        var purMat  = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.10 });

        var placements = [
          { pos: [-18, 8, -10], mat: wireMat, speed: 0.0035 },
          { pos: [16, -6, -15], mat: purMat,  speed: 0.0028 },
          { pos: [-8, -12, -8], mat: wireMat, speed: 0.0050 },
        ];

        placements.forEach(function (p, idx) {
          var mesh = new THREE.Mesh(shapes[idx], p.mat);
          mesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
          mesh.userData = { speed: p.speed, offset: idx * 2 };
          scene.add(mesh);
          wireObjects.push(mesh);
        });

        scene.userData.wireObjects = wireObjects;
      }

      /* ── Central Interactive Icosahedron (desktop only) ── */
      var centralObj = null;
      var mouseLight = null;
      var targetRotX = 0, targetRotY = 0;

      if (!isLowEnd && !isMobile) {
        var icoGeo = new THREE.IcosahedronGeometry(3.5, 1);
        var icoMat = new THREE.MeshStandardMaterial({
          color: 0x3478ff,
          metalness: 0.85,
          roughness: 0.15,
          wireframe: false,
          transparent: true,
          opacity: 0.7,
          emissive: 0x0a1a3f,
          emissiveIntensity: 0.4,
        });
        centralObj = new THREE.Mesh(icoGeo, icoMat);
        centralObj.position.set(0, 0, 5);
        scene.add(centralObj);

        /* Ambient light for the icosahedron */
        var ambLight = new THREE.AmbientLight(0x334466, 0.6);
        scene.add(ambLight);

        /* Point light that follows mouse */
        mouseLight = new THREE.PointLight(0x00e5ff, 1.5, 50);
        mouseLight.position.set(0, 0, 15);
        scene.add(mouseLight);

        /* Secondary accent light */
        var accentLight = new THREE.PointLight(0x8b5cf6, 0.8, 40);
        accentLight.position.set(-10, 5, 10);
        scene.add(accentLight);
      }

      var frameId;
      var clock = new THREE.Clock();

      function animate() {
        frameId = requestAnimationFrame(animate);
        if (!isTabVisible) return;

        var elapsed = clock.getElapsedTime();
        mat.uniforms.time.value = elapsed;

        particles.rotation.y = elapsed * 0.012;
        particles.rotation.x = elapsed * 0.006;

        camera.position.x += (mouse.nx * 3.5 - camera.position.x) * 0.03;
        camera.position.y += (-mouse.ny * 1.8 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        if (scene.userData.wireObjects) {
          scene.userData.wireObjects.forEach(function (obj) {
            obj.rotation.x += obj.userData.speed;
            obj.rotation.y += obj.userData.speed * 0.7;
            obj.position.y += Math.sin(elapsed + obj.userData.offset) * 0.008;
          });
        }

        /* Animate central icosahedron */
        if (centralObj) {
          centralObj.rotation.y = elapsed * 0.15;
          centralObj.rotation.x = elapsed * 0.08;
          /* React to mouse — subtle rotation toward cursor */
          targetRotX = mouse.ny * 0.4;
          targetRotY = mouse.nx * 0.4;
          centralObj.rotation.x += (targetRotX - centralObj.rotation.x % 1) * 0.02;
          centralObj.rotation.z = Math.sin(elapsed * 0.5) * 0.1;
          /* Pulsing scale */
          var pulse = 1 + Math.sin(elapsed * 0.8) * 0.04;
          centralObj.scale.setScalar(pulse);
          /* Fade icosahedron based on scroll — visible mainly in hero */
          var scrollFade = 1 - Math.min(1, window.scrollY / (window.innerHeight * 0.7));
          centralObj.material.opacity = 0.7 * Math.max(0, scrollFade);
        }

        /* Mouse-following light */
        if (mouseLight) {
          mouseLight.position.x += (mouse.nx * 15 - mouseLight.position.x) * 0.05;
          mouseLight.position.y += (-mouse.ny * 10 - mouseLight.position.y) * 0.05;
        }

        renderer.render(scene, camera);
      }
      animate();
      threeScene = { renderer: renderer, scene: scene, camera: camera, particles: particles, clock: clock, frameId: frameId };

      var resizeTimeout;
      window.addEventListener('resize', function () {
        if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
        resizeTimeout = requestAnimationFrame(function () {
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

  /* ══════════════════════════════════════════════════════════ */
  /* ── 2D CANVAS FALLBACK PARTICLES ───────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initFallbackParticles() {
    var cv = document.getElementById('ptcl');
    if (!cv) return;
    var cx = cv.getContext('2d');
    var W = cv.width = innerWidth;
    var H = cv.height = innerHeight;

    window.addEventListener('resize', function () { W = cv.width = innerWidth; H = cv.height = innerHeight; }, { passive: true });

    var pts = Array.from({ length: PARTICLE_COUNT }, function () {
      return {
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        c: Math.random() > 0.5 ? '0,245,255' : '168,85,247',
        a: Math.random() * 0.5 + 0.1,
      };
    });

    function draw() {
      if (!isTabVisible) { requestAnimationFrame(draw); return; }
      cx.clearRect(0, 0, W, H);
      pts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = 'rgba(' + p.c + ',' + p.a + ')'; cx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── ENHANCED CUSTOM CURSOR ─────────────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initCursor() {
    var cur = document.getElementById('cur');
    var curR = document.getElementById('curR');
    if (!cur || !curR || isMobile) return;

    /* Create cursor label element */
    var curLabel = document.createElement('div');
    curLabel.className = 'cursor-label';
    curLabel.style.cssText = 'position:fixed;pointer-events:none;z-index:100002;font-family:var(--fmono,monospace);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#00e5ff;opacity:0;transition:opacity 0.25s;white-space:nowrap;transform:translate(-50%,-150%);';
    document.body.appendChild(curLabel);

    /* Cursor trail (desktop, non-low-end only) */
    var trailDots = [];
    if (!isLowEnd) {
      for (var t = 0; t < 5; t++) {
        var dot = document.createElement('div');
        dot.style.cssText = 'position:fixed;pointer-events:none;z-index:99998;width:4px;height:4px;border-radius:50%;background:rgba(0,229,255,' + (0.3 - t * 0.05) + ');transform:translate(-50%,-50%);transition:none;';
        document.body.appendChild(dot);
        trailDots.push({ el: dot, x: 0, y: 0 });
      }
    }

    var rx = 0, ry = 0;

    var handleMouseMove = throttle(function (e) {
      mouse.x = e.clientX; mouse.y = e.clientY;
      mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ny = (e.clientY / window.innerHeight) * 2 - 1;
    }, 8);

    document.addEventListener('mousemove', function (e) {
      /* Direct cursor dot position — no throttle for responsiveness */
      cur.style.left = e.clientX + 'px';
      cur.style.top  = e.clientY + 'px';
      /* Label follows cursor */
      curLabel.style.left = e.clientX + 'px';
      curLabel.style.top  = e.clientY + 'px';
      handleMouseMove(e);
    }, { passive: true });

    function animateCursorRing() {
      rx += (mouse.x - rx) * 0.12;
      ry += (mouse.y - ry) * 0.12;
      curR.style.left = rx + 'px';
      curR.style.top  = ry + 'px';

      /* Trail effect */
      if (trailDots.length) {
        for (var i = trailDots.length - 1; i > 0; i--) {
          trailDots[i].x = trailDots[i - 1].x;
          trailDots[i].y = trailDots[i - 1].y;
        }
        trailDots[0].x = rx;
        trailDots[0].y = ry;
        trailDots.forEach(function (d) {
          d.el.style.left = d.x + 'px';
          d.el.style.top  = d.y + 'px';
        });
      }

      requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    /* Hover detection with label states */
    document.addEventListener('mouseover', function (e) {
      var target = e.target;
      var projectCard = target.closest('.pcard, .bot-card, .tool-card');
      var linkEl = target.closest('a, button');
      var imgEl = target.closest('img, .hero-avatar-frame, .hero-bg-img-box');
      var interactive = target.closest('a, button, .glass-card, .pcard, .bcard, .bot-card, .biz-card, .tool-card, [data-cursor-hover]');

      if (projectCard) {
        document.body.classList.add('cursor-hover');
        curLabel.textContent = 'VIEW';
        curLabel.style.opacity = '1';
      } else if (imgEl) {
        document.body.classList.add('cursor-hover');
        curLabel.textContent = 'EXPLORE';
        curLabel.style.opacity = '1';
      } else if (linkEl) {
        document.body.classList.add('cursor-hover');
        curLabel.textContent = 'CLICK';
        curLabel.style.opacity = '1';
      } else if (interactive) {
        document.body.classList.add('cursor-hover');
        curLabel.style.opacity = '0';
      } else {
        document.body.classList.remove('cursor-hover');
        curLabel.style.opacity = '0';
      }
    }, { passive: true });

    document.addEventListener('mousedown', function () { document.body.classList.add('cursor-click'); }, { passive: true });
    document.addEventListener('mouseup', function () { document.body.classList.remove('cursor-click'); }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── LENIS SMOOTH SCROLL ENGINE & ANCHOR SMOOTH SCROLL ──── */
  /* ══════════════════════════════════════════════════════════ */
  function initLenis() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
        smoothTouch: false,
      });

      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (time) {
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

      /* ── Anchor Smooth Scroll on Nav Button Click ── */
      document.querySelectorAll('a[href^="#"], a[href*="index.html#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
          var href = anchor.getAttribute('href');
          var hashIndex = href.indexOf('#');
          if (hashIndex === -1) return;

          var targetId = href.substring(hashIndex);
          if (targetId === '#' || targetId === '') return;

          var targetEl = document.querySelector(targetId);
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

  /* ══════════════════════════════════════════════════════════ */
  /* ── ADVANCED GSAP SCROLL EXPERIENCE ────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    var isReduced = prefersReducedMotion;

    /* ── Scroll Progress Bar ── */
    var progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      gsap.to(progressBar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        }
      });
    }

    if (isReduced) return;

    /* ── Section Title Reveals (staggered) ── */
    document.querySelectorAll('.stitle').forEach(function (el) {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
        }
      );
    });

    /* ── Section Tag Reveals ── */
    document.querySelectorAll('.stag').forEach(function (el) {
      gsap.fromTo(el,
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' }
        }
      );
    });

    /* ── Glass Cards Staggered Fade-Up ── */
    var cardContainers = document.querySelectorAll('.sgrid, .tools-grid, .ppgrid, .bots-grid, .agrid');
    cardContainers.forEach(function (container) {
      var cards = container.querySelectorAll('.glass-card, .pcard, .bot-card, .tool-card, .scat, .icard');
      if (!cards.length) return;
      gsap.fromTo(cards,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    /* ── Hero Parallax Effect ── */
    var heroName = document.querySelector('.hname');
    var heroDesc = document.querySelector('.hdesc');
    var heroAvatar = document.querySelector('.hero-avatar-wrap, .hero-avatar-frame');

    if (heroName) {
      gsap.to(heroName, {
        y: -60,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        }
      });
    }
    if (heroDesc) {
      gsap.to(heroDesc, {
        y: -30,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }
    if (heroAvatar) {
      gsap.to(heroAvatar, {
        y: -80,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }
      });
    }

    /* ── Text Split / Word Reveal on Major Headings ── */
    document.querySelectorAll('.stitle').forEach(function (heading) {
      var text = heading.textContent;
      var span = heading.querySelector('span');
      var spanText = span ? span.textContent : '';
      /* Only split if heading has real text content beyond a span */
      if (!text || text.trim().length < 3) return;

      var words = text.trim().split(/\s+/);
      heading.innerHTML = '';
      words.forEach(function (word, idx) {
        var wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.overflow = 'hidden';
        var inner = document.createElement('span');
        inner.style.display = 'inline-block';
        inner.textContent = word;
        inner.className = 'word-reveal';
        /* Re-apply the span color for matching words */
        if (spanText && spanText.indexOf(word) !== -1) {
          inner.style.color = 'var(--cyan, #00e5ff)';
        }
        wordSpan.appendChild(inner);
        heading.appendChild(wordSpan);
        if (idx < words.length - 1) {
          heading.appendChild(document.createTextNode(' '));
        }
      });

      var wordEls = heading.querySelectorAll('.word-reveal');
      gsap.fromTo(wordEls,
        { y: '110%' },
        {
          y: '0%', duration: 0.7, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    /* ── Horizontal Marquee Scroll Section ── */
    var marquee = document.querySelector('.marquee-track');
    if (marquee) {
      gsap.to(marquee, {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: marquee.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }

    /* ── Project Cards Scale-In with Depth ── */
    document.querySelectorAll('.pcard').forEach(function (card) {
      gsap.fromTo(card,
        { scale: 0.85, opacity: 0, rotateX: 8 },
        {
          scale: 1, opacity: 1, rotateX: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    /* ── Timeline Items Slide from Alternating Sides ── */
    document.querySelectorAll('.tlc, .tl-item').forEach(function (item, i) {
      var fromX = (i % 2 === 0) ? -60 : 60;
      gsap.fromTo(item,
        { x: fromX, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    /* ── Section Background Color Transitions (subtle via body attribute) ── */
    var sections = document.querySelectorAll('section[id]');
    var sectionColors = {
      'hero':       '#050505',
      'about':      '#060810',
      'skills':     '#050508',
      'education':  '#060810',
      'tools':      '#050508',
      'pprev':      '#060810',
      'bots':       '#050508',
      'business':   '#060810',
      'contact':    '#050505',
    };

    sections.forEach(function (sec) {
      var secId = sec.getAttribute('id');
      var bgColor = sectionColors[secId];
      if (!bgColor) return;

      ScrollTrigger.create({
        trigger: sec,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: function () { gsap.to('body', { backgroundColor: bgColor, duration: 0.8, ease: 'power2.inOut' }); },
        onEnterBack: function () { gsap.to('body', { backgroundColor: bgColor, duration: 0.8, ease: 'power2.inOut' }); },
      });
    });

    /* ── Generic Section Content Reveal ── */
    document.querySelectorAll('.about-info, .objc, .skills-filter, .filter-row, .edu-section, .contact-grid, .biz-grid').forEach(function (el) {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
        }
      );
    });

    /* ── Scroll Indicator Fade Out ── */
    var scrollInd = document.querySelector('.scroll-ind');
    if (scrollInd) {
      gsap.to(scrollInd, {
        opacity: 0,
        y: -20,
        scrollTrigger: {
          trigger: '#hero',
          start: '20% top',
          end: '40% top',
          scrub: true,
        }
      });
    }
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── MAGNETIC BUTTON INTERACTIONS ───────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initMagneticButtons() {
    if (isMobile || prefersReducedMotion) return;

    var selectors = '.btnP, .btnG, .btnS, .nhire, .ncv, .pb, .bot-btn, .tool-launch-btn';
    var buttons = document.querySelectorAll(selectors);

    buttons.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var maxDist = Math.max(rect.width, rect.height);

        if (dist < maxDist) {
          var pull = 0.3;
          var moveX = dx * pull;
          var moveY = dy * pull;
          btn.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px) scale(1.03)';
        }
      }, { passive: true });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
        /* Elastic spring-back via transition set in CSS */
      }, { passive: true });

      btn.addEventListener('mousedown', function () {
        btn.style.transform = 'scale(0.95)';
        btn.style.transition = 'transform 0.1s ease';
      });

      btn.addEventListener('mouseup', function () {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(function () { btn.style.transition = ''; }, 500);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── DYNAMIC DATA RENDERERS ─────────────────────────────── */
  /* ══════════════════════════════════════════════════════════ */

  /* 1. Render Skills Arsenal with Filters */
  function renderSkills(filterKey) {
    if (filterKey === undefined) filterKey = 'all';
    var container = document.querySelector('.sgrid');
    if (!container || typeof PORTFOLIO_DATA === 'undefined') return;

    var filtered = PORTFOLIO_DATA.skills.filter(function (s) { return filterKey === 'all' || s.cat === filterKey; });

    var categories = {
      code: { name: 'Programming & Core Frameworks', items: [] },
      web: { name: '3D Graphics & Creative Dev', items: [] },
      ai: { name: 'AI, Bots & Workflow Automation', items: [] },
      tools: { name: 'Tools & Cloud Infrastructure', items: [] }
    };

    filtered.forEach(function (s) {
      if (categories[s.cat]) {
        categories[s.cat].items.push(s);
      }
    });

    var html = '';
    Object.keys(categories).forEach(function (catKey) {
      var cat = categories[catKey];
      if (cat.items.length > 0) {
        html += '<div class="scat glass-card" data-cat="' + catKey + '">' +
          '<div class="ctit">' + cat.name + '</div>' +
          '<div class="sklist">' +
          cat.items.map(function (s) {
            return '<div>' +
              '<div class="smeta">' +
                '<span class="sname">' + s.icon + ' ' + s.name + '</span>' +
                '<span class="spct">' + s.pct + '%</span>' +
              '</div>' +
              '<div class="sbg"><div class="sbar" data-w="' + s.pct + '"></div></div>' +
              '<div style="font-size:11px;color:var(--txtd);margin-top:4px">' + s.desc + '</div>' +
            '</div>';
          }).join('') +
          '</div></div>';
      }
    });

    container.innerHTML = html;

    setTimeout(function () {
      document.querySelectorAll('.sbar').forEach(function (b) { b.style.width = b.dataset.w + '%'; });
    }, 100);
  }

  /* 2. Render Free AI & Developer Tools with Custom-Built Utilities */
  function renderTools(filterKey, searchQuery) {
    if (filterKey === undefined) filterKey = 'all';
    if (searchQuery === undefined) searchQuery = '';
    var container = document.getElementById('tools-container');
    if (!container || typeof PORTFOLIO_DATA === 'undefined') return;

    var query = searchQuery.toLowerCase().trim();
    var filtered = PORTFOLIO_DATA.tools.filter(function (tool) {
      var matchCat = false;
      if (filterKey === 'all') {
        matchCat = true;
      } else if (filterKey === 'custom' || filterKey === 'live') {
        matchCat = tool.isCustom === true;
      } else {
        matchCat = tool.catKey === filterKey;
      }

      var matchSearch = !query ||
        tool.title.toLowerCase().indexOf(query) !== -1 ||
        tool.description.toLowerCase().indexOf(query) !== -1 ||
        tool.category.toLowerCase().indexOf(query) !== -1;

      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--txtd);font-family:var(--fmono)">' +
        '<div style="font-size:2rem;margin-bottom:12px;color:var(--cyan)">// 404 NO_MATCH</div>' +
        '<p>No tools found matching your search. Try adjusting filters or search query.</p></div>';
      return;
    }

    container.innerHTML = filtered.map(function (t) {
      var badge = t.isCustom ?
        '<div class="tool-badge-custom"><span class="pulse-dot"></span> Built by Omar</div>' :
        '<span class="tool-status ' + t.status + '">' + t.statusLabel + '</span>';

      return '<div class="tool-card glass-card ' + (t.isCustom ? 'custom-tool' : '') + '">' +
        badge +
        '<div>' +
          '<div class="pico ' + (t.isCustom ? 'pico-custom' : '') + '">' + t.icon + '</div>' +
          '<div class="tool-cat">' + t.category + '</div>' +
          '<h3 class="ptit">' + t.title + '</h3>' +
          '<p class="pdesc">' + t.description + '</p>' +
        '</div>' +
        '<div>' +
          '<div class="pstack">' +
            t.techStack.map(function (st) { return '<span class="stk ' + (t.isCustom ? 'stk-custom' : '') + '">' + st + '</span>'; }).join('') +
          '</div>' +
          '<a href="' + t.openUrl + '"' + (t.openUrl.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + ' class="pb ' + (t.isCustom ? 'pbl tool-launch-btn' : 'pbl') + '">' +
            t.btnText +
          '</a>' +
        '</div>' +
      '</div>';
    }).join('');

    initCardTilt();
  }

  /* 3. Render Projects Grid */
  function renderProjects(filterKey, searchQuery) {
    if (filterKey === undefined) filterKey = 'all';
    if (searchQuery === undefined) searchQuery = '';
    var container = document.getElementById('projects-container');
    if (!container || typeof PORTFOLIO_DATA === 'undefined') return;

    var query = searchQuery.toLowerCase().trim();
    var filtered = PORTFOLIO_DATA.projects.filter(function (p) {
      var matchCat = filterKey === 'all' || p.category === filterKey;
      var matchSearch = !query || p.title.toLowerCase().indexOf(query) !== -1 || p.description.toLowerCase().indexOf(query) !== -1;
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--txtd);font-family:var(--fmono)">' +
        '<div style="font-size:2rem;margin-bottom:12px;color:var(--cyan)">// 404 NO_MATCH</div>' +
        '<p>No projects found matching the filter.</p></div>';
      return;
    }

    container.innerHTML = filtered.map(function (p) {
      return '<div class="pcard glass-card" data-cat="' + p.category + '">' +
        '<div class="pico">' + p.icon + '</div>' +
        '<h3 class="ptit">' + p.title + '</h3>' +
        '<p class="pdesc">' + p.description + '</p>' +
        (p.challenges ? '<div style="font-size:11px;color:var(--cyan);margin-bottom:8px"><strong>Challenge:</strong> ' + p.challenges + '</div>' : '') +
        (p.solutions ? '<div style="font-size:11px;color:var(--txtd);margin-bottom:12px"><strong>Solution:</strong> ' + p.solutions + '</div>' : '') +
        '<div class="pstack">' +
          p.tags.map(function (t) { return '<span class="stk">' + t + '</span>'; }).join('') +
        '</div>' +
        '<div class="pbtns">' +
          '<a href="' + p.liveUrl + '" class="pb pbl">▶ Demo</a>' +
          '<a href="' + p.codeUrl + '" target="_blank" rel="noopener" class="pb pbs">&lt;/&gt; Source</a>' +
          (p.caseStudyUrl !== '#' ? '<a href="' + p.caseStudyUrl + '" class="pb pbs">Case Study</a>' : '') +
        '</div>' +
      '</div>';
    }).join('');

    initCardTilt();
  }

  /* 4. Render Bots Grid */
  function renderBots(filterKey, searchQuery) {
    if (filterKey === undefined) filterKey = 'all';
    if (searchQuery === undefined) searchQuery = '';
    var container = document.getElementById('bots-container');
    if (!container || typeof PORTFOLIO_DATA === 'undefined') return;

    var query = searchQuery.toLowerCase().trim();
    var filtered = PORTFOLIO_DATA.bots.filter(function (b) {
      var matchCat = filterKey === 'all' || b.catKey === filterKey;
      var matchSearch = !query || b.name.toLowerCase().indexOf(query) !== -1 || b.description.toLowerCase().indexOf(query) !== -1;
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--txtd);font-family:var(--fmono)">' +
        '<div style="font-size:2rem;margin-bottom:12px;color:var(--cyan)">// 404 NO_MATCH</div>' +
        '<p>No bots found matching the criteria.</p></div>';
      return;
    }

    container.innerHTML = filtered.map(function (b) {
      return '<div class="bot-card glass-card" data-bot-cat="' + b.catKey + '">' +
        '<div class="bot-header">' +
          '<div class="bot-icon">' + b.icon + '</div>' +
          '<div>' +
            '<h3 class="bot-name">' + b.name + '</h3>' +
            '<div class="bot-cat">' + b.category + '</div>' +
          '</div>' +
          '<span class="bot-status ' + b.statusClass + '">' + b.statusText + '</span>' +
        '</div>' +
        '<p class="bot-desc">' + b.description + '</p>' +
        '<ul class="bot-features">' +
          b.features.map(function (f) { return '<li><svg class="icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--cyan)"><polyline points="20 6 9 17 4 12"/></svg>' + f + '</li>'; }).join('') +
        '</ul>' +
        (b.roadmap ? '<div style="font-size:11px;color:var(--pur);margin-bottom:12px"><strong>Roadmap:</strong> ' + b.roadmap + '</div>' : '') +
        '<div class="bot-tech">' +
          b.tech.map(function (t) { return '<span>' + t + '</span>'; }).join('') +
        '</div>' +
        '<div class="bot-btns">' +
          '<a href="' + b.demoUrl + '" class="bot-btn primary">Demo</a>' +
          '<a href="' + b.telegramUrl + '" target="_blank" rel="noopener" class="bot-btn secondary">Telegram</a>' +
        '</div>' +
      '</div>';
    }).join('');

    initCardTilt();
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── TYPEWRITER ─────────────────────────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initTypewriter() {
    var tw = document.getElementById('tw');
    if (!tw) return;
    var phrases = [
      'Full Stack Web Developer',
      'AI Automation Engineer',
      'Telegram Bot Specialist',
      'Three.js Creative Engineer',
      'n8n Workflow Architect',
      'Creative Technologist',
    ];
    var pi = 0, ci = 0, del = false;

    function type() {
      var ph = phrases[pi];
      if (!del) {
        tw.textContent = ph.slice(0, ++ci);
        if (ci === ph.length) { del = true; setTimeout(type, 2200); return; }
      } else {
        tw.textContent = ph.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(type, del ? 40 : 75);
    }
    type();
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── HERO ANIMATION ─────────────────────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function triggerHeroAnimation() {
    if (typeof gsap === 'undefined') return;
    var tl = gsap.timeline({ delay: 0.1 });
    tl.from('.hbadge',           { y: -18, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('.hname',            { y: 35,  opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
      .from('.hsub',             { y: 18,  opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
      .from('.hdesc',            { y: 18,  opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .from('.hctas',            { y: 18,  opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .from('.socrow',           { y: 15,  opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .from('.hstats',           { y: 15,  opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .from('.hero-avatar-frame, .hero-bg-img-box', { scale: 0.9, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.8')
      .from('.hero-tag',         { scale: 0.8, opacity: 0, stagger: 0.15, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.5');
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── NAVBAR & MOBILE SIDEBAR DRAWER ─────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initNav() {
    var nb = document.getElementById('nb');
    if (!nb) return;

    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nlinks a');

    window.addEventListener('scroll', function () {
      var sy = window.scrollY;
      nb.classList.toggle('scrolled', sy > 40);

      if (sy > prevScrollY + 6 && sy > 220) {
        nb.classList.add('hidden');
      } else if (sy < prevScrollY - 6) {
        nb.classList.remove('hidden');
      }
      prevScrollY = sy;

      /* Active Link Spy for Single Page Sections */
      var currentSection = '';
      sections.forEach(function (sec) {
        var top = sec.offsetTop - 120;
        var height = sec.offsetHeight;
        if (sy >= top && sy < top + height) {
          currentSection = sec.getAttribute('id');
        }
      });

      if (currentSection) {
        navLinks.forEach(function (link) {
          var href = link.getAttribute('href');
          if (href === '#' + currentSection || href === 'index.html#' + currentSection) {
            link.classList.add('act');
          } else if (href.indexOf('#') === 0 || href.indexOf('index.html#') === 0) {
            link.classList.remove('act');
          }
        });
      }
    }, { passive: true });
  }

  /* Toggle Mobile Drawer & Backdrop Overlay */
  window.tMM = function () {
    var mm = document.getElementById('mm');
    var overlay = document.getElementById('mm-overlay');
    var isOpen = mm && mm.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  /* Close Mobile Drawer */
  window.cMM = function () {
    var mm = document.getElementById('mm');
    var overlay = document.getElementById('mm-overlay');
    if (mm) mm.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  /* ══════════════════════════════════════════════════════════ */
  /* ── STAT COUNTERS (Enhanced with Easing) ───────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initCounters() {
    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function countUp(id, target, suffix, isFloat) {
      if (suffix === undefined) suffix = '';
      if (isFloat === undefined) isFloat = false;
      var el = document.getElementById(id);
      if (!el) return;

      var duration = 2000; /* ms */
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var easedProgress = easeOutExpo(progress);
        var current = easedProgress * target;

        if (isFloat) {
          el.textContent = current.toFixed(2);
        } else {
          el.textContent = Math.floor(current) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }

    var hero = document.getElementById('hero');
    if (!hero) return;
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        setTimeout(function () {
          countUp('c1', 15, '+');
          countUp('c2', 28, '+');
          countUp('c3', 5, '+');
          countUp('c4', 5, '', true);
        }, 300);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(hero);
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── MOUSE GLOW & TILT ──────────────────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initCardGlow() {
    var glowHandler = throttle(function (e) {
      var cards = document.querySelectorAll('.glass-card, .pcard, .bot-card, .biz-card, .tool-card, .hero-avatar-frame');
      cards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          var mx = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
          var my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
          card.style.setProperty('--mx', mx + '%');
          card.style.setProperty('--my', my + '%');
        }
      });
    }, 16);

    document.addEventListener('mousemove', glowHandler, { passive: true });
  }

  function initCardTilt() {
    if (isLowEnd || prefersReducedMotion) return;
    document.querySelectorAll('.pcard, .bot-card, .biz-card, .tool-card').forEach(function (card) {
      if (card._tiltBound) return; /* Prevent double-binding */
      card._tiltBound = true;

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        var rx = (y / rect.height * -6).toFixed(2);
        var ry = (x / rect.width  *  6).toFixed(2);
        card.style.transform = 'translateY(-6px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      }, { passive: true });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      }, { passive: true });
    });
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── FILTER & SEARCH ATTACHMENTS ────────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initFilterEvents() {
    /* Skills Filter */
    var sfBtns = document.querySelectorAll('.sf-btn');
    sfBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        sfBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderSkills(btn.dataset.filter);
      });
    });

    /* Tools Filter & Search */
    var toolBtns = document.querySelectorAll('[data-tool-filter]');
    var toolSearch = document.getElementById('tool-search');
    toolBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        toolBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderTools(btn.dataset.toolFilter, toolSearch ? toolSearch.value : '');
      });
    });
    if (toolSearch) {
      toolSearch.addEventListener('input', function () {
        var activeBtn = document.querySelector('[data-tool-filter].active');
        renderTools(activeBtn ? activeBtn.dataset.toolFilter : 'all', toolSearch.value);
      });
    }

    /* Projects Filter & Search */
    var projBtns = document.querySelectorAll('[data-proj-filter]');
    var projSearch = document.getElementById('proj-search');
    projBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        projBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderProjects(btn.dataset.projFilter, projSearch ? projSearch.value : '');
      });
    });
    if (projSearch) {
      projSearch.addEventListener('input', function () {
        var activeBtn = document.querySelector('[data-proj-filter].active');
        renderProjects(activeBtn ? activeBtn.dataset.projFilter : 'all', projSearch.value);
      });
    }

    /* Bots Filter & Search */
    var botBtns = document.querySelectorAll('[data-bot-filter]');
    var botSearch = document.getElementById('bot-search');
    botBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        botBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderBots(btn.dataset.botFilter, botSearch ? botSearch.value : '');
      });
    });
    if (botSearch) {
      botSearch.addEventListener('input', function () {
        var activeBtn = document.querySelector('[data-bot-filter].active');
        renderBots(activeBtn ? activeBtn.dataset.botFilter : 'all', botSearch.value);
      });
    }
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── BUSINESS CARD EXPAND ───────────────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initBizExpand() {
    document.querySelectorAll('.biz-card[data-expandable]').forEach(function (card) {
      card.addEventListener('click', function () {
        var wasExpanded = card.classList.contains('expanded');
        document.querySelectorAll('.biz-card').forEach(function (c) { c.classList.remove('expanded'); });
        if (!wasExpanded) card.classList.add('expanded');
      });
    });
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── CONTACT FORM ENGINE & CLIPBOARD ────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function showToast(msg, isError) {
    if (isError === undefined) isError = false;
    var toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = isError ?
      '<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#ff6464"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> ' + msg :
      '<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--grn)"><polyline points="20 6 9 17 4 12"/></svg> ' + msg;

    toast.style.borderColor = isError ? 'rgba(255,100,100,0.4)' : 'rgba(0,255,136,0.4)';
    toast.style.color = isError ? '#ff6464' : 'var(--grn)';
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 3800);
  }

  /* ── Enhanced Contact Form ── */
  function initContactForm() {
    var inputs = document.querySelectorAll('#contact input, #contact textarea');
    inputs.forEach(function (input) {
      var wrapper = input.parentElement;

      input.addEventListener('focus', function () {
        if (wrapper) wrapper.classList.add('input-focused');
        input.style.borderColor = 'var(--cyan, #00e5ff)';
        input.style.boxShadow = '0 0 0 3px rgba(0,229,255,0.1)';
      });

      input.addEventListener('blur', function () {
        if (wrapper) wrapper.classList.remove('input-focused');
        input.style.borderColor = '';
        input.style.boxShadow = '';
      });
    });
  }

  function shakeElement(el) {
    if (!el) return;
    el.style.animation = 'none';
    el.offsetHeight; /* reflow */
    el.style.animation = 'shake 0.5s ease';
    setTimeout(function () { el.style.animation = ''; }, 500);
  }

  window.sendMsg = function () {
    var nameEl = document.getElementById('fn');
    var emailEl = document.getElementById('fe');
    var subEl = document.getElementById('fs');
    var msgEl = document.getElementById('fm');

    var n = nameEl ? nameEl.value.trim() : '';
    var e = emailEl ? emailEl.value.trim() : '';
    var s = subEl ? subEl.value.trim() : '';
    var m = msgEl ? msgEl.value.trim() : '';

    if (!n) {
      shakeElement(nameEl);
      showToast('Please enter your full name.', true);
      return;
    }
    if (!e) {
      shakeElement(emailEl);
      showToast('Please enter your email address.', true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      shakeElement(emailEl);
      showToast('Please enter a valid email address (e.g., user@example.com).', true);
      return;
    }
    if (!m) {
      shakeElement(msgEl);
      showToast('Please write a message before sending.', true);
      return;
    }

    var sub = s || 'Portfolio Inquiry from ' + n;
    var body = 'Name: ' + n + '\nEmail: ' + e + '\n\nMessage:\n' + m;
    window.location.href = 'mailto:md.rifat@myself.com?subject=' + encodeURIComponent(sub) + '&body=' + encodeURIComponent(body);
    showToast('Launching your email client...');
  };

  window.copyEmail = function (btn) {
    navigator.clipboard.writeText('md.rifat@myself.com').then(function () {
      btn.innerHTML = '<svg class="icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied to Clipboard!';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.innerHTML = '<svg class="icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Email Address';
        btn.classList.remove('copied');
      }, 2200);
    }).catch(function () {
      showToast('Could not copy automatically. Email: md.rifat@myself.com');
    });
  };

  /* ══════════════════════════════════════════════════════════ */
  /* ── PAGE TRANSITION OVERLAY ────────────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initPageTransitions() {
    /* Create transition overlay */
    var overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#050505;z-index:999999;transform:scaleY(0);transform-origin:bottom;pointer-events:none;';
    document.body.appendChild(overlay);

    /* Fade-in on page load (reveal) */
    overlay.style.transform = 'scaleY(1)';
    overlay.style.transformOrigin = 'top';
    setTimeout(function () {
      overlay.style.transition = 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)';
      overlay.style.transform = 'scaleY(0)';
    }, 100);

    /* Intercept page-leaving links */
    var pageLinks = document.querySelectorAll('a[href$=".html"]:not([href^="#"]):not([target="_blank"])');
    pageLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href.indexOf('#') === 0) return;
        /* Only transition for local navigation pages */
        if (href.indexOf('http') === 0 && href.indexOf(window.location.origin) === -1) return;

        e.preventDefault();
        overlay.style.transformOrigin = 'bottom';
        overlay.style.transition = 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)';
        overlay.style.transform = 'scaleY(1)';
        overlay.style.pointerEvents = 'all';

        setTimeout(function () {
          window.location.href = href;
        }, 500);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── INTERSECTION OBSERVER LAZY INIT ────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initLazyObservers() {
    /* Observe heavy sections and initialize their animations only when near viewport */
    var heavySections = document.querySelectorAll('#skills, #tools, #pprev, #bots, #business');
    if (!heavySections.length) return;

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          /* Re-trigger card tilt for dynamically rendered cards */
          initCardTilt();
          initMagneticButtons();
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });

    heavySections.forEach(function (sec) {
      sectionObserver.observe(sec);
    });
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── SHAKE ANIMATION (for validation) ───────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function injectShakeKeyframes() {
    if (document.getElementById('shake-keyframes')) return;
    var style = document.createElement('style');
    style.id = 'shake-keyframes';
    style.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-4px)}20%,40%,60%,80%{transform:translateX(4px)}}';
    document.head.appendChild(style);
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── CLEANUP ON PAGE UNLOAD ─────────────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initCleanup() {
    window.addEventListener('beforeunload', function () {
      /* Kill Three.js */
      if (threeScene) {
        if (threeScene.frameId) cancelAnimationFrame(threeScene.frameId);
        if (threeScene.renderer) {
          threeScene.renderer.dispose();
          threeScene.renderer.forceContextLoss();
        }
        if (threeScene.scene) {
          threeScene.scene.traverse(function (obj) {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
              if (Array.isArray(obj.material)) {
                obj.material.forEach(function (m) { m.dispose(); });
              } else {
                obj.material.dispose();
              }
            }
          });
        }
      }

      /* Kill ScrollTrigger */
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(function (st) { st.kill(); });
      }

      /* Kill Lenis */
      if (lenis) {
        lenis.destroy();
      }

      /* Run custom cleanups */
      cleanupFns.forEach(function (fn) { fn(); });
    });
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── DIGITAL PLAYGROUND 3D CYBER CORE ───────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function initPlayground() {
    var canvas = document.getElementById('playground-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    var container = canvas.parentElement;
    var width = container.clientWidth || 800;
    var height = container.clientHeight || 480;

    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: !isLowEnd,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1 : 2));
    renderer.setSize(width, height);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3, 14);

    /* Lighting */
    var ambLight = new THREE.AmbientLight(0x223355, 0.8);
    scene.add(ambLight);

    var coreLight = new THREE.PointLight(0x00e5ff, 2.5, 30);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    var rimLight = new THREE.PointLight(0x8b5cf6, 1.8, 25);
    rimLight.position.set(8, 6, 8);
    scene.add(rimLight);

    /* Cyber Grid Floor */
    var gridHelper = new THREE.GridHelper(30, 30, 0x00e5ff, 0x142038);
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    /* Central Cyber Core (Layered) */
    var coreGroup = new THREE.Group();
    scene.add(coreGroup);

    /* Inner Pulsing Solid */
    var innerGeo = new THREE.IcosahedronGeometry(2, 1);
    var innerMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x005577,
      emissiveIntensity: 0.6,
      wireframe: false
    });
    var innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    /* Outer Holographic Wireframe Shell */
    var outerGeo = new THREE.IcosahedronGeometry(2.7, 0);
    var outerMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    var outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    /* Outer Rotating Rings */
    var ringGeo = new THREE.TorusGeometry(3.6, 0.04, 16, 100);
    var ringMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.5 });
    var ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    var ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
    ring2.material.color.setHex(0x8b5cf6);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    /* Orbiting Capability Nodes */
    var nodes = [];
    var nodeData = [
      { id: 'ai', color: 0x00e5ff, geo: new THREE.OctahedronGeometry(0.7, 0), radius: 5.5, speed: 0.8, yOff: 0.5 },
      { id: 'web3d', color: 0x8b5cf6, geo: new THREE.IcosahedronGeometry(0.7, 0), radius: 6.2, speed: 0.6, yOff: -0.8 },
      { id: 'bots', color: 0x3478ff, geo: new THREE.BoxGeometry(0.9, 0.9, 0.9), radius: 6.8, speed: 0.7, yOff: 1.2 },
      { id: 'fullstack', color: 0x22c55e, geo: new THREE.DodecahedronGeometry(0.7, 0), radius: 7.5, speed: 0.5, yOff: -0.5 }
    ];

    nodeData.forEach(function (nd) {
      var nMesh = new THREE.Mesh(nd.geo, new THREE.MeshStandardMaterial({
        color: nd.color,
        emissive: nd.color,
        emissiveIntensity: 0.4,
        metalness: 0.8,
        roughness: 0.2
      }));
      var nWire = new THREE.Mesh(nd.geo, new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      }));
      nMesh.add(nWire);
      scene.add(nMesh);
      nodes.push({ mesh: nMesh, data: nd, angle: Math.random() * Math.PI * 2 });
    });

    /* Starfield Particles in Chamber */
    var partCount = isLowEnd ? 40 : 120;
    var partGeo = new THREE.BufferGeometry();
    var partPos = new Float32Array(partCount * 3);
    for (var p = 0; p < partCount * 3; p += 3) {
      partPos[p] = (Math.random() - 0.5) * 25;
      partPos[p + 1] = (Math.random() - 0.5) * 15;
      partPos[p + 2] = (Math.random() - 0.5) * 25;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    var partMat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.15, transparent: true, opacity: 0.6 });
    var starPoints = new THREE.Points(partGeo, partMat);
    scene.add(starPoints);

    /* State & Mouse Drag Interaction */
    var isDragging = false;
    var prevMousePos = { x: 0, y: 0 };
    var rotVel = { x: 0.003, y: 0.006 };
    var speedMultiplier = 1;
    var isWarpMode = false;
    var isInView = true;

    function onPointerDown(e) {
      isDragging = true;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      prevMousePos = { x: clientX, y: clientY };
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      var dx = clientX - prevMousePos.x;
      var dy = clientY - prevMousePos.y;
      coreGroup.rotation.y += dx * 0.008;
      coreGroup.rotation.x += dy * 0.008;
      prevMousePos = { x: clientX, y: clientY };

      var hudCoords = document.getElementById('hud-coords');
      if (hudCoords) {
        hudCoords.textContent = 'X: ' + (coreGroup.rotation.x).toFixed(2) + ' Y: ' + (coreGroup.rotation.y).toFixed(2);
      }
    }

    function onPointerUp() { isDragging = false; }

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    /* Interactive Node Switching */
    var nodeInfoMap = {
      'ai': {
        title: 'NEURAL AI AUTOMATION NODE',
        desc: 'Custom LLM prompt pipelines, autonomous agent workflows, OpenAI GPT-4 function calling, and zero-latency webhook automation engineered by Omar Faruk Miah.',
        tags: ['GPT-4 API', 'n8n Pipelines', 'Autonomous Agents', 'JSON Function Calling'],
        color: 0x00e5ff
      },
      'web3d': {
        title: '3D GRAPHICS & WEBGL EXPERIENCES',
        desc: 'Immersive Three.js environments, GLSL shaders, 60 FPS Lenis scroll synchronization, GSAP timelines, and dark cyber aesthetic visual engineering.',
        tags: ['Three.js', 'WebGL Shaders', 'GSAP ScrollTrigger', 'Lenis Smooth Scroll'],
        color: 0x8b5cf6
      },
      'bots': {
        title: 'INTELLIGENT TELEGRAM BOTS & AUTOMATION',
        desc: 'Production-ready Telegram bots with interactive inline keyboards, automated broadcasting channels, anti-spam mechanisms, and payment processors.',
        tags: ['Python', 'Telegram Bot API', 'Webhook Architecture', 'Real-time Sync'],
        color: 0x3478ff
      },
      'fullstack': {
        title: 'FULL STACK ARCHITECTURE & SAAS',
        desc: 'High-performance web applications built on React, Vite, Node.js, and Firebase, featuring secure database rules and conversion-driven UI/UX design.',
        tags: ['React & Vite', 'Firebase Cloud', 'Node.js', 'REST APIs'],
        color: 0x22c55e
      }
    };

    var nodeButtons = document.querySelectorAll('.pg-node-btn');
    nodeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var nodeKey = btn.dataset.node;
        if (nodeKey === 'warp') {
          isWarpMode = !isWarpMode;
          speedMultiplier = isWarpMode ? 5 : 1;
          btn.classList.toggle('active', isWarpMode);
          innerMat.color.setHex(isWarpMode ? 0xff0077 : 0x00e5ff);
          coreLight.color.setHex(isWarpMode ? 0xff0077 : 0x00e5ff);
          return;
        }

        nodeButtons.forEach(function (b) { if (b.dataset.node !== 'warp') b.classList.remove('active'); });
        btn.classList.add('active');

        var info = nodeInfoMap[nodeKey];
        if (info) {
          var titleEl = document.getElementById('pg-info-title');
          var descEl = document.getElementById('pg-info-desc');
          var tagsEl = document.getElementById('pg-info-tags');
          var hudActiveNode = document.getElementById('hud-active-node');

          if (titleEl) titleEl.textContent = info.title;
          if (descEl) descEl.textContent = info.desc;
          if (hudActiveNode) hudActiveNode.textContent = info.title;
          if (tagsEl) {
            tagsEl.innerHTML = info.tags.map(function (tg) { return '<span>' + tg + '</span>'; }).join('');
          }

          innerMat.color.setHex(info.color);
          coreLight.color.setHex(info.color);

          /* Highlight matching node */
          nodes.forEach(function (n) {
            if (n.data.id === nodeKey) {
              n.mesh.scale.set(1.5, 1.5, 1.5);
            } else {
              n.mesh.scale.set(1, 1, 1);
            }
          });
        }
      });
    });

    /* Resize Observer */
    var ro = new ResizeObserver(function () {
      var w = container.clientWidth;
      var h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    ro.observe(container);

    /* Viewport Visibility Observer */
    var vObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        isInView = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    vObs.observe(container);

    /* Animation Loop */
    var clock = new THREE.Clock();
    var animId;

    function renderLoop() {
      animId = requestAnimationFrame(renderLoop);
      if (!isTabVisible || !isInView) return;

      var delta = clock.getDelta();
      var elapsed = clock.getElapsedTime();

      /* Auto rotate core */
      if (!isDragging) {
        coreGroup.rotation.y += rotVel.y * speedMultiplier;
        coreGroup.rotation.x += rotVel.x * speedMultiplier;
      }

      /* Rings counter-rotation */
      ring1.rotation.z += 0.01 * speedMultiplier;
      ring2.rotation.z -= 0.012 * speedMultiplier;

      /* Pulse inner solid */
      var scale = 1 + Math.sin(elapsed * 2 * speedMultiplier) * 0.05;
      innerMesh.scale.set(scale, scale, scale);

      /* Orbit satellites */
      nodes.forEach(function (n) {
        n.angle += 0.015 * n.data.speed * speedMultiplier;
        n.mesh.position.x = Math.cos(n.angle) * n.data.radius;
        n.mesh.position.z = Math.sin(n.angle) * n.data.radius;
        n.mesh.position.y = n.data.yOff + Math.sin(elapsed * 1.5 + n.data.radius) * 0.4;
        n.mesh.rotation.x += 0.02;
        n.mesh.rotation.y += 0.02;
      });

      /* Rotate particles */
      starPoints.rotation.y += 0.002 * speedMultiplier;

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    renderLoop();

    cleanupFns.push(function () {
      cancelAnimationFrame(animId);
      ro.disconnect();
      vObs.disconnect();
      renderer.dispose();
    });
  }

  /* ══════════════════════════════════════════════════════════ */
  /* ── INITIALIZATION ─────────────────────────────────────── */
  /* ══════════════════════════════════════════════════════════ */
  function init() {
    injectShakeKeyframes();
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
    initMagneticButtons();
    initPlayground();
    initContactForm();
    initPageTransitions();
    initLazyObservers();
    initCleanup();

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
