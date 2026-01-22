# Quickstart: Users Page Layout

## Prerequisites

- Node.js 20 LTS
- npm

## Setup

1. Install dependencies:
   - `cd /Users/tanya/Documents/XBS/fams-demo-partly/backend && npm install`
   - `cd /Users/tanya/Documents/XBS/fams-demo-partly/frontend && npm install`

2. Configure environment:
   - Backend: ensure `DATABASE_URL` is set in `/Users/tanya/Documents/XBS/fams-demo-partly/backend/.env`
   - Frontend: ensure `NEXT_PUBLIC_API_BASE_URL` is set in `/Users/tanya/Documents/XBS/fams-demo-partly/frontend/.env`

3. Run migrations (includes demo users seed):
   - `cd /Users/tanya/Documents/XBS/fams-demo-partly/backend && npm run migrate`

4. Start the backend (NestJS):
   - `cd /Users/tanya/Documents/XBS/fams-demo-partly/backend && npm run start:dev`

5. Start the frontend (Next.js):
   - `cd /Users/tanya/Documents/XBS/fams-demo-partly/frontend && npm run dev`

## Verify

- Open the users page in the frontend app.
- Confirm the table shows seeded users and search filters results as you type.
- Select a row to see the right-side details panel update.
- Verify empty-state details panel when no selection is present.
- Confirm missing fields render as empty input values.
- Confirm multiple warnings can display at once when conditions apply.
- Upload a user image and verify it renders in the details panel.
- Delete a user via the confirmation prompt and verify the list updates.
- Add a user via the Add User form and verify it appears in the list.

## E2E test: user creation flow

1. Ensure the backend is running and `DATABASE_URL` is configured.
2. Run the e2e test (targets the running backend):
   - `cd /Users/tanya/Documents/XBS/fams-demo-partly/backend && E2E_BASE_URL=http://localhost:3000 npm run test:e2e`
3. Confirm the test passes and the created user is deleted at the end.
