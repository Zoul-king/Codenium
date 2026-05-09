"use client";

import { AlertTriangle, Briefcase, Building2, Mail, Phone, ShieldCheck, Trash2, UserSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
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
  role: Role;
}

const roleLabel: Record<Role, string> = {
  client: "Cliente",
  pm: "Project manager",
  admin: "Administración"
};

export function ProfilePanel({ role }: ProfilePanelProps) {
  const { state } = useDashboardWorkspace();
  const user = getPrimaryUser(state, role);
  const project = role !== "admin" ? getSelectedOrPrimaryProject(state, role) : undefined;
  const counterpart = getUserById(state, role === "client" ? project?.pmId : role === "pm" ? project?.clientId : undefined);

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
              Rol · {roleLabel[role]}
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
          <h2 className="text-base font-semibold text-slate-950">
            {role === "admin" ? "Cobertura del equipo" : "Relación operativa"}
          </h2>
          <Separator className="my-4" />
          {role === "admin" ? (
            <>
              <ProfileRow
                icon={<Briefcase className="size-4" />}
                label="Proyectos en plataforma"
                value={`${state.projects.length}`}
              />
              <ProfileRow
                icon={<UserSquare className="size-4" />}
                label="Usuarios registrados"
                value={`${state.users.length}`}
              />
              <ProfileRow
                icon={<Building2 className="size-4" />}
                label="Cotizaciones"
                value={`${state.quotes.length}`}
                last
              />
            </>
          ) : project ? (
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

      {role === "client" ? <DeleteAccountSection userId={user.id} userName={user.name} /> : null}
    </div>
  );
}

function DeleteAccountSection({ userId, userName }: { userId: string; userName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const response = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "No se pudo eliminar la cuenta.");
      }
      toast.success("Cuenta eliminada", {
        description: "Tus datos fueron borrados de la plataforma. Esperamos verte de vuelta."
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("No se pudo eliminar la cuenta", {
        description: error instanceof Error ? error.message : undefined
      });
      setDeleting(false);
    }
  }

  return (
    <section className="rounded-[var(--radius-card)] border border-error-100 bg-error-50/40 p-6 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-error-700">
            Zona de riesgo
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">Eliminar mi cuenta</h2>
          <p className="mt-1 text-sm text-slate-600">
            Borra tu cuenta y todos los datos relacionados. Esta acción es permanente y no podrá
            revertirse.
          </p>
        </div>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          <Trash2 className="size-4" />
          Eliminar mi cuenta
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(next) => (!deleting ? setOpen(next) : undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-error-700">
              <AlertTriangle className="size-5" />
              Eliminar cuenta de {userName}
            </DialogTitle>
            <DialogDescription className="space-y-3 text-slate-700">
              <span className="block">
                Al eliminar tu cuenta lo haces de forma <strong>permanente</strong>. Tus datos
                personales, mensajes y cotizaciones se borrarán y no podrán recuperarse.
              </span>
              <span className="block">
                <strong>Tus proyectos activos terminarán su desarrollo</strong> y dejarán de estar
                disponibles. Si tienes pagos o entregables pendientes, te recomendamos coordinarlo
                con tu PM antes de continuar.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Eliminando…" : "Sí, eliminar mi cuenta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
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
