# Data Model: Users Page Layout

## Entities

### User

**Description**: Core user record shown in the list and detail panel.

**Fields**:
- id (unique identifier)
- name
- surname
- imageUrl (string, optional, derived from latest image if present)
- status (enum: Active, Banned)
- gender (enum: Male, Female)
- position (enum: Sale, Merchandiser, Driver, House Master, Logistic, Courier)
- dateOfBirth (date)
- contractTerminationDate (date)
- email (string, optional)
- phone (string, optional)
- drivingLicense (string, optional)
- drivingLicenseExpiresAt (date, optional)
- drivingCategories (enum array: AM, A, A1, B, C, D, BE, CE, DE)
- createdAt
- updatedAt

### UserImage

**Description**: Image metadata for a user with local file path and display order.

**Fields**:
- id (unique identifier)
- userId (foreign key to User)
- relativePath (string, required)
- displayOrder (integer, required)
- createdAt

**Validation Rules**:
- relativePath is required and stored as a relative path from the image root.
- displayOrder is a non-negative integer.
- Primary image is the record with the highest displayOrder.

**Validation Rules**:
- name and surname are required and non-empty.
- status, gender, position values must be within their enumerations.
- date fields must be valid dates when present.
- drivingCategories contains only the allowed enum values.

## Relationships

- User 1:N UserImage

## Derived Concepts

- Warning badges are derived from contractTerminationDate and drivingLicenseExpiresAt and are not stored as persistent records.

## State Transitions

- User: create → update → delete (not in scope for this feature, but standard lifecycle).
