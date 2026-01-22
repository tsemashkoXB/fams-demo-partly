"use client";

import * as React from "react";

type UsersSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function UsersSearch({ value, onChange }: UsersSearchProps) {
  return (
    <div className="w-full max-w-sm">
      <label htmlFor="users-search" className="sr-only">
        Search users
      </label>
      <input
        id="users-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name, role, status, dates"
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-primary"
      />
    </div>
  );
}
