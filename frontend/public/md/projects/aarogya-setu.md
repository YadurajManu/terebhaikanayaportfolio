# Aarogya Setu

By [Yaduraj Singh](/about).

Multi-tenant hospital SaaS — OPD/IPD queues, EMR, appointments, billing, pharmacy, diagnostics. 6-tier RBAC.

## Problem

Hospitals in India still run on paper. Existing EMR vendors are bloated, expensive, and not multi-tenant. I wanted one platform a 50-bed clinic and a 500-bed hospital can both run.

## Engineering approach

- Designed a 6-tier RBAC matrix from scratch (super-admin → patient).
- Multi-tenant Postgres with Prisma — schema-per-tenant evaluated, settled on row-level isolation.
- Redis for queue state, session, and rate-limit. NextAuth for sessions.
- Self-hosted on a Linux VPS behind Nginx with auto-renew SSL via Certbot.
- GitHub Actions → Docker Compose deploy on push to main.

## Technical decisions

- Chose Prisma over raw SQL for type-safety across 9 modules.
- Picked self-hosted over Vercel — cost predictability + SSH debug access.
- OPD/IPD queue logic kept stateful in Redis — sub-100ms updates.

## Technology stack

Next.js 14, TypeScript, Prisma, PostgreSQL, Redis, Docker

## Links

[Project website](https://arogya.yaduraj.me)

[Source profile or repository](https://github.com/YadurajManu)

[All projects](/projects) · [Contact Yaduraj Singh](/contact)
