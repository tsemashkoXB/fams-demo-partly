import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

async function readJson(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Expected JSON response but got: ${text}`);
  }
}

test('users creation flow creates, fetches, and deletes a user', async () => {
  const uniqueSuffix = Date.now();
  const payload = {
    name: 'E2E',
    surname: 'User',
    status: 'Active',
    gender: 'Male',
    position: 'Driver',
    dateOfBirth: null,
    contractTerminationDate: null,
    email: `e2e.user+${uniqueSuffix}@example.com`,
    phone: '555-0100',
    drivingLicense: null,
    drivingLicenseExpiresAt: null,
    drivingCategories: ['B'],
  };

  const createResponse = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const createdUser = await readJson(createResponse);

  assert.equal(
    createResponse.status,
    201,
    `Expected 201 from POST /users, got ${createResponse.status}`
  );
  assert.ok(createdUser?.id, 'Expected created user to include id');
  assert.equal(createdUser?.email, payload.email);
  assert.equal(createdUser?.name, payload.name);
  assert.equal(createdUser?.surname, payload.surname);

  const userId = createdUser.id;
  const getResponse = await fetch(`${baseUrl}/users/${userId}`);
  const fetchedUser = await readJson(getResponse);

  assert.equal(
    getResponse.status,
    200,
    `Expected 200 from GET /users/:id, got ${getResponse.status}`
  );
  assert.equal(fetchedUser?.id, userId);
  assert.equal(fetchedUser?.email, payload.email);

  const deleteResponse = await fetch(`${baseUrl}/users/${userId}`, {
    method: 'DELETE',
  });

  assert.equal(
    deleteResponse.status,
    204,
    `Expected 204 from DELETE /users/:id, got ${deleteResponse.status}`
  );
});
