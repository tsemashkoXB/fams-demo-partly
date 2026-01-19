# Quickstart: FAMS Demo App

## Prerequisites
- Node.js 20 LTS
- npm 10+
- Docker Desktop

## Frontend (Next.js + Tailwind + shadcn/ui)
```bash
npx create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
cd frontend
npx shadcn-ui@latest init
```

## Backend (NestJS)
```bash
cd ..
npx @nestjs/cli new backend --package-manager npm
```
After generation, enable strict TypeScript in `backend/tsconfig.json` and add
ESLint + Prettier configs per the constitution.

## Database (PostgreSQL via Docker)
Create `docker/db/Dockerfile` based on the official Postgres image and then run:
```bash
docker compose up -d db
```

Suggested `DATABASE_URL` for backend:
```text
postgres://fams:fams@localhost:5432/fams_demo
```

## Dev Commands
```bash
cd backend
npm run start:dev
```
```bash
cd frontend
npm run dev
```
