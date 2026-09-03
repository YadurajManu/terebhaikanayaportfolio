# Yaduraj Singh — Full-stack engineer · AI/ML builder

> Ships production-grade systems solo — firmware on ESP32, scalable SaaS, iOS apps. Three live products with real users before 21.

Yaduraj Singh is a 20-year-old full-stack engineer · ai/ml builder based in Dehradun · Greater Noida, India.

## Highlights

- Self-hosted Linux infrastructure — Nginx, SSL, PM2, systemd. Not just Vercel deploys.
- Manual WebRTC: full ICE/STUN/TURN + signalling layer. No third-party video SDK.
- Designed multi-tenancy, RBAC, caching, CI/CD for a hospital SaaS — solo, from a blank repo.
- Three live production applications with real users before age 21.
- Hackathon-winning hardware + AI system: ESP32-S3 + FastAPI + Flutter, team of two.
- AI/ML pipelines: handwriting synthesis, voice + LLM + TTS cognitive OS, wearable vitals monitoring.

## By the numbers

- **2,000+** users in production
- **08** shipped projects
- **03** hackathons won
- **04** self-hosted servers

## Now building

**Fleet OS** (open source · mit) — Git push to the hardware you already own. A Raspberry Pi, an old laptop and a spare VPS, treated as one deploy target — multi-arch builds, constraint-based placement, health-gated rollouts and automatic failover.

- Outbound-only Go agents — no inbound Docker socket, no SSH key, no port to forward. A Pi behind a home router is a first-class node.
- Weighted scheduling across CPU, memory headroom, reliability tier, tags, GPU and affinity — and the placement plan explains every node it rejected.
- Health-gated rollouts: the release that works keeps serving until its replacement proves it can serve too.

## Projects

### Aarogya Setu

Multi-tenant hospital SaaS — OPD/IPD queues, EMR, appointments, billing, pharmacy, diagnostics. 6-tier RBAC.

- Category: SaaS · Self-hosted
- Stack: Next.js 14, TypeScript, Prisma, PostgreSQL, Redis, Docker
- Live: https://arogya.yaduraj.me

### Tollgate

Cost & usage observability for LLM APIs. Reverse proxy for OpenAI, Anthropic and OpenAI-compatible providers — one base URL for per-feature cost, caching, budgets and runaway-agent alerts.

- Category: LLMOps · Proxy
- Stack: OpenAI API, Anthropic API, OpenRouter, Vercel
- Live: https://tollgate.yaduraj.me/

### MuhDikhai

Omegle-style anonymous video chat. Full WebRTC peer lifecycle built manually over Socket.io. Sub-2s pairing.

- Category: Real-time · WebRTC
- Stack: Node.js, TypeScript, WebRTC, Socket.io, PostgreSQL
- Live: https://batchit.yaduraj.me

### CineVerse

Social film tracking — watchlists, ratings, reviews, discovery feeds. TMDB API across 500k+ titles.

- Category: Social · SSR
- Stack: Next.js, Firebase, TMDB API, Nginx, PM2
- Live: https://cine.yaduraj.me

### SecondMind / CortX

Cognitive OS on ESP32-S3 Sense. Voice → faster-whisper → local LLM → Coqui TTS. VAD firmware, Opus compression.

- Category: Hackathon Winner
- Stack: ESP32-S3, FastAPI, Flutter, Neo4j, Qdrant
- Live: https://cortx.yaduraj.me

### GBU Timetable

Official iOS app for GBU students. Live home-screen widgets via WidgetKit. Real-time schedule updates.

- Category: iOS · App Store
- Stack: SwiftUI, Combine, WidgetKit
- Live: https://apps.apple.com

### Maakosh

Maternal & neonatal health iOS app. Wearable sensor integration (MAX30100, EMG) for real-time vitals. Role-based.

- Category: Hackathon Winner
- Stack: Swift, Firebase, ThingSpeak

### Bolonyay

Multilingual legal aid iOS app — petitioners with regional advocates. Voice-assisted forms, automated PDF reports.

- Category: iOS · Legal Aid
- Stack: Swift, Firestore, PDFKit, STT

## Stack

- **Languages:** TypeScript, Python, Go, Swift, C/C++, Dart
- **Web & APIs:** Next.js, React, Node.js, Fastify, Express, FastAPI, Tailwind
- **Mobile:** SwiftUI, UIKit, Combine, WidgetKit, AVFoundation, Flutter
- **AI & ML:** faster-whisper, Coqui TTS, LM Studio
- **Data:** PostgreSQL, Redis, Firebase, Prisma, Drizzle ORM, Qdrant, Neo4j
- **Infrastructure:** Linux, Docker, Docker Buildx, GitHub Actions, Nginx, systemd, PM2, Certbot, Vercel
- **Real-time:** WebRTC, ICE/STUN/TURN, coturn, Socket.io, Cloudflare Tunnel
- **Embedded:** ESP32-S3, FreeRTOS, BLE, Opus

## Contact

- Email: yadurajsingham@gmail.com
- GitHub: https://github.com/YadurajManu
- LinkedIn: https://www.linkedin.com/in/yadurajenc
- Résumé: https://www.yaduraj.me/Resume_Web.pdf
