import type { AuthAccountRecord } from "@/lib/types/domain";

// Replace these credentials with a real identity provider/Auth.js later.
export const mockAuthAccounts: AuthAccountRecord[] = [
  {
    userId: "user-client-1",
    email: "client@codenium.com",
    password: "123provisional",
    role: "client"
  },
  {
    userId: "user-pm-1",
    email: "pm@codenium.com",
    password: "123provisional",
    role: "pm"
  },
  {
    userId: "user-admin-1",
    email: "admin@codenium.com",
    password: "123provisional",
    role: "admin"
  }
];
