# MuhDikhai

By [Yaduraj Singh](/about).

Omegle-style anonymous video chat. Full WebRTC peer lifecycle built manually over Socket.io. Sub-2s pairing.

## Problem

Wanted to truly understand WebRTC — not call Twilio's SDK and pretend. Built ICE/STUN/TURN signalling and peer lifecycle from primitives.

## Engineering approach

- Custom Socket.io signalling with offer/answer/ICE relay.
- Stateful matchmaking queue in memory — backpressure on overload.
- Graceful reconnect: peer state cached for 30s on disconnect.
- Self-hosted TURN via coturn for symmetric-NAT users.

## Technical decisions

- No third-party video SDK — full peer connection lifecycle manual.
- TypeScript everywhere for signalling type safety.
- Postgres only for abuse-report ledger; chat itself is ephemeral.

## Technology stack

Node.js, TypeScript, WebRTC, Socket.io, PostgreSQL

## Links

[Project website](https://batchit.yaduraj.me)

[Source profile or repository](https://github.com/YaduEnc/MuhDikhai)

[All projects](/projects) · [Contact Yaduraj Singh](/contact)
