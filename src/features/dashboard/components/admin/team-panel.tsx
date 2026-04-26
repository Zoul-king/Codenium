"use client";

import { useState } from "react";

import { TextField } from "@/components/common/form-field";
import { DashboardCard, SectionHeading } from "@/features/dashboard/components/primitives";
import { getClientUsers, getPmUsers } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { sendDashboardNotification } from "@/lib/api/client";
import type { UserState } from "@/lib/types/domain";

export function AdminTeamPanel() {
  const { state, createPmAccount, setUserState } = useDashboardWorkspace();
  const clients = getClientUsers(state);
  const pms = getPmUsers(state);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [notice, setNotice] = useState("");

  function nextStateFor(current: UserState): UserState {
    return current === "active" ? "banned" : "active";
  }

  return (
    <div className="grid h-full gap-6 xl:grid-cols-[minmax(0,1.08fr)_340px]">
      <DashboardCard>
        <SectionHeading eyebrow="Usuarios" title="Clientes y project managers" />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <UserColumn title="Clientes" items={clients} onToggleState={setUserState} nextStateFor={nextStateFor} />
          <UserColumn title="Project managers" items={pms} onToggleState={setUserState} nextStateFor={nextStateFor} />
        </div>
      </DashboardCard>

      <DashboardCard className="h-fit xl:sticky xl:top-6">
        <SectionHeading eyebrow="Crear PM" title="Nueva cuenta interna" />
        <form
          className="mt-6 grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();

            if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
              return;
            }

            const nextForm = { ...form };
            createPmAccount(form);
            setForm({ firstName: "", lastName: "", email: "", phone: "" });

            try {
              await sendDashboardNotification({
                type: "pm_account_created",
                pmEmail: nextForm.email,
                pmName: `${nextForm.firstName} ${nextForm.lastName}`
              });

              setNotice("");
            } catch (error) {
              setNotice(error instanceof Error ? error.message : "No pudimos enviar el correo al nuevo PM.");
            }
          }}
        >
          <TextField label="Nombre" placeholder="Nombre" value={form.firstName} onChange={(value) => setForm((current) => ({ ...current, firstName: value }))} />
          <TextField label="Apellidos" placeholder="Apellidos" value={form.lastName} onChange={(value) => setForm((current) => ({ ...current, lastName: value }))} />
          <TextField label="Correo" placeholder="correo@codenium.com" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
          <TextField label="Telefono" placeholder="+52..." value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
          {notice ? <p className="text-sm font-medium text-rose-600">{notice}</p> : null}
          <button type="submit" className="dashboard-button-primary w-fit">
            Crear PM
          </button>
        </form>
      </DashboardCard>
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
    <section>
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <span className="text-sm font-semibold text-slate-500">{items.length}</span>
      </div>
      <div className="mt-4 grid gap-4">
        {items.map((user) => (
          <div key={user.id} className="dashboard-gridline grid gap-3 pb-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{user.name}</p>
                <p className="mt-1 text-sm text-slate-500">{user.company ?? user.email}</p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{user.state}</p>
            </div>
            <p className="text-sm text-slate-600">{user.email}</p>
            <button type="button" className="dashboard-button-secondary w-fit" onClick={() => onToggleState(user.id, nextStateFor(user.state))}>
              {user.state === "banned" ? "Reactivar" : "Banear"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
