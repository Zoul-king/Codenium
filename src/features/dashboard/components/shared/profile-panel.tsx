"use client";

import { Briefcase, Building2, Mail, Phone, ShieldCheck, UserSquare } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DashboardEmptyState } from "@/features/dashboard/components/primitives";
import {
  getPrimaryUser,
  getSelectedOrPrimaryProject,
  getUserById
} from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import type { Role } from "@/lib/types/domain";

interface ProfilePanelProps {
  role: Extract<Role, "client" | "pm">;
}

export function ProfilePanel({ role }: ProfilePanelProps) {
  const { state } = useDashboardWorkspace();
  const user = getPrimaryUser(state, role);
  const project = getSelectedOrPrimaryProject(state, role);
  const counterpart = getUserById(state, role === "client" ? project?.pmId : project?.clientId);

  if (!user) {
    return <DashboardEmptyState title="Sin usuario" body="No hay perfil para este rol." />;
  }

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <header className="warm-card relative overflow-hidden">
        <div className="absolute -right-16 -top-16 size-56 rounded-full bg-[var(--role,#5e92c2)]/15 blur-3xl" />
        <div className="relative flex flex-wrap items-start gap-6">
          <Avatar className="size-20 ring-4 ring-white">
            <AvatarFallback className="bg-[var(--role-strong,#224a78)] text-2xl font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">{user.name}</h1>
              {user.state === "active" ? (
                <Badge className="bg-success-50 text-success-700">
                  <ShieldCheck className="size-3" />
                  Activo
                </Badge>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-slate-600">{user.title}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--role-strong,#224a78)]">
              Rol · {role === "client" ? "Cliente" : "Project manager"}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-semibold text-slate-950">Datos de contacto</h2>
          <Separator className="my-4" />
          <ProfileRow icon={<Mail className="size-4" />} label="Correo" value={user.email} />
          <ProfileRow icon={<Phone className="size-4" />} label="Teléfono" value={user.phone || "Sin teléfono"} />
          <ProfileRow icon={<Building2 className="size-4" />} label="Empresa" value={user.company ?? "Codenium (interno)"} />
          <ProfileRow icon={<UserSquare className="size-4" />} label="ID interno" value={user.id} last />
        </section>

        <section className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-semibold text-slate-950">Relación operativa</h2>
          <Separator className="my-4" />
          {project ? (
            <>
              <ProfileRow icon={<Briefcase className="size-4" />} label="Proyecto activo" value={project.name} />
              <ProfileRow
                icon={<UserSquare className="size-4" />}
                label={role === "client" ? "PM asignado" : "Cliente"}
                value={counterpart?.name ?? "Pendiente"}
              />
              {counterpart?.email ? (
                <ProfileRow icon={<Mail className="size-4" />} label="Correo" value={counterpart.email} />
              ) : null}
              <ProfileRow
                icon={<Building2 className="size-4" />}
                label="Origen"
                value={project.intakeSource === "service" ? "Servicio" : "Plan"}
                last
              />
            </>
          ) : (
            <DashboardEmptyState
              title="Sin proyecto activo"
              body="Selecciona uno para ver tu contraparte y datos del proyecto."
            />
          )}
        </section>
      </div>
    </div>
  );
}

function ProfileRow({
  icon,
  label,
  value,
  last
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "border-b border-slate-100 pb-3 mb-3"}>
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-[var(--role-soft,#eff6fb)] text-[var(--role-strong,#224a78)]">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
          <p className="text-sm font-semibold text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}
