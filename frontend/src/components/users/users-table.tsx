"use client";

import * as React from "react";
import type { User, UserImage } from "@/services/users";
import { formatIsoDate } from "@/services/users-date-utils";
import { getUserWarnings } from "@/components/users/user-warnings";

type UsersTableProps = {
  users: User[];
  selectedId: number | null;
  onSelect: (userId: number) => void;
  disabled?: boolean;
};

function getPrimaryImage(images?: UserImage[]): UserImage | null {
  if (!images || images.length === 0) {
    return null;
  }
  return images.reduce((primary, image) =>
    image.displayOrder > primary.displayOrder ? image : primary
  );
}

export function UsersTable({
  users,
  selectedId,
  onSelect,
  disabled = false,
}: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Position</th>
            <th className="px-4 py-3 text-left">DoB</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Alert</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelected = user.id === selectedId;
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
              <tr
                key={user.id}
                className={`cursor-pointer border-t border-border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isSelected ? "bg-accent/40" : "hover:bg-muted/60"
                } ${disabled ? "pointer-events-none opacity-60" : ""}`}
                onClick={() => onSelect(user.id)}
                tabIndex={disabled ? -1 : 0}
                role="button"
                aria-pressed={isSelected}
                onKeyDown={(event) => {
                  if (disabled) {
                    return;
                  }
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(user.id);
                  }
                }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 overflow-hidden rounded-full bg-muted/40">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${user.name} ${user.surname}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          {user.name.charAt(0)}{user.surname.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {user.name} {user.surname}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.position}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{user.position}</td>
                <td className="px-4 py-3">{formatIsoDate(user.dateOfBirth)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {warnings.length > 0 ? (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                      {warnings.length}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
