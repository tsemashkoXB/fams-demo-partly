# Quickstart: Vehicles Page Layout

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

3. Start the backend (NestJS):
   - `cd /Users/tanya/Documents/XBS/fams-demo-partly/backend && npm run start:dev`

4. Start the frontend (Next.js):
   - `cd /Users/tanya/Documents/XBS/fams-demo-partly/frontend && npm run dev`

## Verify

- Open the vehicles page in the frontend app.
- Confirm the table shows seeded vehicles and search filters results.
- Select a row to see the right-side details panel update.
- Enter edit mode and verify inline validation and disabled selection.
- Add a vehicle, then delete it using the confirmation prompt.
- Upload and delete vehicle images; confirm images render and are removed.
- Confirm warnings appear only when thresholds are strictly less than rules.
- Verify date fields display as `dd.MM.yyyy` and are sent/stored as ISO strings with time.
- Manual performance check: filter 1,000 vehicles and confirm results appear within 1 second; switch selections and confirm details update within 500 ms.
