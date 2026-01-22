"use client";

import type { User } from "@/services/users";

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

export function UserContactsSection({ user }: { user: User }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Contacts
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <ReadonlyField label="Email" value={user.email} />
        <ReadonlyField label="Phone" value={user.phone} />
      </div>
    </section>
  );
}
