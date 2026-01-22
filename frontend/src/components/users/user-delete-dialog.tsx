"use client";

import * as React from "react";

type UserDeleteDialogProps = {
  disabled?: boolean;
  onConfirm: () => void;
};

export function UserDeleteDialog({
  disabled = false,
  onConfirm,
}: UserDeleteDialogProps) {
  const handleClick = () => {
    if (disabled) {
      return;
    }
    const confirmed = window.confirm("Delete this user?");
    if (confirmed) {
      onConfirm();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="h-10 rounded-lg border border-destructive/50 px-4 text-sm font-semibold text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Delete User
    </button>
  );
}
