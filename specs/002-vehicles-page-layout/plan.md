# Implementation Plan: Vehicles Page Layout

**Branch**: `002-vehicles-page-layout` | **Date**: 2026-01-20 | **Spec**: /Users/tanya/Documents/XBS/fams-demo-partly/specs/002-vehicles-page-layout/spec.md
**Input**: Feature specification from `/specs/002-vehicles-page-layout/spec.md`

**Note**: This plan follows the `/speckit.plan` workflow and the SDD Partly Constitution.

## Summary

Deliver a vehicles page with a searchable table, a right-side details panel with view/edit modes, image upload/delete, warning badges, and role-based editing permissions. Use the existing web + API stack, add TanStack React Query for data fetching, store images on disk with relative paths in the database, and seed demo data for five vehicles.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), Node.js 20 LTS  
**Primary Dependencies**: Next.js (frontend), React, Tailwind CSS, shadcn/ui, TanStack React Query, NestJS (backend), pg  
**Storage**: PostgreSQL for vehicles and image metadata; local filesystem for image files (relative paths stored in DB)  
**Testing**: None (not requested)  
**Target Platform**: Web app (browser) + Node.js server  
**Project Type**: Web application (frontend/ + backend/)  
**Performance Goals**: Search filters return results in under 1 second for up to 1,000 vehicles; detail panel updates in under 500 ms  
**Constraints**: Inline form validation for all editable fields; local image storage with relative paths; no automated tests added  
**Scale/Scope**: Single fleet list up to ~1,000 vehicles; initial seed of 5 vehicles

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
specs/002-vehicles-page-layout/
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
│   ├── controllers/
│   ├── services/
│   └── entities/
│   └── migrations/
└── tests/

frontend/
├── src/
│   ├── app/
│   ├── components/
│   └── services/
└── tests/
```

**Structure Decision**: Use the existing `backend/` and `frontend/` split. API routes and data access live in backend; page UI, forms, and React Query live in frontend.

## Phase 0: Outline & Research

### Research Tasks

- Best practices for local image storage with relative paths and cleanup on delete.
- Recommended API patterns for image upload/delete in a REST service.
- TanStack React Query usage patterns for list/detail + optimistic update in admin pages.

### Research Output

`/Users/tanya/Documents/XBS/fams-demo-partly/specs/002-vehicles-page-layout/research.md`

## Phase 1: Design & Contracts

### Data Model

Create a vehicle entity and a vehicle image entity. Enforce unique identifiers for plate number and VIN. Store images as relative paths and maintain display order.

Output: `/Users/tanya/Documents/XBS/fams-demo-partly/specs/002-vehicles-page-layout/data-model.md`

### API Contracts

Define endpoints for list/search, detail, create, update, delete vehicles, and upload/delete images.

Output: `/Users/tanya/Documents/XBS/fams-demo-partly/specs/002-vehicles-page-layout/contracts/openapi.yaml`

### Quickstart

Document how to run backend and frontend, seed demo data, and verify the vehicles page.

Output: `/Users/tanya/Documents/XBS/fams-demo-partly/specs/002-vehicles-page-layout/quickstart.md`

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
