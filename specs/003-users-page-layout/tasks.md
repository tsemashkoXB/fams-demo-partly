---
description: "Task list for Users Page Layout"
---

# Tasks: Users Page Layout

**Input**: Design documents from `/specs/003-users-page-layout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested (do not add tests).

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create feature folders and align with existing image upload patterns

- [ ] T001 Review image upload pattern in `backend/src/modules/vehicles/vehicle-images.controller.ts`
- [ ] T002 Review image upload pattern in `frontend/src/services/vehicles.ts`
- [ ] T003 [P] Create users module folder structure in `backend/src/modules/users/`
- [ ] T004 [P] Create users UI folder structure in `frontend/src/components/users/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema, entities, and core backend scaffolding

- [ ] T005 Create users table migration in `backend/src/migrations/004_create_users_tables.ts`
- [ ] T006 Create user images table migration in `backend/src/migrations/005_create_user_images_tables.ts`
- [ ] T007 Create seed migration with 5 demo users in `backend/src/migrations/006_seed_users.ts`
- [ ] T008 Create User entity definition in `backend/src/modules/users/entities/user.entity.ts`
- [ ] T009 Create UserImage entity definition in `backend/src/modules/users/entities/user-image.entity.ts`
- [ ] T010 Implement users repository (base queries + mapping) in `backend/src/modules/users/users.repository.ts`
- [ ] T011 Implement users service (list/detail + image helpers) in `backend/src/modules/users/users.service.ts`
- [ ] T012 Create users module wiring in `backend/src/modules/users/users.module.ts`
- [ ] T013 Register UsersModule in `backend/src/app.module.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Browse and select a user (Priority: P1) 🎯 MVP

**Goal**: Display the users table and a selectable, fixed-width detail panel with edit mode and image upload/remove

**Independent Test**: Users list renders from API, selecting a row updates the detail panel, edit mode saves changes, image upload/remove works

### Implementation for User Story 1

- [ ] T014 [P] Add users list/detail endpoints in `backend/src/modules/users/users.controller.ts`
- [ ] T015 [P] Add users update endpoint in `backend/src/modules/users/users.controller.ts`
- [ ] T016 [P] Add user image upload/delete endpoints in `backend/src/modules/users/user-images.controller.ts`
- [ ] T017 Implement users update persistence in `backend/src/modules/users/users.service.ts`
- [ ] T018 Implement image file handling using existing pattern in `backend/src/modules/users/user-images.service.ts`
- [ ] T019 [P] Add users API client in `frontend/src/services/users.ts`
- [ ] T020 [P] Add user images API client in `frontend/src/services/user-images.ts`
- [ ] T021 [P] Add users React Query hooks in `frontend/src/services/users.queries.ts`
- [ ] T022 Build users page shell layout (title, search, Add User button) in `frontend/src/app/users/page.tsx`
- [ ] T023 Build users table component with selection state in `frontend/src/components/users/users-table.tsx`
- [ ] T024 Build details panel main section (header, image, fields) in `frontend/src/components/users/user-details-panel.tsx`
- [ ] T025 Add Edit button and edit-mode state in `frontend/src/components/users/user-details-panel.tsx`
- [ ] T026 Build editable form fields and Save action in `frontend/src/components/users/user-edit-form.tsx`
- [ ] T027 Add inline validation rules and messages in `frontend/src/components/users/user-edit-validation.ts`
- [ ] T028 Add image upload/remove UI in `frontend/src/components/users/user-image-upload.tsx`
- [ ] T029 Apply primary image selection (highest displayOrder) in `frontend/src/components/users/user-details-panel.tsx`

---

## Phase 4: User Story 2 - Search the list by any field (Priority: P2)

**Goal**: Live, debounced search across all visible columns

**Independent Test**: Typing filters rows by case-insensitive substring match and shows no-results state

### Implementation for User Story 2

- [ ] T030 Implement search filtering in repository query in `backend/src/modules/users/users.repository.ts`
- [ ] T031 Add debounced search input and query param wiring in `frontend/src/components/users/users-search.tsx`
- [ ] T032 Integrate search state into page list query in `frontend/src/app/users/page.tsx`
- [ ] T033 Add no-results state styling in `frontend/src/components/users/users-table.tsx`

---

## Phase 5: User Story 3 - Review contacts, documents, and warnings (Priority: P3)

**Goal**: Show Contacts and Docs sections plus derived warnings for selected user

**Independent Test**: Contacts/Docs render in two-column layout; warnings display based on dates

### Implementation for User Story 3

- [ ] T034 Ensure contact/doc fields are mapped in API responses in `backend/src/modules/users/users.repository.ts`
- [ ] T035 Build Contacts section fields in `frontend/src/components/users/user-contacts-section.tsx`
- [ ] T036 Build Docs section fields and tags in `frontend/src/components/users/user-docs-section.tsx`
- [ ] T037 Add warning derivation helpers with 30-day thresholds in `frontend/src/components/users/user-warnings.ts`
- [ ] T038 Render warnings below sections in `frontend/src/components/users/user-details-panel.tsx`
- [ ] T039 Ensure missing optional fields render as empty values in `frontend/src/components/users/user-details-panel.tsx`
- [ ] T040 Ensure missing optional fields render empty in contacts/docs sections in `frontend/src/components/users/user-contacts-section.tsx`
- [ ] T041 Ensure missing optional fields render empty in contacts/docs sections in `frontend/src/components/users/user-docs-section.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final verification

- [ ] T042 Run quickstart verification steps from `specs/003-users-page-layout/quickstart.md`
- [ ] T043 Perform manual performance check (1s search, 500ms detail) in `specs/003-users-page-layout/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational - no dependencies
- **US2 (P2)**: Starts after Foundational; integrates with US1 list UI
- **US3 (P3)**: Starts after Foundational; integrates with US1 details panel

---

## Parallel Execution Examples

### User Story 1

- T014, T015, and T016 can run in parallel (different controllers)
- T019, T020, and T021 can run in parallel (different frontend service files)
- T023 and T024 can run in parallel (table vs details panel components)
- T026 and T027 can run in parallel (form vs validation rules)

### User Story 2

- T029 can run in parallel with T030 (backend query vs frontend input)

### User Story 3

- T034 and T035 can run in parallel (separate UI sections)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2
2. Complete Phase 3
3. Validate US1 independent test

### Incremental Delivery

1. US1 → validate
2. US2 → validate
3. US3 → validate
