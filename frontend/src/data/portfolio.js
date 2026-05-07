export const PROFILE = {
  name: "Yaduraj Singh",
  age: 20,
  role: "Full-stack engineer · AI/ML builder",
  location: "Dehradun · Greater Noida, India",
  email: "yadurajsingham@gmail.com",
  phone: "+91 9220916445",
  portfolio: "yaduraj.me",
  github: "https://github.com/YadurajManu",
  linkedin: "https://www.linkedin.com/in/yaduraj-singh",
  tagline:
    "Ships production-grade systems solo — firmware on ESP32, scalable SaaS, iOS apps. Three live products with real users before 21.",
};

export const STATS = [
  { value: "2,000+", label: "users in production" },
  { value: "08", label: "shipped projects" },
  { value: "03", label: "hackathons won" },
  { value: "04", label: "self-hosted servers" },
];

export const ABOUT_POINTS = [
  "Self-hosted Linux infrastructure — Nginx, SSL, PM2, systemd. Not just Vercel deploys.",
  "Manual WebRTC: full ICE/STUN/TURN + signalling layer. No third-party video SDK.",
  "Designed multi-tenancy, RBAC, caching, CI/CD for a hospital SaaS — solo, from a blank repo.",
  "Three live production applications with real users before age 21.",
  "Hackathon-winning hardware + AI system: ESP32-S3 + FastAPI + Flutter, team of two.",
  "AI/ML pipelines: handwriting synthesis, voice + LLM + TTS cognitive OS, wearable vitals monitoring.",
];

export const EXPERIENCE = [
  {
    role: "Lead Software Developer — Intern",
    org: "Gautam Buddha University",
    period: "2024 · 6 months",
    points: [
      "Sole architect of a ground-up institutional ERP — ER diagrams, API contracts, to production deployment.",
      "Modules: student lifecycle, automated attendance, fee ledger, timetable engine, faculty/admin portals.",
      "Eliminated 100% paper workflows. ~60% admin overhead reduction.",
    ],
    stack: ["Node.js", "Express", "JWT RBAC", "React"],
  },
];

export const PROJECTS = [
  {
    id: "aarogya-setu",
    name: "Aarogya Setu",
    blurb:
      "Multi-tenant hospital SaaS — OPD/IPD queues, EMR, appointments, billing, pharmacy, diagnostics. 6-tier RBAC.",
    stack: ["Next.js 14", "TypeScript", "Prisma", "PostgreSQL", "Redis", "Docker"],
    url: "https://arogya.yaduraj.me",
    repo: "https://github.com/YadurajManu",
    tag: "SaaS · Self-hosted",
    featured: true,
    live: true,
    lastDeploy: "3d ago",
    metrics: [
      { k: "RBAC tiers", v: "6" },
      { k: "Modules", v: "9" },
      { k: "Tenancy", v: "Multi" },
      { k: "Stack depth", v: "Full" },
    ],
    caseStudy: {
      problem:
        "Hospitals in India still run on paper. Existing EMR vendors are bloated, expensive, and not multi-tenant. I wanted one platform a 50-bed clinic and a 500-bed hospital can both run.",
      approach: [
        "Designed a 6-tier RBAC matrix from scratch (super-admin → patient).",
        "Multi-tenant Postgres with Prisma — schema-per-tenant evaluated, settled on row-level isolation.",
        "Redis for queue state, session, and rate-limit. NextAuth for sessions.",
        "Self-hosted on a Linux VPS behind Nginx with auto-renew SSL via Certbot.",
        "GitHub Actions → Docker Compose deploy on push to main.",
      ],
      decisions: [
        "Chose Prisma over raw SQL for type-safety across 9 modules.",
        "Picked self-hosted over Vercel — cost predictability + SSH debug access.",
        "OPD/IPD queue logic kept stateful in Redis — sub-100ms updates.",
      ],
    },
  },
  {
    id: "muhdikhai",
    name: "MuhDikhai",
    blurb:
      "Omegle-style anonymous video chat. Full WebRTC peer lifecycle built manually over Socket.io. Sub-2s pairing.",
    stack: ["Node.js", "TypeScript", "WebRTC", "Socket.io", "PostgreSQL"],
    url: "https://batchit.yaduraj.me",
    repo: "https://github.com/YaduEnc/MuhDikhai",
    tag: "Real-time · WebRTC",
    live: true,
    lastDeploy: "1w ago",
    metrics: [
      { k: "Pairing time", v: "<2s" },
      { k: "Stack", v: "WebRTC raw" },
      { k: "SDK used", v: "None" },
    ],
    caseStudy: {
      problem:
        "Wanted to truly understand WebRTC — not call Twilio's SDK and pretend. Built ICE/STUN/TURN signalling and peer lifecycle from primitives.",
      approach: [
        "Custom Socket.io signalling with offer/answer/ICE relay.",
        "Stateful matchmaking queue in memory — backpressure on overload.",
        "Graceful reconnect: peer state cached for 30s on disconnect.",
        "Self-hosted TURN via coturn for symmetric-NAT users.",
      ],
      decisions: [
        "No third-party video SDK — full peer connection lifecycle manual.",
        "TypeScript everywhere for signalling type safety.",
        "Postgres only for abuse-report ledger; chat itself is ephemeral.",
      ],
    },
  },
  {
    id: "cineverse",
    name: "CineVerse",
    blurb:
      "Social film tracking — watchlists, ratings, reviews, discovery feeds. TMDB API across 500k+ titles.",
    stack: ["Next.js", "Firebase", "TMDB API", "Nginx", "PM2"],
    url: "https://cine.yaduraj.me",
    repo: null,
    tag: "Social · SSR",
    live: true,
    lastDeploy: "2w ago",
    metrics: [
      { k: "TMDB titles", v: "500k+" },
      { k: "Render", v: "SSR" },
    ],
    caseStudy: {
      problem:
        "Letterboxd is great but bloated, and no one tracks regional films well. Built a lighter, faster alternative.",
      approach: [
        "Next.js SSR for SEO-friendly title pages.",
        "Firestore for user data; TMDB API proxied for caching.",
        "Discovery feed ranks by friend activity + recency.",
      ],
      decisions: [
        "Firebase over custom auth — speed of shipping > purity.",
        "Nginx + PM2 self-host for full log access.",
      ],
    },
  },
  {
    id: "cortx",
    name: "SecondMind / CortX",
    blurb:
      "Cognitive OS on ESP32-S3 Sense. Voice → faster-whisper → local LLM → Coqui TTS. VAD firmware, Opus compression.",
    stack: ["ESP32-S3", "FastAPI", "Flutter", "Neo4j", "Qdrant"],
    url: "https://cortx.yaduraj.me",
    repo: null,
    tag: "Hackathon Winner",
    live: true,
    lastDeploy: "via cloudflare tunnel",
    metrics: [
      { k: "Latency", v: "Edge-first" },
      { k: "Pipeline", v: "STT→LLM→TTS" },
      { k: "DBs", v: "Neo4j + Qdrant + PG" },
    ],
    caseStudy: {
      problem:
        "Wanted a wearable cognitive assistant that runs locally — no cloud round-trip per query. Two-person team, 36-hour hackathon.",
      approach: [
        "ESP32-S3 firmware: VAD detection, I2S mic, Opus encoding.",
        "FastAPI backend pipes audio → faster-whisper → LM Studio LLM → Coqui TTS.",
        "Neo4j stores conversation graph; Qdrant for semantic memory.",
        "Flutter app as control surface.",
      ],
      decisions: [
        "Local LLM over OpenAI — privacy + cost.",
        "Opus over WAV — 10x bandwidth reduction over BLE.",
      ],
    },
  },
  {
    id: "likhai",
    name: "Likhai",
    blurb:
      "Handwriting synthesis engine — 5-stage AI pipeline. Needleman-Wunsch alignment, SVD/PCA tilt correction, Bezier glyphs.",
    stack: ["Python", "OpenCV", "NumPy", "SciPy"],
    url: null,
    repo: null,
    tag: "AI Research",
    live: false,
    metrics: [
      { k: "Pipeline", v: "5-stage" },
      { k: "Output", v: "A4 ready" },
    ],
    caseStudy: {
      problem:
        "Generative handwriting is mostly GAN-based and looks fake. I wanted a deterministic, geometry-driven approach.",
      approach: [
        "Stage 1: preprocessing & glyph extraction.",
        "Stage 2: vectorization to Bezier control points.",
        "Stage 3: style learning via Welford profile refinement.",
        "Stage 4: per-glyph rendering with stroke variance.",
        "Stage 5: A4 compositing with line/word spacing.",
      ],
      decisions: [
        "Needleman-Wunsch for glyph alignment — borrowed from bioinformatics.",
        "SVD/PCA for tilt correction over Hough transform.",
      ],
    },
  },
  {
    id: "gbu-timetable",
    name: "GBU Timetable",
    blurb:
      "Official iOS app for GBU students. Live home-screen widgets via WidgetKit. Real-time schedule updates.",
    stack: ["SwiftUI", "Combine", "WidgetKit"],
    url: "https://apps.apple.com",
    repo: null,
    tag: "iOS · App Store",
    live: true,
    lastDeploy: "App Store",
    metrics: [
      { k: "Users", v: "GBU campus" },
      { k: "Widget", v: "Live" },
    ],
    caseStudy: {
      problem:
        "GBU students manually checked PDFs for daily schedules. Built a native iOS app + home-screen widget so the next class is one glance away.",
      approach: [
        "SwiftUI + Combine for reactive schedule updates.",
        "WidgetKit timeline provider refreshes every 15min.",
        "Backend API serves cached daily schedules.",
      ],
      decisions: [
        "iOS first — Android version pending.",
        "Widget over notifications — less intrusive.",
      ],
    },
  },
  {
    id: "maakosh",
    name: "Maakosh",
    blurb:
      "Maternal & neonatal health iOS app. Wearable sensor integration (MAX30100, EMG) for real-time vitals. Role-based.",
    stack: ["Swift", "Firebase", "ThingSpeak"],
    url: null,
    repo: "https://github.com/YadurajManu",
    tag: "Hackathon Winner",
    live: false,
    metrics: [
      { k: "Sensors", v: "MAX30100 + EMG" },
      { k: "Roles", v: "Mother + ASHA" },
    ],
    caseStudy: {
      problem:
        "Rural India lacks maternal-health monitoring. Built a wearable + iOS app that streams vitals to ASHA workers.",
      approach: [
        "MAX30100 (SpO2 + HR) + EMG sensor over BLE.",
        "ThingSpeak as IoT broker; Firestore for clinical records.",
        "Role-based UX for mothers and healthcare workers.",
      ],
      decisions: [
        "Firebase over custom backend — hackathon constraint.",
        "Designed offline-first; sync when online.",
      ],
    },
  },
  {
    id: "bolonyay",
    name: "Bolonyay",
    blurb:
      "Multilingual legal aid iOS app — petitioners with regional advocates. Voice-assisted forms, automated PDF reports.",
    stack: ["Swift", "Firestore", "PDFKit", "STT"],
    url: null,
    repo: "https://github.com/YadurajManu",
    tag: "iOS · Legal Aid",
    live: false,
    metrics: [
      { k: "Languages", v: "Multi" },
      { k: "PDF gen", v: "On-device" },
    ],
    caseStudy: {
      problem:
        "Legal aid in regional languages is broken. Built voice-first iOS forms that auto-generate filing-ready PDFs.",
      approach: [
        "Speech-to-text in regional languages.",
        "PDFKit composes filing templates client-side.",
        "Firestore matches petitioners with verified advocates.",
      ],
      decisions: [
        "Voice forms over text — accessibility first.",
        "On-device PDF gen — works offline.",
      ],
    },
  },
];

export const STACK = [
  { group: "Full-stack web", items: ["Next.js 14", "React 18", "TypeScript", "Node.js", "Express", "tRPC", "Tailwind", "shadcn/ui"] },
  { group: "Mobile / iOS", items: ["Swift", "SwiftUI", "UIKit", "Combine", "WidgetKit", "AVFoundation", "Flutter", "Dart"] },
  { group: "Real-time & networking", items: ["WebRTC", "Socket.io", "REST", "GraphQL", "Cloudflare Tunnels"] },
  { group: "AI / ML", items: ["faster-whisper", "LM Studio", "Coqui TTS", "Qdrant", "Neo4j", "Celery/Redis", "xlm-roberta", "spaCy", "Ollama"] },
  { group: "Embedded / hardware", items: ["ESP32-S3", "FreeRTOS", "I2S", "BLE", "Opus", "PSRAM", "C/C++"] },
  { group: "Databases", items: ["PostgreSQL", "Prisma", "Firebase", "Redis", "MongoDB", "MySQL"] },
  { group: "DevOps / infra", items: ["Docker", "Compose", "GitHub Actions", "Nginx", "PM2", "Certbot", "systemd", "Vercel", "SSH"] },
];

export const NOW_BUILDING = {
  name: "SubSlot",
  status: "in development",
  pitch:
    "A subscription slot-sharing marketplace for India. Escrow payments, verified sellers, Gen-Z brand.",
  bullets: [
    "Escrow-backed payments — no chargebacks, no scams.",
    "Verified seller onboarding with KYC & ratings.",
    "Designed Gen-Z first — sharp, fast, native-feel UX.",
  ],
};
