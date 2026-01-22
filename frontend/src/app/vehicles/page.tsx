'use client';

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { VehicleAddButton } from '@/components/vehicles/vehicle-add-button';
import { VehicleDeleteDialog } from '@/components/vehicles/vehicle-delete-dialog';
import { VehicleDetailsPanel } from '@/components/vehicles/vehicle-details-panel';
import {
  VehicleForm,
  buildVehicleFormValues,
} from '@/components/vehicles/vehicle-form';
import { VehiclesSearch } from '@/components/vehicles/vehicles-search';
import { VehiclesEmptyState } from '@/components/vehicles/vehicles-empty-state';
import { VehiclesTable } from '@/components/vehicles/vehicles-table';
import {
  useVehicleDetailsQuery,
  useVehiclesQuery,
} from '@/services/vehicles/queries';
import { getVehicleWarnings } from '@/services/vehicles/warnings';
import type { Vehicle, VehicleImage } from '@/services/vehicles/queries';
import {
  useCreateVehicleMutation,
  useDeleteVehicleImageMutation,
  useDeleteVehicleMutation,
  useUpdateVehicleMutation,
  uploadVehicleImage,
  useUploadVehicleImageMutation,
} from '@/services/vehicles/mutations';

export default function VehiclesPage() {
  const [search, setSearch] = React.useState('');
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [pendingImageFile, setPendingImageFile] = React.useState<File | null>(
    null,
  );
  const [pendingImageUrl, setPendingImageUrl] = React.useState<string>('');
  const skipEditResetRef = React.useRef(false);
  const queryClient = useQueryClient();

  const appendImage = React.useCallback(
    (vehicleId: number, image: VehicleImage) => {
      const append = (images?: VehicleImage[]) => {
        const next = images ? [...images, image] : [image];
        return next.sort((a, b) => b.displayOrder - a.displayOrder);
      };

      queryClient.setQueryData<Vehicle>(['vehicle', vehicleId], (current) =>
        current ? { ...current, images: append(current.images) } : current
      );

      queryClient.setQueryData<Vehicle[]>(['vehicles'], (current) =>
        current
          ? current.map((vehicle) =>
              vehicle.id === vehicleId
                ? { ...vehicle, images: append(vehicle.images) }
                : vehicle
            )
          : current
      );
    },
    [queryClient]
  );
  const { data: vehicles = [], isLoading, isError } = useVehiclesQuery(search);

  React.useEffect(() => {
    if (isAdding) {
      return;
    }
    if (vehicles.length === 0) {
      setSelectedId(null);
      return;
    }
    const isSelectedInList = vehicles.some(
      (vehicle) => vehicle.id === selectedId,
    );
    if (!isSelectedInList) {
      setSelectedId(vehicles[0].id);
    }
  }, [vehicles, selectedId]);

  React.useEffect(() => {
    if (!isAdding) {
      if (skipEditResetRef.current) {
        skipEditResetRef.current = false;
        return;
      }
      setIsEditing(false);
    }
  }, [isAdding, selectedId]);

  React.useEffect(() => {
    if (!pendingImageFile) {
      setPendingImageUrl('');
      return;
    }
    const objectUrl = URL.createObjectURL(pendingImageFile);
    setPendingImageUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [pendingImageFile]);

  const { data: selectedVehicleDetails, isLoading: isDetailsLoading } =
    useVehicleDetailsQuery(selectedId ?? undefined);

  const selectedVehicle =
    selectedVehicleDetails ??
    (selectedId === null
      ? null
      : (vehicles.find((vehicle) => vehicle.id === selectedId) ?? null));

  const updateMutation = useUpdateVehicleMutation(selectedId ?? 0);
  const createMutation = useCreateVehicleMutation();
  const deleteMutation = useDeleteVehicleMutation();
  const uploadMutation = useUploadVehicleImageMutation(selectedId ?? 0);
  const deleteImageMutation = useDeleteVehicleImageMutation(selectedId ?? 0);

  const formValues = React.useMemo(() => {
    if (isAdding) {
      return buildVehicleFormValues();
    }
    return buildVehicleFormValues(selectedVehicle ?? undefined);
  }, [isAdding, selectedVehicle]);

  const toNullableNumber = (value: string) =>
    value.trim() === '' ? null : Number(value);
  const toNullableString = (value: string) =>
    value.trim() === '' ? null : value;

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-6 overflow-hidden">
      {isEditing && (
        <div className="fixed inset-0 z-40 bg-black/50 pointer-events-none" />
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Vehicles</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage fleet inventory details.
          </p>
        </div>
        <VehicleAddButton
          disabled={isEditing}
          onAdd={() => {
            setIsAdding(true);
            setIsEditing(true);
            setSelectedId(null);
          }}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 xl:flex-row">
        <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden">
          <VehiclesSearch value={search} onChange={setSearch} />
          <div className="flex-1 min-h-0 overflow-y-auto">
            {isLoading ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                Loading vehicles...
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
                Unable to load vehicles. Try again.
              </div>
            ) : vehicles.length === 0 ? (
              <VehiclesEmptyState />
            ) : (
              <VehiclesTable
                vehicles={vehicles}
                selectedId={selectedId}
                onSelect={setSelectedId}
                disabled={isEditing}
              />
            )}
          </div>
        </section>

        <aside
          className={`relative z-50 flex w-full max-w-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border xl:max-w-[550px] xl:self-stretch ${
            isEditing ? 'bg-card shadow-lg' : 'bg-muted/20'
          }`}
        >
          {isDetailsLoading && selectedId ? (
            <div className="p-6 text-sm text-muted-foreground">
              Loading details...
            </div>
          ) : selectedVehicle || isAdding ? (
            isEditing ? (
              <>
                <div className="flex-1 min-h-0 overflow-y-auto p-6">
                <VehicleForm
                  initialValues={formValues}
                  images={selectedVehicle?.images}
                  imagesDisabled={false}
                  pendingPreviewUrl={pendingImageUrl}
                  onClearPendingImage={() => setPendingImageFile(null)}
                  onCancel={() => {
                    setIsEditing(false);
                    setIsAdding(false);
                    setPendingImageFile(null);
                  }}
                  onSave={(values) => {
                      const payload = {
                        plateNumber: values.plateNumber.trim(),
                        modelName: values.modelName.trim(),
                        type: values.type,
                        yearOfProduction: Number(values.yearOfProduction),
                        vin: values.vin.trim(),
                        currentMileage:
                          toNullableNumber(values.currentMileage) ?? 0,
                        color: toNullableString(values.color),
                        engine: toNullableString(values.engine),
                        fuelType: toNullableString(values.fuelType),
                        payload: toNullableNumber(values.payload),
                        seats: toNullableNumber(values.seats),
                        fullMass: toNullableNumber(values.fullMass),
                        vehiclePassport: toNullableString(
                          values.vehiclePassport,
                        ),
                        vehiclePassportIssuedDate: toNullableString(
                          values.vehiclePassportIssuedDate,
                        ),
                        insurance: toNullableString(values.insurance),
                        insuranceExpiresAt: toNullableString(
                          values.insuranceExpiresAt,
                        ),
                        nextServiceAtMileage: toNullableNumber(
                          values.nextServiceAtMileage,
                        ),
                        nextServiceTillDate: toNullableString(
                          values.nextServiceTillDate,
                        ),
                        stateInspectionExpiresAt: toNullableString(
                          values.stateInspectionExpiresAt,
                        ),
                      };

                      if (isAdding) {
                        createMutation.mutate(payload, {
                          onSuccess: async (created) => {
                            skipEditResetRef.current = true;
                            setSelectedId(created.id);
                            setIsAdding(false);
                            setIsEditing(true);
                            if (pendingImageFile) {
                              const image = await uploadVehicleImage(
                                created.id,
                                pendingImageFile,
                              );
                              appendImage(created.id, image);
                              queryClient.invalidateQueries({
                                queryKey: ['vehicle', created.id],
                              });
                              queryClient.invalidateQueries({
                                queryKey: ['vehicles'],
                              });
                              setPendingImageFile(null);
                            }
                          },
                        });
                        return;
                      }

                      if (selectedId) {
                        updateMutation.mutate(payload, {
                          onSuccess: () => setIsEditing(false),
                        });
                      }
                    }}
                    onUploadImage={(file) => {
                      if (isAdding) {
                        setPendingImageFile(file);
                        return;
                      }
                      uploadMutation.mutate(file);
                    }}
                    onRemoveImage={(imageId) =>
                      deleteImageMutation.mutate(imageId)
                    }
                    isSaving={
                      updateMutation.isPending || createMutation.isPending
                    }
                  />
                </div>
              </>
            ) : selectedVehicle ? (
              <>
                <div className="flex-1 min-h-0 overflow-y-auto p-6">
                  <VehicleDetailsPanel
                    vehicle={selectedVehicle}
                    warnings={getVehicleWarnings(selectedVehicle).map(
                      (warning) => warning.message,
                    )}
                    onEdit={() => setIsEditing(true)}
                    editDisabled={isEditing}
                  />
                </div>
                <div className="border-t border-border p-6">
                  <VehicleDeleteDialog
                    disabled={isEditing}
                    onConfirm={() => {
                      if (!selectedId) {
                        return;
                      }
                      deleteMutation.mutate(selectedId, {
                        onSuccess: () => setSelectedId(null),
                      });
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="p-6 text-sm text-muted-foreground">
                Start filling out the form to add a new vehicle.
              </div>
            )
          ) : (
            <div className="p-6 text-sm text-muted-foreground">
              Select a vehicle to view details.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
