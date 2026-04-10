"use client";

import { useState } from "react";

import { TextField } from "@/components/ui/form-controls";
import { DashboardCard, DashboardMutedCard, SectionHeading, StatusBadge } from "@/features/dashboard/components/dashboard-ui";
import { getClientUsers, getPmUsers } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import type { UserState } from "@/lib/types/domain";

export function AdminTeamPanel() {
  const { state, createPmAccount, setUserState } = useDashboardWorkspace();
  const clients = getClientUsers(state);
  const pms = getPmUsers(state);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });

  function nextStateFor(current: UserState): UserState {
    if (current === "active") {
      return "banned";
    }

    return "active";
  }

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <DashboardCard>
        <SectionHeading eyebrow="Usuarios" title="Clientes y PM visibles" />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <UserColumn title="Clientes" items={clients} onToggleState={setUserState} nextStateFor={nextStateFor} />
          <UserColumn title="Project Managers" items={pms} onToggleState={setUserState} nextStateFor={nextStateFor} />
        </div>
      </DashboardCard>

      <DashboardMutedCard>
        <SectionHeading eyebrow="Crear PM" title="Nueva cuenta interna" />
        <form
          className="mt-6 grid gap-4 rounded-[22px] border border-slate-200 bg-white p-5"
          onSubmit={(event) => {
            event.preventDefault();

            if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
              return;
            }

            createPmAccount(form);
            setForm({ firstName: "", lastName: "", email: "", phone: "" });
          }}
        >
          <TextField label="Nombre" placeholder="Nombre" value={form.firstName} onChange={(value) => setForm((current) => ({ ...current, firstName: value }))} />
          <TextField label="Apellidos" placeholder="Apellidos" value={form.lastName} onChange={(value) => setForm((current) => ({ ...current, lastName: value }))} />
          <TextField label="Correo" placeholder="correo@codenium.com" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
          <TextField label="Telefono" placeholder="+52..." value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
          <button type="submit" className="dashboard-button-primary w-fit">
            Crear PM
          </button>
        </form>
      </DashboardMutedCard>
    </div>
  );
}

function UserColumn({
  title,
  items,
  onToggleState,
  nextStateFor
}: {
  title: string;
  items: Array<{ id: string; name: string; email: string; company?: string; state: UserState }>;
  onToggleState: (userId: string, state: UserState) => void;
  nextStateFor: (state: UserState) => UserState;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <span className="text-sm font-semibold text-slate-500">{items.length}</span>
      </div>
      <div className="mt-4 grid gap-3">
        {items.map((user) => (
          <div key={user.id} className="rounded-[18px] border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{user.name}</p>
                <p className="mt-1 text-sm text-slate-500">{user.company ?? user.email}</p>
              </div>
              <StatusBadge tone={user.state === "active" ? "success" : user.state === "inactive" ? "warning" : "danger"}>{user.state}</StatusBadge>
            </div>
            <p className="mt-2 text-sm text-slate-600">{user.email}</p>
            <button type="button" className="dashboard-button-secondary mt-4" onClick={() => onToggleState(user.id, nextStateFor(user.state))}>
              {user.state === "banned" ? "Reactivar" : "Banear"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
