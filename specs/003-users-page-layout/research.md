# Phase 0 Research: Users Page Layout

## Decision 1: User record holds driving categories as an array of enums

**Decision**: Store drivingCategories as an array of enum values on the user record.

**Rationale**: The categories are a bounded set, and the UI only needs to display tags. A single array field keeps the model simple for read-only usage.

**Alternatives considered**:
- Normalize into a join table (adds complexity without clear benefit for read-only display).
- Store as a comma-delimited string (harder to validate and query reliably).

## Decision 2: REST endpoints for list, detail, and image upload/delete

**Decision**: Provide GET /users for list/search, GET /users/{id} for detail, and POST/DELETE endpoints for user image upload/delete matching the existing image pattern.

**Rationale**: The UI is read-only for profile fields, and the existing image flow is already proven for file uploads. Reusing it keeps implementation consistent and low risk.

**Alternatives considered**:
- Single list endpoint only (works but complicates detail refresh if data changes).
- Full CRUD endpoints for user fields (out of scope for this layout-only feature).

## Decision 3: Local image storage with relative paths

**Decision**: Store uploaded user images on the backend filesystem and persist relative paths in the database.

**Rationale**: Matches the current vehicles image approach and keeps storage portable across environments.

**Alternatives considered**:
- Store images as base64 in DB (increases DB size, slower reads).
- Use external object storage (not aligned with current setup).

## Decision 4: Seed demo data via a migration

**Decision**: Add a migration to insert 5 demo users as initial data.

**Rationale**: Matches existing seed strategy and ensures predictable demo data without manual setup.

**Alternatives considered**:
- Ad-hoc SQL scripts (less repeatable and not tracked in migrations).
- On-demand seed endpoint (adds unnecessary API surface for this scope).
