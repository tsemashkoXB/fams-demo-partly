# Data Model: FAMS Demo App

## Overview
This phase has no persisted domain data. The demo UI uses in-memory layout
state and static navigation definitions. A PostgreSQL instance is provisioned
for future expansion but is not required by the current feature scope.

## Entities (UI State)

### NavigationItem
- id: string (stable key)
- label: "Vehicles" | "Users" | "Scheduler" | "Radar" | "Statistics"
- href: string (route)
- icon: string (icon id)
- isActive: boolean (derived)

### LayoutState
- isSidebarCollapsed: boolean
- activeRoute: string

### HeaderMockUser
- displayName: string (e.g., "Admin")
- avatarUrl: string (random user photo URL)

## Validation Rules
- activeRoute MUST match one of the NavigationItem routes.
- Exactly one NavigationItem MUST be active at a time.
