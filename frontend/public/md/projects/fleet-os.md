# Fleet OS: self-hosted container orchestration across ARM and x86

By [Yaduraj Singh](/about).

A self-hosted deployment platform for Linux containers across hardware you already own. Deploy from the CLI or GitHub, build on opted-in machines, and serve apps from behind NAT.

## Problem

A Raspberry Pi, an old laptop and a VPS can each run containers, but they have different CPU architectures, capacity and uptime. A home or campus router can also block inbound access. I built Fleet OS to give those machines one deployment workflow while keeping placement decisions and failure behavior visible.

## Engineering approach

- Define the service, resources, placement and health checks in fleet.yaml. Submit a local snapshot with the CLI, connect a GitHub repository for commit-based builds, or deploy a prebuilt image.
- Pair machines with single-use tokens. Go agents report Docker engine capabilities and health to a Fastify control plane and reconcile assigned containers locally.
- Plan the image platforms and assign builds to eligible, opted-in BuildKit workers. Publish to a registry and deploy by immutable image digest.
- Filter runtime nodes against the image and service constraints, then use health evidence to promote the release and update routing.

## Technical decisions

- Read container platform and capacity from Docker Engine. On Docker Desktop, the Linux VM determines what can run and how much capacity the scheduler can assign.
- Keep build and runtime placement independent. A node can run services without opting into builds. Prefer native builders and require an explicit opt-in for QEMU fallback.
- Keep desired state and build jobs in PostgreSQL. Use Redis for current heartbeat snapshots, progress and logs.
- Keep persistent volumes tied to a node and let flexible stateless services move when suitable capacity is available.

## Engineering decisions and trade-offs

- Outbound Go agents. A worker can connect from behind NAT, and the ingress proxy can reach its container over that connection. The control plane and registry still need reachable endpoints, and an interrupted agent tunnel can affect app traffic.
- Docker. A common Linux container engine lets the agent reconcile workloads on ARM and x86. Platform compatibility still governs placement, and on Docker Desktop the Linux VM determines the usable capacity.
- PostgreSQL. Durable desired state, deployment records, and build jobs survive control-plane restarts. Redis handles current heartbeats and progress. Operating a stateful control plane requires application-aware backups and recovery.
- Health-gated deployments. The previous stateless release keeps serving while its replacement is checked. A persistent-volume workload can require in-place replacement to avoid concurrent writers, so downtime is possible.

## Outbound agents and public ingress

Agents initiate HTTPS and WebSocket connections to the control plane. Public app traffic reaches the ingress edge and can travel back to the agent over the connection it already opened. Worker nodes need no inbound router port forwarding. The control plane, ingress and registry still need reachable endpoints.

- [Fleet OS architecture and component map](https://github.com/YadurajManu/fleet-os/blob/d77ef259b9f625e2ee433143beb7a2956506b8d6/docs/ARCHITECTURE.md)
- [Self-hosting and network setup](https://github.com/YadurajManu/fleet-os/blob/d77ef259b9f625e2ee433143beb7a2956506b8d6/docs/self-hosting.md)

## Build delegation and immutable releases

The control plane records a build job for each target platform. An opted-in agent runs BuildKit and pushes the result using a short-lived registry credential scoped to the active job attempt. The runtime agent pulls the resulting digest. For multi-platform builds, the control plane assembles the manifest.

- Build jobs carry a lease and an attempt identity, so an expired attempt cannot publish a result as the current one.
- Builder selection accounts for CPU, memory, concurrency and disk headroom. Disk usage is monitored between checks.

- [Delegated builds and builder configuration](https://github.com/YadurajManu/fleet-os/blob/d77ef259b9f625e2ee433143beb7a2956506b8d6/docs/agent-delegated-builds.md)

## Placement, rollouts and failure handling

The scheduler filters offline or cordoned nodes and checks image platform, resources, tags, GPU requirements and volume constraints. It ranks the candidates that remain. The fleet where command reports the candidates and their rejection reasons.

During a stateless replacement, the prior release stays routed until the new container passes its configured health check. Flexible workloads can move after a node goes offline if another eligible node is available. Persistent-volume services may replace in place with downtime. Local data stays on its node, and a control-plane outage can interrupt public ingress.

- [Manifest options for placement and health checks](https://github.com/YadurajManu/fleet-os/blob/d77ef259b9f625e2ee433143beb7a2956506b8d6/docs/fleet-yaml-spec.md)

## Production rollout evidence

The recorded delegated-build rollout used one Apple Silicon Mac running Docker Desktop. It built and deployed the MediLifecycle frontend and API by digest and reached both over public HTTPS. A deliberately broken build left the previous frontend serving, and cancellation cleaned up the BuildKit container.

That rollout exercised one Linux/arm64 builder. Mixed-architecture runtime and Windows agent behavior were outside its verified scope.

- [Recorded rollout, test results and remaining coverage](https://github.com/YadurajManu/fleet-os/blob/d77ef259b9f625e2ee433143beb7a2956506b8d6/docs/delegated-builds-handover.md)

## Source and license

Fleet OS is open source under the Apache License, Version 2.0.

- [Fleet OS repository license](https://github.com/YadurajManu/fleet-os/blob/d77ef259b9f625e2ee433143beb7a2956506b8d6/LICENSE)
- [License change on GitHub](https://github.com/YadurajManu/fleet-os/commit/49c8b7aaef063a3a3dfed08ad1107787aed8764d)

## Technology stack

Go, TypeScript, Fastify, Drizzle ORM, PostgreSQL, Redis, Docker BuildKit / Buildx, React, Vite, Caddy

## Links

[Project website](https://fleet.plastikworld.xyz)

[Source profile or repository](https://github.com/YadurajManu/fleet-os)

[All projects](/projects) · [Contact Yaduraj Singh](/contact)
