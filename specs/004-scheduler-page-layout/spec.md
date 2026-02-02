# Feature Specification: Scheduler Page Layout

**Feature Branch**: `004-scheduler-page-layout`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "Layout for scheduler page - right part of layout contains scheduler for displaying vehicles statuses depending on time. Vehicle has one of the following status at each moment of time: Available, In work, Service. On scheduler we have list of vehicles, each item has image, vehicle name, plate number, type. And we have timeline with events, which have statuses: in work or service. If some time is empty (i.e. without event), vehicle at this time has status available. Each event is assigned on some user. Timeline can be displayed at one of the following modes: Day, Week, Month. In day mode a time unit is an hour, in week mode - a day, in month mode - also day, but unit is more narrow. In day and week modes on event bar we see the date range and assigned user. In month mode we see no info, just bars. On scheduler header we see today button and arrows to navigate. In day mode we navigate between days, in week mode - between weeks, in month mode - between months. On this header we see color notes about statuses. Left part of layout contains filter block of fixed size (near 300px). This block has button New booking, toggle button Show calendar, that show/hide calendar under the toggle button. Selecting date switch scheduler to day mode and display selected date. Next controls is search input, that filters scheduler list by vehicle name, status filter with checkboxes, vehicle type filter with select input, period filter with daterange input and checkbox - Available during the period. Selecting daterange do nothing with scheduler, but with checking checkbox it filters scheduler list by available vehicles during the selected period. There is ability to clear all filters."

## Clarifications

### Session 2026-02-01

- Q: How do users switch between Day, Week, and Month view modes? → A: Segmented control / toggle group in the scheduler header (Day | Week | Month).
- Q: What is the default view mode on initial page load? → A: Day mode (shows today's hourly schedule).
- Q: Who can create, edit, and delete bookings? → A: Any user can create, edit, and delete any booking (no authorization enforced).
- Q: What happens if a user tries to create a booking that overlaps with an existing one? → A: Prevent save and show error message indicating the time conflict.
- Q: What happens when no vehicles match the applied filters? → A: Show empty timeline area with no message.

## User Scenarios _(mandatory)_

### User Story 1 - View vehicle schedule timeline (Priority: P1)

A user opens the scheduler page to view the timeline of vehicle statuses across time. The scheduler displays a list of vehicles on the left side of the timeline area, showing each vehicle's image, name, plate number, and type. The timeline shows events (In work, Service) as colored bars, with empty time slots indicating the vehicle is Available.

**Why this priority**: Viewing the schedule is the primary entry point and core value of the page - users need to see vehicle availability at a glance.

**Acceptance Scenarios**:

1. **Given** the scheduler page is open, **When** the page loads, **Then** the scheduler displays a list of vehicles with their timeline showing events and available time slots.
2. **Given** the scheduler is in Day mode, **When** viewing the timeline, **Then** time units are displayed as hours for the selected day.
3. **Given** the scheduler is in Week mode, **When** viewing the timeline, **Then** time units are displayed as days for the selected week.
4. **Given** the scheduler is in Month mode, **When** viewing the timeline, **Then** time units are displayed as narrower day columns for the selected month.
5. **Given** an event exists on the timeline, **When** the event has status "In work" or "Service", **Then** the event bar is displayed with the corresponding status color.

---

### User Story 2 - Navigate timeline and switch view modes (Priority: P2)

A user navigates through different time periods and switches between Day, Week, and Month view modes to see the schedule at different granularities.

**Why this priority**: Navigation is essential for users to find the specific time period they need to view or plan.

**Acceptance Scenarios**:

1. **Given** the scheduler is in Day mode, **When** the user clicks the forward arrow, **Then** the timeline advances to the next day.
2. **Given** the scheduler is in Week mode, **When** the user clicks the back arrow, **Then** the timeline goes to the previous week.
3. **Given** the scheduler is in Month mode, **When** the user clicks the forward arrow, **Then** the timeline advances to the next month.
4. **Given** any view mode, **When** the user clicks the "Today" button, **Then** the timeline navigates to include the current date.
5. **Given** the user is in Day or Week mode viewing an event, **When** looking at the event bar, **Then** the date range and assigned user are visible on the bar.
6. **Given** the user is in Month mode viewing an event, **When** looking at the event bar, **Then** only a colored bar is shown without date range or user information.

---

### User Story 3 - Filter vehicles in the scheduler (Priority: P3)

A user uses the filter panel on the left side to narrow down the list of vehicles shown in the scheduler based on various criteria.

**Why this priority**: Filtering allows users to focus on specific vehicles or availability, improving efficiency when managing many vehicles.

**Acceptance Scenarios**:

1. **Given** the filter panel is visible, **When** the user types in the search input, **Then** the scheduler list filters to show only vehicles whose names contain the search term.
2. **Given** the status filter checkboxes are available, **When** the user checks specific statuses, **Then** the scheduler shows only vehicles that have events matching those statuses.
3. **Given** the vehicle type filter select is available, **When** the user selects a type, **Then** the scheduler shows only vehicles of that type.
4. **Given** the user has set a date range and checked "Available during the period", **When** viewing the scheduler, **Then** only vehicles that are available (no events) during the entire selected period are shown.
5. **Given** filters are applied, **When** the user clicks "Clear", **Then** all filters are reset and the full vehicle list is shown.

---

### User Story 4 - Use calendar to jump to a specific date (Priority: P4)

A user uses the calendar in the filter panel to quickly navigate to a specific date on the scheduler.

**Why this priority**: Direct date selection provides a faster way to navigate than using arrows repeatedly.

**Acceptance Scenarios**:

1. **Given** the filter panel is visible, **When** the user clicks the "Show calendar" toggle, **Then** a calendar widget appears below the toggle.
2. **Given** the calendar is visible, **When** the user selects a date, **Then** the scheduler switches to Day mode and displays the selected date.
3. **Given** the calendar is visible, **When** the user clicks the "Show calendar" toggle again, **Then** the calendar is hidden.

---

### User Story 5 - Create a new booking (Priority: P5)

A user initiates the creation of a new booking/event from the scheduler page using a popup form.

**Why this priority**: Creating bookings is important for fleet management but depends on viewing and navigation capabilities being in place first.

**Acceptance Scenarios**:

1. **Given** the filter panel is visible, **When** the user clicks the "New booking" button, **Then** a popup appears with an empty booking form.
2. **Given** the booking popup is open, **When** the user fills in Car, User, Description, Time period, and optionally checks Service, **Then** clicking Save creates the booking and closes the popup.
3. **Given** the booking popup is open, **When** the user clicks Close, **Then** the popup closes without saving.

---

### User Story 6 - Edit or delete an existing booking (Priority: P6)

A user can view, edit, or delete an existing booking by double-clicking on an event in the scheduler.

**Why this priority**: Editing and deleting bookings completes the CRUD operations for event management.

**Acceptance Scenarios**:

1. **Given** an event exists on the scheduler timeline, **When** the user double-clicks on the event, **Then** a popup appears with the booking form pre-filled with the event data.
2. **Given** the booking popup is open for an existing event, **When** the user modifies fields and clicks Save, **Then** the booking is updated and the popup closes.
3. **Given** the booking popup is open for an existing event, **When** the user clicks Delete, **Then** a confirmation is requested and upon confirmation the booking is removed.
4. **Given** the booking popup is open for an existing event, **When** the user clicks Close, **Then** the popup closes without saving changes.

---

### Edge Cases

- When no vehicles match the applied filters, an empty timeline area is displayed.
- When a vehicle has no events, it displays as entirely available (no event bars).
- Overlapping bookings are prevented; the system shows an error and blocks save.
- Events spanning multiple visible periods display as bars extending to the edge of the visible area.
- The date range filter for availability operates independently of the visible timeline period.

## Requirements _(mandatory)_

### Functional Requirements

**Layout Structure**

- **FR-001**: The page MUST have a two-column layout with a filter panel on the left (fixed width ~300px) and a scheduler area on the right.
- **FR-002**: The scheduler area MUST display a list of vehicles on the left side of the timeline, showing image, vehicle name, plate number, and type for each vehicle.
- **FR-003**: The scheduler area MUST display a timeline to the right of the vehicle list.

**Vehicle Status and Events**

- **FR-004**: Vehicles MUST have one of three statuses at any given time: Available, In work, or Service.
- **FR-005**: Events on the timeline MUST represent either "In work" or "Service" status.
- **FR-006**: Time periods without events MUST be treated as "Available" status.
- **FR-007**: Each event MUST be assigned to a user.

**View Modes**

- **FR-008**: The scheduler MUST support three view modes: Day, Week, and Month.
- **FR-009**: In Day mode, the timeline MUST display hours as time units.
- **FR-010**: In Week mode, the timeline MUST display days as time units.
- **FR-011**: In Month mode, the timeline MUST display days as time units with narrower column width than Week mode.
- **FR-012**: In Day and Week modes, event bars MUST display the date range and assigned user name.
- **FR-013**: In Month mode, event bars MUST display only as colored bars without text information.

**Navigation**

- **FR-014**: The scheduler header MUST include a segmented control (toggle group) allowing users to switch between Day, Week, and Month view modes.
- **FR-015**: The scheduler header MUST include a "Today" button that navigates the timeline to include the current date.
- **FR-016**: The scheduler header MUST include forward and back navigation arrows.
- **FR-017**: In Day mode, navigation arrows MUST move forward/back by one day.
- **FR-018**: In Week mode, navigation arrows MUST move forward/back by one week.
- **FR-019**: In Month mode, navigation arrows MUST move forward/back by one month.
- **FR-020**: The scheduler header MUST display color-coded legend/notes indicating the meaning of status colors.

**Filter Panel**

- **FR-021**: The filter panel MUST include a "New booking" button.
- **FR-022**: The filter panel MUST include a "Show calendar" toggle button that shows/hides a calendar widget.
- **FR-023**: Selecting a date on the calendar MUST switch the scheduler to Day mode and display the selected date.
- **FR-024**: The filter panel MUST include a search input that filters the vehicle list by vehicle name (case-insensitive substring match).
- **FR-025**: The filter panel MUST include a status filter with checkboxes for filtering by vehicle event statuses.
- **FR-026**: The filter panel MUST include a vehicle type filter as a select input.
- **FR-027**: The filter panel MUST include a period filter with a date range input and an "Available during the period" checkbox.
- **FR-028**: Selecting a date range alone MUST NOT affect the scheduler display.
- **FR-029**: When the "Available during the period" checkbox is checked with a date range selected, the scheduler MUST filter to show only vehicles that have no events during the entire selected period.
- **FR-030**: The filter panel MUST include a "Clear" action that resets all filter controls to their default state.
- **FR-031**: When no vehicles match the applied filters, the scheduler MUST display an empty timeline area without an error message.

**Booking Popup**

- **FR-032**: Clicking the "New booking" button MUST open a popup with an empty booking form.
- **FR-033**: The booking popup form MUST include the following fields: Car (select from vehicles), User (select from users), Description (textarea), Service (checkbox), and Time period (date and time pickers for start and end).
- **FR-034**: If the Service checkbox is checked, the booking status MUST be "Service"; otherwise, the status MUST be "In work".
- **FR-035**: The booking popup MUST include Close and Save buttons.
- **FR-036**: Clicking Save MUST create the booking (if new) or update the booking (if editing), then close the popup.
- **FR-037**: Clicking Close MUST close the popup without saving any changes.
- **FR-038**: Double-clicking on an existing event in the scheduler timeline MUST open the booking popup with the form pre-filled with that event's data.
- **FR-039**: When editing an existing event, the booking popup MUST include a Delete button in addition to Close and Save.
- **FR-040**: Clicking Delete MUST prompt for confirmation, and upon confirmation, remove the booking and close the popup.
- **FR-041**: Any user MUST be able to create, edit, and delete any booking; no authorization is enforced.
- **FR-042**: The system MUST prevent saving a booking that overlaps with an existing booking for the same vehicle and MUST display an error message indicating the time conflict.

**Visual Design**

- **FR-043**: Events MUST be visually distinguished by status using different colors.
- **FR-044**: The current date/time MUST be visually indicated on the timeline when visible.

### Key Entities _(include if feature involves data)_

- **Vehicle**: A fleet vehicle with image, name, plate number, and type. Existing entity from the vehicles feature.
- **Event/Booking**: A time-bound assignment of a vehicle to a task, with start date/time, end date/time, status (In work or Service), assigned user, and description.
- **User**: A person who can be assigned to events. Existing entity from the users feature.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can identify a vehicle's availability for a specific time period within 15 seconds of viewing the scheduler.
- **SC-002**: Users can switch between Day, Week, and Month views and see the timeline update within 1 second.
- **SC-003**: Users can navigate to a specific date using the calendar in under 5 seconds.
- **SC-004**: Filter operations return updated results within 1 second for a fleet of up to 500 vehicles.
- **SC-005**: 90% of users can correctly interpret vehicle status colors on first use without additional guidance.
- **SC-006**: Users can find available vehicles during a specific period in under 30 seconds using the period filter.

## Assumptions

- Vehicle types use the same enumeration as the existing vehicles feature (PC, Pass Van, Van, CV, Bus).
- The scheduler defaults to Day mode showing today's date on initial page load.
- Events are stored with precise start and end timestamps.
- A vehicle can have multiple events but they do not overlap in time.
- Status filter checkboxes filter vehicles that have at least one event with the checked status in the visible period.
- The Car and User select fields in the booking popup are populated from existing vehicles and users in the system.
