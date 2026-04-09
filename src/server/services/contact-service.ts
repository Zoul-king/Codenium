import { listContactLeads } from "@/server/repositories";

export async function getContactLeads() {
  return listContactLeads();
}
