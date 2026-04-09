const mockSettings = [
  "Reglas de estimación mock listas para salir a catálogos persistidos.",
  "Configuración de roles preparada para reemplazar por permisos reales.",
  "Datos de mensajes y proyectos centralizados en mocks intercambiables."
];

export function SettingsPanel() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {mockSettings.map((item) => (
        <article key={item} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
          <p className="type-body">{item}</p>
        </article>
      ))}
    </div>
  );
}
