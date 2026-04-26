import type { ApiActionResult, DashboardNotificationPayload, PublicLeadPayload } from "@/lib/types/api";

export async function submitPublicLead(payload: PublicLeadPayload) {
  return postJson<ApiActionResult>("/api/forms", payload);
}

export async function sendDashboardNotification(payload: DashboardNotificationPayload) {
  return postJson<ApiActionResult>("/api/dashboard/notify", payload);
}

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? "No pudimos completar la solicitud.");
  }

  return data;
}
