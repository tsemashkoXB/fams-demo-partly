import { UserImage } from './user-image.entity';

export const userStatuses = ['Active', 'Banned'] as const;
export type UserStatus = (typeof userStatuses)[number];

export const userGenders = ['Male', 'Female'] as const;
export type UserGender = (typeof userGenders)[number];

export const userPositions = [
  'Sale',
  'Merchandiser',
  'Driver',
  'House Master',
  'Logistic',
  'Courier',
] as const;
export type UserPosition = (typeof userPositions)[number];

export const drivingCategories = [
  'AM',
  'A',
  'A1',
  'B',
  'C',
  'D',
  'BE',
  'CE',
  'DE',
] as const;
export type DrivingCategory = (typeof drivingCategories)[number];

export type User = {
  id: number;
  name: string;
  surname: string;
  status: UserStatus;
  gender: UserGender;
  position: UserPosition;
  dateOfBirth: string | null;
  contractTerminationDate: string | null;
  email: string | null;
  phone: string | null;
  drivingLicense: string | null;
  drivingLicenseExpiresAt: string | null;
  drivingCategories: DrivingCategory[] | null;
  createdAt: string;
  updatedAt: string;
  images?: UserImage[];
};
