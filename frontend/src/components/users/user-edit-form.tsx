"use client";

import * as React from "react";
import type { User, UserImage } from "@/services/users";
import {
  type UserFormErrors,
  type UserFormValues,
  validateUserForm,
} from "@/components/users/user-edit-validation";
import { UserImageUpload } from "@/components/users/user-image-upload";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOptions = ["Active", "Banned"] as const;
const genderOptions = ["Male", "Female"] as const;
const positionOptions = [
  "Sale",
  "Merchandiser",
  "Driver",
  "House Master",
  "Logistic",
  "Courier",
] as const;
const drivingCategoryOptions = [
  "AM",
  "A",
  "A1",
  "B",
  "C",
  "D",
  "BE",
  "CE",
  "DE",
] as const;

type UserEditFormProps = {
  initialValues: UserFormValues;
  images?: UserImage[];
  onCancel: () => void;
  onSave: (values: UserFormValues) => void;
  onUploadImage: (file: File) => void;
  onRemoveImage: (imageId: number) => void;
  isSaving?: boolean;
  imagesDisabled?: boolean;
};

type FieldProps = {
  label: string;
  name: keyof UserFormValues;
  type?: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (name: keyof UserFormValues, value: string) => void;
};

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        className={`h-9 rounded-md border px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name: keyof UserFormValues;
  value: string;
  options: readonly string[];
  error?: string;
  onChange: (name: keyof UserFormValues, value: string) => void;
};

function SelectField({
  label,
  name,
  value,
  options,
  error,
  onChange,
}: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      <span>{label}</span>
      <Select value={value} onValueChange={(nextValue) => onChange(name, nextValue)}>
        <SelectTrigger
          className={`h-9 bg-transparent ${error ? "border-destructive" : "border-border"}`}
        >
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}

type DateFieldProps = {
  label: string;
  name: keyof UserFormValues;
  value: string;
  error?: string;
  onChange: (name: keyof UserFormValues, value: string) => void;
};

function DateField({ label, name, value, error, onChange }: DateFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      <span>{label}</span>
      <DatePicker value={value} onChange={(nextValue) => onChange(name, nextValue)} />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function buildUserFormValues(user?: User | null): UserFormValues {
  return {
    name: user?.name ?? "",
    surname: user?.surname ?? "",
    status: user?.status ?? "Active",
    gender: user?.gender ?? "Male",
    position: user?.position ?? "Sale",
    dateOfBirth: user?.dateOfBirth ?? "",
    contractTerminationDate: user?.contractTerminationDate ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    drivingLicense: user?.drivingLicense ?? "",
    drivingLicenseExpiresAt: user?.drivingLicenseExpiresAt ?? "",
    drivingCategories: user?.drivingCategories ?? [],
  };
}

export function UserEditForm({
  initialValues,
  images,
  onCancel,
  onSave,
  onUploadImage,
  onRemoveImage,
  isSaving = false,
  imagesDisabled = false,
}: UserEditFormProps) {
  const [values, setValues] = React.useState<UserFormValues>(initialValues);
  const [errors, setErrors] = React.useState<UserFormErrors>({});

  React.useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const handleChange = (name: keyof UserFormValues, value: string) => {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setErrors(validateUserForm(nextValues));
  };

  const toggleCategory = (category: string) => {
    const current = new Set(values.drivingCategories);
    if (current.has(category)) {
      current.delete(category);
    } else {
      current.add(category);
    }
    const nextValues = {
      ...values,
      drivingCategories: Array.from(current),
    };
    setValues(nextValues);
    setErrors(validateUserForm(nextValues));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateUserForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSave(values);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <section className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <UserImageUpload
            images={images}
            onUpload={onUploadImage}
            onRemove={onRemoveImage}
            disabled={isSaving || imagesDisabled}
          />
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Field
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={errors.name}
              />
              <Field
                label="Surname"
                name="surname"
                value={values.surname}
                onChange={handleChange}
                error={errors.surname}
              />
            </div>
            <SelectField
              label="Status"
              name="status"
              value={values.status}
              options={statusOptions}
              onChange={handleChange}
              error={errors.status}
            />
            <SelectField
              label="Gender"
              name="gender"
              value={values.gender}
              options={genderOptions}
              onChange={handleChange}
              error={errors.gender}
            />
            <SelectField
              label="Position"
              name="position"
              value={values.position}
              options={positionOptions}
              onChange={handleChange}
              error={errors.position}
            />
            <DateField
              label="Date of birth"
              name="dateOfBirth"
              value={values.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
            />
            <DateField
              label="Contract termination"
              name="contractTerminationDate"
              value={values.contractTerminationDate}
              onChange={handleChange}
              error={errors.contractTerminationDate}
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Contacts
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            label="Phone"
            name="phone"
            value={values.phone}
            onChange={handleChange}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Docs
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Driving license"
            name="drivingLicense"
            value={values.drivingLicense}
            onChange={handleChange}
          />
          <DateField
            label="License expires at"
            name="drivingLicenseExpiresAt"
            value={values.drivingLicenseExpiresAt}
            onChange={handleChange}
            error={errors.drivingLicenseExpiresAt}
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Driving categories</p>
          <div className="flex flex-wrap gap-2">
            {drivingCategoryOptions.map((category) => (
              <label
                key={category}
                className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                  values.drivingCategories.includes(category)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                <input
                  type="checkbox"
                  checked={values.drivingCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="hidden"
                />
                {category}
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/40"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow disabled:opacity-60"
        >
          Save
        </button>
      </div>
    </form>
  );
}
