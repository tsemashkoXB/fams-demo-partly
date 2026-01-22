"use client";

import type { User } from "@/services/users";
import { formatIsoDate } from "@/services/users-date-utils";

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

export function UserDocsSection({ user }: { user: User }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Docs
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <ReadonlyField label="Driving license" value={user.drivingLicense} />
        <ReadonlyField
          label="License expires at"
          value={formatIsoDate(user.drivingLicenseExpiresAt)}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Driving categories</p>
        <div className="flex flex-wrap gap-2">
          {(user.drivingCategories ?? []).length > 0 ? (
            user.drivingCategories?.map((category) => (
              <span
                key={category}
                className="rounded-full border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
              >
                {category}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">&nbsp;</span>
          )}
        </div>
      </div>
    </section>
  );
}
