"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CreditCard,
  FileText,
  FolderKanban,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PackageCheck,
  UserRound,
  Users
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "@/components/ui/command";
import { logout } from "@/features/auth/lib/session-store";
import { dashboardNav } from "@/lib/mocks";
import type { Role } from "@/lib/types/domain";

const SECTION_ICONS: Record<string, typeof Home> = {
  projects: LayoutDashboard,
  metrics: LayoutDashboard,
  plans: PackageCheck,
  milestones: FolderKanban,
  chat: MessageSquare,
  payments: CreditCard,
  deliverables: PackageCheck,
  profile: UserRound,
  quotes: FileText,
  users: Users
};

interface CommandPaletteProps {
  role: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ role, open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  function navigate(href: string) {
    router.push(href);
    onOpenChange(false);
  }

  async function handleLogout() {
    await logout();
    router.push("/");
    onOpenChange(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Buscar" description="Navega rápido por el dashboard">
      <CommandInput placeholder="Buscar sección, acción o atajo…" />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>

        <CommandGroup heading="Navegación">
          {dashboardNav[role].map((item) => {
            const Icon = SECTION_ICONS[item.key] ?? Home;
            return (
              <CommandItem key={item.key} value={`navegar ${item.label}`} onSelect={() => navigate(item.href)}>
                <Icon className="size-4" />
                <span>{item.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Acciones">
          <CommandItem value="ir al inicio" onSelect={() => navigate("/")}>
            <Home className="size-4" />
            <span>Volver al inicio</span>
          </CommandItem>
          <CommandItem value="cerrar sesión" onSelect={handleLogout}>
            <LogOut className="size-4" />
            <span>Cerrar sesión</span>
            <CommandShortcut>⇧⌘Q</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPaletteShortcut(setOpen: (open: boolean | ((v: boolean) => boolean)) => void) {
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);
}

export function useCommandPaletteState() {
  const [open, setOpen] = useState(false);
  useCommandPaletteShortcut(setOpen);
  return { open, setOpen };
}
