import { getApiBaseUrl, UserImage } from './users';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function uploadUserImage(
  userId: number,
  file: File
): Promise<UserImage> {
  const baseUrl = getApiBaseUrl();
  const formData = new FormData();
  formData.append('file', file);
  return fetchJson<UserImage>(`${baseUrl}/users/${userId}/images`, {
    method: 'POST',
    body: formData,
  });
}

export async function deleteUserImage(
  userId: number,
  imageId: number
): Promise<void> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(
    `${baseUrl}/users/${userId}/images/${imageId}`,
    { method: 'DELETE' }
  );
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}
