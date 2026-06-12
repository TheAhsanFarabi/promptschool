"use client";

const KEY = "promptschool_user_api_key";

export function getUserApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setUserApiKey(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, key.trim());
}

export function clearUserApiKey(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
