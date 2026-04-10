import type { ReactNode } from "react";

import { DashboardWorkspaceProvider } from "@/features/dashboard/lib/workspace-store";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-dvh overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(104,184,178,0.16),transparent_22%),radial-gradient(circle_at_top_right,rgba(34,74,120,0.12),transparent_22%),linear-gradient(180deg,#f6f8fb_0%,#edf3f5_100%)]">
      <DashboardWorkspaceProvider>{children}</DashboardWorkspaceProvider>
    </div>
  );
}
