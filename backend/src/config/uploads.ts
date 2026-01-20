import path from 'node:path';

export const uploadsRoot = path.resolve(process.cwd(), 'uploads');
export const vehicleImagesDir = path.join(uploadsRoot, 'vehicles');

export function getVehicleImagePath(relativePath: string): string {
  return path.join(vehicleImagesDir, relativePath);
}
