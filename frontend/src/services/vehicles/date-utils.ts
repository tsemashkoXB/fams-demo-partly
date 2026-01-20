import { format, isValid, parse, parseISO } from "date-fns";

const displayFormat = "dd.MM.yyyy";
const inputFormat = "yyyy-MM-dd";

export function formatIsoDate(value?: string | null): string {
  if (!value) {
    return "";
  }
  const date = parseISO(value);
  if (!isValid(date)) {
    return "";
  }
  return format(date, displayFormat);
}

export function parseDisplayDate(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = parse(trimmed, displayFormat, new Date());
  if (!isValid(parsed)) {
    return null;
  }
  return parsed.toISOString();
}

export function formatIsoDateInput(value?: string | null): string {
  if (!value) {
    return "";
  }
  const date = parseISO(value);
  if (!isValid(date)) {
    return "";
  }
  return format(date, inputFormat);
}

export function parseDateInput(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = parse(trimmed, inputFormat, new Date());
  if (!isValid(parsed)) {
    return null;
  }
  return parsed.toISOString();
}
