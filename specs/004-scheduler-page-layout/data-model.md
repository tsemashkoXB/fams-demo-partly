# Data Model: Scheduler Page Layout

**Feature**: 004-scheduler-page-layout  
**Date**: 2026-02-02

## Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────────────┐     ┌─────────────────┐
│     VEHICLE     │     │        BOOKING          │     │      USER       │
├─────────────────┤     ├─────────────────────────┤     ├─────────────────┤
│ id (PK)         │───┐ │ id (PK)                 │ ┌───│ id (PK)         │
│ plate_number    │   │ │ vehicle_id (FK)         │←┘   │ name            │
│ model_name      │   └→│ user_id (FK)            │     │ surname         │
│ type            │     │ status                  │     │ ...             │
│ ...             │     │ start_time              │     └─────────────────┘
└─────────────────┘     │ end_time                │
                        │ description             │
                        │ created_at              │
                        │ updated_at              │
                        └─────────────────────────┘
```

## Booking Entity

### Schema Definition

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Unique identifier |
| vehicle_id | BIGINT | NOT NULL, FK → vehicles(id) ON DELETE CASCADE | Referenced vehicle |
| user_id | BIGINT | NOT NULL, FK → users(id) ON DELETE CASCADE | Assigned user |
| status | TEXT | NOT NULL, DEFAULT 'In work' | 'In work' or 'Service' |
| start_time | TIMESTAMPTZ | NOT NULL | Booking start (inclusive) |
| end_time | TIMESTAMPTZ | NOT NULL | Booking end (exclusive) |
| description | TEXT | NULL | Optional notes |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last modification time |

### Indexes

| Name | Columns | Purpose |
|------|---------|---------|
| bookings_pkey | id | Primary key |
| bookings_vehicle_id_idx | vehicle_id | Filter by vehicle |
| bookings_user_id_idx | user_id | Filter by user |
| bookings_vehicle_time_idx | (vehicle_id, start_time, end_time) | Overlap detection |
| bookings_time_range_idx | (start_time, end_time) | Time range queries |

### Constraints

```sql
CONSTRAINT bookings_status_check 
  CHECK (status IN ('In work', 'Service'))

CONSTRAINT bookings_time_order_check 
  CHECK (end_time > start_time)
```

### TypeScript Entity

```typescript
// backend/src/modules/bookings/entities/booking.entity.ts

export const bookingStatuses = ['In work', 'Service'] as const;
export type BookingStatus = (typeof bookingStatuses)[number];

export type Booking = {
  id: number;
  vehicleId: number;
  userId: number;
  status: BookingStatus;
  startTime: string;  // ISO 8601 timestamp
  endTime: string;    // ISO 8601 timestamp
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

// Extended type with joined data for frontend
export type BookingWithDetails = Booking & {
  vehicle: {
    id: number;
    plateNumber: string;
    modelName: string;
    type: string;
  };
  user: {
    id: number;
    name: string;
    surname: string;
  };
};
```

## Computed Status: Available

The "Available" status is **not stored** in the database. It is computed as:

```typescript
// A vehicle is available during a time range if no bookings overlap that range
function isVehicleAvailable(
  vehicleId: number,
  bookings: Booking[],
  rangeStart: Date,
  rangeEnd: Date
): boolean {
  return !bookings.some(
    (b) =>
      b.vehicleId === vehicleId &&
      new Date(b.startTime) < rangeEnd &&
      new Date(b.endTime) > rangeStart
  );
}
```

## Existing Entities (Reference)

### Vehicle (from 002-vehicles-page-layout)

Key fields used by scheduler:
- `id`: Reference in booking
- `plate_number`: Display in vehicle list
- `model_name`: Display in vehicle list  
- `type`: Filter and display (PC, Pass Van, Van, CV, Bus)
- `images`: First image thumbnail in scheduler list

### User (from 003-users-page-layout)

Key fields used by scheduler:
- `id`: Reference in booking
- `name`: Display assigned user
- `surname`: Display assigned user
- `status`: Filter active users for assignment

## Validation Rules

### Booking Form Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| vehicle_id | Required, must exist | "Vehicle is required" |
| user_id | Required, must exist | "User is required" |
| start_time | Required, valid datetime | "Start time is required" |
| end_time | Required, valid datetime, > start_time | "End time must be after start time" |
| overlap | No overlapping bookings for same vehicle | "Time conflict: Vehicle is already booked from {start} to {end}" |

### Server-Side Validation

Overlap check query:
```sql
SELECT id, start_time, end_time
FROM bookings
WHERE vehicle_id = $1
  AND id != $2  -- Exclude current booking when editing
  AND start_time < $4  -- proposed end_time
  AND end_time > $3    -- proposed start_time
LIMIT 1;
```

## State Transitions

Bookings do not have state transitions beyond CRUD:
- **Create**: New booking with status 'In work' or 'Service'
- **Update**: Modify any field (with validation)
- **Delete**: Remove booking (with confirmation)

## Data Volume Estimates

| Entity | Expected Records | Growth Rate |
|--------|------------------|-------------|
| Vehicles | ~500 max | Low (fleet size) |
| Users | ~100 | Low |
| Bookings | ~10,000/year | ~40/day average |
