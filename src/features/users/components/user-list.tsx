import { mockUsers } from "@/lib/mocks";

export function UserList() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {mockUsers.map((user) => (
        <article key={user.id} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-body-color">{user.name}</h3>
              <p className="mt-2 text-sm font-semibold text-primary-500">{user.title}</p>
              <p className="type-body mt-3">{user.email}</p>
            </div>
            <div className="text-right">
              <span className="tag">{user.role}</span>
              <p className="mt-3 text-sm text-body-color">{user.activeProjects} proyectos activos</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
