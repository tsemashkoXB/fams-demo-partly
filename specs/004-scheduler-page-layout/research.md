# Research: Scheduler Page Layout

**Feature**: 004-scheduler-page-layout  
**Date**: 2026-02-02

## Design Decisions

### 1. Timeline Component Architecture

**Decision**: Build custom timeline component using CSS Grid with Tailwind classes.

**Rationale**:
- No external scheduler library required - keeps bundle size small
- Full control over styling to match existing design system
- CSS Grid provides natural time slot alignment and responsive behavior
- Better integration with existing shadcn/ui component patterns

**Alternatives Considered**:
- `react-big-calendar`: Overkill for this use case, brings complex theming system
- `fullcalendar`: Heavy dependency, would require significant customization
- `@tanstack/react-table`: Designed for tabular data, not timeline visualization

### 2. View Mode Implementation

**Decision**: Single timeline component with view mode prop controlling column generation.

**Rationale**:
- Day mode: 24 columns (hours 00:00-23:00)
- Week mode: 7 columns (days Sun-Sat)
- Month mode: 28-31 columns (days of month, narrower width)
- Same component handles all modes with different column configs
- Reduces code duplication and maintains consistent behavior

**Alternatives Considered**:
- Separate components per view: Would duplicate logic and be harder to maintain
- Virtual scrolling: Not needed for 500 vehicles max with pagination/filtering

### 3. Available Status Computation

**Decision**: Compute availability on the frontend by analyzing booking gaps.

**Rationale**:
- Per spec: "Available status is computed" (not stored in DB)
- Frontend receives bookings for visible time range
- Gaps between bookings = available slots
- No server-side computation needed for display
- Filter "Available during period" requires server query for efficiency

**Alternatives Considered**:
- Materialized availability table: Adds complexity, sync issues
- Real-time server computation: Unnecessary network overhead

### 4. Calendar Styling (Figma Integration)

**Decision**: Create `SchedulerCalendar` component wrapping `react-day-picker` with Figma styles.

**Rationale**:
- Existing `Calendar` component uses react-day-picker
- Apply Figma design tokens via Tailwind classes
- Glassmorphism effect (blur, gradient) for modern look
- Maintain consistency with existing codebase patterns

**Implementation Details**:
- Container: 8px border radius, 24px padding, gradient background with backdrop blur
- Header: Arrow icons, month/year title in 14px semibold
- Day labels: 10px uppercase (SUN, MON, TUE...)
- Date cells: 30x30px, selected state with #2F6FED background
- Week starts on Sunday per Figma design

### 5. Booking Status Mapping

**Decision**: Use "In work" and "Service" as booking statuses, stored in `status` enum.

**Rationale**:
- Per spec: Events have statuses "In work" or "Service"
- Service checkbox in form determines status
- Default (unchecked) = "In work"
- Checked = "Service"
- Maps to distinct colors on timeline

**Color Scheme**:
- In work: Blue (#2F6FED) - matches primary color
- Service: Amber/Orange (#F59E0B) - distinct warning color
- Available: (no bar, white/transparent background)

### 6. Booking Overlap Prevention

**Decision**: Server-side validation with clear error response.

**Rationale**:
- Per spec: "Prevent save and show error message indicating the time conflict"
- Backend checks for overlapping bookings on same vehicle
- Returns 409 Conflict with overlapping booking details
- Frontend displays inline error in popup form
- Prevents race conditions vs client-only validation

### 7. Filter Panel State Management

**Decision**: Use React state with URL query params for shareable filters.

**Rationale**:
- Local state for immediate UI feedback
- Sync to URL params for bookmarkable filter states
- Debounced search (300ms) to reduce API calls
- TanStack Query handles caching and deduplication

**Filter Interactions**:
- Date range alone: No effect on scheduler (per spec)
- Date range + "Available during period": Server query for available vehicles
- Status checkboxes: Client-side filter of visible vehicles
- Vehicle type: Client-side filter
- Search: Client-side filter by vehicle name

### 8. Database Schema Design

**Decision**: Single `bookings` table with foreign keys to users and vehicles.

**Rationale**:
- Per entity diagram: BOOKING has user_id FK and vehicle_id FK
- Start/end times stored as TIMESTAMPTZ for timezone handling
- Status stored as TEXT enum for flexibility
- Description as TEXT for notes
- Supports existing migration pattern

**Table Structure**:
```sql
bookings (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'In work',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
```

### 9. Timeline Navigation

**Decision**: Controlled date state with navigation functions.

**Rationale**:
- `currentDate` state represents the anchor date for current view
- Today button sets to current date
- Arrows add/subtract based on view mode:
  - Day: ±1 day
  - Week: ±7 days
  - Month: ±1 month (using date-fns `addMonths`)
- Calendar selection sets date and switches to Day mode

### 10. Event Bar Display Logic

**Decision**: Conditional rendering based on view mode.

**Rationale**:
- Day/Week modes: Show date range + assigned user name on bar
- Month mode: Show only colored bar (no text)
- Text truncation with ellipsis for long names
- Tooltip on hover for full details
- Double-click opens edit popup

## Dependencies

**No new dependencies required** - using existing:
- `react-day-picker` v9 - calendar widget
- `date-fns` v3 - date manipulation
- `@tanstack/react-query` v5 - data fetching
- Tailwind CSS v4 - styling

## Performance Considerations

1. **Virtual scrolling**: Not implemented initially; revisit if performance issues with 500 vehicles
2. **Memoization**: Use `useMemo` for timeline calculations, `React.memo` for vehicle rows
3. **Query optimization**: Backend query includes vehicle data (JOIN) to avoid N+1
4. **Date range queries**: Index on `(vehicle_id, start_time, end_time)` for efficient overlap checks
