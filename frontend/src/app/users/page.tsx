'use client';

import * as React from 'react';
import { UsersSearch } from '@/components/users/users-search';
import { UsersTable } from '@/components/users/users-table';
import { UserDeleteDialog } from '@/components/users/user-delete-dialog';
import { UserDetailsPanel } from '@/components/users/user-details-panel';
import {
  UserEditForm,
  buildUserFormValues,
} from '@/components/users/user-edit-form';
import {
  useDeleteUserImageMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUploadUserImageMutation,
  useUserDetailsQuery,
  useUsersQuery,
} from '@/services/users.queries';

export default function UsersPage() {
  const [searchInput, setSearchInput] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const { data: users = [], isLoading, isError } = useUsersQuery(search);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  React.useEffect(() => {
    if (isAdding) {
      return;
    }
    if (users.length === 0) {
      setSelectedId(null);
      return;
    }
    const isSelectedInList = users.some((user) => user.id === selectedId);
    if (!isSelectedInList) {
      setSelectedId(users[0].id);
    }
  }, [users, selectedId, isAdding]);

  React.useEffect(() => {
    if (!isAdding) {
      setIsEditing(false);
    }
  }, [isAdding, selectedId]);

  const { data: selectedUserDetails, isLoading: isDetailsLoading } =
    useUserDetailsQuery(selectedId ?? undefined);

  const selectedUser =
    selectedUserDetails ??
    (selectedId === null
      ? null
      : (users.find((user) => user.id === selectedId) ?? null));

  const updateMutation = useUpdateUserMutation(selectedId ?? 0);
  const createMutation = useCreateUserMutation();
  const deleteMutation = useDeleteUserMutation();
  const uploadMutation = useUploadUserImageMutation(selectedId ?? 0);
  const deleteImageMutation = useDeleteUserImageMutation(selectedId ?? 0);

  const formValues = React.useMemo(() => {
    if (isAdding) {
      return buildUserFormValues();
    }
    return buildUserFormValues(selectedUser ?? undefined);
  }, [selectedUser, isAdding]);

  const toNullableString = (value: string) =>
    value.trim() === '' ? null : value;

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-6 overflow-hidden">
      {isEditing && (
        <div className="fixed inset-0 z-40 bg-black/50 pointer-events-none" />
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">
            Review staff profiles and compliance details.
          </p>
        </div>
        <button
          type="button"
          disabled={isEditing}
          onClick={() => {
            setIsAdding(true);
            setIsEditing(true);
            setSelectedId(null);
          }}
          className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add User
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 xl:flex-row">
        <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden">
          <UsersSearch value={searchInput} onChange={setSearchInput} />
          <div className="flex-1 min-h-0 overflow-y-auto">
            {isLoading ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                Loading users...
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
                Unable to load users. Try again.
              </div>
            ) : users.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                No users found.
              </div>
            ) : (
              <UsersTable
                users={users}
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
          ) : selectedUser || isAdding ? (
            isEditing ? (
              <div className="flex-1 min-h-0 overflow-y-auto p-6">
                <UserEditForm
                  initialValues={formValues}
                  images={selectedUser?.images}
                  onCancel={() => {
                    setIsEditing(false);
                    setIsAdding(false);
                  }}
                  onSave={(values) => {
                    const payload = {
                      name: values.name.trim(),
                      surname: values.surname.trim(),
                      status: values.status,
                      gender: values.gender,
                      position: values.position,
                      dateOfBirth: toNullableString(values.dateOfBirth),
                      contractTerminationDate: toNullableString(
                        values.contractTerminationDate,
                      ),
                      email: toNullableString(values.email),
                      phone: toNullableString(values.phone),
                      drivingLicense: toNullableString(values.drivingLicense),
                      drivingLicenseExpiresAt: toNullableString(
                        values.drivingLicenseExpiresAt,
                      ),
                      drivingCategories: values.drivingCategories,
                    };

                    if (isAdding) {
                      createMutation.mutate(payload, {
                        onSuccess: (created) => {
                          setSelectedId(created.id);
                          setIsAdding(false);
                          setIsEditing(false);
                        },
                      });
                      return;
                    }

                    if (!selectedId) {
                      return;
                    }

                    updateMutation.mutate(payload, {
                      onSuccess: () => setIsEditing(false),
                    });
                  }}
                  onUploadImage={(file) => uploadMutation.mutate(file)}
                  onRemoveImage={(imageId) =>
                    deleteImageMutation.mutate(imageId)
                  }
                  isSaving={
                    updateMutation.isPending || createMutation.isPending
                  }
                  imagesDisabled={isAdding}
                />
              </div>
            ) : (
              <>
                <div className="flex-1 min-h-0 overflow-y-auto p-6">
                  {selectedUser ? (
                    <UserDetailsPanel
                      user={selectedUser}
                      onEdit={() => setIsEditing(true)}
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Select a user to see details.
                    </div>
                  )}
                </div>
                <div className="border-t border-border p-6">
                  <UserDeleteDialog
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
            )
          ) : (
            <div className="p-6 text-sm text-muted-foreground">
              {isAdding
                ? 'Start filling out the form to add a new user.'
                : 'Select a user to see details.'}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
