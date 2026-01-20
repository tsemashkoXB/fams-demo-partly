# Feature Specification: Vehicles Page Layout

**Feature Branch**: `002-vehicles-page-layout`  
**Created**: 2026-01-20  
**Status**: Draft  
**Input**: User description: "Layout for vehicles page - Left part of layout contains table of vehicles with plate number, model name, type (can be one of these: PC, Pass Van, Van, CV, Bus), year. User can select any row. There is page title, search input and Add Car button above the table. Search input can search the table by any column value. Right part of layout has block with fixed width (near 550px) and contains description of selected vehicle with a few sections. Each section except main section looks like a group of non-editable inputs with section title. Main section at the top of this block is without section title. Main section has the following content: model name, image(s), plate number, year of prod, VIN. Model name looks like a header of the whole block (simple text). There is Edit button to the right of model name. There are image(s) below the model name. Image container takes half of block width. If images are more than one, they are placed in carousel with arrow buttons. The rest part of section content takes the right rest half of block width. Plate number also looks like simple text. Year of prod and VIN looks like non-editable inputs. Second section named Characteristics has the following fields: type (can be one of these: PC, Pass Van, Van, CV, Bus), current mileage, color, engine, fuel type (can be one of these: Petrol, Gas, Diesel), payload, seats, full mass. All these fields look like non-editable inputs and arranged in three columns. Third section named Documentation has the following fields: vehicle passport, [vehicle passport] issued (date), insurance, [insurance] expires at (date), next service at (number of miles), till (date), vehicle state inspection expires at (date). All these fields look like non-editable inputs and arranged in three columns. Under this sections we can see some warnings: \"Less than 1000 km to next service check\", \"Less than 30 days to next service check\", \"Less than 30 days to next technical inspection\", \"Less than 30 days before the insurance expires\", \"Less than 30 days before the state inspection expires\" in appropriate situations, based on values of inputs. There is Delete Car button at the bottom of block. On click it opens confirm for deleting and on delete button click inside confirmation system deletes the car. All these fields are possible to edit by clicking Edit button. In edit mode this the same form become editable and highlighted (other part of page is darken). Even fields that look like a simple text become text inputs. Upload photo button appears below the images carousel. Close icon appears on every image and gives ability to remove corresponding image. Cancel and Save button appear on the bottom of form. On Add Car click the same form is highlighted the same way as in edit mode, but the whole form is empty. While edit mode is active, Add Car button and Edit button become disabled."

## Clarifications

### Session 2026-01-20

- Q: Which user roles can add/edit/delete vehicles? → A: All users can view; only users with manage permission can add/edit/delete.
- Q: What should happen when the list is non-empty and no vehicle is selected? → A: Auto-select the first row whenever the list is non-empty.
- Q: Are warning thresholds inclusive or exclusive? → A: Warnings trigger only when the value is strictly less than the threshold.
- Q: When should warnings be displayed? → A: Warnings appear only when at least one rule triggers.
- Q: Can users switch vehicle selection while editing? → A: Switching selection is prevented while editing.

## User Scenarios _(mandatory)_

### User Story 1 - Browse and select vehicles (Priority: P1)

A user views the vehicles list, searches by any column value, and selects a row to see details on the right panel.

**Why this priority**: The list and selection are the entry point to all other actions.

**Acceptance Scenarios**:

1. **Given** a list of vehicles is shown, **When** the user types in the search input, **Then** the table filters by any matching column value.
2. **Given** multiple vehicles are listed, **When** the user selects a row, **Then** the details panel updates to show that vehicle's data.

---

### User Story 2 - Review vehicle details (Priority: P2)

A user reads a selected vehicle's details across the main, characteristics, and documentation sections.

**Why this priority**: Users need clear, structured details before deciding to edit or delete.

**Acceptance Scenarios**:

1. **Given** a vehicle is selected, **When** the details panel is shown, **Then** the main section displays model name, images, plate number, year of production, and VIN.
2. **Given** a vehicle is selected, **When** the characteristics and documentation sections are shown, **Then** fields are displayed as non-editable inputs grouped into three columns with section titles.

---

### User Story 3 - Edit vehicle details (Priority: P3)

A user enters edit mode to change any field, manage photos, then saves or cancels.

**Why this priority**: Editing is required for maintaining accurate vehicle records.

**Acceptance Scenarios**:

1. **Given** a vehicle is selected, **When** the user clicks Edit, **Then** the form becomes editable, the rest of the page is darkened, and Add Car and Edit are disabled.
2. **Given** edit mode is active, **When** the user clicks Save, **Then** changes are applied and edit mode exits.
3. **Given** edit mode is active, **When** the user clicks Cancel, **Then** changes are discarded and edit mode exits.

---

### User Story 4 - Add or delete a vehicle (Priority: P4)

A user with manage permission adds a new vehicle using the same form, or deletes a vehicle after confirmation.

**Why this priority**: Create and delete flows are essential but less frequent than viewing and editing.

**Acceptance Scenarios**:

1. **Given** the user clicks Add Car, **When** the form opens, **Then** it is highlighted as in edit mode and all fields are empty.
2. **Given** the user clicks Delete Car, **When** they confirm the deletion, **Then** the vehicle is removed and the list updates.

---

### Edge Cases

- What happens when the search yields no results?
- What happens when there is no selected vehicle (initial load or after deletion)? Auto-select the first available vehicle when the list is non-empty.
- How does the panel behave when a vehicle has zero images or only one image?
- How are warnings handled when required dates or mileage values are missing?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The vehicles table MUST display columns for plate number, model name, type, and year.
- **FR-002**: The search input MUST filter the table by any column value.
- **FR-003**: Selecting a row MUST update the details panel to the selected vehicle.
- **FR-004**: The details panel MUST have a fixed width near 550px and appear on the right side of the layout.
- **FR-005**: The main section MUST display model name, images, plate number, year of production, and VIN, with an Edit button aligned to the right of the model name.
- **FR-006**: The image area MUST occupy about half of the main section width, and when more than one image exists it MUST present navigation controls to move between images.
- **FR-007**: In view mode, the main, characteristics, and documentation fields MUST appear as non-editable inputs (with model name and plate number displayed as text).
- **FR-008**: The characteristics section MUST include type, current mileage, color, engine, fuel type, payload, seats, and full mass arranged in three columns.
- **FR-009**: The documentation section MUST include vehicle passport, passport issued date, insurance, insurance expiry date, next service mileage, next service date, and state inspection expiry date arranged in three columns.
- **FR-010**: The system MUST show warning messages when thresholds are met (exclusive): less than 1000 km to next service, less than 30 days to next service, less than 30 days to next technical inspection, less than 30 days before insurance expiry, and less than 30 days before state inspection expiry.
- **FR-011**: Clicking Edit MUST enable editing for all fields, darken the rest of the page, and disable the Add Car and Edit buttons.
- **FR-012**: In edit mode, an Upload Photo action MUST appear and each existing image MUST provide a remove control.
- **FR-013**: Edit mode MUST provide Cancel and Save actions to discard or apply changes and exit edit mode.
- **FR-014**: Clicking Add Car MUST open the same form in edit mode with all fields empty.
- **FR-015**: Clicking Delete Car MUST open a confirmation step, and confirming MUST remove the vehicle from the system and update the list.
- **FR-016**: Only users with manage permission MUST be able to add, edit, or delete vehicles; all users MUST be able to view and search.
- **FR-017**: When the list is non-empty and no selection exists, the system MUST auto-select the first vehicle.
- **FR-018**: Warning messages MUST be shown only when at least one warning rule is triggered; otherwise no warnings area is shown.
- **FR-019**: While edit mode is active, selecting a different vehicle in the table MUST be disabled.

### Key Entities _(include if feature involves data)_

- **Vehicle**: A vehicle record with plate number, model name, type, year of production, VIN, characteristics, documentation, and photos.
- **Vehicle Photo**: An image associated with a vehicle, including display order.
- **Vehicle Warning**: A derived alert based on mileage or date thresholds.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 95% of searches return filtered results in under 1 second for lists up to 1,000 vehicles.
- **SC-002**: Users can locate and open a vehicle's details within 30 seconds on first attempt.
- **SC-003**: Users complete an edit or add flow in under 3 minutes without assistance in 90% of observed sessions.
- **SC-004**: All threshold-based warning messages appear correctly in 100% of defined test scenarios.

## Assumptions

- Vehicles have at least one of the values required for warnings; missing values result in no warning for that rule.
- Distance values used for service warnings are treated in kilometers, matching the warning text.
- The first vehicle in the list is selected by default when the list is non-empty.
