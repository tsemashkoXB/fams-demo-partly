# Feature Specification: Users Page Layout

**Feature Branch**: `003-users-page-layout`  
**Created**: 2026-01-21  
**Status**: Draft  
**Input**: User description: "Layout for users page - Left part of layout contains table of users with avatar, name, position (can be one of these: Sale, Merchandiser, Driver, House Master, Logistic, Courier), DoB, Status (can be one of these: Active, Banned), Alert. There is ability to select any row. There is page title, search input and Add User button above the table. Search input can search the table by any column value. Right part of layout has block with fixed width (near 550px) and contains description of selected user with a few sections. Each section except main section looks like a group of non-editable inputs with section title. Main section at the top of this block is without section title. Main section has the following content: name, surname, image, status (can be one of these: Active, Banned), gender (can be one of these: Male, Female), position (can be one of these: Sale, Merchandiser, Driver, House Master, Logistic, Courier), Date of birth (date), Contract termination (date). Name + Surname looks like a header of the whole block (simple text). There is Edit button to the right of Name Surname. There is image below the Name Surname. Image container takes half of block width. The rest part of section content takes the right rest half of block width. Status, gender, position, Date of birth, Contract termination look like non-editable inputs. Second section named Contacts has the following fields: email, phone. All these fields look like non-editable inputs and arranged in two columns. Third section named Docs has the following fields: driving license, [driving license] expires at (date), driving categories (multiselect, can be some of these: AM, A, A1, B, C, D, BE, CE, DE). In non-edit mode driving categories field looks like tags. All these fields look like non-editable inputs and arranged in two columns. Under this sections we can see some warnings: Driving license expired, Driving license expires soon, Contract expired,"

## Clarifications

### Session 2026-01-21

- Q: How should search matching work across columns? → A: Case-insensitive substring match across all visible columns.
- Q: When should search filtering be applied? → A: Live filtering with a short debounce.
- Q: What should the right panel show when nothing is selected? → A: An empty-state details panel.
- Q: How should missing user fields be displayed? → A: Leave missing fields blank.
- Q: How should multiple warnings be displayed? → A: Show all applicable warnings.

## User Scenarios _(mandatory)_

### User Story 1 - Browse and select a user (Priority: P1)

As a staff member, I can view a list of users and select any row to see that user's details in the right panel.

**Why this priority**: The core value is quickly finding a user and reviewing their profile details.

**Acceptance Scenarios**:

1. **Given** the users page is open with at least one user, **When** I select a row, **Then** the selected row is visually highlighted and the right panel updates to show that user's details.
2. **Given** the users page is open, **When** I open the page without making a selection, **Then** an empty-state details panel is shown so the layout remains stable.
3. **Given** a user is selected, **When** I click Edit, **Then** the details panel switches to editable fields and I can save changes.
4. **Given** a user is selected, **When** I confirm Delete, **Then** the user is removed from the list and the details panel clears.
5. **Given** I click Add User, **When** I complete the form and save, **Then** the new user appears in the list and is selected.

---

### User Story 2 - Search the list by any field (Priority: P2)

As a staff member, I can search by any column value to quickly filter the list.

**Why this priority**: Search reduces time to find a user in long lists.

**Acceptance Scenarios**:

1. **Given** the users list contains multiple rows, **When** I enter a search query, **Then** only rows matching any visible column value remain visible.
2. **Given** a search query that matches no rows, **When** I view the list, **Then** an explicit no-results state is shown.

---

### User Story 3 - Review contacts, documents, and warnings (Priority: P3)

As a staff member, I can view contact info, document details, and warnings for the selected user in clearly grouped sections.

**Why this priority**: Grouped information and warnings support quick compliance checks.

**Acceptance Scenarios**:

1. **Given** a user with contact info and documents, **When** I view the right panel, **Then** the Contacts and Docs sections display their fields as non-editable inputs in two columns.
2. **Given** a user with warning conditions, **When** I view the right panel, **Then** all relevant warnings are shown beneath the sections.

---

### Edge Cases

- No users are available in the list.
- A user lacks optional fields (email, phone, documents, image).
- Very long names or field values cause overflow risk.
- A search query matches multiple columns for the same row.
- A user triggers multiple warnings at once.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The page MUST present a left list area and a right details panel, with the right panel fixed near 550px width.
- **FR-002**: The left list MUST show a page title, search input, and an Add User button above the list.
- **FR-002a**: Clicking Add User MUST open an editable form for a new user and allow saving.
- **FR-003**: The list MUST include columns for avatar, name, position, date of birth, status, and alert indicator.
- **FR-004**: Users MUST be able to select any row, with a visible selection state and details panel updates to the selected user.
- **FR-005**: The search input MUST filter the list by case-insensitive substring matches on any visible column value.
- **FR-005a**: The search input MUST apply filtering as the user types, with a short debounce to avoid excessive updates.
- **FR-006**: The details panel MUST include a main section (no section title) showing name, surname, image, status, gender, position, date of birth, and contract termination.
- **FR-007**: The name and surname MUST appear as a header with an Edit button aligned to its right.
- **FR-008**: The main section MUST place the image in a container taking about half the panel width, with the remaining fields in the other half.
- **FR-008a**: The image area MUST support uploading and removing a user image using the existing image upload logic from prior features.
- **FR-008a1**: The primary image displayed in the details panel MUST be the image with the highest displayOrder value.
- **FR-008b**: Clicking Edit MUST switch the details panel into an editable form mode for all user fields.
- **FR-008c**: Users MUST be able to save edits to any field and see updates reflected in the list and details panel.
- **FR-008d**: All editable fields MUST validate inline with clear, field-level error messages.
- **FR-008e**: Users MUST be able to delete a user after a confirmation prompt, and the list/details MUST update accordingly.
- **FR-008f**: Users MUST be able to create a new user and see it reflected in the list and details panel.
- **FR-009**: Status, gender, position, date of birth, and contract termination MUST appear as non-editable input-style fields.
- **FR-010**: A Contacts section MUST present email and phone as non-editable input-style fields in two columns.
- **FR-010a**: If a field value is missing, its input-style field MUST remain visible but empty.
- **FR-011**: A Docs section MUST present driving license, license expiry date, and driving categories in two columns as non-editable input-style fields.
- **FR-012**: Driving categories MUST appear as tags in view mode.
- **FR-013**: Warnings MUST be shown beneath the sections when applicable, including: Driving license expired, Driving license expires soon, Contract expired.
- **FR-013a**: If multiple warnings apply, all of them MUST be displayed.
- **FR-013b**: "Expired" applies when the relevant date is before today; "expires soon" applies when the relevant date is within the next 30 days.
- **FR-014**: The UI MUST support the following enumerations:
  - Positions: Sale, Merchandiser, Driver, House Master, Logistic, Courier.
  - Status: Active, Banned.
  - Gender: Male, Female.
  - Driving categories: AM, A, A1, B, C, D, BE, CE, DE.
- **FR-015**: If no users are present or no results match search, the list area MUST show a clear empty or no-results state without breaking layout.

### Key Entities _(include if feature involves data)_

- **User**: Represents a person in the system with identity, role/position, status, dates, contacts, and document metadata.
- **UserImage**: Image metadata for a user stored using the existing image upload pattern.
- **Warning**: A displayable alert derived from user document dates or contract status.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can identify and open a user profile from the list within 30 seconds in a list of 100 users.
- **SC-002**: 95% of search queries return visible results or a no-results state within 1 second of input.
- **SC-003**: At least 90% of users can correctly identify a user's status, position, and key dates from the details panel on first attempt.
- **SC-004**: The layout remains readable without overlap for names up to 40 characters and for users with multiple warnings.

## Assumptions

- When the list is non-empty, the first user is selected by default; otherwise, an empty-state panel is shown.
