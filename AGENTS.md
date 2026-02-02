# fams-demo-partly Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-02

## Active Technologies
- TypeScript 5.x (strict), Node.js 20 LTS + Next.js (frontend), React, Tailwind CSS, shadcn/ui, TanStack React Query, NestJS (backend), pg (002-vehicles-page-layout)
- PostgreSQL for vehicles and image metadata; local filesystem for image files (relative paths stored in DB) (002-vehicles-page-layout)
- PostgreSQL for user records and document metadata; image stored as a URL/path string on the user record (003-users-page-layout)
- TypeScript 5.x (strict), Next.js 14 (App Router), React 18, Tailwind CSS v4, shadcn/ui, TanStack React Query v5, NestJS 10, pg, react-day-picker v9, date-fns v3 (004-scheduler-page-layout)
- PostgreSQL for bookings table with foreign keys to users and vehicles (004-scheduler-page-layout)

- TypeScript 5.x, Node.js 20 LTS + Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui, NestJS 10, pg (001-fams-demo-app)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x, Node.js 20 LTS: Follow standard conventions

## Recent Changes
- 004-scheduler-page-layout: Added TypeScript 5.x (strict), Next.js 14 (App Router), React 18, Tailwind CSS v4, shadcn/ui, TanStack React Query v5, NestJS 10, pg, react-day-picker v9, date-fns v3; PostgreSQL bookings table
- 003-users-page-layout: Added TypeScript 5.x (strict), Node.js 20 LTS + Next.js (frontend), React, Tailwind CSS, shadcn/ui, TanStack React Query, NestJS (backend), pg
- 002-vehicles-page-layout: Added TypeScript 5.x (strict), Node.js 20 LTS + Next.js (frontend), React, Tailwind CSS, shadcn/ui, TanStack React Query, NestJS (backend), pg

- 001-fams-demo-app: Added TypeScript 5.x, Node.js 20 LTS + Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui, NestJS 10, pg

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
