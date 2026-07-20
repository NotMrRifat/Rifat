/* ============================================================
   RIFAT HASSAN PORTFOLIO — RICH DATA MODULE v4.0
   100% Comprehensive Content for Skills, Tools, Projects, Bots, Businesses
   ============================================================ */

const PORTFOLIO_DATA = {

  /* ── 1. COMPREHENSIVE SKILLS DATA ────────────────────────── */
  skills: [
    /* Programming & Core */
    { id: "sk-html", name: "HTML5 & Semantic Markup", cat: "code", pct: 95, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>`, desc: "Accessible HTML5 semantic layout, WAI-ARIA standards, and clean DOM architecture." },
    { id: "sk-css", name: "CSS3 & Modern Layouts", cat: "code", pct: 90, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`, desc: "Flexbox, CSS Grid, Glassmorphism, CSS Custom Properties, and keyframe animations." },
    { id: "sk-js", name: "JavaScript (ES2026+)", cat: "code", pct: 85, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`, desc: "Asynchronous JS, Promises, ES Modules, DOM Engine optimization, and Event Loops." },
    { id: "sk-py", name: "Python Development", cat: "code", pct: 78, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>`, desc: "Automation scripts, Telegram bot development, API integration, and web scraping." },
    { id: "sk-cpp", name: "C++ Programming", cat: "code", pct: 60, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`, desc: "Object-oriented programming, data structures, algorithms, and logic building." },
    { id: "sk-react", name: "React & Vite Ecosystem", cat: "code", pct: 72, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>`, desc: "Component architecture, state management, hooks, and fast Vite bundling." },

    /* Web, 3D & Creative */
    { id: "sk-three", name: "Three.js & WebGL", cat: "web", pct: 76, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`, desc: "3D particle systems, custom shaders, camera parallax, and mesh animations." },
    { id: "sk-gsap", name: "GSAP Animation Suite", cat: "web", pct: 84, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`, desc: "ScrollTrigger timeline sequences, stagger effects, and smooth UI reveals." },
    { id: "sk-lenis", name: "Lenis Smooth Scroll", cat: "web", pct: 88, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`, desc: "60 FPS smooth scrolling integration synced directly with GSAP render ticker." },
    { id: "sk-ui", name: "UI/UX & Glassmorphism Design", cat: "web", pct: 88, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>`, desc: "Modern cyber dark glass aesthetics, visual hierarchy, typography, and contrast." },
    { id: "sk-vibe", name: "Vibe Coding & Creative Dev", cat: "web", pct: 92, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`, desc: "Intuitive rapid prototype development combining high design taste with modern AI coding workflows." },

    /* AI, Bots & Automation */
    { id: "sk-prompt", name: "Prompt Engineering & LLMs", cat: "ai", pct: 92, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`, desc: "System prompt tuning, OpenAI GPT-4 function calling, structured JSON output, and context handling." },
    { id: "sk-tgbot", name: "Telegram Bot Development", cat: "ai", pct: 88, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`, desc: "Building feature-rich automated Telegram bots with custom inline menus, broadcasts, and database sync." },
    { id: "sk-n8n", name: "n8n Workflow Automation", cat: "ai", pct: 80, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`, desc: "Multi-service API orchestration, webhook listeners, automated database triggers, and AI nodes." },
    { id: "sk-botai", name: "AI Agent & Chatbot Dev", cat: "ai", pct: 85, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8z"/></svg>`, desc: "Website AI chatbots, customer support bots, memory-enabled agents, and automated lead capture." },

    /* Tools & Infrastructure */
    { id: "sk-git", name: "Git & GitHub Version Control", cat: "tools", pct: 85, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 9v12"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`, desc: "Branch management, pull requests, automated GitHub Actions CI/CD workflows, and repositories." },
    { id: "sk-firebase", name: "Firebase & Cloud Backend", cat: "tools", pct: 75, icon: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`, desc: "Firestore Database, Authentication, Cloud Storage, Hosting, and Realtime Database rules." }
  ],

  /* ── 2. FREE AI & DEVELOPER TOOLS DATA ──────────────────── */
  tools: [
    {
      id: "tool-studious-ai",
      title: "Studious AI Study Tracker",
      category: "AI Utilities",
      catKey: "ai",
      status: "live",
      statusLabel: "● Live Tool",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
      description: "AI-driven study session manager with auto-generated routines, focus timer, analytics dashboard, and JSON progress backups.",
      techStack: ["React", "Firebase", "OpenAI API", "Tailwind"],
      openUrl: "#",
      btnText: "Open App →"
    },
    {
      id: "tool-focussphere",
      title: "FocusSphere Research Hub",
      category: "Productivity",
      catKey: "productivity",
      status: "live",
      statusLabel: "● Live Tool",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
      description: "Distraction-free educational research browser tool that blocks digital noise and structures focus sessions.",
      techStack: ["JavaScript", "HTML5", "CSS3", "Web Storage"],
      openUrl: "#",
      btnText: "Open Tool →"
    },
    {
      id: "tool-billing-gen",
      title: "Tenant Billing Generator",
      category: "Developer Tools",
      catKey: "devtools",
      status: "live",
      statusLabel: "● Live Utility",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
      description: "Automated utility billing & electricity distribution manager with instant PDF generation and multi-tenant tracking.",
      techStack: ["JavaScript", "PDF.js", "Local Storage"],
      openUrl: "#",
      btnText: "Open Generator →"
    },
    {
      id: "tool-omr-portal",
      title: "Digital OMR Evaluation Portal",
      category: "Educational Apps",
      catKey: "devtools",
      status: "beta",
      statusLabel: "◐ Beta",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
      description: "Fast MCQ exam scanner and grade calculator system designed for competitive exams and practice sets.",
      techStack: ["HTML5", "CSS3", "JavaScript"],
      openUrl: "#",
      btnText: "Try Portal →"
    },
    {
      id: "tool-tg-notifier",
      title: "Telegram Alert System",
      category: "Telegram Utilities",
      catKey: "ai",
      status: "live",
      statusLabel: "● Live Bot",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
      description: "Instant web-to-Telegram event notification system for server status, website forms, and cron updates.",
      techStack: ["Python", "Telegram API", "n8n Webhooks"],
      openUrl: "#",
      btnText: "Open Bot →"
    },
    {
      id: "tool-json-schema",
      title: "AI Prompt & Schema Builder",
      category: "Developer Tools",
      catKey: "devtools",
      status: "live",
      statusLabel: "● Live Tool",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      description: "Interactive helper to draft structured JSON schemas, OpenAI function call parameters, and prompt templates.",
      techStack: ["JavaScript", "OpenAI Format"],
      openUrl: "#",
      btnText: "Use Tool →"
    }
  ],

  /* ── 3. FEATURED PROJECTS DATA ──────────────────────────── */
  projects: [
    {
      id: "proj-studious",
      title: "Studious AI Study Tracker",
      category: "ai",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><polyline points="12 6 12 12 16 14"/></svg>`,
      description: "Full-stack AI-driven study tracking web application featuring automated routine generation, focus timers, and cloud analytics.",
      challenges: "Managing real-time sync with Firebase while parsing AI API response streams cleanly without UI freezing.",
      solutions: "Implemented web workers and decoupled state listeners, rendering updates asynchronously with optimistic state UI.",
      features: ["AI Routine Generator", "Focus Timer Analytics", "Firebase Cloud Sync", "JSON Backup Export"],
      tags: ["React", "Firebase", "OpenAI API", "Tailwind"],
      liveUrl: "#",
      codeUrl: "#",
      caseStudyUrl: "#"
    },
    {
      id: "proj-stymetics",
      title: "StyMetics Fashion E-Commerce",
      category: "ecommerce",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
      description: "High-performance fashion storefront engineered with React, Vite, and Firebase with variant selector and admin dashboard.",
      challenges: "Handling complex apparel variants (sizes, colors, stock limits) in real-time.",
      solutions: "Created a centralized multi-dimensional product variant matrix using Firebase Realtime listeners.",
      features: ["Variant Selection Matrix", "Wishlist & Cart Management", "Admin Product Manager", "Order History Panel"],
      tags: ["React", "Vite", "Firebase", "Tailwind"],
      liveUrl: "#",
      codeUrl: "#",
      caseStudyUrl: "#"
    },
    {
      id: "proj-billing",
      title: "Automated Electricity Billing",
      category: "tools",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
      description: "Multi-tenant electricity distribution & billing system with automated client PDF generation and local data persistence.",
      challenges: "Generating print-accurate PDF invoices directly inside browser clients without server-side rendering.",
      solutions: "Integrated PDF.js with custom HTML canvas templates for pixel-perfect client-side PDF export.",
      features: ["Multi-Tenant Ledger", "Instant PDF Invoice Export", "Local Storage Auto-Save", "Monthly Meter Calculator"],
      tags: ["JavaScript", "Local Storage", "PDF.js"],
      liveUrl: "#",
      codeUrl: "#",
      caseStudyUrl: "#"
    },
    {
      id: "proj-routine",
      title: "Responsive Routine System",
      category: "web",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
      description: "Mobile-first routine management interface for students with smooth anchor navigation and customizable time slots.",
      challenges: "Providing responsive cross-device layout compatibility down to small screen sizes.",
      solutions: "Utilized fluid CSS clamp typography and mobile-first CSS Grid layouts.",
      features: ["Mobile-First Design", "Anchor Section Navigation", "Dynamic Slot Highlighting"],
      tags: ["HTML5", "CSS3", "JavaScript"],
      liveUrl: "#",
      codeUrl: "#",
      caseStudyUrl: "#"
    },
    {
      id: "proj-focus",
      title: "FocusSphere Research Hub",
      category: "tools",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>`,
      description: "Distraction-free educational web tool designed to streamline academic research by eliminating digital clutter.",
      challenges: "Enforcing deep work focus environment through pure frontend controls.",
      solutions: "Created full-screen minimalist research mode with built-in time block tracking.",
      features: ["Distraction-Free Workspace", "Research Note Saver", "Pomodoro Interval Timer"],
      tags: ["HTML5", "CSS3", "JavaScript"],
      liveUrl: "#",
      codeUrl: "#",
      caseStudyUrl: "#"
    },
    {
      id: "proj-portfolio-v3",
      title: "Portfolio v3.5 (Three.js)",
      category: "web",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
      description: "This portfolio featuring Three.js 3D graphics, GSAP animation sequences, Lenis smooth scroll, and dark cyber glass UI.",
      challenges: "Balancing rich 3D graphics with 60 FPS scrolling performance across low-end mobile devices.",
      solutions: "Integrated Lenis into GSAP's rendering ticker, throttled event listeners, and implemented auto-pausing when tab is hidden.",
      features: ["Three.js Particle Canvas", "GSAP ScrollTrigger Reveals", "Lenis Smooth Scroll Engine", "Data-Driven UI Architecture"],
      tags: ["Three.js", "GSAP", "Lenis", "HTML5/CSS3"],
      liveUrl: "index.html",
      codeUrl: "#",
      caseStudyUrl: "#"
    }
  ],

  /* ── 4. BOTS & AUTOMATION DATA ──────────────────────────── */
  bots: [
    {
      id: "bot-support",
      name: "Customer Support AI Bot",
      catKey: "website",
      category: "Website AI Bot",
      statusClass: "active",
      statusText: "● Active",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      description: "24/7 intelligent website assistant capable of answering user inquiries, fetching product information, and capturing leads.",
      features: ["Natural language understanding", "Multi-language support (Bangla/English)", "CRM lead capture ready", "Real-time query analytics"],
      tech: ["OpenAI GPT-4", "JavaScript", "Node.js"],
      roadmap: "Integrating automated speech-to-text and multi-tenant portal management.",
      demoUrl: "#",
      codeUrl: "#",
      telegramUrl: "#"
    },
    {
      id: "bot-tg-auto",
      name: "Telegram Automation Bot",
      catKey: "telegram",
      category: "Telegram Bot",
      statusClass: "active",
      statusText: "● Active",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
      description: "Automated community manager for Telegram channels & groups. Handles scheduled broadcasts, member verification, and anti-spam.",
      features: ["Scheduled channel broadcasts", "Inline menu button navigation", "Anti-spam captcha verification", "Custom command triggers"],
      tech: ["Python", "python-telegram-bot", "SQLite"],
      roadmap: "Adding multi-group analytics dashboard and payment gateway integrations.",
      demoUrl: "#",
      codeUrl: "#",
      telegramUrl: "#"
    },
    {
      id: "bot-crypto-alert",
      name: "Crypto Price Alert Bot",
      catKey: "crypto",
      category: "Crypto Bot",
      statusClass: "active",
      statusText: "● Active",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
      description: "Monitors cryptocurrency price movements continuously and dispatches automated alerts to Telegram channels in real time.",
      features: ["500+ cryptocurrency tracking", "User price threshold alerts", "Telegram channel notifications", "Daily market summary reports"],
      tech: ["Python", "CoinGecko API", "Telegram API"],
      roadmap: "Adding automated technical indicator alerts (RSI, MACD, Moving Averages).",
      demoUrl: "#",
      codeUrl: "#",
      telegramUrl: "#"
    },
    {
      id: "bot-n8n-workflow",
      name: "n8n Workflow Automation Pipeline",
      catKey: "automation",
      category: "Automation Pipeline",
      statusClass: "active",
      statusText: "● Active",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
      description: "Visual automation workflow linking webhooks, database records, email alerts, and OpenAI processing nodes.",
      features: ["Multi-app API integration", "AI data transformation nodes", "Automatic error retry handling", "Webhook trigger listeners"],
      tech: ["n8n", "OpenAI API", "REST APIs"],
      roadmap: "Expanding to full self-hosted workflow cluster with webhook security monitoring.",
      demoUrl: "#",
      codeUrl: "#",
      telegramUrl: "#"
    },
    {
      id: "bot-ai-assistant",
      name: "Custom Knowledge AI Assistant",
      catKey: "ai",
      category: "AI Agent",
      statusClass: "soon",
      statusText: "◐ Growing",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8z"/></svg>`,
      description: "Tailored AI agent trained on document knowledge bases with persistent conversation memory and brand tone.",
      features: ["Document PDF/URL ingestion", "Persistent conversation memory", "Brand voice customization", "Web & Telegram deployment"],
      tech: ["OpenAI GPT-4", "Python", "Vector DB"],
      roadmap: "Adding voice response capability and vector database auto-sync.",
      demoUrl: "#",
      codeUrl: "#",
      telegramUrl: "#"
    },
    {
      id: "bot-content-gen",
      name: "AI Content Generation Bot",
      catKey: "ai",
      category: "AI Content Bot",
      statusClass: "active",
      statusText: "● Active",
      icon: `<svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
      description: "Automates article drafting, social post copy, product descriptions, and hashtags on demand.",
      features: ["Multi-platform social copy", "SEO keyword integration", "Bulk content generation", "Hashtag recommendations"],
      tech: ["GPT-4 API", "Python", "Telegram API"],
      roadmap: "Integrating AI image prompt generation for automatic visual pair creation.",
      demoUrl: "#",
      codeUrl: "#",
      telegramUrl: "#"
    }
  ],

  /* ── 5. BUSINESS VENTURES DATA ───────────────────────────── */
  businesses: [
    {
      id: "biz-rs-software",
      name: "RS Software Solutions",
      category: "Tech & Software Development",
      status: "Active Agency",
      statusClass: "active",
      icon: `<svg class="icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      overview: "RS Software Solutions delivers high-performance custom web applications, React platforms, and Firebase cloud integrations for business clients.",
      mission: "To empower enterprises with high-speed, reliable, and scalable digital software solutions.",
      vision: "To become a leading software agency recognized for clean code architecture and modern web design.",
      stats: [
        { label: "Clients Served", val: "12+" },
        { label: "Projects Completed", val: "20+" },
        { label: "Client Satisfaction", val: "99%" }
      ],
      services: ["Custom Web Application Dev", "React & Vite Frontend Engineering", "Firebase Cloud Backend Integration", "API & Database Architecture"],
      tech: ["React", "Vite", "Firebase", "JavaScript", "CSS3/HTML5"],
      workflow: "Requirement Discovery → Wireframing → Component Architecture → API Integration → Testing → Production Deployment",
      roadmap: "Expanding service portfolio to offer specialized white-label SaaS development packages for global clients.",
      contactUrl: "mailto:md.rifat@myself.com?subject=RS Software Inquiry"
    },
    {
      id: "biz-elite-progen",
      name: "Elite ProGen",
      category: "Digital Products & AI Automation Agency",
      status: "Flagship Agency",
      statusClass: "new",
      isElite: true,
      icon: `<svg class="icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      overview: "Elite ProGen is Rifat Hassan's primary agency providing custom AI solutions, high-converting web experiences, automated Telegram bots, and n8n workflows.",
      mission: "To bridge modern artificial intelligence with exceptional web design to elevate client conversion and operational efficiency.",
      vision: "To build world-class digital products and automation tools that scale business productivity globally.",
      stats: [
        { label: "Specialization", val: "AI & Full-Stack" },
        { label: "Quality Level", val: "Awwwards Standard" },
        { label: "Founded", val: "2026" }
      ],
      services: ["Awwwards-Level 3D & Cyber Portfolios", "Custom Telegram & Website AI Chatbots", "n8n Workflow Automation Systems", "Custom Full-Stack Web Applications", "Prompt Engineering & LLM Tuning"],
      tech: ["Three.js", "GSAP", "React", "Python", "OpenAI GPT-4", "n8n"],
      workflow: "Consultation & Scope → Architectural Design → Prototyping → AI Node Setup → Deployment & Analytics Monitoring",
      roadmap: "Launching proprietary SaaS automation tools and expanding AI agency operations worldwide.",
      contactUrl: "mailto:md.rifat@myself.com?subject=Elite ProGen Project Inquiry"
    },
    {
      id: "biz-stymetics",
      name: "StyMetics Shop",
      category: "Fashion E-Commerce",
      status: "Active Brand",
      statusClass: "active",
      icon: `<svg class="icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 1 2 2h14a2 2 0 0 1 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
      overview: "StyMetics Shop is a modern fashion e-commerce storefront engineered with React, Vite, and Firebase for apparel shopping.",
      mission: "To deliver high-quality futuristic fashion apparel through an intuitive online shopping platform.",
      vision: "To establish StyMetics as a premier fashion brand with nationwide delivery in Bangladesh.",
      stats: [
        { label: "Catalog Size", val: "50+ Items" },
        { label: "Platform Tech", val: "React/Vite" },
        { label: "Customer Rating", val: "4.8 / 5" }
      ],
      services: ["Fashion E-Commerce Retail", "Product Catalog Management", "Order Tracking Panel"],
      tech: ["React", "Vite", "Firebase", "Tailwind CSS"],
      workflow: "Product Design → Inventory Management → Digital Listing → Order Processing → Dispatch",
      roadmap: "Integrating automated SMS order notifications and multi-payment gateway options.",
      contactUrl: "#"
    },
    {
      id: "biz-cybervision",
      name: "CyberVision Media",
      category: "EdTech & Technical Media",
      status: "Growing Channel",
      statusClass: "growing",
      icon: `<svg class="icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
      overview: "CyberVision Media produces technical content, web development guides, AI tool breakdowns, and programming tutorials.",
      mission: "To make programming, AI automation, and web development understandable and actionable for aspiring developers.",
      vision: "To build a thriving tech community empowering thousands of learners across Bangladesh.",
      stats: [
        { label: "Follower Base", val: "5K+ Audience" },
        { label: "Content Focus", val: "Web & AI" },
        { label: "Channel Focus", val: "Tech Education" }
      ],
      services: ["Video Tutorials & Guides", "AI Tool Review Breakdowns", "Coding Career Guidance"],
      tech: ["YouTube", "Facebook Media", "Screen Studio", "Canva Pro"],
      workflow: "Topic Research → Scripting → Video Production → Editing → Community Engagement",
      roadmap: "Launching dedicated structured video courses on full-stack web development and AI automation.",
      contactUrl: "#"
    }
  ]
};
