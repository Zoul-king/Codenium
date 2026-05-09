"use client";

import {
  CheckCircle2,
  ImagePlus,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
  XCircle
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DashboardEmptyState } from "@/features/dashboard/components/primitives";
import {
  cloneManagedPlanCatalog,
  defaultManagedPlans,
  fetchManagedPlanCatalog,
  saveManagedPlanCatalog,
  type ManagedPlanCatalog,
  type ManagedPlanRecord
} from "@/features/marketing/lib/plan-catalog";
import {
  fetchManagedLogos,
  fetchManagedPlanTexts,
  fetchManagedPortfolio,
  fetchManagedServicesPricing,
  saveManagedLogos,
  saveManagedPlanTexts,
  saveManagedPortfolio,
  saveManagedServicesPricing,
  uploadImage,
  type ManagedClientLogo,
  type ManagedPlanTexts,
  type ManagedPortfolioCard,
  type ManagedServicePricingItem
} from "@/features/marketing/lib/site-content";
import type { PlanProfile } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

type Section = "plans" | "services" | "logos" | "portfolio";

export function AdminPlanPanel() {
  const [section, setSection] = useState<Section>("plans");

  return (
    <div className="space-y-6">
      <header className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--role-strong,#3f237a)]">
              Catálogo
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">
              Editar elementos
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Administra planes, servicios, clientes y proyectos · cambios se publican al guardar.
            </p>
          </div>
        </div>
      </header>

      <Tabs value={section} onValueChange={(v) => setSection(v as Section)}>
        <TabsList variant="line" className="bg-transparent">
          <TabsTrigger value="plans">Planes</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="logos">Clientes</TabsTrigger>
          <TabsTrigger value="portfolio">Portafolio</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-6">
          <PlansEditor />
        </TabsContent>
        <TabsContent value="services" className="mt-6">
          <ServicesEditor />
        </TabsContent>
        <TabsContent value="logos" className="mt-6">
          <LogosEditor />
        </TabsContent>
        <TabsContent value="portfolio" className="mt-6">
          <PortfolioEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------- Planes ----------

function PlansEditor() {
  const [plans, setPlans] = useState<ManagedPlanCatalog>(() => cloneManagedPlanCatalog(defaultManagedPlans));
  const [texts, setTexts] = useState<ManagedPlanTexts>({});
  const [profile, setProfile] = useState<PlanProfile>("personal");
  const [editingPlan, setEditingPlan] = useState<{ profile: PlanProfile; plan: ManagedPlanRecord } | null>(null);
  const [draft, setDraft] = useState({
    title: "",
    note: "",
    customPriceLabel: "",
    items: [] as string[],
    setupFee: 0,
    monthlyFee: 0,
    discountPercentage: 0,
    active: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([fetchManagedPlanCatalog(), fetchManagedPlanTexts()])
      .then(([catalog, planTexts]) => {
        setPlans(applyTexts(cloneManagedPlanCatalog(catalog), planTexts));
        setTexts(planTexts);
      })
      .catch((error) => toast.error("No se pudieron cargar los planes", { description: error?.message }));
  }, []);

  const activeCount = useMemo(
    () => [...plans.personal, ...plans.business].filter((p) => p.active).length,
    [plans]
  );

  function openEdit(plan: ManagedPlanRecord) {
    setEditingPlan({ profile, plan });
    setDraft({
      title: plan.title,
      note: plan.note ?? "",
      customPriceLabel: plan.customPriceLabel ?? "",
      items: [...plan.items],
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
    const cleanedItems = draft.items.map((it) => it.trim()).filter((it) => it.length > 0);
    setPlans((current) => ({
      ...current,
      [targetProfile]: current[targetProfile].map((plan) =>
        plan.id === targetId
          ? {
              ...plan,
              title: draft.title.trim() || plan.title,
              note: draft.note.trim() ? draft.note.trim() : undefined,
              customPriceLabel: draft.customPriceLabel.trim() ? draft.customPriceLabel.trim() : undefined,
              items: cleanedItems.length > 0 ? cleanedItems : plan.items,
              setupFee: draft.setupFee,
              monthlyFee: draft.monthlyFee,
              discountPercentage: draft.discountPercentage,
              active: draft.active
            }
          : plan
      )
    }));
    setTexts((current) => ({
      ...current,
      [targetId]: {
        id: targetId,
        title: draft.title.trim() || editingPlan.plan.title,
        note: draft.note.trim() || undefined,
        customPriceLabel: draft.customPriceLabel.trim() || undefined,
        items: cleanedItems
      }
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
      const [saved] = await Promise.all([saveManagedPlanCatalog(plans), saveManagedPlanTexts(texts)]);
      setPlans(applyTexts(cloneManagedPlanCatalog(saved), texts));
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
      const [catalog, planTexts] = await Promise.all([fetchManagedPlanCatalog(), fetchManagedPlanTexts()]);
      setPlans(applyTexts(cloneManagedPlanCatalog(catalog), planTexts));
      setTexts(planTexts);
      toast.success("Recargado desde el servidor");
    } catch (error) {
      toast.error("No se pudo recargar", {
        description: error instanceof Error ? error.message : undefined
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">{activeCount} planes activos en total</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleReload}>
            <RefreshCw className="size-4" /> Recargar
          </Button>
          <Button className="btn-role" onClick={handleSave} disabled={saving}>
            <Save className="size-4" /> {saving ? "Guardando…" : "Publicar cambios"}
          </Button>
        </div>
      </div>

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
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {editingPlan ? (
            <>
              <SheetHeader>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Plan {editingPlan.profile === "business" ? "empresarial" : "personal"}
                </p>
                <SheetTitle>{editingPlan.plan.title}</SheetTitle>
                <SheetDescription>Editar texto, precios y visibilidad.</SheetDescription>
              </SheetHeader>

              <div className="grid gap-4 px-4 py-3">
                <div className="space-y-2">
                  <Label>Título del plan</Label>
                  <Input
                    value={draft.title}
                    onChange={(e) => setDraft((c) => ({ ...c, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nota descriptiva (opcional)</Label>
                  <Input
                    placeholder="Ej. Incluye todo lo del plan basico, mas:"
                    value={draft.note}
                    onChange={(e) => setDraft((c) => ({ ...c, note: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto de precio personalizado (opcional)</Label>
                  <Input
                    placeholder='Si lo llenas, reemplaza el precio. Ej. "Cotizacion personalizada."'
                    value={draft.customPriceLabel}
                    onChange={(e) => setDraft((c) => ({ ...c, customPriceLabel: e.target.value }))}
                  />
                </div>
                <ItemsEditor
                  items={draft.items}
                  onChange={(items) => setDraft((c) => ({ ...c, items }))}
                />
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
                  <X className="size-4" /> Cancelar
                </Button>
                <Button className="btn-role" onClick={applyDraft}>
                  <CheckCircle2 className="size-4" /> Aplicar
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function applyTexts(catalog: ManagedPlanCatalog, texts: ManagedPlanTexts): ManagedPlanCatalog {
  const apply = (plans: ManagedPlanRecord[]) =>
    plans.map((plan) => {
      const t = texts[plan.id];
      if (!t) return plan;
      return {
        ...plan,
        title: t.title || plan.title,
        note: t.note || plan.note,
        customPriceLabel: t.customPriceLabel || plan.customPriceLabel,
        items: t.items.length > 0 ? [...t.items] : [...plan.items]
      };
    });
  return { personal: apply(catalog.personal), business: apply(catalog.business) };
}

function ItemsEditor({ items, onChange }: { items: string[]; onChange: (next: string[]) => void }) {
  return (
    <div className="space-y-2">
      <Label>Características (una por línea)</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[index] = e.target.value;
                onChange(next);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ""]) }>
          <Plus className="size-4" /> Agregar línea
        </Button>
      </div>
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
                <CheckCircle2 className="size-3" /> Activo
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                <XCircle className="size-3" /> Inactivo
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
              <Pencil className="size-3.5" /> Editar
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

// ---------- Servicios ----------

function ServicesEditor() {
  const [items, setItems] = useState<ManagedServicePricingItem[]>([]);
  const [editing, setEditing] = useState<ManagedServicePricingItem | null>(null);
  const [draft, setDraft] = useState<ManagedServicePricingItem | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchManagedServicesPricing()
      .then(setItems)
      .catch((e) => toast.error("No se pudieron cargar los servicios", { description: e?.message }));
  }, []);

  function openEdit(item: ManagedServicePricingItem) {
    setEditing(item);
    setDraft({ ...item });
  }

  function openCreate() {
    const id = `service-custom-${Date.now()}`;
    const blank: ManagedServicePricingItem = {
      id,
      title: "Nuevo servicio",
      price: "",
      subtitle: "",
      description: "",
      active: true,
      order: items.length
    };
    setEditing(blank);
    setDraft(blank);
  }

  function applyDraft() {
    if (!draft) return;
    setItems((current) => {
      const exists = current.some((it) => it.id === draft.id);
      if (exists) return current.map((it) => (it.id === draft.id ? draft : it));
      return [...current, draft];
    });
    toast.success("Cambios listos", { description: "Recuerda guardar para publicar." });
    setEditing(null);
    setDraft(null);
  }

  function remove(id: string) {
    setItems((current) => current.filter((it) => it.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const saved = await saveManagedServicesPricing(items);
      setItems(saved);
      toast.success("Servicios publicados");
    } catch (error) {
      toast.error("No se pudieron guardar", {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">{items.filter((i) => i.active).length} servicios activos</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={openCreate}>
            <Plus className="size-4" /> Agregar servicio
          </Button>
          <Button className="btn-role" onClick={handleSave} disabled={saving}>
            <Save className="size-4" /> {saving ? "Guardando…" : "Publicar cambios"}
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <DashboardEmptyState title="Sin servicios" body="Agrega un servicio para empezar." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className={cn(
                "rounded-[var(--radius-card-dense)] border bg-white p-5 shadow-[var(--shadow-card-dense)]",
                item.active ? "border-slate-200" : "border-slate-200 opacity-70"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-950">{item.title}</h3>
                {item.active ? (
                  <Badge variant="secondary" className="bg-success-50 text-success-700">
                    <CheckCircle2 className="size-3" /> Activo
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                    <XCircle className="size-3" /> Inactivo
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-700">{item.price}</p>
              <p className="text-xs text-slate-500">{item.subtitle}</p>
              <p className="mt-2 line-clamp-3 text-xs text-slate-600">{item.description}</p>

              <div className="mt-4 flex items-center justify-between gap-2">
                <Switch
                  checked={item.active}
                  onCheckedChange={() =>
                    setItems((c) => c.map((it) => (it.id === item.id ? { ...it, active: !it.active } : it)))
                  }
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                    <Pencil className="size-3.5" /> Editar
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => remove(item.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Sheet open={!!editing} onOpenChange={(o) => !o && (setEditing(null), setDraft(null))}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {draft ? (
            <>
              <SheetHeader>
                <SheetTitle>Editar servicio</SheetTitle>
                <SheetDescription>El texto se publica tal cual aparezca aquí.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 px-4 py-3">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Precio</Label>
                  <Input
                    placeholder="Ej. Pago inicial de $2,500 MXN"
                    value={draft.price}
                    onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input
                    placeholder="Ej. Mensualidad de $900 MXN"
                    value={draft.subtitle}
                    onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    rows={4}
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-[12px] border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-950">Mostrar en sitio</p>
                  <Switch checked={draft.active} onCheckedChange={(v) => setDraft({ ...draft, active: v })} />
                </div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => (setEditing(null), setDraft(null))}>
                  <X className="size-4" /> Cancelar
                </Button>
                <Button className="btn-role" onClick={applyDraft}>
                  <CheckCircle2 className="size-4" /> Aplicar
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ---------- Logos ----------

function LogosEditor() {
  const [items, setItems] = useState<ManagedClientLogo[]>([]);
  const [editing, setEditing] = useState<ManagedClientLogo | null>(null);
  const [draft, setDraft] = useState<ManagedClientLogo | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchManagedLogos()
      .then(setItems)
      .catch((e) => toast.error("No se pudieron cargar los logos", { description: e?.message }));
  }, []);

  function openEdit(item: ManagedClientLogo) {
    setEditing(item);
    setDraft({ ...item });
  }

  function openCreate() {
    const blank: ManagedClientLogo = {
      id: `logo-custom-${Date.now()}`,
      alt: "Nueva marca",
      src: undefined,
      href: undefined,
      active: true,
      order: items.length
    };
    setEditing(blank);
    setDraft(blank);
  }

  function applyDraft() {
    if (!draft) return;
    setItems((current) => {
      const exists = current.some((it) => it.id === draft.id);
      if (exists) return current.map((it) => (it.id === draft.id ? draft : it));
      return [...current, draft];
    });
    toast.success("Cambios listos", { description: "Recuerda guardar para publicar." });
    setEditing(null);
    setDraft(null);
  }

  function remove(id: string) {
    setItems((current) => current.filter((it) => it.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const saved = await saveManagedLogos(items);
      setItems(saved);
      toast.success("Logos publicados");
    } catch (error) {
      toast.error("No se pudieron guardar", {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">
          {items.filter((i) => i.active).length} logos activos en el carrusel
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={openCreate}>
            <Plus className="size-4" /> Agregar logo
          </Button>
          <Button className="btn-role" onClick={handleSave} disabled={saving}>
            <Save className="size-4" /> {saving ? "Guardando…" : "Publicar cambios"}
          </Button>
        </div>
      </div>

      <div className="rounded-[12px] border border-slate-200 bg-amber-50/60 p-3 text-xs text-slate-700">
        <p className="font-semibold">Sugerencias para la imagen</p>
        <p className="mt-1 text-slate-600">
          Sube solo el logo, sin recuadro ni fondo (PNG o SVG con fondo transparente). Idealmente proporcionado horizontalmente
          (≈240×120px). Se centra en una tarjeta blanca y se ajusta sin recortar ni deformarse.
        </p>
      </div>

      {items.length === 0 ? (
        <DashboardEmptyState title="Sin logos" body="Agrega un logo para empezar." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className={cn(
                "rounded-[var(--radius-card-dense)] border bg-white p-5 shadow-[var(--shadow-card-dense)]",
                item.active ? "border-slate-200" : "border-slate-200 opacity-70"
              )}
            >
              <div className="flex h-24 items-center justify-center rounded-[10px] border border-slate-200 bg-slate-50">
                {item.src ? (
                  <img src={item.src} alt={item.alt} className="max-h-16 max-w-[80%] object-contain" />
                ) : (
                  <span className="text-sm font-semibold text-slate-700">{item.alt}</span>
                )}
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-950">{item.alt}</p>
              <p className="line-clamp-1 text-xs text-slate-500">{item.href || "Sin enlace"}</p>

              <div className="mt-4 flex items-center justify-between gap-2">
                <Switch
                  checked={item.active}
                  onCheckedChange={() =>
                    setItems((c) => c.map((it) => (it.id === item.id ? { ...it, active: !it.active } : it)))
                  }
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                    <Pencil className="size-3.5" /> Editar
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => remove(item.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Sheet open={!!editing} onOpenChange={(o) => !o && (setEditing(null), setDraft(null))}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {draft ? (
            <>
              <SheetHeader>
                <SheetTitle>Editar logo</SheetTitle>
                <SheetDescription>Sube el logo de la marca, sin fondo y sin recuadro.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 px-4 py-3">
                <ImagePreviewUploader
                  url={draft.src}
                  onUpload={(url) => setDraft({ ...draft, src: url })}
                  hint="Solo logo, fondo transparente (PNG/SVG)."
                  aspect="logo"
                />
                <div className="space-y-2">
                  <Label>Nombre de la marca</Label>
                  <Input value={draft.alt} onChange={(e) => setDraft({ ...draft, alt: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Enlace (opcional)</Label>
                  <Input
                    placeholder="https://..."
                    value={draft.href ?? ""}
                    onChange={(e) => setDraft({ ...draft, href: e.target.value || undefined })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-[12px] border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-950">Mostrar en carrusel</p>
                  <Switch checked={draft.active} onCheckedChange={(v) => setDraft({ ...draft, active: v })} />
                </div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => (setEditing(null), setDraft(null))}>
                  <X className="size-4" /> Cancelar
                </Button>
                <Button className="btn-role" onClick={applyDraft}>
                  <CheckCircle2 className="size-4" /> Aplicar
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ---------- Portfolio ----------

function PortfolioEditor() {
  const [items, setItems] = useState<ManagedPortfolioCard[]>([]);
  const [editing, setEditing] = useState<ManagedPortfolioCard | null>(null);
  const [draft, setDraft] = useState<ManagedPortfolioCard | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchManagedPortfolio()
      .then(setItems)
      .catch((e) => toast.error("No se pudo cargar el portafolio", { description: e?.message }));
  }, []);

  function openEdit(item: ManagedPortfolioCard) {
    setEditing(item);
    setDraft({ ...item, tags: [...item.tags] });
  }

  function openCreate() {
    const blank: ManagedPortfolioCard = {
      id: `portfolio-custom-${Date.now()}`,
      name: "Nuevo proyecto",
      year: new Date().getFullYear().toString(),
      description: "",
      tags: ["", "", ""],
      image: "",
      logo: undefined,
      href: undefined,
      active: true,
      order: items.length
    };
    setEditing(blank);
    setDraft(blank);
  }

  function applyDraft() {
    if (!draft) return;
    setItems((current) => {
      const exists = current.some((it) => it.id === draft.id);
      if (exists) return current.map((it) => (it.id === draft.id ? draft : it));
      return [...current, draft];
    });
    toast.success("Cambios listos", { description: "Recuerda guardar para publicar." });
    setEditing(null);
    setDraft(null);
  }

  function remove(id: string) {
    setItems((current) => current.filter((it) => it.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const saved = await saveManagedPortfolio(items);
      setItems(saved);
      toast.success("Portafolio publicado");
    } catch (error) {
      toast.error("No se pudo guardar", {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">{items.filter((i) => i.active).length} proyectos activos</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={openCreate}>
            <Plus className="size-4" /> Agregar proyecto
          </Button>
          <Button className="btn-role" onClick={handleSave} disabled={saving}>
            <Save className="size-4" /> {saving ? "Guardando…" : "Publicar cambios"}
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <DashboardEmptyState title="Sin proyectos" body="Agrega un proyecto para empezar." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className={cn(
                "rounded-[var(--radius-card-dense)] border bg-white p-5 shadow-[var(--shadow-card-dense)]",
                item.active ? "border-slate-200" : "border-slate-200 opacity-70"
              )}
            >
              <div className="relative h-32 overflow-hidden rounded-[10px] border border-slate-200 bg-slate-100">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="320px" className="object-cover" unoptimized />
                ) : null}
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={`${item.name} logo`}
                    className="absolute right-2 top-2 h-7 w-auto rounded bg-white/80 px-2 py-1"
                  />
                ) : null}
              </div>
              <div className="mt-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-950">{item.name}</h3>
                  <p className="text-xs text-slate-500">{item.year}</p>
                </div>
                {item.active ? (
                  <Badge variant="secondary" className="bg-success-50 text-success-700">
                    <CheckCircle2 className="size-3" /> Activo
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                    <XCircle className="size-3" /> Inactivo
                  </Badge>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-slate-600">{item.description}</p>
              <p className="mt-1 line-clamp-1 text-xs text-slate-500">{item.href || "Sin enlace"}</p>

              <div className="mt-4 flex items-center justify-between gap-2">
                <Switch
                  checked={item.active}
                  onCheckedChange={() =>
                    setItems((c) => c.map((it) => (it.id === item.id ? { ...it, active: !it.active } : it)))
                  }
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                    <Pencil className="size-3.5" /> Editar
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => remove(item.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Sheet open={!!editing} onOpenChange={(o) => !o && (setEditing(null), setDraft(null))}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {draft ? (
            <>
              <SheetHeader>
                <SheetTitle>Editar proyecto</SheetTitle>
                <SheetDescription>Imagen, logo, texto y enlace del sitio del proyecto.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 px-4 py-3">
                <div className="space-y-2">
                  <Label>Imagen principal</Label>
                  <ImagePreviewUploader
                    url={draft.image}
                    onUpload={(url) => setDraft({ ...draft, image: url })}
                    hint="Imagen del proyecto (JPG/PNG/WEBP, recomendado 1600px)."
                    aspect="cover"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo del proyecto</Label>
                  <ImagePreviewUploader
                    url={draft.logo}
                    onUpload={(url) => setDraft({ ...draft, logo: url })}
                    hint="Solo el logo, fondo transparente."
                    aspect="logo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nombre del proyecto</Label>
                  <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Año</Label>
                  <Input value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    rows={3}
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags (Enfoque · Resultado · Escala)</Label>
                  <div className="grid gap-2">
                    <Input
                      placeholder="Enfoque principal"
                      value={draft.tags[0] ?? ""}
                      onChange={(e) => {
                        const next = [...draft.tags];
                        next[0] = e.target.value;
                        setDraft({ ...draft, tags: next });
                      }}
                    />
                    <Input
                      placeholder="Resultado visible"
                      value={draft.tags[1] ?? ""}
                      onChange={(e) => {
                        const next = [...draft.tags];
                        next[1] = e.target.value;
                        setDraft({ ...draft, tags: next });
                      }}
                    />
                    <Input
                      placeholder="Escala del proyecto"
                      value={draft.tags[2] ?? ""}
                      onChange={(e) => {
                        const next = [...draft.tags];
                        next[2] = e.target.value;
                        setDraft({ ...draft, tags: next });
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>URL del sitio (botón "Visitar sitio")</Label>
                  <Input
                    placeholder="https://www.ejemplo.com"
                    value={draft.href ?? ""}
                    onChange={(e) => setDraft({ ...draft, href: e.target.value || undefined })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-[12px] border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-950">Mostrar en sitio</p>
                  <Switch checked={draft.active} onCheckedChange={(v) => setDraft({ ...draft, active: v })} />
                </div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => (setEditing(null), setDraft(null))}>
                  <X className="size-4" /> Cancelar
                </Button>
                <Button className="btn-role" onClick={applyDraft}>
                  <CheckCircle2 className="size-4" /> Aplicar
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ---------- Image upload ----------

function ImagePreviewUploader({
  url,
  onUpload,
  hint,
  aspect
}: {
  url?: string;
  onUpload: (url: string) => void;
  hint: string;
  aspect: "logo" | "cover";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const next = await uploadImage(file);
      onUpload(next);
      toast.success("Imagen subida");
    } catch (err) {
      toast.error("No se pudo subir", {
        description: err instanceof Error ? err.message : undefined
      });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-[12px] border border-dashed border-slate-300 bg-slate-50",
          aspect === "logo" ? "h-24" : "h-40"
        )}
      >
        {url ? (
          <img
            src={url}
            alt="preview"
            className={cn(aspect === "cover" ? "h-full w-full rounded-[12px] object-cover" : "max-h-16 max-w-[80%] object-contain")}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-400">
            <ImagePlus className="size-6" />
            <span className="text-xs">Sin imagen</span>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500">{hint}</p>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handle} />
      <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
        <Upload className="size-4" /> {busy ? "Subiendo…" : url ? "Reemplazar" : "Subir imagen"}
      </Button>
    </div>
  );
}
