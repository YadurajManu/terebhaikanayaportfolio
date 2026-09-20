# SecondMind / CortX

By [Yaduraj Singh](/about).

Cognitive OS on ESP32-S3 Sense. Voice → faster-whisper → local LLM → Coqui TTS. VAD firmware, Opus compression.

## Problem

Wanted a wearable cognitive assistant that runs locally — no cloud round-trip per query. Two-person team, 36-hour hackathon.

## Engineering approach

- ESP32-S3 firmware: VAD detection, I2S mic, Opus encoding.
- FastAPI backend pipes audio → faster-whisper → LM Studio LLM → Coqui TTS.
- Neo4j stores conversation graph; Qdrant for semantic memory.
- Flutter app as control surface.

## Technical decisions

- Local LLM over OpenAI — privacy + cost.
- Opus over WAV — 10x bandwidth reduction over BLE.

## Technology stack

ESP32-S3, FastAPI, Flutter, Neo4j, Qdrant

## Links

[Project website](https://cortx.yaduraj.me)



[All projects](/projects) · [Contact Yaduraj Singh](/contact)
