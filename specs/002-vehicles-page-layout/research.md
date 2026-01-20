# Phase 0 Research: Vehicles Page Layout

## Decision 1: Local image storage with relative paths

**Decision**: Store uploaded vehicle images on the backend filesystem and persist relative paths in the database. On delete, remove the file and DB row together.

**Rationale**: Matches the requirement to store images locally while keeping DB references portable across environments. Cleaning up files on image deletion avoids orphaned storage.

**Alternatives considered**:
- Store images as base64 in DB (increases DB size, slower reads).
- Use external object storage (conflicts with “store locally” requirement).

## Decision 2: REST endpoints for image upload/delete

**Decision**: Use REST endpoints with multipart uploads for adding images and a dedicated delete endpoint for removing images.

**Rationale**: Multipart upload is a standard, reliable approach for file transfer; dedicated delete provides clear lifecycle control.

**Alternatives considered**:
- Encode images in JSON payloads (inefficient, size limits).
- Combine image updates into vehicle update payload (complicates validation and file handling).

## Decision 3: TanStack React Query for list/detail data

**Decision**: Use TanStack React Query for vehicles list, detail fetch, and mutations with cache invalidation on create/update/delete.

**Rationale**: Provides consistent caching, loading, and error handling for list/detail flows and reduces manual state management.

**Alternatives considered**:
- Local state + custom fetch hooks (more manual state work, higher inconsistency risk).
- Global store (overkill for CRUD-heavy page).
