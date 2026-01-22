import path from 'node:path';

export const uploadsRoot = path.resolve(process.cwd(), 'uploads');
export const vehicleImagesDir = path.join(uploadsRoot, 'vehicles');
export const userImagesDir = path.join(uploadsRoot, 'users');

export function getVehicleImagePath(relativePath: string): string {
  return path.join(vehicleImagesDir, relativePath);
}

export function getUserImagePath(relativePath: string): string {
  return path.join(userImagesDir, relativePath);
}
