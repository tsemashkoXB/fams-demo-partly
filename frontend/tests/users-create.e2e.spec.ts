import { expect, test } from '@playwright/test';

const apiBaseUrl = process.env.E2E_API_BASE_URL ?? 'http://localhost:3000';

test('creates a user from the users form', async ({ page, request }) => {
  await page.goto('/users', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Add User' })).toBeVisible({
    timeout: 15_000,
  });

  await page.getByRole('button', { name: 'Add User' }).click();
  await expect(page.getByLabel('Name', { exact: true })).toBeEditable({
    timeout: 15_000,
  });

  const uniqueSuffix = Date.now();
  const name = `E2E${uniqueSuffix}`;
  const surname = 'Frontend';
  const email = `e2e.frontend+${uniqueSuffix}@example.com`;

  await page.getByLabel('Name', { exact: true }).fill(name);
  await page.getByLabel('Surname').fill(surname);
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Phone', { exact: true }).fill('555-0102');

  const createResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().endsWith('/users') &&
      response.request().method() === 'POST' &&
      response.status() === 201
    );
  });

  await page.getByRole('button', { name: 'Save' }).click();

  const createResponse = await createResponsePromise;
  const createdUser = await createResponse.json();

  await expect(
    page.getByRole('button', {
      name: `Edit`,
    }),
  ).toBeVisible();

  await request.delete(`${apiBaseUrl}/users/${createdUser.id}`);
});
