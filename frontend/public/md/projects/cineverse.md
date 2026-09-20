# CineVerse

By [Yaduraj Singh](/about).

Social film tracking — watchlists, ratings, reviews, discovery feeds. TMDB API across 500k+ titles.

## Problem

Letterboxd is great but bloated, and no one tracks regional films well. Built a lighter, faster alternative.

## Engineering approach

- Next.js SSR for SEO-friendly title pages.
- Firestore for user data; TMDB API proxied for caching.
- Discovery feed ranks by friend activity + recency.

## Technical decisions

- Firebase over custom auth — speed of shipping > purity.
- Nginx + PM2 self-host for full log access.

## Technology stack

Next.js, Firebase, TMDB API, Nginx, PM2

## Links

[Project website](https://cine.yaduraj.me)



[All projects](/projects) · [Contact Yaduraj Singh](/contact)
