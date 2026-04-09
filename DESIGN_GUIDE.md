# Design Guide

## Principios
- Priorizar claridad sobre decoracion.
- Cada bloque debe resolver una necesidad concreta de informacion, accion o contexto.
- Evitar secciones infladas con texto de relleno.
- Mantener una interfaz sobria, ligera y consistente.

## Tipografia
- Usar `Poppins` como fuente principal.
- Titulos: peso `600-700`, tracking negativo leve, line-height corto.
- Cuerpo: `14px-16px` con line-height amplio (`1.6` aprox).
- No usar mas de dos niveles fuertes de jerarquia por bloque.

## Spacing
- Base de separacion: `4, 8, 12, 16, 24, 32`.
- Tarjetas: padding interno minimo `24px`.
- Secciones de marketing: padding vertical preferente `64px-80px`.
- Dashboards: evitar apilar mas de 3 capas de contenedores.

## Cards
- Radio dominante: `24px-30px`.
- Bordes suaves antes que sombras pesadas.
- Fondo blanco o slate muy claro.
- No usar cards solo para rellenar aire visual.

## Botones
- Primario: fondo solido, contraste alto, CTA unica por bloque.
- Secundario: borde claro y menor peso visual.
- No mezclar estilos arbitrarios dentro de una misma pagina.
- Hover corto, sin rebotes exagerados.

## Inputs
- Fondo claro, borde suave, foco visible.
- Labels siempre visibles.
- Textareas sin resize libre si rompe composicion.
- En formularios largos, dividir por secciones con objetivo claro.

## Animaciones
- Usar `transform` y `opacity`.
- Duracion general: `220ms-320ms` en UI y hasta `820ms` en showcases visuales.
- Easing recomendado: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Evitar animaciones decorativas permanentes salvo en heroes o highlights muy controlados.
- Respetar `prefers-reduced-motion`.

## Responsividad
- Evitar scroll interno innecesario.
- No depender de `h-screen` con contenedores secundarios scrollables.
- Priorizar una columna en mobile, dos solo cuando la informacion se mantenga legible.
- Tablas densas deben simplificarse o colapsar semantica en mobile.

## Composicion
- Un solo mensaje principal por seccion.
- Si una imagen no agrega contexto real, eliminarla.
- Reducir parrafos largos; preferir bloques cortos con mejor jerarquia.
- En portfolio, el contenido debe apoyarse mas en composicion y menos en explicacion extensa.

## Iconografia
- Usar una sola familia visual por contexto.
- Iconos pequenos y funcionales.
- No usar iconos gigantes para compensar falta de estructura.

## Dashboards
- Sidebar estable, contenido principal limpio y sin ruido.
- Cada vista debe responder una pregunta concreta.
- Inicio por rol: una sola lectura central, mas 2 o 3 acciones utiles.
- Evitar widgets duplicados y estados visuales redundantes.
- Priorizar tablas compactas, timelines claros y formularios directos.

## Pills y badges
- Prohibidos si son decorativos.
- Solo usar estados compactos cuando aporten una diferencia operativa real.
- Preferir texto con punto de estado o etiquetas planas antes que capsulas llamativas.

## Minimalismo
- Quitar antes de agregar.
- Menos copy, mas estructura.
- Menos sombras, mas contraste y espaciado correcto.
- Menos componentes especiales, mas sistema reusable.
