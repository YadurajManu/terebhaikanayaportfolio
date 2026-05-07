# Yaduraj Singh Portfolio — PRD

## Original problem statement
Personal portfolio site for Yaduraj Singh, 20, full-stack engineer / AI-ML builder, B.Tech CSE (AI) at GBU. Audience: startups, MNC recruiters. Brand: dark, technical, minimal, code-first, confident builder.

## User choices (verbatim)
- Single-page scrolling portfolio (hero → about → projects → stack → contact) + "now building"
- Aesthetic: blend of pure terminal / code-editor vibe + modern dev-portfolio (Linear/Vercel-engineer style)
- Contact: mailto only (no backend storage)
- Static portfolio content (hardcoded)
- Resume: just a "Download Resume" button placeholder

## Architecture
- Frontend-only React app (CRA + Tailwind + shadcn/ui)
- No backend mutation — default FastAPI server.py left as-is
- Data hardcoded in `/app/frontend/src/data/portfolio.js`
- Toaster (sonner) for clipboard toasts
- Lucide-react for icons

## What's been implemented (Dec 2025)
- Sticky pill navigation with smooth scroll + mobile menu
- Hero: terminal `$ whoami`, large Outfit display name, taglines, CTAs (view work, resume placeholder, mailto)
- About: builder narrative + "what sets me apart" list
- Now Building: SubSlot featured card with glow border + animated cursor
- Experience: timeline (LEAP iOS Lead, Lead Software Developer at GBU)
- Projects: 8 cards (Aarogya Setu, MuhDikhai, CineVerse, SecondMind/CortX, Likhai, GBU Timetable, Maakosh, Bolonyay) with live URLs
- Tech Stack: 7 grouped categories with mono pills
- Contact: mailto CTA + copy-phone (sonner toast) + GitHub/LinkedIn/web links
- Footer
- Fonts: Outfit (display), JetBrains Mono (mono accents)
- Dark theme with emerald accent (#4ADE80)
- data-testid on all interactive elements

## Backlog (P1/P2)
- P1: Wire up actual resume PDF download once user uploads it
- P2: Add subtle scroll progress bar / section indicator
- P2: Add lazy-load preview screenshots for each project card
- P2: SubSlot waitlist email capture (would require backend)
- P2: Testimonials / recommendations section
