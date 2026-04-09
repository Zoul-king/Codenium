const mockSettings = [
  {
    title: "Criterios de estimado",
    description: "Rangos base por tipo de proyecto y módulos para orientar nuevas solicitudes."
  },
  {
    title: "Roles del equipo",
    description: "Definición visible de cliente, PM y administración dentro del producto."
  },
  {
    title: "Catálogos operativos",
    description: "Estructura de cotizaciones, proyectos y mensajes lista para seguir creciendo."
  },
  {
    title: "Preferencias del servicio",
    description: "Base para ordenar seguimiento, contacto y acompañamiento comercial."
  }
];

export function SettingsPanel() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {mockSettings.map((item) => (
        <article key={item.title} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
          <span className="type-kicker">{item.title}</span>
          <p className="type-body mt-4">{item.description}</p>
        </article>
      ))}
    </div>
  );
}
