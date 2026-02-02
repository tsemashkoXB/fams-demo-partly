# Implementation Plan: Scheduler Page Layout

**Branch**: `004-scheduler-page-layout` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-scheduler-page-layout/spec.md`

## Summary

Implement a fleet scheduler page with a two-column layout: filter panel (left, ~300px) with calendar, search, and filtering controls; scheduler area (right) displaying vehicle timelines with booking events. Features include Day/Week/Month view modes, booking CRUD via popup form, and availability filtering. Calendar styling follows Figma design specifications.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**: Next.js 14 (App Router), React 18, Tailwind CSS v4, shadcn/ui, TanStack React Query v5, NestJS 10, pg, react-day-picker v9, date-fns v3  
**Storage**: PostgreSQL for bookings table with foreign keys to users and vehicles  
**Testing**: None (per constitution - no automated tests unless explicitly requested)  
**Target Platform**: Web browser (modern browsers)  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: Filter operations return within 1 second for up to 500 vehicles  
**Constraints**: Timeline view switch within 1 second, responsive design (WCAG 2.1 AA target)  
**Scale/Scope**: Support up to 500 vehicles, unlimited bookings

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] TypeScript strictness enforced; no `any` or `@ts-ignore`
- [x] ESLint + Prettier configured and run clean (existing project configuration)
- [x] No automated tests unless explicitly requested
- [x] Inline form validation defined for all user-facing forms (booking popup form)
- [x] Clean code standards: readable structure, no dead code or duplication

## Project Structure

### Documentation (this feature)

```text
specs/004-scheduler-page-layout/
├── plan.md              # This file
├── research.md          # Phase 0 output - design decisions
├── data-model.md        # Phase 1 output - booking entity schema
├── quickstart.md        # Phase 1 output - developer guide
├── contracts/           # Phase 1 output - OpenAPI spec
│   └── openapi.yaml
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── migrations/
│   │   ├── 007_create_bookings_table.ts    # New: booking table
│   │   └── 008_seed_bookings.ts            # New: 20 demo bookings
│   └── modules/
│       └── bookings/                        # New: booking module
│           ├── booking.entity.ts
│           ├── bookings.controller.ts
│           ├── bookings.module.ts
│           ├── bookings.repository.ts
│           └── bookings.service.ts

frontend/
├── src/
│   ├── app/
│   │   └── scheduler/
│   │       └── page.tsx                     # Scheduler page
│   ├── components/
│   │   ├── scheduler/                       # New: scheduler components
│   │   │   ├── scheduler-layout.tsx
│   │   │   ├── filter-panel.tsx
│   │   │   ├── scheduler-timeline.tsx
│   │   │   ├── timeline-header.tsx
│   │   │   ├── vehicle-row.tsx
│   │   │   ├── event-bar.tsx
│   │   │   ├── booking-popup.tsx
│   │   │   ├── booking-popup.validation.ts  # Form validation
│   │   │   └── scheduler-calendar.tsx       # Figma-styled calendar
│   │   └── ui/
│   │       └── calendar.tsx                 # Update with Figma styles
│   ├── services/
│   │   └── bookings.ts                      # New: booking queries
│   └── lib/
│       └── scheduler-utils.ts               # Timeline calculation helpers
```

**Structure Decision**: Web application structure following existing patterns. Backend uses NestJS modular architecture matching vehicles/users modules. Frontend uses Next.js App Router with feature-based component organization.

## Figma Design Integration

Calendar styling from Figma design (node-id=1-92):

| Token | Value | Usage |
|-------|-------|-------|
| Background | Gradient radial with blur | Calendar container |
| Border | 2px gradient stroke | Calendar border |
| Border Radius | 8px | Calendar container |
| Padding | 24px | Calendar container |
| Day header font | 10px, uppercase, semibold | Week day labels (SUN, MON...) |
| Day header color | #828282 (Gray 3) | Week day labels |
| Date font | 16px, semibold | Date numbers |
| Inactive date color | #4A5660 (Gray 80) | Non-selected dates |
| Active date bg | #2F6FED (Primary blue) | Selected date |
| Active date color | #FFFFFF | Selected date text |
| Month title font | 14px, semibold | Month/year header |
| Month title color | #333333 (Gray 1) | Month/year text |
| Gap between rows | 8px | Date grid spacing |
| Cell size | 30x30px | Individual date cells |

## Entity Relationship

Per `.cursor/plans/entitiesDiagram.mmd`:

```
USER ||--o{ BOOKING : "books"
VEHICLE ||--o{ BOOKING : "is booked in"
```

- BOOKING references existing USER and VEHICLE tables
- Available status is **computed** (absence of booking for a time slot)
- Statuses: "In work" (default), "Service" (when service checkbox checked)

## Complexity Tracking

No constitution violations. Standard CRUD feature with timeline visualization.
