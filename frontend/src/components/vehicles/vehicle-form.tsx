"use client";

import * as React from "react";
import type { Vehicle, VehicleImage } from "@/services/vehicles/queries";
import {
  type VehicleFormErrors,
  type VehicleFormValues,
  validateVehicleForm,
} from "@/components/vehicles/vehicle-form.validation";
import { VehicleImagesEditor } from "@/components/vehicles/vehicle-images-editor";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VehicleFormProps = {
  initialValues: VehicleFormValues;
  images?: VehicleImage[];
  onCancel: () => void;
  onSave: (values: VehicleFormValues) => void;
  onUploadImage: (file: File) => void;
  onRemoveImage: (imageId: number) => void;
  isSaving?: boolean;
  imagesDisabled?: boolean;
  pendingPreviewUrl?: string;
  onClearPendingImage?: () => void;
};

type FieldProps = {
  label: string;
  name: keyof VehicleFormValues;
  type?: string;
  value: string;
  error?: string;
  inputClassName?: string;
  placeholder?: string;
  onChange: (name: keyof VehicleFormValues, value: string) => void;
};

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  inputClassName,
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
        } ${inputClassName ?? ""}`}
      />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name: keyof VehicleFormValues;
  value: string;
  options: string[];
  error?: string;
  onChange: (name: keyof VehicleFormValues, value: string) => void;
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

type DatePickerFieldProps = {
  label: string;
  name: keyof VehicleFormValues;
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (name: keyof VehicleFormValues, value: string) => void;
};

function DatePickerField({
  label,
  name,
  value,
  error,
  disabled,
  onChange,
}: DatePickerFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      <span>{label}</span>
      <DatePicker
        value={value}
        onChange={(nextValue) => onChange(name, nextValue)}
        disabled={disabled}
        placeholder="dd.MM.yyyy"
      />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function VehicleForm({
  initialValues,
  images,
  onCancel,
  onSave,
  onUploadImage,
  onRemoveImage,
  isSaving = false,
  imagesDisabled = false,
  pendingPreviewUrl,
  onClearPendingImage,
}: VehicleFormProps) {
  const [values, setValues] = React.useState<VehicleFormValues>(initialValues);
  const [errors, setErrors] = React.useState<VehicleFormErrors>({});

  React.useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const handleChange = (name: keyof VehicleFormValues, value: string) => {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setErrors(validateVehicleForm(nextValues));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateVehicleForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSave(values);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <section className="space-y-4">
        <label className="sr-only" htmlFor="vehicle-model-name">
          Model name
        </label>
        <input
          id="vehicle-model-name"
          type="text"
          value={values.modelName}
          onChange={(event) => handleChange("modelName", event.target.value)}
          className="w-full rounded-md border border-border bg-transparent px-2 py-1 text-2xl font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.modelName && (
          <p className="text-xs text-destructive">{errors.modelName}</p>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <VehicleImagesEditor
            images={images}
            onUpload={onUploadImage}
            onRemove={onRemoveImage}
            disabled={imagesDisabled}
            pendingPreviewUrl={pendingPreviewUrl}
            onClearPending={onClearPendingImage}
          />
          <div className="space-y-3">
            <Field
              label="Plate number"
              name="plateNumber"
              value={values.plateNumber}
              onChange={handleChange}
              error={errors.plateNumber}
              inputClassName="text-lg font-semibold"
            />
            <Field
              label="Year of production"
              name="yearOfProduction"
              value={values.yearOfProduction}
              onChange={handleChange}
              error={errors.yearOfProduction}
              type="number"
            />
            <Field
              label="VIN"
              name="vin"
              value={values.vin}
              onChange={handleChange}
              error={errors.vin}
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Characteristics</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <SelectField
            label="Type"
            name="type"
            value={values.type}
            options={vehicleTypeOptions}
            onChange={handleChange}
            error={errors.type}
          />
          <Field
            label="Current mileage"
            name="currentMileage"
            value={values.currentMileage}
            onChange={handleChange}
            error={errors.currentMileage}
            type="number"
          />
          <Field label="Color" name="color" value={values.color} onChange={handleChange} />
          <Field
            label="Engine"
            name="engine"
            value={values.engine}
            onChange={handleChange}
          />
          <SelectField
            label="Fuel type"
            name="fuelType"
            value={values.fuelType}
            options={fuelTypeOptions}
            onChange={handleChange}
          />
          <Field
            label="Payload"
            name="payload"
            value={values.payload}
            onChange={handleChange}
            error={errors.payload}
            type="number"
          />
          <Field
            label="Seats"
            name="seats"
            value={values.seats}
            onChange={handleChange}
            error={errors.seats}
            type="number"
          />
          <Field
            label="Full mass"
            name="fullMass"
            value={values.fullMass}
            onChange={handleChange}
            error={errors.fullMass}
            type="number"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Documentation</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <Field
            label="Vehicle passport"
            name="vehiclePassport"
            value={values.vehiclePassport}
            onChange={handleChange}
          />
          <DatePickerField
            label="Vehicle passport issued"
            name="vehiclePassportIssuedDate"
            value={values.vehiclePassportIssuedDate}
            onChange={handleChange}
            disabled={isSaving}
          />
          <Field
            label="Insurance"
            name="insurance"
            value={values.insurance}
            onChange={handleChange}
          />
          <DatePickerField
            label="Insurance expires at"
            name="insuranceExpiresAt"
            value={values.insuranceExpiresAt}
            onChange={handleChange}
            disabled={isSaving}
          />
          <Field
            label="Next service at"
            name="nextServiceAtMileage"
            value={values.nextServiceAtMileage}
            onChange={handleChange}
            error={errors.nextServiceAtMileage}
            type="number"
          />
          <DatePickerField
            label="Next service till"
            name="nextServiceTillDate"
            value={values.nextServiceTillDate}
            onChange={handleChange}
            disabled={isSaving}
          />
          <DatePickerField
            label="State inspection expires at"
            name="stateInspectionExpiresAt"
            value={values.stateInspectionExpiresAt}
            onChange={handleChange}
            disabled={isSaving}
          />
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export function buildVehicleFormValues(vehicle?: Vehicle): VehicleFormValues {
  return {
    plateNumber: vehicle?.plateNumber ?? "",
    modelName: vehicle?.modelName ?? "",
    type: vehicle?.type ?? "",
    yearOfProduction: vehicle?.yearOfProduction?.toString() ?? "",
    vin: vehicle?.vin ?? "",
    currentMileage: vehicle?.currentMileage?.toString() ?? "",
    color: vehicle?.color ?? "",
    engine: vehicle?.engine ?? "",
    fuelType: vehicle?.fuelType ?? "",
    payload: vehicle?.payload?.toString() ?? "",
    seats: vehicle?.seats?.toString() ?? "",
    fullMass: vehicle?.fullMass?.toString() ?? "",
    vehiclePassport: vehicle?.vehiclePassport ?? "",
    vehiclePassportIssuedDate: vehicle?.vehiclePassportIssuedDate ?? "",
    insurance: vehicle?.insurance ?? "",
    insuranceExpiresAt: vehicle?.insuranceExpiresAt ?? "",
    nextServiceAtMileage: vehicle?.nextServiceAtMileage?.toString() ?? "",
    nextServiceTillDate: vehicle?.nextServiceTillDate ?? "",
    stateInspectionExpiresAt: vehicle?.stateInspectionExpiresAt ?? "",
  };
}
  const vehicleTypeOptions = ["PC", "Pass Van", "Van", "CV", "Bus"];
  const fuelTypeOptions = ["Petrol", "Gas", "Diesel"];
