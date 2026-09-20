# Fleet OS

By [Yaduraj Singh](/about).

Git push to the hardware you already own. A Raspberry Pi, an old laptop and a spare VPS, treated as one deploy target — multi-arch builds, constraint-based placement, health-gated rollouts and automatic failover.

## Problem

Coolify, Dokploy and CapRover are excellent single-server deployment tools, but their scheduling model assumes one stable host or a fairly uniform cluster. Balena assumes a fleet of similarly managed devices. None of them fit the hardware most people actually have lying around — a Raspberry Pi, an old laptop and a spare VPS, on different architectures, behind different networks, none of them reliably online.

## Engineering approach

- Outbound-only Go agents: each node reports its capabilities and heartbeats over outbound HTTPS and reconciles container state locally. No inbound Docker socket, no SSH key, no port to forward.
- The control plane holds a reverse tunnel for ingress, so a machine on a college LAN or behind a home router can serve public traffic without a port forward.
- Weighted scheduling across CPU, memory headroom, reliability tier, tags, GPU, affinity and anti-affinity — with a dry-run placement plan that explains every node it rejected.
- Architecture-aware multi-platform builds through Docker Buildx, pushed to a registry the fleet pulls from, so an arm64 Pi and an amd64 VPS each get an image they can run.
- Health-gated rollouts plus heartbeat liveness, cordon/drain controls, and automatic failover for flexible services.

## Technical decisions

- Heterogeneous, intermittently connected hardware is the design centre, not an edge case — capability discovery is reported by agents rather than assumed by the scheduler.
- Pinned stateful services are treated differently from movable stateless ones, because rescheduling a database is not the same as rescheduling a web process.
- Per-organisation GitHub App installations, so a shared control plane never lets one tenant reach another's repositories.
- Envelope-encrypted secrets with per-secret keys, injected only into the services that declare them.
- MIT with no open-core split and no enterprise fork — what is in the repository is the product.

## Technology stack

Go, TypeScript, Fastify, Drizzle ORM, PostgreSQL, Redis, Docker Buildx, React, Vite, nginx, Cloudflare Tunnel

## Links

[Project website](https://fleet.plastikworld.xyz)

[Source profile or repository](https://github.com/YadurajManu/fleet-os)

[All projects](/projects) · [Contact Yaduraj Singh](/contact)
