<!--
Sync Impact Report
- Version change: N/A (template) -> 1.0.0
- Modified principles: N/A (template placeholders) -> I. TypeScript Strictness (No `any`), II. ESLint + Prettier,
  III. No Automated Tests by Default, IV. Inline Form Validation, V. Clean Code & Structure
- Added sections: Core Principles (filled), Technical Standards, Workflow & Quality Gates, Governance
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: None
-->

# SDD Partly Constitution

## Core Principles

### I. TypeScript Strictness (No `any`)

All TypeScript MUST run with strict type checking enabled. `any` and
`@ts-ignore` are forbidden; use explicit types and `unknown` with narrowing.
Public APIs and reusable utilities MUST be typed.

### II. ESLint + Prettier (Non-Negotiable)

All code MUST conform to ESLint and Prettier. Linting and formatting MUST be
configured in project scripts and run before delivery. No manual formatting or
style deviations without an explicit rule change.

### III. No Automated Tests by Default

Do not add unit, integration, or e2e tests unless explicitly requested in the
feature requirements. Do not introduce test frameworks or CI test steps without
approval.

### IV. Inline Form Validation

All user-facing forms MUST validate inline (on change/blur) with clear,
field-level error messages. Validation logic MUST be centralized and reused
across form fields.

### V. Clean Code & Structure

Prioritize readability and maintainability: small focused modules, clear naming,
no dead code, and minimal duplication. Keep concerns separated and avoid
unnecessary abstractions.

## Technical Standards

- **Language**: TypeScript with strict compiler settings.
- **Dependencies**: Install all required Node modules and maintain a lockfile.
- **Tooling**: ESLint + Prettier are mandatory.
- **Common Web Requirement**: Responsive design with semantic HTML, basic
  accessibility (WCAG 2.1 AA target), and SEO-ready metadata.

## Workflow & Quality Gates

- **Constitution Check**: Every plan MUST include a gate verifying compliance
  with the five core principles.
- **Manual Verification**: Use a short manual QA checklist for key flows since
  automated tests are excluded by default.
- **Definition of Done**: Lint/format clean, inline validation complete, no
  `any` usage, dependencies installed, and requirements met.

## Governance

- This constitution supersedes conflicting guidance.
- Amendments require updating this file, documenting rationale, and bumping the
  version using semantic versioning (MAJOR/MINOR/PATCH).
- Every plan/spec/tasks artifact MUST reference these principles and enforce
  them via explicit checks.

**Version**: 1.0.0 | **Ratified**: 2026-01-19 | **Last Amended**: 2026-01-19
