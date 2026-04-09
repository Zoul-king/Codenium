import { mockUsers } from "@/lib/mocks";

export function ProfilePanel() {
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
          <span className="text-sm font-semibold text-primary-500">Teléfono</span>
          <p className="mt-1 text-body-color">{user?.phone}</p>
        </div>
        <div>
          <span className="text-sm font-semibold text-primary-500">Empresa</span>
          <p className="mt-1 text-body-color">{user?.company ?? "Pendiente"}</p>
        </div>
        <div>
          <span className="text-sm font-semibold text-primary-500">Proyectos activos</span>
          <p className="mt-1 text-body-color">{user?.activeProjects}</p>
        </div>
      </div>
    </article>
  );
}
