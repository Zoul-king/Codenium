export interface LicenseStatus {
  valid: boolean;
  reason?: "missing_key" | "missing_expiration" | "invalid_expiration" | "expired";
  expiresAt?: Date;
}

export function validateLicense(now: Date = new Date()): LicenseStatus {
  const key = (process.env.LICENSE_KEY ?? "").trim();
  const expiresAtRaw = (process.env.LICENSE_EXPIRES_AT ?? "").trim();

  if (!key) {
    return { valid: false, reason: "missing_key" };
  }

  if (!expiresAtRaw) {
    return { valid: false, reason: "missing_expiration" };
  }

  const expiresAt = new Date(expiresAtRaw);
  if (Number.isNaN(expiresAt.getTime())) {
    return { valid: false, reason: "invalid_expiration" };
  }

  if (now.getTime() >= expiresAt.getTime()) {
    return { valid: false, reason: "expired", expiresAt };
  }

  return { valid: true, expiresAt };
}

export function isLicenseValid(): boolean {
  return validateLicense().valid;
}
