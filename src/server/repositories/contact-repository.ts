import { db } from "@/lib/db";

export async function listContactLeads() {
  return db.contactLead.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}
