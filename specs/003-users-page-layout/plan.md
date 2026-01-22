# Implementation Plan: Users Page Layout

**Branch**: `003-users-page-layout` | **Date**: 2026-01-21 | **Spec**: /Users/tanya/Documents/XBS/fams-demo-partly/specs/003-users-page-layout/spec.md
**Input**: Feature specification from `/specs/003-users-page-layout/spec.md`

**Note**: This plan follows the `/speckit.plan` workflow and the SDD Partly Constitution.

## Summary

Deliver a users page with a searchable table, selectable rows, and a fixed-width right-side details panel using the existing web + API stack and design style. Provide create/view/edit/delete for user details (including image upload/remove), derived warnings, and seed the database with 5 users via a migration for demo data.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), Node.js 20 LTS  
**Primary Dependencies**: Next.js (frontend), React, Tailwind CSS, shadcn/ui, TanStack React Query, NestJS (backend), pg  
**Storage**: PostgreSQL for user records and image metadata; local filesystem for user images (relative paths stored in DB)  
**Testing**: None (not requested)  
**Target Platform**: Web app (browser) + Node.js server  
**Project Type**: Web application (frontend/ + backend/)  
**Performance Goals**: Search filters return results in under 1 second for up to 100 users; detail panel updates in under 500 ms  
**Constraints**: Keep current design principles and style; inline validation for editable fields; no automated tests added  
**Scale/Scope**: Single users list up to ~100 users; initial seed of 5 users

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- TypeScript strictness enforced; no `any` or `@ts-ignore`
- ESLint + Prettier configured and run clean
- No automated tests unless explicitly requested
- Inline form validation defined for all user-facing forms
- Clean code standards: readable structure, no dead code or duplication

## Project Structure

### Documentation (this feature)

```text
specs/003-users-page-layout/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── modules/
│   ├── migrations/
│   └── app.module.ts
└── test/

frontend/
├── src/
│   ├── app/
│   ├── components/
│   └── services/
└── tests/
```

**Structure Decision**: Use the existing `backend/` and `frontend/` split. API routes and data access live in backend; page UI and data fetching live in frontend.

## Phase 0: Outline & Research

### Research Tasks

- Confirm data representation for driving categories and enum fields in a single user record.
- Define a REST contract for list/detail, plus image upload/delete using the existing pattern.
- Decide how to seed initial user data in migrations.

### Research Output

`/Users/tanya/Documents/XBS/fams-demo-partly/specs/003-users-page-layout/research.md`

## Phase 1: Design & Contracts

### Data Model

Define a user entity covering identity, position/status/gender enums, dates, contacts, and document fields. Define a user image entity that reuses the existing image upload approach. Warnings are derived from date rules and not stored.

Output: `/Users/tanya/Documents/XBS/fams-demo-partly/specs/003-users-page-layout/data-model.md`

### API Contracts

Define list/search, detail retrieval, and image upload/delete endpoints.

Output: `/Users/tanya/Documents/XBS/fams-demo-partly/specs/003-users-page-layout/contracts/openapi.yaml`

### Quickstart

Document how to run backend and frontend, run migrations, and verify the users page with seeded data.

Output: `/Users/tanya/Documents/XBS/fams-demo-partly/specs/003-users-page-layout/quickstart.md`

### Agent Context Update

Run `/Users/tanya/Documents/XBS/fams-demo-partly/.specify/scripts/bash/update-agent-context.sh codex` after contracts and data model are generated.

## Constitution Check (Post-Design)

- TypeScript strictness enforced; no `any` or `@ts-ignore`
- ESLint + Prettier configured and run clean
- No automated tests unless explicitly requested
- Inline form validation defined for all user-facing forms
- Clean code standards: readable structure, no dead code or duplication

## Phase 2: Task Planning

Stop after Phase 2 planning. Task generation will be completed by `/speckit.tasks`.
