import type { User } from '@/services/users';

const DAY_MS = 24 * 60 * 60 * 1000;
const SOON_DAYS = 30;

function parseDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isExpired(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

function isExpiringSoon(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = date.getTime() - today.getTime();
  return diff >= 0 && diff <= SOON_DAYS * DAY_MS;
}

export function getUserWarnings(user: User): string[] {
  const warnings: string[] = [];

  const licenseDate = parseDate(user.drivingLicenseExpiresAt);
  if (licenseDate) {
    if (isExpired(licenseDate)) {
      warnings.push('Driving license expired');
    } else if (isExpiringSoon(licenseDate)) {
      warnings.push('Driving license expires soon');
    }
  }

  const contractDate = parseDate(user.contractTerminationDate);
  if (contractDate && isExpired(contractDate)) {
    warnings.push('Contract expired');
  }

  return warnings;
}
