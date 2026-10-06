# MuhDikhai: WebRTC signaling server with Node.js

By [Yaduraj Singh](/about).

WebRTC video chat with a Node.js signaling server, Socket.io offer/answer exchange, Redis matchmaking and configurable TURN fallback.

## Problem

Build a video-chat product while understanding the complete WebRTC peer lifecycle: finding a partner, negotiating media, handling network changes and cleaning up after a disconnect. WebRTC transports media, but the application must supply its own signaling and matchmaking.

## Engineering approach

- Use Node.js and Socket.io to relay offers, answers and ICE candidates between matched users. The random-chat relay checks the sender's Redis room mapping before forwarding a signal.
- Use Redis queue partitions and an atomic Lua match-or-enqueue operation to coordinate matching. Heartbeats identify waiting users; duplicate joins and deferred retries avoid re-enqueuing the same entry.
- Create browser RTCPeerConnection instances, attach local tracks, exchange descriptions and receive the remote stream through ontrack.
- Configure STUN servers and an optional TURN relay through deployment settings. The client collects connection-state, round-trip-time and packet-loss telemetry.

## Technical decisions

- Implement the browser WebRTC lifecycle directly, without a hosted video SDK, to control negotiation and media behavior.
- Keep signaling messages separate from audio/video: Socket.io coordinates the call, while WebRTC carries the media over a direct or relay path.
- Allow a five-second cleanup grace period after the last socket disconnects. Reconnecting within that window cancels pending cleanup; this does not guarantee recovery of the media connection.
- Use Redis for shared matchmaking state; the public backend is TypeScript and the current browser hook is JavaScript. Avoid describing the entire product as TypeScript-only.

## Offer, answer and ICE: the signaling sequence

SDP (Session Description Protocol) describes media capabilities. ICE (Interactive Connectivity Establishment) discovers usable network paths. The signaling server forwards these messages; it does not choose the final media path.

Read this sequence as Browser A → Node.js / Socket.io → Browser B. Media subsequently travels Browser A ↔ Browser B, potentially through TURN.

```text
Browser A             Node.js / Socket.io             Browser B
   | -- SDP offer ----------> | -- SDP offer ------------> |
   | <--- SDP answer -------- | <--- SDP answer ----------- |
   | <--- ICE candidates ---> | <--- ICE candidates ------> |
   |                                                       |
   +========= WebRTC media (direct or via TURN) ============+
```

- A creates an offer, calls setLocalDescription and emits webrtc:signal with its room or recipient and the offer.
- The server relays the signal to the other participant. B applies setRemoteDescription, creates an answer, sets its local description and sends the answer back.
- A applies the answer as its remote description. Each browser emits discovered ICE candidates through the same signaling event.
- The receiver adds a candidate immediately when its remote description exists, or buffers it until negotiation can accept it. The current offer handler drains that buffer after sending the answer.
- Once connected, ontrack exposes the remote stream. Connection-state changes and periodic stats provide diagnostics.

## STUN and TURN: direct connections and relay fallback

STUN helps browsers discover externally reachable addresses. TURN relays media when a usable direct route is unavailable. The reviewed hook supplies Google STUN servers and adds TURN only when all three TURN settings are present.

The ICE policy is all, permitting direct and relay candidates. A configured relay is not proof that a particular call used it: inspect the selected candidate pair and test across separate networks. There is no claim here that a production coturn deployment was verified.

- Test on two devices and different networks, then repeat on a restrictive network with a valid relay configured.
- Inspect connectionState, selected ICE candidate type, round-trip time and packet loss. A connected socket alone does not mean video is connected.

## Matchmaking load, waiting users and queue limits

The current backend replaces the old in-memory-queue description with Redis partitions, heartbeats and a Lua transaction. Atomic matching reduces duplicate assignment when users join concurrently. A deferred consumer retries waiting entries without duplicating them.

Queue coordination is not the same as a hard capacity limit. I have not established a bounded queue or rejection policy from this review, so the former backpressure-on-overload claim has been removed.

- For a load test, measure queue depth, wait time, match throughput and stale-entry cleanup together. Do not infer throughput from the presence of Redis.
- An overloaded service needs an explicit admission limit and user-visible waiting or retry behavior. Those are next steps to validate, not shipped performance guarantees.

## Reconnect and cleanup: signaling versus media

When the last socket for a user disconnects, the server starts a five-second timer. A reconnect cancels that timer. On expiry, cleanup removes queue heartbeat and room state and notifies the partner.

The browser records disconnected and failed peer states. Socket reconnection and media recovery are separate concerns; a preserved room does not automatically repair an ICE path.

- Test a brief network interruption, a disconnect lasting longer than five seconds and a skip/rematch while signals are in flight.
- Verify that old room membership is removed, the partner is notified and camera/microphone tracks stop when the call ends.
- Test early ICE candidates in both directions. The reviewed hook explicitly drains pending candidates in its offer branch; answer-side buffering warrants a focused regression check.

## Source evidence and scope

This case study was checked against public source revision 8ae5018 on October 7, 2026. It describes source behavior, not a production load test. The earlier sub-two-second pairing metric is omitted because a reproducible benchmark was not available.

- [Browser WebRTC hook: offer, answer, ICE and TURN configuration](https://github.com/YaduEnc/MuhDikhai/blob/8ae5018cfd9c2216d6ed596fa18214d3c515ae01/web-next/src/hooks/useWebRTC.js)
- [Node.js signaling, Redis matching and disconnect cleanup](https://github.com/YaduEnc/MuhDikhai/blob/8ae5018cfd9c2216d6ed596fa18214d3c515ae01/PlasticWorld/src/config/socket.ts)

## Technology stack

Node.js, TypeScript, WebRTC, Socket.io, Redis, PostgreSQL

## Links

[Project website](https://batchit.yaduraj.me)

[Source profile or repository](https://github.com/YaduEnc/MuhDikhai)

[All projects](/projects) · [Contact Yaduraj Singh](/contact)
