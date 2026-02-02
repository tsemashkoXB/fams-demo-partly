# Tasks: Scheduler Page Layout

**Input**: Design documents from `/specs/004-scheduler-page-layout/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml

**Tests**: None (per constitution - no automated tests unless explicitly requested)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project structure and module scaffolding

- [ ] T001 [P] Create backend bookings module folder structure in backend/src/modules/bookings/
- [ ] T002 [P] Create frontend scheduler components folder structure in frontend/src/components/scheduler/
- [ ] T003 [P] Create scheduler utilities file in frontend/src/lib/scheduler-utils.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database, entities, and API infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database & Entities

- [ ] T004 Create bookings table migration in backend/src/migrations/007_create_bookings_table.ts
- [ ] T005 Create seed migration with 20 demo bookings in backend/src/migrations/008_seed_bookings.ts
- [ ] T006 [P] Create booking entity types in backend/src/modules/bookings/entities/booking.entity.ts

### Backend API Layer

- [ ] T007 Implement bookings repository with CRUD and overlap check in backend/src/modules/bookings/bookings.repository.ts
- [ ] T008 Implement bookings service with validation logic in backend/src/modules/bookings/bookings.service.ts
- [ ] T009 Implement bookings controller with all endpoints per OpenAPI spec in backend/src/modules/bookings/bookings.controller.ts
- [ ] T010 Create bookings module and register in app.module.ts in backend/src/modules/bookings/bookings.module.ts

### Frontend Data Layer

- [ ] T011 [P] Create booking types in frontend/src/types/booking.ts (or co-locate with service)
- [ ] T012 Implement bookings service with TanStack Query hooks in frontend/src/services/bookings.ts

**Checkpoint**: Foundation ready - API endpoints functional, frontend can fetch bookings

---

## Phase 3: User Story 1 - View vehicle schedule timeline (Priority: P1) 🎯 MVP

**Goal**: Display scheduler page with vehicle list and timeline showing booking events

**Independent Test**: Navigate to /scheduler, see list of vehicles with their timeline, events display as colored bars

### Implementation for User Story 1

- [ ] T013 [US1] Create scheduler page in frontend/src/app/scheduler/page.tsx
- [ ] T014 [US1] Create scheduler layout component (two-column) in frontend/src/components/scheduler/scheduler-layout.tsx
- [ ] T015 [P] [US1] Create vehicle row component showing image, name, plate, type in frontend/src/components/scheduler/vehicle-row.tsx
- [ ] T016 [P] [US1] Create event bar component with status colors in frontend/src/components/scheduler/event-bar.tsx (handle events spanning view boundaries - clip at edges)
- [ ] T017 [US1] Create scheduler timeline component with CSS Grid in frontend/src/components/scheduler/scheduler-timeline.tsx
- [ ] T018 [US1] Create timeline header component (static mode display) in frontend/src/components/scheduler/timeline-header.tsx
- [ ] T019 [US1] Implement timeline column generation helpers in frontend/src/lib/scheduler-utils.ts
- [ ] T020 [US1] Wire up bookings data fetching and display in scheduler page

**Checkpoint**: User Story 1 complete - scheduler displays vehicles with booking events in Day mode (default)

---

## Phase 4: User Story 2 - Navigate timeline and switch view modes (Priority: P2)

**Goal**: Users can switch between Day/Week/Month views and navigate through time periods

**Independent Test**: Click Day/Week/Month toggle, timeline updates; click arrows to navigate; click Today to return to current date

### Implementation for User Story 2

- [ ] T021 [US2] Add view mode state and segmented control to timeline header in frontend/src/components/scheduler/timeline-header.tsx
- [ ] T022 [US2] Implement navigation arrows (prev/next) with mode-specific increments in frontend/src/components/scheduler/timeline-header.tsx
- [ ] T023 [US2] Implement Today button navigation in frontend/src/components/scheduler/timeline-header.tsx
- [ ] T024 [US2] Update timeline column generation for Week and Month modes in frontend/src/lib/scheduler-utils.ts
- [ ] T025 [US2] Update scheduler timeline to handle all view modes in frontend/src/components/scheduler/scheduler-timeline.tsx (filter events to visible range, handle partial visibility)
- [ ] T026 [US2] Update event bar display logic (text in Day/Week, bars only in Month) in frontend/src/components/scheduler/event-bar.tsx

**Checkpoint**: User Story 2 complete - all view modes work, navigation is functional

---

## Phase 5: User Story 3 - Filter vehicles in the scheduler (Priority: P3)

**Goal**: Users can filter vehicles using search, status, type, and availability filters

**Independent Test**: Type in search to filter by name; check status filters; select vehicle type; set date range with "Available" checkbox to filter available vehicles

### Implementation for User Story 3

- [ ] T027 [US3] Create filter panel component skeleton in frontend/src/components/scheduler/filter-panel.tsx
- [ ] T028 [US3] Implement search input with debounced filtering in frontend/src/components/scheduler/filter-panel.tsx (search by vehicle model name only, case-insensitive)
- [ ] T029 [US3] Implement status filter checkboxes (In work, Service, Available) in frontend/src/components/scheduler/filter-panel.tsx (Available = vehicles with any available time in visible period)
- [ ] T030 [US3] Implement vehicle type filter select in frontend/src/components/scheduler/filter-panel.tsx
- [ ] T031 [US3] Implement period date range picker in frontend/src/components/scheduler/filter-panel.tsx
- [ ] T032 [US3] Implement "Available during period" checkbox with server query in frontend/src/components/scheduler/filter-panel.tsx
- [ ] T033 [US3] Implement Clear filters button in frontend/src/components/scheduler/filter-panel.tsx
- [ ] T034 [US3] Integrate filter state with scheduler timeline display in frontend/src/components/scheduler/scheduler-layout.tsx

**Checkpoint**: User Story 3 complete - all filter controls work, empty state shows when no matches

---

## Phase 6: User Story 4 - Use calendar to jump to a specific date (Priority: P4)

**Goal**: Users can toggle a calendar widget and select a date to navigate to Day mode

**Independent Test**: Click "Show calendar" toggle, calendar appears; select a date, scheduler shows that day in Day mode; toggle again to hide calendar

### Implementation for User Story 4

- [ ] T035 [US4] Create scheduler calendar component with Figma styling in frontend/src/components/scheduler/scheduler-calendar.tsx
- [ ] T036 [US4] Implement "Show calendar" toggle button in frontend/src/components/scheduler/filter-panel.tsx
- [ ] T037 [US4] Implement calendar date selection → Day mode navigation in frontend/src/components/scheduler/filter-panel.tsx

**Checkpoint**: User Story 4 complete - calendar toggle and date selection work

---

## Phase 7: User Story 5 - Create a new booking (Priority: P5)

**Goal**: Users can create new bookings via a popup form

**Independent Test**: Click "New booking" button, popup opens; fill form fields and save, booking appears on timeline; close without saving, no booking created

### Implementation for User Story 5

- [ ] T038 [US5] Create booking popup component with form fields in frontend/src/components/scheduler/booking-popup.tsx
- [ ] T039 [US5] Implement booking form validation (inline errors) in frontend/src/components/scheduler/booking-popup.validation.ts
- [ ] T040 [US5] Implement "New booking" button in filter panel in frontend/src/components/scheduler/filter-panel.tsx
- [ ] T041 [US5] Implement create booking mutation with optimistic update in frontend/src/services/bookings.ts
- [ ] T042 [US5] Implement overlap error handling (409 Conflict) display in popup in frontend/src/components/scheduler/booking-popup.tsx

**Checkpoint**: User Story 5 complete - can create bookings, overlap prevention works

---

## Phase 8: User Story 6 - Edit or delete an existing booking (Priority: P6)

**Goal**: Users can edit or delete bookings by double-clicking events

**Independent Test**: Double-click event, popup opens with pre-filled data; modify and save, booking updates; click Delete, confirm, booking removed

### Implementation for User Story 6

- [ ] T043 [US6] Implement double-click handler on event bar to open popup in frontend/src/components/scheduler/event-bar.tsx
- [ ] T044 [US6] Implement edit mode in booking popup (pre-fill form, show Delete button) in frontend/src/components/scheduler/booking-popup.tsx
- [ ] T045 [US6] Implement update booking mutation in frontend/src/services/bookings.ts
- [ ] T046 [US6] Implement delete booking mutation with confirmation dialog in frontend/src/components/scheduler/booking-popup.tsx

**Checkpoint**: User Story 6 complete - full CRUD operations work on bookings

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Visual polish and improvements that affect multiple user stories

- [ ] T047 [P] Add status color legend to timeline header in frontend/src/components/scheduler/timeline-header.tsx
- [ ] T048 [P] Add current date/time indicator on timeline in frontend/src/components/scheduler/scheduler-timeline.tsx
- [ ] T049 [P] Add memoization for timeline calculations in frontend/src/lib/scheduler-utils.ts
- [ ] T050 [P] Add React.memo to vehicle rows and event bars for performance in frontend/src/components/scheduler/vehicle-row.tsx and event-bar.tsx
- [ ] T051 Run ESLint and Prettier on all new files
- [ ] T052 Validate feature against quickstart.md scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5 → P6)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Priority | Depends On | Can Parallel With |
|-------|----------|------------|-------------------|
| US1 - View timeline | P1 | Foundational | None (MVP first) |
| US2 - Navigation | P2 | Foundational | US1 (but builds on it) |
| US3 - Filtering | P3 | Foundational | US1, US2 |
| US4 - Calendar | P4 | Foundational, US3 (filter panel) | US5, US6 |
| US5 - Create booking | P5 | Foundational | US3, US4 |
| US6 - Edit/Delete | P6 | US5 (booking popup) | - |

### Within Each User Story

- Core components before integration
- Layout before details
- State management before UI polish
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks (T001-T003) can all run in parallel
- Foundational: T006, T011 can run in parallel with T004-T005
- US1: T015, T016 can run in parallel (different components)
- US3: Filter controls can be developed in parallel
- Polish: T047-T050 can all run in parallel

---

## Parallel Example: User Story 1

```bash
# After Foundational is complete, launch in parallel:
Task: "Create vehicle row component in frontend/src/components/scheduler/vehicle-row.tsx"
Task: "Create event bar component in frontend/src/components/scheduler/event-bar.tsx"

# Then sequentially:
Task: "Create scheduler timeline component in frontend/src/components/scheduler/scheduler-timeline.tsx"
Task: "Wire up bookings data fetching and display"
```

---

## Parallel Example: User Story 3 (Filters)

```bash
# Filter controls can be developed in parallel:
Task: "Implement search input with debounced filtering"
Task: "Implement status filter checkboxes"
Task: "Implement vehicle type filter select"
Task: "Implement period date range picker"

# Then integrate:
Task: "Integrate filter state with scheduler timeline display"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T012)
3. Complete Phase 3: User Story 1 (T013-T020)
4. **STOP and VALIDATE**: Scheduler displays vehicles with events
5. Deploy/demo if ready

### Incremental Delivery

| Increment | Stories | Deliverable |
|-----------|---------|-------------|
| MVP | US1 | View vehicle schedule timeline |
| v1.1 | US1 + US2 | Add navigation and view modes |
| v1.2 | US1-3 | Add filtering |
| v1.3 | US1-4 | Add calendar navigation |
| v1.4 | US1-5 | Add booking creation |
| v2.0 | US1-6 | Full CRUD operations |

### Recommended Sequence

1. **Day 1**: Setup + Foundational (T001-T012)
2. **Day 2**: User Story 1 (T013-T020) → MVP complete
3. **Day 3**: User Story 2 (T021-T026) → Navigation working
4. **Day 4**: User Story 3 (T027-T034) → Filters working
5. **Day 5**: User Stories 4-6 (T035-T046) → Full feature
6. **Day 6**: Polish (T047-T052) → Production ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No tests included (per constitution)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Figma calendar styling tokens are documented in plan.md
