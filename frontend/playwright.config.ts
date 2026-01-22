import { defineConfig } from '@playwright/test';

const baseURL =
  process.env.E2E_FRONTEND_BASE_URL ??
  process.env.E2E_BASE_URL ??
  'http://localhost:3001';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
});
