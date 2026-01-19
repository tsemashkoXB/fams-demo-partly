# Tasks: FAMS Demo App

**Input**: Design documents from `/specs/001-fams-demo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated tests requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Next.js app scaffold in `frontend/` (create `frontend/package.json`, `frontend/src/app/layout.tsx`)
- [ ] T002 Initialize NestJS app scaffold in `backend/` (create `backend/package.json`, `backend/src/main.ts`)
- [ ] T003 [P] Configure TypeScript strict mode in `frontend/tsconfig.json`
- [ ] T004 [P] Configure TypeScript strict mode in `backend/tsconfig.json`
- [ ] T005 [P] Configure ESLint + Prettier in `frontend/.eslintrc.cjs` and `frontend/.prettierrc`
- [ ] T006 [P] Configure ESLint + Prettier in `backend/.eslintrc.cjs` and `backend/.prettierrc`
- [ ] T007 [P] Initialize shadcn/ui in `frontend/components.json` and `frontend/src/components/ui/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Create Docker Postgres image in `docker/db/Dockerfile`
- [ ] T009 Create local DB compose config in `docker-compose.yml`
- [ ] T010 Add backend env validation for DB config in `backend/src/config/env.validation.ts`
- [ ] T011 Implement backend health endpoint in `backend/src/health/health.controller.ts` and `backend/src/health/health.service.ts`
- [ ] T012 Wire health module in `backend/src/app.module.ts`
- [ ] T013 Define navigation data source in `frontend/src/lib/nav.ts`
- [ ] T014 Define theme tokens and helpers in `frontend/src/lib/theme.ts`
- [ ] T015 Add global palette and base styles in `frontend/src/styles/globals.css`
- [ ] T016 Create base app shell layout in `frontend/src/components/layout/app-shell.tsx`
- [ ] T017 Add shared header container in `frontend/src/components/layout/header.tsx`
- [ ] T018 Add shared sidebar container in `frontend/src/components/layout/sidebar.tsx`
- [ ] T019 Apply app shell in `frontend/src/app/layout.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Navigate Fleet Sections (Priority: P1) 🎯 MVP

**Goal**: Users can navigate between Vehicles, Users, Scheduler, Radar, and Statistics from the sidebar.

**Independent Test**: Load the app, verify Vehicles is default, and click each nav item to confirm route change and active highlight.

### Implementation for User Story 1

- [ ] T020 [P] [US1] Create route files for five pages in `frontend/src/app/vehicles/page.tsx`, `frontend/src/app/users/page.tsx`, `frontend/src/app/scheduler/page.tsx`, `frontend/src/app/radar/page.tsx`, `frontend/src/app/statistics/page.tsx`
- [ ] T021 [US1] Render empty page content shells in each page file listed in `frontend/src/app/*/page.tsx`
- [ ] T022 [US1] Implement sidebar navigation links and active state styles in `frontend/src/components/layout/sidebar.tsx`
- [ ] T023 [US1] Set default landing page to Vehicles in `frontend/src/app/page.tsx`

**Checkpoint**: User Story 1 is fully functional and testable independently

---

## Phase 4: User Story 2 - Collapse the Sidebar (Priority: P2)

**Goal**: Users can collapse and expand the sidebar from the title area.

**Independent Test**: Click the sidebar title area to toggle collapsed state and confirm active item remains highlighted.

### Implementation for User Story 2

- [ ] T024 [US2] Add collapsed state handling in `frontend/src/components/layout/app-shell.tsx`
- [ ] T025 [US2] Implement title click toggle in `frontend/src/components/layout/sidebar.tsx`
- [ ] T026 [US2] Add collapsed styles and icon-only mode in `frontend/src/components/layout/sidebar.tsx`

**Checkpoint**: User Stories 1 and 2 work together without regressions

---

## Phase 5: User Story 3 - View Header Mock Info (Priority: P3)

**Goal**: Header displays admin avatar with random photo and alerts icon.

**Independent Test**: Load any page and confirm avatar image and alerts icon are visible with no actions.

### Implementation for User Story 3

- [ ] T027 [US3] Add mock user avatar display in `frontend/src/components/layout/header.tsx`
- [ ] T028 [US3] Add alerts icon display in `frontend/src/components/layout/header.tsx`
- [ ] T029 [US3] Style header elements with shadcn/ui components in `frontend/src/components/layout/header.tsx`

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T030 [P] Apply consistent shadows and accent buttons across layout in `frontend/src/styles/globals.css`
- [ ] T031 [P] Align sidebar colors with palette in `frontend/src/components/layout/sidebar.tsx`
- [ ] T032 Update quickstart instructions if scaffolded outputs differ in `specs/001-fams-demo-app/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)

### Within Each User Story

- Layout structure before route wiring
- Routes before active state styling
- Core implementation before visual polish

### Parallel Opportunities

- T003-T007 can run in parallel after T001/T002
- T008-T012 can run in parallel after setup
- T013-T018 can run in parallel after setup
- T020 can run in parallel with T022 once foundation is ready

---

## Parallel Example: User Story 1

```bash
Task: "Create route files for five pages in frontend/src/app/vehicles/page.tsx, frontend/src/app/users/page.tsx, frontend/src/app/scheduler/page.tsx, frontend/src/app/radar/page.tsx, frontend/src/app/statistics/page.tsx"
Task: "Implement sidebar navigation links and active state styles in frontend/src/components/layout/sidebar.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Verify navigation and default landing page
