# Research: FAMS Demo App

## Decisions

### Runtime + Language
- Decision: Node.js 20 LTS with TypeScript 5.x across frontend and backend.
- Rationale: Aligns with current Next.js/NestJS support and modern tooling.
- Alternatives considered: Node.js 18 LTS (older LTS, fewer tool defaults).

### Frontend Framework
- Decision: Next.js 14 (App Router) + React 18 with Tailwind CSS and shadcn/ui.
- Rationale: Matches user request, strong component primitives, and fast setup.
- Alternatives considered: Next.js Pages Router (legacy), Remix (not requested).

### Backend Framework
- Decision: NestJS 10 with a minimal health endpoint.
- Rationale: Matches user request and provides a clean API scaffold.
- Alternatives considered: Express-only setup (less structured), Fastify (not requested).

### Database
- Decision: PostgreSQL 16 in Docker for local development.
- Rationale: Matches user request and keeps setup isolated and repeatable.
- Alternatives considered: SQLite (not requested), hosted Postgres (adds deps).

### Styling + Design System
- Decision: Tailwind CSS with a defined color palette in CSS variables; shadcn/ui
  components styled via the same variables.
- Rationale: Ensures a cohesive, sleek look with consistent shadows and accents.
- Alternatives considered: CSS modules only (slower to standardize), MUI (not requested).

### Docker for DB
- Decision: Create `docker/db/Dockerfile` based on the official Postgres image and
  run it via `docker-compose.yml`.
- Rationale: Satisfies "Docker file for launch db" while keeping local ops simple.
- Alternatives considered: `docker run` only (less repeatable).
