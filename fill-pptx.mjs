import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const AdmZip = require('./node_modules/adm-zip');

const SRC  = 'C:/Users/gokul/Downloads/Presentacion-Tesis.pptx';
const DEST = 'C:/Users/gokul/Downloads/Codenium-Defensa-Final.pptx';

const zip = new AdmZip(SRC);

// ── Helpers ────────────────────────────────────────────────────────────────

function replaceAll(s, find, rep) {
  while (s.includes(find)) s = s.split(find).join(rep);
  return s;
}

/** Habilita auto-reducción de fuente en cuadros con wrap="square" */
function addNormAutofit(xml) {
  return xml.replace(
    /<a:bodyPr (wrap="square"[^>]*)\/>/g,
    '<a:bodyPr $1><a:normAutofit/></a:bodyPr>'
  );
}

function patch(num, pairs, extraFn) {
  const path  = `ppt/slides/slide${num}.xml`;
  const entry = zip.getEntry(path);
  let xml = entry.getData().toString('utf8');

  xml = addNormAutofit(xml);                    // auto-fit en todos los cuadros wrap=square

  for (const [f, r] of pairs) {
    xml = replaceAll(xml, `<a:t>${f}</a:t>`, `<a:t>${r}</a:t>`);
  }

  if (extraFn) xml = extraFn(xml);              // ajustes de fuente por slide

  zip.updateFile(path, Buffer.from(xml, 'utf8'));
  console.log(`  ✓  Slide ${num}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 1 — PORTADA
// ═══════════════════════════════════════════════════════════════════════════
patch(1, [
  ['Nombre del Proyecto',
   'Sistema Web de Cotización y Gestión de Proyectos con IA'],

  ['Nombre completo del autor o autores del proyecto',
   'Gabriel Acero Ortiz · Juan Manuel González Camacho · Miguel Ángel Fuentes Pérez'],

  ['Nombre de la institución educativa o empresa',
   'Universidad Politécnica de Texcoco'],

  ['Nombre del asesor o directores del proyecto',
   'Mtra. Edurnet Jhaquelin Luna Becerril  ·  Mtro. Gerardo Miguel Sánchez'],

  ['Mes, Año de presentación', 'Mayo 2026'],
],
// Reducir la fuente del título de 78 pt → 48 pt para que quepa en 2 líneas
xml => xml.replace(/sz="7800"/g, 'sz="4800"'));

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 2 — ÍNDICE
// ═══════════════════════════════════════════════════════════════════════════
patch(2, [
  ['A continuación se presenta la estructura de esta presentación, organizada para guiar al evaluador a través de cada aspecto del proyecto de forma clara y ordenada.',
   'Codenium es una plataforma web empresarial que centraliza cotización automatizada, seguimiento de proyectos y asistente conversacional con IA. La presentación recorre el problema detectado, la solución implementada, la arquitectura y los resultados obtenidos.'],
]);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 3 — RESUMEN EJECUTIVO
// ═══════════════════════════════════════════════════════════════════════════
patch(3, [
  ['Descripción general del proyecto, su contexto y el propósito que persigue. Indique el área de aplicación, la institución involucrada y el período de desarrollo.',
   'Plataforma web para Codenium que integra: cotizador de 7 etapas con estimado automático, paneles diferenciados por tipo de usuario (cliente · PM · admin) y asistente conversacional FrancIA con LLaMA 3.1 vía Groq. Stack: Next.js 15, React 19, TypeScript, Prisma y NeonDB. Desarrollado nov. 2025 — abr. 2026.'],
]);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 4 — PROBLEMA
// ═══════════════════════════════════════════════════════════════════════════
patch(4, [
  ['Exponga la situación actual y las necesidades detectadas que motivan el desarrollo de este proyecto. Una correcta identificación del problema es la base para una solución sólida.',
   'Codenium operaba sin presencia web propia ni herramientas de gestión comercial. La cotización y el seguimiento de proyectos dependían de procesos manuales sin trazabilidad.'],

  ['Describa cómo se realizan actualmente los procesos afectados. Incluya los métodos existentes, herramientas en uso y sus principales limitaciones.',
   'Cotizaciones por correo sin estándar. Sin panel de seguimiento para clientes. Atención a prospectos limitada al horario del equipo.'],

  ['Explique la brecha identificada entre la situación actual y la situación deseada. ¿Qué está faltando o funcionando de manera ineficiente?',
   'Falta automatizar la cotización inicial, centralizar el seguimiento de proyectos y atender prospectos en tiempo real sin intervención humana constante.'],

  ['Argumente por qué es importante desarrollar este proyecto en este momento. Indique el valor que aporta su solución frente al problema identificado.',
   'Digitalizar el proceso comercial reduce tiempos de respuesta, estandariza estimados y permite a Codenium escalar la captación sin incrementar la carga operativa del equipo.'],
]);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 5 — OBJETIVOS
// ═══════════════════════════════════════════════════════════════════════════
patch(5, [
  ['Redacte aquí el objetivo general del proyecto. Debe expresar de forma clara y concisa la solución propuesta, el sistema o producto a desarrollar, y el beneficio principal que se pretende lograr al concluir el proyecto.',
   'Desarrollar una plataforma web que centralice la cotización automatizada, el seguimiento de proyectos por tipo de usuario y la atención conversacional con IA para la empresa Codenium.'],

  ['Objetivo Específico 1', 'Sitio público y cotizador'],
  ['Describa el primer objetivo específico, que debe ser medible, alcanzable y contribuir directamente al objetivo general.',
   'Implementar sitio público con 6 secciones y cotizador de 7 etapas que genere estimados de costo y tiempo automáticamente.'],

  ['Objetivo Específico 2', 'Paneles de seguimiento'],
  ['Describa el segundo objetivo específico, orientado a una fase o componente particular del proyecto.',
   'Desarrollar dashboards diferenciados: cliente (hitos, pagos, docs), PM (proyectos, timeline) y administrador (cotizaciones, equipo).'],

  ['Objetivo Específico 3', 'Asistente FrancIA con IA'],
  ['Describa el tercer objetivo específico, que puede estar relacionado con validación, pruebas o implementación del sistema.',
   'Integrar FrancIA con LLaMA 3.1 vía Groq para responder consultas de servicios y precios usando un system prompt empresarial.'],
]);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 6 — BENEFICIOS
// ═══════════════════════════════════════════════════════════════════════════
patch(6, [
  ['Describa las mejoras técnicas que el sistema aporta: automatización de procesos, mayor disponibilidad, escalabilidad, mantenibilidad, seguridad u otros atributos de calidad del software.',
   'Automatización del proceso de cotización. Arquitectura modular con TypeScript strict. Notificaciones transaccionales con Resend. Persistencia con Prisma ORM y NeonDB.'],

  ['Indique el ahorro en costos operativos, reducción de tiempos, optimización de recursos humanos o cualquier retorno de inversión que el proyecto pueda generar para la organización.',
   'Estimados sin intervención humana en menos de 3 minutos. Correos automáticos al cliente y al equipo. Reducción de carga operativa en la etapa de captación.'],

  ['Explique cómo mejora la experiencia de los usuarios finales y el impacto positivo en los procesos organizacionales: productividad, satisfacción, toma de decisiones, etc.',
   'Cliente: monitorea hitos, pagos y documentos. PM: gestiona proyectos con visibilidad total. Admin: supervisa cotizaciones y equipo en una sola vista.'],

  ['Mencione los elementos innovadores del proyecto: uso de nuevas tecnologías, enfoques novedosos de solución, integración de sistemas, modelos de inteligencia artificial u otros aspectos diferenciadores.',
   'LLM empresarial (LLaMA 3.1 vía Groq) sin base de datos vectorial. Motor de estimado con indicador de viabilidad automático: favorable, media o compleja.'],
]);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 7 — ALCANCE
// ═══════════════════════════════════════════════════════════════════════════
patch(7, [
  ['Módulo / Funcionalidad 1', 'Sitio público y cotizador'],
  ['Describa la primera funcionalidad o módulo que el sistema contempla dentro de su alcance definido.',
   '6 secciones: inicio, servicios, planes, cotizador, portafolio y contacto. Cotizador de 7 etapas con estimado automático de costo, tiempo y viabilidad. Asistente FrancIA integrado.'],

  ['Módulo / Funcionalidad 2', 'Zona privada y dashboards'],
  ['Describa la segunda funcionalidad o módulo incluido, especificando su propósito y el tipo de usuario que lo utilizará.',
   'Panel cliente: hitos, documentos, pagos y mensajes. Panel PM: proyectos y timeline. Panel administrador: cotizaciones y equipo.'],

  ['Indique los perfiles de usuarios a quienes está dirigido el sistema, sus roles y cómo interactuarán con la plataforma.',
   'Visitante: cotización y consulta. Cliente: seguimiento de proyecto. Project Manager: gestión operativa. Administrador: supervisión.'],

  ['Limitación 1', 'Sector específico'],
  ['Señale lo que el sistema no cubrirá en esta versión: funcionalidades diferidas, integraciones no contempladas, etc.',
   'Orientado exclusivamente a Codenium. No es CRM genérico ni plataforma multi-empresa.'],

  ['Limitación 2', 'Autenticación provisional'],
  ['Indique restricciones de hardware, plataformas no soportadas, regiones geográficas excluidas u otros límites del proyecto.',
   'OAuth (Google Sign-In) y aplicación móvil complementaria quedan como trabajo futuro.'],

  ['Especifique el entorno donde se desplegará el sistema: servidores locales, nube pública, dispositivos móviles, sistemas operativos compatibles, etc.',
   'VPS Linux · Node.js 20+ · PM2 · NeonDB (PostgreSQL) · codenium.nth-solutions.com.mx'],
]);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 8 — ARQUITECTURA
// ═══════════════════════════════════════════════════════════════════════════
patch(8, [
  ['La arquitectura define la estructura general del sistema, incluyendo sus capas, componentes principales y el flujo de datos entre ellos. A continuación se describe cada elemento de la solución.',
   'Arquitectura full-stack en Next.js 15 con separación entre experiencia pública, API interna y capa de datos. Cada dominio funcional está aislado en módulos independientes.'],

  ['Base de datos y nube',       'PostgreSQL · NeonDB · Prisma ORM · Resend · Groq API'],
  ['APIs y servicios centrales', '9 endpoints REST · Motor de cotización · Email · Sesiones · IA'],
  ['Interfaz web y móvil',       'Next.js 15 App Router · React 19 · Tailwind CSS 4 · GSAP'],

  ['Describa brevemente cada componente de la arquitectura, el flujo de información entre capas y cualquier patrón de diseño aplicado (MVC, microservicios, REST, etc.). Si el sistema ya está funcional, mencione la posibilidad de una demostración en vivo.',
   'El navegador usa el App Router de Next.js. Las API Routes validan datos y acceden a Prisma sobre NeonDB. Groq procesa el asistente FrancIA. Resend gestiona correos transaccionales. Sistema activo: codenium.nth-solutions.com.mx'],
]);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 9 — STACK TECNOLÓGICO
// ═══════════════════════════════════════════════════════════════════════════
patch(9, [
  ['El conjunto de tecnologías seleccionadas responde a criterios de escalabilidad, comunidad de soporte, compatibilidad entre componentes y alineación con los requerimientos del proyecto.',
   'Stack moderno de industria (2025), seleccionado por madurez, compatibilidad y adopción activa. Todo está desplegado en producción.'],

  // Lenguajes
  ['Indique los lenguajes utilizados en el desarrollo del sistema, tanto en el frontend como en el backend. Ejemplo: ',
   'TypeScript 5.9 (modo strict) · JavaScript · '],
  ['Python, JavaScript, TypeScript', 'HTML5 · CSS3'],

  // Frameworks
  ['Mencione los frameworks principales empleados para acelerar el desarrollo. Ejemplo: ',
   'Next.js 15.5 (App Router) · React 19 · '],
  ['React, Django, Spring Boot, Node.js', 'Tailwind CSS 4.1 · GSAP 3.14 · Lucide React'],

  // Base de datos
  ['Especifique el motor de base de datos elegido y el tipo (relacional o no relacional). Ejemplo: ',
   'PostgreSQL (relacional) · Prisma ORM 6.6 · '],
  ['PostgreSQL, MongoDB, MySQL', 'NeonDB (serverless cloud PostgreSQL)'],

  // Servicios cloud
  ['Indique los servicios cloud utilizados para despliegue, almacenamiento u otras funcionalidades. Ejemplo: ',
   'Resend (email) · Groq API + LLaMA 3.1-8B · '],
  ['AWS, Google Cloud, Azure, Firebase', 'VPS Linux · Node.js 20+ · PM2'],

  // Herramientas
  ['Mencione herramientas de apoyo al desarrollo: control de versiones, CI/CD, gestión de proyectos. Ejemplo: ',
   'Git · npm · Visual Studio Code · '],
  ['Git, Docker, Jira, Postman', 'Prisma Studio · PM2 · GitHub'],
]);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 10 — DEMO EN VIVO
// ═══════════════════════════════════════════════════════════════════════════
patch(10, [
  ['Presentar la Funcionalidad del sistema ', 'Demo en Vivo — Sistema Codenium'],
  ['Link de su Sistema', 'codenium.nth-solutions.com.mx'],
],
// Aumentar tamaño del link para que sea legible y elegante
xml => xml.replace(
  /<a:t>codenium\.nth-solutions\.com\.mx<\/a:t>/,
  '<a:t>codenium.nth-solutions.com.mx</a:t>'
));

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 11 — VALIDACIÓN Y PRUEBAS
// ═══════════════════════════════════════════════════════════════════════════
patch(11, [
  ['Se aplicó una estrategia de pruebas integral para garantizar la calidad, corrección funcional y el rendimiento del sistema bajo distintos escenarios de uso.',
   'La validación se realizó de forma manual por incremento y mediante encuesta KPI con usuarios reales al concluir el desarrollo.'],

  ['Pruebas Unitarias', 'Validación de Componentes'],
  ['Verificación de funciones y métodos individuales de forma aislada para asegurar que cada componente opera correctamente según su especificación.',
   'Cada módulo fue validado de forma individual antes de integrarse: cotizador, autenticación, paneles, sistema de correo y asistente FrancIA.'],

  ['Pruebas de Integración', 'Pruebas de Flujo Completo'],
  ['Evaluación de la correcta interacción entre módulos del sistema: comunicación entre servicios, llamadas a APIs, conexiones con la base de datos y flujo de datos entre capas.',
   'Flujo cotizador → formulario → correo automático validado. Integración API Routes, Prisma y NeonDB verificada en producción real.'],

  ['Pruebas Funcionales', 'Validación por Caso de Uso'],
  ['Validación de que las funcionalidades del sistema cumplen con los requerimientos especificados. Se simulan escenarios reales de uso desde la perspectiva del usuario final.',
   'Se ejecutaron los 7 casos de uso: navegación pública, cotización, envío de formulario, autenticación y los 3 tipos de dashboard.'],

  ['Pruebas de Rendimiento', 'Evaluación en Producción Real'],
  ['Medición de la respuesta del sistema bajo carga de usuarios concurrentes, tiempos de respuesta, uso de memoria y estabilidad ante situaciones de estrés operacional.',
   'Sistema desplegado en VPS + NeonDB. Tiempos de respuesta del cotizador, entrega de correos y respuestas de FrancIA verificados en producción.'],

  ['Pruebas de Usuario (UAT)', 'Encuesta KPI — Usuarios Reales'],
  ['Evaluación realizada con usuarios finales reales para verificar la usabilidad, la experiencia de usuario y la aceptación del sistema en su entorno de trabajo habitual.',
   '5 usuarios reales (28-29 abr. 2026). Claridad del propósito: 4.2/5. Facilidad de uso: 4.2/5. 4 de 5 sin reportar errores.'],
]);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 12 — RESULTADOS
// ═══════════════════════════════════════════════════════════════════════════
patch(12, [
  ['Los siguientes indicadores reflejan el desempeño del sistema tras su implementación y las pruebas realizadas. Los datos muestran el cumplimiento de los objetivos planteados al inicio del proyecto.',
   'Los resultados confirman el cumplimiento de los objetivos. La plataforma está en producción y fue validada con usuarios reales en abril 2026.'],

  ['↑ Mejora',      '✓ Cotización'],
  ['Indicador de Desempeño 1', 'Proceso automatizado'],
  ['Descripción del resultado cuantitativo obtenido para esta métrica. Especifique unidad de medida y valor logrado.',
   'De cotización manual a estimado en menos de 3 min. 7 etapas. Confirmación automática al cliente y notificación interna al equipo.'],

  ['↓ Reducción',   '✓ Atención 24/7'],
  ['Indicador de Desempeño 2', 'Sin intervención humana'],
  ['Descripción del resultado cuantitativo para esta métrica. Incluya comparación antes vs. después si aplica.',
   'FrancIA atiende consultas de servicios y precios en tiempo real. El cotizador opera sin intervención del equipo.'],

  ['↑ Incremento',  '✓ Cobertura técnica'],
  ['Indicador de Desempeño 3', 'Sistema funcional completo'],
  ['Descripción del tercer resultado clave. Mencione la evidencia que respalda este indicador (capturas, logs, reportes).',
   '9 endpoints · 14 modelos BD · 18 componentes panel · 6 secciones públicas · 6 tipos de email. Activo en producción.'],

  ['↑ Satisfacción', '4.2 / 5 Satisfacción'],
  ['Evaluación de Usuarios', 'Encuesta KPI — Abril 2026'],
  ['Resultado de la evaluación por parte de los usuarios: nivel de satisfacción, usabilidad percibida u otros indicadores cualitativos medidos.',
   '5 usuarios reales. Claridad: 4.2/5. Facilidad: 4.2/5. 4 de 5 sin reportar errores. Validado en entorno real.'],

  ['Incluya capturas de pantalla, gráficas o tablas comparativas que evidencien el funcionamiento real del sistema durante la presentación.',
   'Demostración en vivo: codenium.nth-solutions.com.mx'],
]);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 13 — CONCLUSIONES
// ═══════════════════════════════════════════════════════════════════════════
patch(13, [
  ['El proyecto concluye con los siguientes hallazgos, logros y reflexiones, así como con una visión de las oportunidades de mejora y expansión para versiones futuras del sistema.',
   'Codenium fue desarrollado e implementado en producción, cumpliendo los objetivos planteados y aportando valor real a la empresa.'],

  ['Resuma los principales logros del proyecto: funcionalidades implementadas, sistema desplegado, resultados obtenidos y cualquier reconocimiento o validación recibida durante el proceso.',
   'Plataforma web completa en producción. Cotizador de 7 etapas automático. Paneles para cliente, PM y admin. Asistente FrancIA con LLM. Sistema de correo transaccional con 6 tipos de plantilla.'],

  ['Indique el grado en que se cumplieron los objetivos general y específicos planteados al inicio. Señale si algún objetivo fue parcialmente cumplido y las razones correspondientes.',
   'Se cumplieron los 6 objetivos específicos: sitio público, cotizador interactivo, paneles diferenciados, asistente FrancIA y sistema de correo — todos en producción.'],

  ['Describa las contribuciones del proyecto al área de conocimiento, a la institución o a la organización beneficiaria: conocimiento generado, procesos mejorados, valor tecnológico creado.',
   'Integración de LLM empresarial sin base vectorial. Arquitectura modular en Next.js 15 aplicable a empresas de servicios digitales. Proceso de cotización digitalizado para Codenium.'],

  ['Proponga las mejoras, integraciones o nuevas funcionalidades que podrían desarrollarse en fases posteriores del proyecto para incrementar su impacto y alcance.',
   'Autenticación OAuth (Google Sign-In) · Pruebas automatizadas (Jest + Playwright) · Aplicación móvil · Modo multi-empresa'],
]);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 14 — REFERENCIAS
// ═══════════════════════════════════════════════════════════════════════════
patch(14, [
  ['Referencias',
   'Vercel. Next.js Docs. 2024  |  Meta. React Docs. 2024  |  Prisma. ORM Docs. 2024  |  Groq. API Docs. 2024  |  Resend. Email API. 2024  |  Pressman R. Ingeniería del Software. 7a ed. McGraw-Hill, 2014  |  Sommerville I. Software Engineering. 9a ed. Pearson, 2011'],
]);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 15 — GRACIAS
// ═══════════════════════════════════════════════════════════════════════════
patch(15, [
  ['Agradecemos su atención y el tiempo dedicado a evaluar este proyecto.',
   'Agradecemos su atención y el tiempo dedicado a evaluar el proyecto Codenium.'],

  ['NOMBRE DEL AUTOR',
   'Gabriel Acero Ortiz  ·  Juan Manuel González Camacho  ·  Miguel Ángel Fuentes Pérez'],

  ['INSTITUCIÓN', 'Universidad Politécnica de Texcoco'],
  ['AÑO',         'Mayo 2026'],
]);

// ═══════════════════════════════════════════════════════════════════════════
// GENERAR ARCHIVO FINAL
// ═══════════════════════════════════════════════════════════════════════════
zip.writeZip(DEST);
console.log('\n✅  Archivo generado:', DEST);
