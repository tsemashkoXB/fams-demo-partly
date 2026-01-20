---
description: "Task list for Vehicles Page Layout"
---

# Tasks: Vehicles Page Layout

**Input**: Design documents from `/specs/002-vehicles-page-layout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated tests requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency setup

- [ ] T001 Add backend database dependencies in `backend/package.json`
- [ ] T002 Add TanStack React Query in `frontend/package.json`
- [ ] T003 [P] Create vehicles feature directories in `backend/src/modules/vehicles/`
- [ ] T004 [P] Create vehicles UI directories in `frontend/src/components/vehicles/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T005 Configure backend database connection in `backend/src/config/database.ts`
- [ ] T006 Add database module wiring in `backend/src/modules/database/database.module.ts`
- [ ] T007 Create migration for vehicle tables in `backend/src/migrations/001_create_vehicles_tables.ts`
- [ ] T008 Create migration for seed data (5 vehicles) in `backend/src/migrations/002_seed_vehicles.ts`
- [ ] T009 Add migration runner scripts in `backend/package.json`
- [ ] T010 Create image storage path config in `backend/src/config/uploads.ts`
- [ ] T011 Add manage-permission guard stub in `backend/src/auth/manage-permission.guard.ts`
- [ ] T012 Add vehicles module entry in `backend/src/modules/vehicles/vehicles.module.ts`
- [ ] T013 [P] Create Vehicle entity in `backend/src/modules/vehicles/entities/vehicle.entity.ts`
- [ ] T014 [P] Create VehicleImage entity in `backend/src/modules/vehicles/entities/vehicle-image.entity.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Browse and select vehicles (Priority: P1) 🎯 MVP

**Goal**: List vehicles, search by any column, and select a row to load details.

**Independent Test**: User can search the table and selecting a row updates the details panel.

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement list/search endpoint in `backend/src/modules/vehicles/vehicles.controller.ts`
- [ ] T016 [US1] Add list/search service logic in `backend/src/modules/vehicles/vehicles.service.ts`
- [ ] T017 [P] [US1] Add list query data access in `backend/src/modules/vehicles/vehicles.repository.ts`
- [ ] T018 [P] [US1] Create vehicles query hooks in `frontend/src/services/vehicles/queries.ts`
- [ ] T019 [US1] Build vehicles page shell in `frontend/src/app/vehicles/page.tsx`
- [ ] T020 [P] [US1] Implement table UI in `frontend/src/components/vehicles/vehicles-table.tsx`
- [ ] T021 [US1] Wire search input to query in `frontend/src/components/vehicles/vehicles-search.tsx`
- [ ] T022 [US1] Add selection state + auto-select logic in `frontend/src/app/vehicles/page.tsx`

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Review vehicle details (Priority: P2)

**Goal**: Display vehicle details, images, characteristics, documentation, and warnings.

**Independent Test**: Selecting a vehicle shows all detail sections and warnings based on thresholds.

### Implementation for User Story 2

- [ ] T023 [P] [US2] Implement detail endpoint in `backend/src/modules/vehicles/vehicles.controller.ts`
- [ ] T024 [US2] Add detail service logic in `backend/src/modules/vehicles/vehicles.service.ts`
- [ ] T025 [P] [US2] Create details query hook in `frontend/src/services/vehicles/queries.ts`
- [ ] T026 [P] [US2] Build details panel layout in `frontend/src/components/vehicles/vehicle-details-panel.tsx`
- [ ] T027 [P] [US2] Build image carousel display in `frontend/src/components/vehicles/vehicle-images.tsx`
- [ ] T028 [P] [US2] Implement warnings evaluation in `frontend/src/services/vehicles/warnings.ts`
- [ ] T029 [US2] Render characteristics and documentation sections in `frontend/src/components/vehicles/vehicle-sections.tsx`

**Checkpoint**: User Story 2 fully functional and testable independently

---

## Phase 5: User Story 3 - Edit vehicle details (Priority: P3)

**Goal**: Enable edit mode with inline validation, image upload/delete, and save/cancel.

**Independent Test**: User can edit fields, upload/remove images, save changes, or cancel without changes persisting.

### Implementation for User Story 3

- [ ] T030 [P] [US3] Implement update endpoint in `backend/src/modules/vehicles/vehicles.controller.ts`
- [ ] T031 [US3] Add update service logic in `backend/src/modules/vehicles/vehicles.service.ts`
- [ ] T032 [P] [US3] Implement image upload endpoint in `backend/src/modules/vehicles/vehicle-images.controller.ts`
- [ ] T033 [P] [US3] Implement image delete endpoint in `backend/src/modules/vehicles/vehicle-images.controller.ts`
- [ ] T034 [US3] Add image service logic in `backend/src/modules/vehicles/vehicle-images.service.ts`
- [ ] T035 [P] [US3] Create mutation hooks in `frontend/src/services/vehicles/mutations.ts`
- [ ] T036 [US3] Build editable form with inline validation in `frontend/src/components/vehicles/vehicle-form.tsx`
- [ ] T037 [P] [US3] Add validation schema in `frontend/src/components/vehicles/vehicle-form.validation.ts`
- [ ] T038 [US3] Add edit-mode overlay and disable selection in `frontend/src/app/vehicles/page.tsx`
- [ ] T039 [P] [US3] Add image upload/remove controls in `frontend/src/components/vehicles/vehicle-images-editor.tsx`

**Checkpoint**: User Story 3 fully functional and testable independently

---

## Phase 6: User Story 4 - Add or delete a vehicle (Priority: P4)

**Goal**: Add new vehicles with an empty form and delete vehicles with confirmation.

**Independent Test**: User can add a vehicle, see it in the list, and delete a vehicle after confirming.

### Implementation for User Story 4

- [ ] T040 [P] [US4] Implement create endpoint in `backend/src/modules/vehicles/vehicles.controller.ts`
- [ ] T041 [P] [US4] Implement delete endpoint in `backend/src/modules/vehicles/vehicles.controller.ts`
- [ ] T042 [US4] Add create/delete service logic in `backend/src/modules/vehicles/vehicles.service.ts`
- [ ] T043 [US4] Add add-vehicle flow in `frontend/src/components/vehicles/vehicle-add-button.tsx`
- [ ] T044 [US4] Add delete confirmation UI in `frontend/src/components/vehicles/vehicle-delete-dialog.tsx`
- [ ] T045 [US4] Wire add/delete mutations and list refresh in `frontend/src/app/vehicles/page.tsx`

**Checkpoint**: User Story 4 fully functional and testable independently

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T046 [P] Ensure role-based UI disabling in `frontend/src/components/vehicles/vehicles-actions.tsx`
- [ ] T047 [P] Add empty state display in `frontend/src/components/vehicles/vehicles-empty-state.tsx`
- [ ] T048 [P] Run quickstart verification updates in `specs/002-vehicles-page-layout/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2)

### Parallel Opportunities

- Setup tasks T003-T004 can run in parallel
- Foundational entity tasks T013-T014 can run in parallel
- Per-story tasks marked [P] can run in parallel within each phase

---

## Parallel Example: User Story 1

```bash
# Run in parallel (different files):
Task: "Create vehicles query hooks in frontend/src/services/vehicles/queries.ts"
Task: "Implement table UI in frontend/src/components/vehicles/vehicles-table.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate search and selection behavior end-to-end

### Incremental Delivery

1. Foundation complete → User Story 1 → Validate
2. Add User Story 2 → Validate
3. Add User Story 3 → Validate
4. Add User Story 4 → Validate

