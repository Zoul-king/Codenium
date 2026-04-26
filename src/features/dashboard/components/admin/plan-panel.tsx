"use client";

import { CheckCircle2, Pencil, RefreshCw, Save, X, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardEmptyState } from "@/features/dashboard/components/primitives";
import {
  cloneManagedPlanCatalog,
  defaultManagedPlans,
  fetchManagedPlanCatalog,
  saveManagedPlanCatalog,
  type ManagedPlanCatalog,
  type ManagedPlanRecord
} from "@/features/marketing/lib/plan-catalog";
import type { PlanProfile } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

export function AdminPlanPanel() {
  const [plans, setPlans] = useState<ManagedPlanCatalog>(() => cloneManagedPlanCatalog(defaultManagedPlans));
  const [profile, setProfile] = useState<PlanProfile>("personal");
  const [editingPlan, setEditingPlan] = useState<{ profile: PlanProfile; plan: ManagedPlanRecord } | null>(null);
  const [draft, setDraft] = useState({ setupFee: 0, monthlyFee: 0, discountPercentage: 0, active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchManagedPlanCatalog()
      .then((next) => setPlans(cloneManagedPlanCatalog(next)))
      .catch((error) => toast.error("No se pudieron cargar los planes", { description: error?.message }));
  }, []);

  const currentPlans = useMemo(() => plans[profile], [plans, profile]);
  const activeCount = useMemo(
    () => [...plans.personal, ...plans.business].filter((p) => p.active).length,
    [plans]
  );

  function openEdit(plan: ManagedPlanRecord) {
    setEditingPlan({ profile, plan });
    setDraft({
      setupFee: plan.setupFee ?? 0,
      monthlyFee: plan.monthlyFee ?? 0,
      discountPercentage: plan.discountPercentage,
      active: plan.active
    });
  }

  function applyDraft() {
    if (!editingPlan) return;
    const targetProfile = editingPlan.profile;
    const targetId = editingPlan.plan.id;
    setPlans((current) => ({
      ...current,
      [targetProfile]: current[targetProfile].map((plan) =>
        plan.id === targetId
          ? {
              ...plan,
              setupFee: draft.setupFee,
              monthlyFee: draft.monthlyFee,
              discountPercentage: draft.discountPercentage,
              active: draft.active
            }
          : plan
      )
    }));
    toast.success("Cambios listos", { description: "Recuerda guardar para publicar." });
    setEditingPlan(null);
  }

  function toggleActive(plan: ManagedPlanRecord, profileKey: PlanProfile) {
    setPlans((current) => ({
      ...current,
      [profileKey]: current[profileKey].map((p) => (p.id === plan.id ? { ...p, active: !p.active } : p))
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const saved = await saveManagedPlanCatalog(plans);
      setPlans(cloneManagedPlanCatalog(saved));
      toast.success("Planes publicados");
    } catch (error) {
      toast.error("No se pudieron guardar", {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleReload() {
    try {
      const next = await fetchManagedPlanCatalog();
      setPlans(cloneManagedPlanCatalog(next));
      toast.success("Recargado desde el servidor");
    } catch (error) {
      toast.error("No se pudo recargar", {
        description: error instanceof Error ? error.message : undefined
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--role-strong,#3f237a)]">
              Catálogo
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">Planes y precios</h1>
            <p className="mt-1 text-sm text-slate-600">
              {activeCount} planes activos en total · cambios surten efecto al guardar
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={handleReload}>
              <RefreshCw className="size-4" />
              Recargar
            </Button>
            <Button className="btn-role" onClick={handleSave} disabled={saving}>
              <Save className="size-4" />
              {saving ? "Guardando…" : "Publicar cambios"}
            </Button>
          </div>
        </div>
      </header>

      <Tabs value={profile} onValueChange={(v) => setProfile(v as PlanProfile)}>
        <TabsList variant="line" className="bg-transparent">
          <TabsTrigger value="personal">Personal ({plans.personal.length})</TabsTrigger>
          <TabsTrigger value="business">Empresarial ({plans.business.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PlansGrid plans={plans.personal} profile="personal" onEdit={openEdit} onToggle={toggleActive} />
        </TabsContent>
        <TabsContent value="business" className="mt-6">
          <PlansGrid plans={plans.business} profile="business" onEdit={openEdit} onToggle={toggleActive} />
        </TabsContent>
      </Tabs>

      <Sheet open={!!editingPlan} onOpenChange={(o) => !o && setEditingPlan(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {editingPlan ? (
            <>
              <SheetHeader>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Plan {editingPlan.profile === "business" ? "empresarial" : "personal"}
                </p>
                <SheetTitle>{editingPlan.plan.title}</SheetTitle>
                <SheetDescription>{editingPlan.plan.items.join(" · ")}</SheetDescription>
              </SheetHeader>

              <div className="grid gap-4 px-4 py-3">
                <div className="space-y-2">
                  <Label>Pago inicial (MXN)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={draft.setupFee}
                    onChange={(e) => setDraft((c) => ({ ...c, setupFee: Math.max(0, Number(e.target.value) || 0) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mensualidad (MXN)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={draft.monthlyFee}
                    onChange={(e) => setDraft((c) => ({ ...c, monthlyFee: Math.max(0, Number(e.target.value) || 0) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descuento (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={draft.discountPercentage}
                    onChange={(e) =>
                      setDraft((c) => ({
                        ...c,
                        discountPercentage: Math.min(100, Math.max(0, Number(e.target.value) || 0))
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-[12px] border border-slate-200 p-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Mostrar en sitio</p>
                    <p className="text-xs text-slate-500">Si está apagado el plan no es visible públicamente.</p>
                  </div>
                  <Switch checked={draft.active} onCheckedChange={(v) => setDraft((c) => ({ ...c, active: v }))} />
                </div>
              </div>

              <SheetFooter>
                <Button variant="outline" onClick={() => setEditingPlan(null)}>
                  <X className="size-4" />
                  Cancelar
                </Button>
                <Button className="btn-role" onClick={applyDraft}>
                  <CheckCircle2 className="size-4" />
                  Aplicar
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function PlansGrid({
  plans,
  profile,
  onEdit,
  onToggle
}: {
  plans: ManagedPlanRecord[];
  profile: PlanProfile;
  onEdit: (plan: ManagedPlanRecord) => void;
  onToggle: (plan: ManagedPlanRecord, profile: PlanProfile) => void;
}) {
  if (plans.length === 0) {
    return <DashboardEmptyState title="Sin planes" body="No hay planes en este perfil." />;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => (
        <article
          key={plan.id}
          className={cn(
            "rounded-[var(--radius-card-dense)] border bg-white p-5 shadow-[var(--shadow-card-dense)] transition",
            plan.active ? "border-slate-200" : "border-slate-200 opacity-70"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-slate-950">{plan.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{plan.items.join(" · ")}</p>
            </div>
            {plan.active ? (
              <Badge variant="secondary" className="bg-success-50 text-success-700">
                <CheckCircle2 className="size-3" />
                Activo
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                <XCircle className="size-3" />
                Inactivo
              </Badge>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Setup" value={`$${(plan.setupFee ?? 0).toLocaleString("es-MX")}`} />
            <Stat label="Mensual" value={`$${(plan.monthlyFee ?? 0).toLocaleString("es-MX")}`} />
            <Stat label="Desc." value={`${plan.discountPercentage}%`} />
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <Switch checked={plan.active} onCheckedChange={() => onToggle(plan, profile)} />
            <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
              <Pencil className="size-3.5" />
              Editar
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-slate-200 bg-slate-50 px-2 py-2 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
