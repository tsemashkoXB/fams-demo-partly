# Implementation Plan: FAMS Demo App

**Branch**: `001-fams-demo-app` | **Date**: 2026-01-20 | **Spec**: specs/001-fams-demo-app/spec.md
**Input**: Feature specification from `/specs/001-fams-demo-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a desktop-first demo app called "FAMS Demo" with a collapsible dark sidebar,
header mock avatar + alerts icon, and five empty pages. Use a Next.js frontend
with Tailwind and shadcn/ui for a unified sleek style, plus a minimal NestJS
backend with a health endpoint and a PostgreSQL Docker setup for local
development.

## Design Notes

- Style direction: simple and sleek, soft shadows, restrained surfaces, and
  accent-colored buttons/active states.
- Palette (CSS variables):
  - `--bg`: #f5f7fa
  - `--surface`: #ffffff
  - `--sidebar`: #131f2c
  - `--text`: #0f172a
  - `--muted`: #64748b
  - `--accent`: #2f6fed
  - `--accent-strong`: #1d4ed8
  - `--accent-soft`: #dbeafe
- Reuse shadcn/ui components (Button, Avatar, Tooltip, Separator) with theme
  tokens from the palette above.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, Node.js 20 LTS  
**Primary Dependencies**: Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui, NestJS 10, pg  
**Storage**: PostgreSQL 16 (Docker)  
**Testing**: none (per constitution)  
**Target Platform**: Web (modern desktop browsers), Node.js API  
**Project Type**: web (frontend + backend)  
**Performance Goals**: 60 fps UI interactions, <200ms local navigation changes  
**Constraints**: No auth, desktop-first layout, no automated tests  
**Scale/Scope**: 5 routes, single demo layout, small local user base

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- TypeScript strictness enforced; no `any` or `@ts-ignore`
- ESLint + Prettier configured and run clean
- No automated tests unless explicitly requested
- Inline form validation defined for all user-facing forms
- Clean code standards: readable structure, no dead code or duplication

**Gate Status**: PASS (no forms in this scope; inline validation requirement is
not applicable yet).

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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
│   ├── app.module.ts
│   ├── main.ts
│   ├── config/
│   │   └── env.validation.ts
│   └── health/
│       ├── health.controller.ts
│       └── health.service.ts
├── .eslintrc.cjs
├── .prettierrc
├── nest-cli.json
├── package.json
└── tsconfig.json

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── vehicles/page.tsx
│   │   ├── users/page.tsx
│   │   ├── scheduler/page.tsx
│   │   ├── radar/page.tsx
│   │   └── statistics/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── app-shell.tsx
│   │   │   ├── header.tsx
│   │   │   └── sidebar.tsx
│   │   └── ui/ (shadcn)
│   ├── lib/
│   │   ├── nav.ts
│   │   └── theme.ts
│   └── styles/
│       └── globals.css
├── public/
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json

docker/
└── db/
    └── Dockerfile

docker-compose.yml
```

**Structure Decision**: Web application split into `frontend/` (Next.js) and
`backend/` (NestJS) with shared Docker tooling for PostgreSQL at repo root.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
