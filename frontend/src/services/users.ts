export type UserImage = {
  id: number;
  userId: number;
  relativePath: string;
  displayOrder: number;
  createdAt: string;
};

export type User = {
  id: number;
  name: string;
  surname: string;
  status: 'Active' | 'Banned';
  gender: 'Male' | 'Female';
  position:
    | 'Sale'
    | 'Merchandiser'
    | 'Driver'
    | 'House Master'
    | 'Logistic'
    | 'Courier';
  dateOfBirth: string | null;
  contractTerminationDate: string | null;
  email: string | null;
  phone: string | null;
  drivingLicense: string | null;
  drivingLicenseExpiresAt: string | null;
  drivingCategories: string[] | null;
  createdAt: string;
  updatedAt: string;
  images?: UserImage[];
};

export type UserUpdatePayload = Partial<
  Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'images'>
>;

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function listUsers(search: string): Promise<User[]> {
  const baseUrl = getApiBaseUrl();
  const query = search.trim();
  const url = query
    ? `${baseUrl}/users?q=${encodeURIComponent(query)}`
    : `${baseUrl}/users`;
  return fetchJson<User[]>(url);
}

export async function getUser(userId: number): Promise<User> {
  const baseUrl = getApiBaseUrl();
  return fetchJson<User>(`${baseUrl}/users/${userId}`);
}

export async function updateUser(
  userId: number,
  payload: UserUpdatePayload
): Promise<User> {
  const baseUrl = getApiBaseUrl();
  return fetchJson<User>(`${baseUrl}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function createUser(payload: UserUpdatePayload): Promise<User> {
  const baseUrl = getApiBaseUrl();
  return fetchJson<User>(`${baseUrl}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(userId: number): Promise<void> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/users/${userId}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}
