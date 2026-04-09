import { AdminQuotePanel } from "@/features/dashboard/components/admin-quote-panel";
import type { Role } from "@/lib/types/domain";

interface QuoteListProps {
  role?: Role;
}

export function QuoteList(_: QuoteListProps) {
  return <AdminQuotePanel />;
}
