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
    name: "Aarogya Setu",
    blurb:
      "Multi-tenant hospital SaaS — OPD/IPD queues, EMR, appointments, billing, pharmacy, diagnostics. 6-tier RBAC.",
    stack: ["Next.js 14", "TypeScript", "Prisma", "PostgreSQL", "Redis", "Docker"],
    url: "https://arogya.yaduraj.me",
    repo: "https://github.com/YadurajManu",
    tag: "SaaS · Self-hosted",
  },
  {
    name: "MuhDikhai",
    blurb:
      "Omegle-style anonymous video chat. Full WebRTC peer lifecycle built manually over Socket.io. Sub-2s pairing.",
    stack: ["Node.js", "TypeScript", "WebRTC", "Socket.io", "PostgreSQL"],
    url: "https://batchit.yaduraj.me",
    repo: "https://github.com/YaduEnc/MuhDikhai",
    tag: "Real-time · WebRTC",
  },
  {
    name: "CineVerse",
    blurb:
      "Social film tracking — watchlists, ratings, reviews, discovery feeds. TMDB API across 500k+ titles.",
    stack: ["Next.js", "Firebase", "TMDB API", "Nginx", "PM2"],
    url: "https://cine.yaduraj.me",
    repo: null,
    tag: "Social · SSR",
  },
  {
    name: "SecondMind / CortX",
    blurb:
      "Cognitive OS on ESP32-S3 Sense. Voice → faster-whisper → local LLM → Coqui TTS. VAD firmware, Opus compression.",
    stack: ["ESP32-S3", "FastAPI", "Flutter", "Neo4j", "Qdrant"],
    url: "https://cortx.yaduraj.me",
    repo: null,
    tag: "Hackathon Winner",
  },
  {
    name: "Likhai",
    blurb:
      "Handwriting synthesis engine — 5-stage AI pipeline. Needleman-Wunsch alignment, SVD/PCA tilt correction, Bezier glyphs.",
    stack: ["Python", "OpenCV", "NumPy", "SciPy"],
    url: null,
    repo: "https://github.com/YadurajManu",
    tag: "AI Research",
  },
  {
    name: "GBU Timetable",
    blurb:
      "Official iOS app for GBU students. Live home-screen widgets via WidgetKit. Real-time schedule updates.",
    stack: ["SwiftUI", "Combine", "WidgetKit"],
    url: "https://apps.apple.com",
    repo: null,
    tag: "iOS · App Store",
  },
  {
    name: "Maakosh",
    blurb:
      "Maternal & neonatal health iOS app. Wearable sensor integration (MAX30100, EMG) for real-time vitals. Role-based.",
    stack: ["Swift", "Firebase", "ThingSpeak"],
    url: null,
    repo: "https://github.com/YadurajManu",
    tag: "Hackathon Winner",
  },
  {
    name: "Bolonyay",
    blurb:
      "Multilingual legal aid iOS app — petitioners with regional advocates. Voice-assisted forms, automated PDF reports.",
    stack: ["Swift", "Firestore", "PDFKit", "STT"],
    url: null,
    repo: "https://github.com/YadurajManu",
    tag: "iOS · Legal Aid",
  },
];

export const STACK = [
  {
    group: "Full-stack web",
    items: ["Next.js 14", "React 18", "TypeScript", "Node.js", "Express", "tRPC", "Tailwind", "shadcn/ui"],
  },
  {
    group: "Mobile / iOS",
    items: ["Swift", "SwiftUI", "UIKit", "Combine", "WidgetKit", "AVFoundation", "Flutter", "Dart"],
  },
  {
    group: "Real-time & networking",
    items: ["WebRTC", "Socket.io", "REST", "GraphQL", "Cloudflare Tunnels"],
  },
  {
    group: "AI / ML",
    items: ["faster-whisper", "LM Studio", "Coqui TTS", "Qdrant", "Neo4j", "Celery/Redis", "xlm-roberta", "spaCy", "Ollama"],
  },
  {
    group: "Embedded / hardware",
    items: ["ESP32-S3", "FreeRTOS", "I2S", "BLE", "Opus", "PSRAM", "C/C++"],
  },
  {
    group: "Databases",
    items: ["PostgreSQL", "Prisma", "Firebase", "Redis", "MongoDB", "MySQL"],
  },
  {
    group: "DevOps / infra",
    items: ["Docker", "Compose", "GitHub Actions", "Nginx", "PM2", "Certbot", "systemd", "Vercel", "SSH"],
  },
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
