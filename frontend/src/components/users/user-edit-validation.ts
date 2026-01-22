import type { User } from "@/services/users";

export type UserFormValues = {
  name: string;
  surname: string;
  status: User["status"];
  gender: User["gender"];
  position: User["position"];
  dateOfBirth: string;
  contractTerminationDate: string;
  email: string;
  phone: string;
  drivingLicense: string;
  drivingLicenseExpiresAt: string;
  drivingCategories: NonNullable<User["drivingCategories"]>;
};

export type UserFormErrors = Partial<Record<keyof UserFormValues, string>>;

function isValidDate(value: string): boolean {
  if (!value.trim()) {
    return true;
  }
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

export function validateUserForm(values: UserFormValues): UserFormErrors {
  const errors: UserFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required";
  }
  if (!values.surname.trim()) {
    errors.surname = "Surname is required";
  }
  if (!values.status.trim()) {
    errors.status = "Status is required";
  }
  if (!values.gender.trim()) {
    errors.gender = "Gender is required";
  }
  if (!values.position.trim()) {
    errors.position = "Position is required";
  }
  if (values.email && !values.email.includes("@")) {
    errors.email = "Email must be valid";
  }
  if (!isValidDate(values.dateOfBirth)) {
    errors.dateOfBirth = "Date of birth is invalid";
  }
  if (!isValidDate(values.contractTerminationDate)) {
    errors.contractTerminationDate = "Contract date is invalid";
  }
  if (!isValidDate(values.drivingLicenseExpiresAt)) {
    errors.drivingLicenseExpiresAt = "License expiry is invalid";
  }

  return errors;
}
