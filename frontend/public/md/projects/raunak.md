# Raunak: India-first event ticketing and management

By [Yaduraj Singh](/about).

An India-first event ticketing platform that takes organizers from event setup to paid bookings and QR-based entry.

## Problem

Hosting an event spans two connected jobs: helping people find and book it, then getting each attendee through the door. Raunak brings the organizer workflow and attendee ticket experience into one India-first platform.

## Engineering approach

- Organizers configure event details, media, ticket prices and inventory, then submit listings for review before publication.
- Attendees can book free tickets or use Cashfree checkout for paid tickets; bookings and inventory are validated by the platform.
- Tickets include a signed admission QR and PDF, with configurable email delivery and optional WhatsApp delivery.
- At the entrance, staff can scan a ticket or look it up manually, with feedback for duplicate, cancelled and refunded tickets.

## Technical decisions

- Keep event publishing behind a review step, while giving organizers a workspace for event setup and booking management.
- Tie entry validation to booking status so staff can identify tickets that cannot be admitted.

## Technology stack

Next.js 16, TypeScript, PostgreSQL, Prisma, Cashfree

## Links

[Project website](https://raunak.yaduraj.me)

[Source profile or repository](https://github.com/YadurajManu/raunak)

[All projects](/projects) · [Contact Yaduraj Singh](/contact)
