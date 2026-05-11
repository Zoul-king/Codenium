"use client";

import { CheckCircle2, MoreHorizontal, Pause, Plus, Trash2, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
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
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TextField } from "@/components/common/form-field";
import { getClientUsers, getPmStats, getPmUsers } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import type { UserRecord, UserState } from "@/lib/types/domain";

export function AdminTeamPanel() {
  const { state, setUserState, deleteUser } = useDashboardWorkspace();
  const clients = getClientUsers(state);
  const pms = getPmUsers(state);

  const teamStats = useMemo(() => {
    // "Activo" = tiene al menos un proyecto en curso (no done).
    const inProgressProjects = state.projects.filter((p) => p.status !== "done");
    const activePmIds = new Set(inProgressProjects.map((p) => p.pmId).filter(Boolean));
    const activeClientIds = new Set(inProgressProjects.map((p) => p.clientId));
    return {
      pmsTotal: pms.length,
      pmsActive: pms.filter((u) => activePmIds.has(u.id)).length,
      clientsTotal: clients.length,
      clientsActive: clients.filter((u) => activeClientIds.has(u.id)).length
    };
  }, [pms, clients, state.projects]);

  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<UserRecord | null>(null);

  async function toggleState(user: UserRecord) {
    const next: UserState = user.state === "active" ? "banned" : "active";
    setPendingUserId(user.id);
    try {
      await setUserState(user.id, next);
      toast.success(next === "active" ? `${user.name} reactivado` : `${user.name} suspendido`, {
        description:
          next === "active"
            ? "El usuario ya puede volver a iniciar sesión."
            : "El usuario quedó bloqueado para iniciar sesión hasta que lo reactives."
      });
    } catch (error) {
      toast.error("No se pudo actualizar", {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setPendingUserId(null);
    }
  }

  async function confirmDeleteAction() {
    if (!confirmDelete) return;
    const target = confirmDelete;
    setPendingUserId(target.id);
    try {
      await deleteUser(target.id);
      toast.success("Cuenta eliminada", {
        description: `${target.name} fue eliminado de la plataforma.`
      });
      setConfirmDelete(null);
    } catch (error) {
      toast.error("No se pudo eliminar la cuenta", {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setPendingUserId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <TeamStatChip label="PMs" value={teamStats.pmsTotal} />
          <TeamStatChip label="PMs activos" value={teamStats.pmsActive} tone="success" />
          <TeamStatChip label="Clientes" value={teamStats.clientsTotal} />
          <TeamStatChip label="Clientes activos" value={teamStats.clientsActive} tone="success" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CreateClientDialog />
          <CreatePmDialog />
        </div>
      </div>

      <Tabs defaultValue="pms">
        <TabsList variant="line" className="bg-transparent">
          <TabsTrigger value="pms">PMs</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="pms" className="mt-6">
          <UserTable
            users={pms}
            state={state}
            onToggle={toggleState}
            onDelete={(user) => setConfirmDelete(user)}
            pendingUserId={pendingUserId}
            kind="pm"
          />
        </TabsContent>
        <TabsContent value="clients" className="mt-6">
          <UserTable
            users={clients}
            state={state}
            onToggle={toggleState}
            onDelete={(user) => setConfirmDelete(user)}
            pendingUserId={pendingUserId}
            kind="client"
          />
        </TabsContent>
      </Tabs>

      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar cuenta</DialogTitle>
            <DialogDescription>
              Esta acción es <strong>permanente</strong>. La cuenta de{" "}
              <strong>{confirmDelete?.name}</strong> y sus datos asociados se borrarán y no podrán
              recuperarse.{" "}
              {confirmDelete?.role === "client"
                ? "Los proyectos activos del cliente se cancelarán."
                : "Los proyectos asignados quedarán sin PM hasta reasignarlos."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteAction}
              disabled={pendingUserId === confirmDelete?.id}
            >
              {pendingUserId === confirmDelete?.id ? "Eliminando…" : "Eliminar definitivamente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserTable({
  users,
  state,
  onToggle,
  onDelete,
  pendingUserId,
  kind
}: {
  users: UserRecord[];
  state: ReturnType<typeof useDashboardWorkspace>["state"];
  onToggle: (user: UserRecord) => void;
  onDelete: (user: UserRecord) => void;
  pendingUserId: string | null;
  kind: "pm" | "client";
}) {
  return (
    <div className="rounded-[var(--radius-card-dense)] border border-slate-200 bg-white shadow-[var(--shadow-card-dense)]">
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Email</TableHead>
            {kind === "pm" ? <TableHead>Carga</TableHead> : <TableHead>Empresa</TableHead>}
            <TableHead>Estado</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
            const busy = pendingUserId === user.id;
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-[var(--role-soft,#efe9fb)] text-xs font-semibold text-[var(--role-strong,#3f237a)]">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-950">{user.name}</p>
                      <p className="text-[11px] text-slate-500">{user.title}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-700">{user.email}</TableCell>
                {kind === "pm" ? (
                  <TableCell className="text-sm text-slate-700">
                    {(() => {
                      const stats = getPmStats(state, user.id);
                      return `${stats.activeProjects} activos · ${stats.completedProjects} cerrados`;
                    })()}
                  </TableCell>
                ) : (
                  <TableCell className="text-sm text-slate-700">{user.company ?? "—"}</TableCell>
                )}
                <TableCell>
                  {user.state === "active" ? (
                    <span className="badge-status-success">
                      <CheckCircle2 className="size-3" />
                      Activo
                    </span>
                  ) : (
                    <span className="badge-status-warning">
                      <Pause className="size-3" />
                      Suspendido
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" disabled={busy}>
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onToggle(user)}
                        variant={user.state === "active" ? "destructive" : "default"}
                      >
                        {user.state === "active" ? (
                          <>
                            <Pause className="size-4" />
                            Suspender
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="size-4" />
                            Reactivar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(user)} variant="destructive">
                        <Trash2 className="size-4" />
                        Eliminar cuenta
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-sm text-slate-500">
                Sin usuarios en esta categoría.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}

function CreatePmDialog() {
  const { createPmAccount } = useDashboardWorkspace();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      toast.error("Faltan datos", { description: "Nombre, apellido y correo son obligatorios." });
      return;
    }
    setSubmitting(true);
    try {
      const created = await createPmAccount(form);
      if (created.emailed === false) {
        toast.warning("PM creado, pero no enviamos el correo", {
          description: "Avisa al PM por otro canal o reintenta el envío."
        });
      } else {
        toast.success("PM creado", {
          description: "Le enviamos sus credenciales al correo registrado."
        });
      }
      setOpen(false);
      setForm({ firstName: "", lastName: "", email: "", phone: "" });
    } catch (error) {
      toast.error("No se pudo crear el PM", {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-role">
          <Plus className="size-4" />
          Nuevo PM
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span className="inline-flex items-center gap-2">
              <UserPlus className="size-5 text-[var(--role-strong,#3f237a)]" />
              Crear Project Manager
            </span>
          </DialogTitle>
          <DialogDescription>
            La persona recibirá un correo con sus credenciales y podrá ingresar al dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Nombre" placeholder="María" value={form.firstName} onChange={(v) => setForm((c) => ({ ...c, firstName: v }))} />
            <TextField label="Apellidos" placeholder="González" value={form.lastName} onChange={(v) => setForm((c) => ({ ...c, lastName: v }))} />
          </div>
          <TextField label="Correo" placeholder="maria@codenium.com" value={form.email} onChange={(v) => setForm((c) => ({ ...c, email: v }))} />
          <TextField label="Teléfono" placeholder="+52 …" value={form.phone} onChange={(v) => setForm((c) => ({ ...c, phone: v }))} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button className="btn-role" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creando…" : "Crear PM"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateClientDialog() {
  const { createClientAccount } = useDashboardWorkspace();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", company: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      toast.error("Faltan datos", { description: "Nombre, apellido y correo son obligatorios." });
      return;
    }
    setSubmitting(true);
    try {
      const created = await createClientAccount(form);
      if (created.emailed === false) {
        toast.warning("Cliente creado, pero no enviamos el correo", {
          description: "Comparte sus credenciales por otro canal o reintenta el envío."
        });
      } else {
        toast.success("Cliente creado", {
          description: "Le enviamos sus credenciales al correo registrado."
        });
      }
      setOpen(false);
      setForm({ firstName: "", lastName: "", email: "", phone: "", company: "" });
    } catch (error) {
      toast.error("No se pudo crear el cliente", {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="size-4" />
          Nuevo cliente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span className="inline-flex items-center gap-2">
              <UserPlus className="size-5 text-[var(--role-strong,#3f237a)]" />
              Crear cuenta de cliente
            </span>
          </DialogTitle>
          <DialogDescription>
            Le enviaremos un correo con sus credenciales y la sugerencia de cambiar la contraseña al primer acceso.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Nombre" placeholder="Juan" value={form.firstName} onChange={(v) => setForm((c) => ({ ...c, firstName: v }))} />
            <TextField label="Apellidos" placeholder="Pérez" value={form.lastName} onChange={(v) => setForm((c) => ({ ...c, lastName: v }))} />
          </div>
          <TextField label="Correo" placeholder="cliente@empresa.com" value={form.email} onChange={(v) => setForm((c) => ({ ...c, email: v }))} />
          <TextField label="Teléfono" placeholder="+52 …" value={form.phone} onChange={(v) => setForm((c) => ({ ...c, phone: v }))} />
          <TextField label="Empresa (opcional)" placeholder="Acme SA de CV" value={form.company} onChange={(v) => setForm((c) => ({ ...c, company: v }))} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button className="btn-role" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creando…" : "Crear cliente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TeamStatChip({
  label,
  value,
  tone = "neutral"
}: {
  label: string;
  value: number;
  tone?: "neutral" | "success";
}) {
  const toneCls =
    tone === "success" ? "bg-success-50 text-success-700" : "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium ${toneCls}`}>
      <span className="font-semibold">{value}</span>
      <span className="text-sm opacity-80">{label}</span>
    </span>
  );
}

void Badge;
