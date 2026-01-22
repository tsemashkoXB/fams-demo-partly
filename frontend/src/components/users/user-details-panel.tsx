"use client";

import type { User, UserImage } from "@/services/users";
import { formatIsoDate } from "@/services/users-date-utils";
import { getUserWarnings } from "@/components/users/user-warnings";
import { UserContactsSection } from "@/components/users/user-contacts-section";
import { UserDocsSection } from "@/components/users/user-docs-section";

type UserDetailsPanelProps = {
  user: User;
  onEdit?: () => void;
  editDisabled?: boolean;
};

type FieldProps = {
  label: string;
  value: string | number | null;
};

function ReadonlyField({ label, value }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      <span>{label}</span>
      <input
        type="text"
        value={value ?? ""}
        readOnly
        className="h-9 rounded-md border border-border bg-muted/40 px-3 text-sm text-foreground"
      />
    </label>
  );
}

function getPrimaryImage(images?: UserImage[]): UserImage | null {
  if (!images || images.length === 0) {
    return null;
  }
  return images.reduce((primary, image) =>
    image.displayOrder > primary.displayOrder ? image : primary
  );
}

export function UserDetailsPanel({
  user,
  onEdit,
  editDisabled = false,
}: UserDetailsPanelProps) {
  const warnings = getUserWarnings(user);
  const primaryImage = getPrimaryImage(user.images);
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  const imageUrl = primaryImage
    ? primaryImage.relativePath.startsWith("http")
      ? primaryImage.relativePath
      : `${apiBaseUrl}/${primaryImage.relativePath}`
    : "";

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {user.name} {user.surname}
          </h2>
          <button
            type="button"
            onClick={onEdit}
            disabled={editDisabled}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Edit
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/30">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${user.name} ${user.surname}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm text-muted-foreground">No image</span>
            )}
          </div>
          <div className="space-y-3">
            <ReadonlyField label="Status" value={user.status} />
            <ReadonlyField label="Gender" value={user.gender} />
            <ReadonlyField label="Position" value={user.position} />
            <ReadonlyField label="Date of birth" value={formatIsoDate(user.dateOfBirth)} />
            <ReadonlyField
              label="Contract termination"
              value={formatIsoDate(user.contractTerminationDate)}
            />
          </div>
        </div>
      </section>

      <UserContactsSection user={user} />
      <UserDocsSection user={user} />

      {warnings.length > 0 && (
        <section className="space-y-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </section>
      )}
    </div>
  );
}
