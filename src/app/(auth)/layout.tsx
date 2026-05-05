import type { ReactNode } from "react";

import { AuthCloseButton } from "@/features/auth/components/auth-close-button";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-[100dvh] bg-surface-soft">
      <AuthCloseButton />
      {children}
    </div>
  );
}
