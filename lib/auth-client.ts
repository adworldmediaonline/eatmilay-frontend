"use client";

import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

// Use same-origin /api/auth (proxied to backend) for cross-domain cookie support
export const authClient = createAuthClient({
  baseURL: "/api/auth",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [emailOTPClient()],
});
