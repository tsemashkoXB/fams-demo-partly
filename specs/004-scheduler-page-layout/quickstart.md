# Quickstart: Scheduler Page Layout

**Feature**: 004-scheduler-page-layout  
**Date**: 2026-02-02

## Prerequisites

- Node.js 20 LTS
- PostgreSQL running (via Docker or local)
- Backend and frontend dependencies installed

## Quick Setup

### 1. Start the Database

```bash
# From project root
docker-compose up -d
```

### 2. Run Migrations

```bash
# From backend directory
cd backend
npm run migrate
```

This will create the `bookings` table and seed 20 demo bookings.

### 3. Start the Backend

```bash
# From backend directory
npm run start:dev
```

Backend runs at `http://localhost:3001`

### 4. Start the Frontend

```bash
# From frontend directory (new terminal)
cd frontend
npm run dev
```

Frontend runs at `http://localhost:3000`

### 5. Access the Scheduler

Navigate to `http://localhost:3000/scheduler`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /bookings | List bookings with filters |
| POST | /bookings | Create a booking |
| GET | /bookings/:id | Get booking by ID |
| PUT | /bookings/:id | Update a booking |
| DELETE | /bookings/:id | Delete a booking |
| GET | /bookings/available-vehicles | Get available vehicles for period |

### Example: List Bookings for a Date Range

```bash
curl "http://localhost:3001/bookings?startDate=2026-02-01T00:00:00Z&endDate=2026-02-28T23:59:59Z"
```

### Example: Create a Booking

```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": 1,
    "userId": 1,
    "startTime": "2026-02-15T09:00:00Z",
    "endTime": "2026-02-15T17:00:00Z",
    "description": "Delivery task"
  }'
```

### Example: Get Available Vehicles

```bash
curl "http://localhost:3001/bookings/available-vehicles?startDate=2026-02-15T08:00:00Z&endDate=2026-02-15T18:00:00Z"
```

## Key Components

### Frontend Components

| Component | Path | Description |
|-----------|------|-------------|
| SchedulerLayout | `components/scheduler/scheduler-layout.tsx` | Main two-column layout |
| FilterPanel | `components/scheduler/filter-panel.tsx` | Left panel with filters and calendar |
| SchedulerTimeline | `components/scheduler/scheduler-timeline.tsx` | Main timeline view |
| TimelineHeader | `components/scheduler/timeline-header.tsx` | View mode toggle and navigation |
| VehicleRow | `components/scheduler/vehicle-row.tsx` | Single vehicle timeline row |
| EventBar | `components/scheduler/event-bar.tsx` | Booking event visualization |
| BookingPopup | `components/scheduler/booking-popup.tsx` | Create/edit booking dialog |
| SchedulerCalendar | `components/scheduler/scheduler-calendar.tsx` | Figma-styled calendar widget |

### Backend Modules

| Module | Path | Description |
|--------|------|-------------|
| BookingsModule | `modules/bookings/` | NestJS module for booking CRUD |
| BookingsController | `modules/bookings/bookings.controller.ts` | REST endpoints |
| BookingsService | `modules/bookings/bookings.service.ts` | Business logic |
| BookingsRepository | `modules/bookings/bookings.repository.ts` | Database queries |

## View Modes

| Mode | Time Unit | Navigation | Event Display |
|------|-----------|------------|---------------|
| Day | Hour | ±1 day | Date range + user name |
| Week | Day | ±1 week | Date range + user name |
| Month | Day (narrow) | ±1 month | Color bar only |

## Status Colors

| Status | Color | Hex |
|--------|-------|-----|
| In work | Blue | #2F6FED |
| Service | Amber | #F59E0B |
| Available | (no bar) | - |

## Filter Controls

| Control | Type | Behavior |
|---------|------|----------|
| Search | Text input | Filters by vehicle name (client-side) |
| Status | Checkboxes | Filters vehicles with matching events |
| Vehicle Type | Select | Filters by vehicle type |
| Period + Available | Date range + checkbox | Server query for available vehicles |
| Show Calendar | Toggle | Shows/hides calendar widget |
| Calendar | Date picker | Selects date, switches to Day mode |
| Clear | Button | Resets all filters |

## Development Tips

### Testing the Timeline

1. Seed data includes 20 bookings spread across vehicles and dates
2. Use Day mode to see hourly granularity
3. Switch to Week/Month mode to see multi-day events
4. Double-click an event to open edit popup

### Testing Overlap Prevention

1. Try creating a booking that overlaps with an existing one
2. Backend returns 409 Conflict with details
3. Frontend shows error message in popup

### Testing Availability Filter

1. Select a date range in the period filter
2. Check "Available during the period" checkbox
3. Only vehicles without bookings in that range are shown
