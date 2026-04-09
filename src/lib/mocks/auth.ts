import type { AuthAccountRecord } from "@/lib/types/domain";

// Replace these credentials with a real identity provider/Auth.js later.
export const mockAuthAccounts: AuthAccountRecord[] = [
  {
    userId: "user-client-1",
    email: "paola@valhui.mx",
    password: "Client123!",
    role: "client"
  },
  {
    userId: "user-pm-1",
    email: "javier@axolotlcode.tech",
    password: "Pm123456!",
    role: "pm"
  },
  {
    userId: "user-admin-1",
    email: "admin@axolotlcode.tech",
    password: "Admin123!",
    role: "admin"
  }
];
