"use client";

import { useEffect } from "react";

const REFERRAL_STORAGE_KEY = "store-referral-code";

export function ReferralTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref")?.trim();
    if (ref && ref.length > 0 && ref.length <= 50) {
      try {
        localStorage.setItem(REFERRAL_STORAGE_KEY, ref);
      } catch {
        // ignore
      }
    }
  }, []);

  return null;
}

export function getStoredReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(REFERRAL_STORAGE_KEY);
    return raw && raw.trim() ? raw.trim() : null;
  } catch {
    return null;
  }
}
