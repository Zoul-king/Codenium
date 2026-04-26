"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardCard, DashboardEmptyState, SectionHeading, StatusBadge } from "@/features/dashboard/components/primitives";
import { cloneManagedPlanCatalog, defaultManagedPlans, fetchManagedPlanCatalog, saveManagedPlanCatalog, type ManagedPlanCatalog } from "@/features/marketing/lib/plan-catalog";
import type { PlanProfile } from "@/lib/types/domain";

export function AdminPlanPanel() {
  const [plans, setPlans] = useState<ManagedPlanCatalog>(() => cloneManagedPlanCatalog(defaultManagedPlans));
  const [profile, setProfile] = useState<PlanProfile>("personal");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchManagedPlanCatalog()
      .then((nextPlans) => setPlans(cloneManagedPlanCatalog(nextPlans)))
      .catch((error) => setNotice(error instanceof Error ? error.message : "No se pudieron cargar los planes."));
  }, []);

  const currentPlans = useMemo(() => plans[profile], [plans, profile]);
  const activeCount = useMemo(() => [...plans.personal, ...plans.business].filter((plan) => plan.active).length, [plans]);

  function updatePlan(planId: string, field: "setupFee" | "monthlyFee" | "discountPercentage" | "active", value: string | boolean) {
    setPlans((current) => ({
      ...current,
      [profile]: current[profile].map((plan) => {
        if (plan.id !== planId) {
          return plan;
        }

        if (field === "active") {
          return { ...plan, active: Boolean(value) };
        }

        const parsedValue = typeof value === "string" && value.trim() ? Number(value) : 0;

        return {
          ...plan,
          [field]: Number.isFinite(parsedValue) ? Math.max(0, Math.round(parsedValue)) : 0
        };
      })
    }));
  }

  async function handleSave() {
    try {
      const savedPlans = await saveManagedPlanCatalog(plans);
      setPlans(cloneManagedPlanCatalog(savedPlans));
      setNotice("Planes guardados correctamente.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudieron guardar los planes.");
    }
  }

  async function handleReload() {
    try {
      const nextPlans = await fetchManagedPlanCatalog();
      setPlans(cloneManagedPlanCatalog(nextPlans));
      setNotice("Se recargaron los planes persistidos.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudieron recargar los planes.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <DashboardCard>
        <SectionHeading
          eyebrow="Planes"
          title="Administracion de precios"
          description="Edita montos, descuentos y activacion por perfil sin romper la estructura visual existente."
          action={
            <div className="inline-flex rounded-[12px] border border-slate-200 bg-slate-50 p-1">
              {([
                ["personal", "Perfil personal"],
                ["business", "Perfil empresarial"]
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setProfile(key)}
                  className={`rounded-[10px] px-4 py-2 text-sm font-semibold ${profile === key ? "bg-[#4f2f96] text-white" : "text-slate-600"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          }
        />

        <div className="mt-8 grid gap-5">
          {currentPlans.length ? (
            currentPlans.map((plan) => (
              <article key={plan.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{plan.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{plan.items.join(" · ")}</p>
                  </div>
                  <StatusBadge tone={plan.active ? "success" : "danger"}>{plan.active ? "Activo" : "Inactivo"}</StatusBadge>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Pago inicial
                    <input
                      type="number"
                      min="0"
                      value={plan.setupFee ?? 0}
                      onChange={(event) => updatePlan(plan.id, "setupFee", event.target.value)}
                      className="dashboard-input"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Mensualidad
                    <input
                      type="number"
                      min="0"
                      value={plan.monthlyFee ?? 0}
                      onChange={(event) => updatePlan(plan.id, "monthlyFee", event.target.value)}
                      className="dashboard-input"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Descuento %
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={plan.discountPercentage}
                      onChange={(event) => updatePlan(plan.id, "discountPercentage", event.target.value)}
                      className="dashboard-input"
                    />
                  </label>
                </div>

                <label className="mt-4 inline-flex items-center gap-3 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={plan.active} onChange={(event) => updatePlan(plan.id, "active", event.target.checked)} />
                  Mostrar este plan en el sitio
                </label>
              </article>
            ))
          ) : (
            <DashboardEmptyState title="Sin planes en este perfil" body="Activa al menos un plan para volver a publicarlo." />
          )}
        </div>
      </DashboardCard>

      <DashboardCard className="h-fit xl:sticky xl:top-6">
        <SectionHeading eyebrow="Publicacion" title="Resumen" />
        <div className="mt-6 grid gap-4">
          <SummaryRow label="Planes activos" value={String(activeCount)} />
          <SummaryRow label="Perfil actual" value={profile === "business" ? "Empresarial" : "Personal"} />
          <SummaryRow label="Con descuento" value={String(currentPlans.filter((plan) => plan.discountPercentage > 0).length)} />
        </div>
        {notice ? <p className="mt-5 text-sm font-medium text-emerald-700">{notice}</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="dashboard-button-primary" onClick={handleSave}>
            Guardar cambios
          </button>
          <button type="button" className="dashboard-button-secondary" onClick={handleReload}>
            Recargar guardado
          </button>
        </div>
      </DashboardCard>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-lg font-semibold text-slate-950">{value}</span>
    </div>
  );
}
