# Data Model: Vehicles Page Layout

## Entities

### Vehicle

**Description**: Core vehicle record shown in the list and detail panel.

**Fields**:
- id (unique identifier)
- plateNumber (unique)
- modelName
- type (enum: PC, Pass Van, Van, CV, Bus)
- yearOfProduction (year)
- vin (unique)
- currentMileage
- color
- engine
- fuelType (enum: Petrol, Gas, Diesel)
- payload
- seats
- fullMass
- vehiclePassport
- vehiclePassportIssuedDate (ISO string with time)
- insurance
- insuranceExpiresAt (ISO string with time)
- nextServiceAtMileage
- nextServiceTillDate (ISO string with time)
- stateInspectionExpiresAt (ISO string with time)
- createdAt
- updatedAt

**Validation Rules**:
- plateNumber and vin are required and unique.
- yearOfProduction is a 4-digit year within a reasonable range (e.g., 1900 to current year + 1).
- currentMileage, payload, seats, fullMass, nextServiceAtMileage are non-negative numbers.
- date fields must be valid dates when present.

### VehicleImage

**Description**: Image metadata for a vehicle with local file path and display order.

**Fields**:
- id (unique identifier)
- vehicleId (foreign key to Vehicle)
- relativePath (string, required)
- displayOrder (integer, required)
- createdAt

**Validation Rules**:
- relativePath is required and stored as a relative path from the image root.
- displayOrder is a non-negative integer.

## Relationships

- Vehicle 1:N VehicleImage

## Derived Concepts

- Vehicle warnings are derived from mileage and date thresholds and are not stored as persistent records.

## State Transitions

- Vehicle: create → update → delete
- VehicleImage: upload → reorder (optional) → delete
