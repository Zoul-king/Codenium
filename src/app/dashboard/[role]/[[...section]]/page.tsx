import { notFound } from "next/navigation";

import { MarketingShell } from "@/features/marketing/components/marketing-shell";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { getDashboardCopy, getDashboardMetrics } from "@/features/dashboard/lib/content";
import { MessageList } from "@/features/messages/components/message-list";
import { ProjectList } from "@/features/projects/components/project-list";
import { QuoteList } from "@/features/quotes/components/quote-list";
import { UserList } from "@/features/users/components/user-list";
import { dashboardNav, mockProjects, mockUsers } from "@/lib/mocks";
import type { Role } from "@/lib/types/domain";

const validRoles: Role[] = ["client", "pm", "admin"];

interface DashboardPageProps {
  params: Promise<{
    role: string;
    section?: string[];
  }>;
}

function resolveRole(role: string): Role | null {
  return validRoles.includes(role as Role) ? (role as Role) : null;
}

function DashboardContent({ role, section }: { role: Role; section: string }) {
  if (section === "quotes") {
    return <QuoteList role={role} />;
  }

  if (section === "projects") {
    return <ProjectList role={role} />;
  }

  if (section === "messages") {
    return <MessageList role={role} />;
  }

  if (section === "profile" && role === "client") {
    const user = mockUsers.find((item) => item.role === "client");

    return (
      <article className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
        <h2 className="text-2xl font-bold text-body-color">{user?.name}</h2>
        <p className="mt-2 text-sm font-semibold text-primary-500">{user?.title}</p>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <span className="text-sm font-semibold text-primary-500">Correo</span>
            <p className="mt-1 text-body-color">{user?.email}</p>
          </div>
          <div>
            <span className="text-sm font-semibold text-primary-500">Proyectos activos</span>
            <p className="mt-1 text-body-color">{user?.activeProjects}</p>
          </div>
        </div>
      </article>
    );
  }

  if (section === "timeline" && role === "pm") {
    return (
      <div className="grid grid-cols-1 gap-4">
        {mockProjects.map((project) => (
          <article key={project.id} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h3 className="text-xl font-bold text-body-color">{project.name}</h3>
              <span className="tag">{project.progress}%</span>
            </div>
            <p className="type-body mt-3">{project.summary}</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-foreground">
              <div className="h-full rounded-full bg-primary-500" style={{ width: `${project.progress}%` }} />
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (section === "tasks" && role === "pm") {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[
          "Definir alcance final de checkout para Nutrition Lab.",
          "Alinear prioridades del sprint con equipo frontend.",
          "Confirmar accesos de staging con cliente Sittycia."
        ].map((task) => (
          <article key={task} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
            <h3 className="text-lg font-bold text-body-color">{task}</h3>
          </article>
        ))}
      </div>
    );
  }

  if (section === "users" && role === "admin") {
    return <UserList />;
  }

  if (section === "assignments" && role === "admin") {
    return (
      <div className="grid grid-cols-1 gap-4">
        {mockProjects.map((project) => {
          const pm = mockUsers.find((user) => user.id === project.pmId);

          return (
            <article key={project.id} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
              <h3 className="text-xl font-bold text-body-color">{project.name}</h3>
              <p className="type-body mt-2">Cliente: {project.clientName}</p>
              <p className="mt-4 text-sm font-semibold text-primary-500">Responsable actual</p>
              <p className="mt-1 text-body-color">{pm?.name}</p>
            </article>
          );
        })}
      </div>
    );
  }

  if (section === "settings" && role === "admin") {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          "Reglas de estimacion mock listas para salir a catalogos persistidos.",
          "Configuracion de roles preparada para reemplazar por permisos reales.",
          "Datos de mensajes y proyectos centralizados en mocks intercambiables."
        ].map((item) => (
          <article key={item} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
            <p className="type-body">{item}</p>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <article className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
        <span className="type-kicker">Vista principal</span>
        <h2 className="mt-4 text-2xl font-bold text-body-color">Estado general</h2>
        <p className="type-body mt-4">
          Esta vista consolida la navegacion mock del rol y queda preparada para conectarse a fuentes reales sin cambiar la UI.
        </p>
      </article>
      <article className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
        <span className="type-kicker">Actividad reciente</span>
        <div className="mt-4 space-y-3">
          {mockProjects.slice(0, 3).map((project) => (
            <div key={project.id} className="rounded-[18px] bg-foreground p-4">
              <strong className="block text-body-color">{project.name}</strong>
              <p className="mt-2 text-sm text-gray-600">{project.summary}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { role: rawRole, section } = await params;
  const role = resolveRole(rawRole);

  if (!role) {
    notFound();
  }

  const activeSection = section?.[0] ?? "summary";

  if (!dashboardNav[role].some((item) => item.key === activeSection)) {
    notFound();
  }

  const copy = getDashboardCopy(role, activeSection);
  const metrics = getDashboardMetrics(role);

  return (
    <MarketingShell headerVariant="pink">
      <DashboardShell role={role} activeKey={activeSection} title={copy.title} description={copy.description} metrics={metrics}>
        <DashboardContent role={role} section={activeSection} />
      </DashboardShell>
    </MarketingShell>
  );
}
