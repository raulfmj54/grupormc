# Sitio web Grupo RMC con WhatsApp y Facebook

Sitio completo en español para Grupo RMC (Renta | Repuestos | Maquinaria | Construcción), con WhatsApp como canal principal de cotización y Facebook como enlace secundario.

## Identidad visual

- Paleta industrial: negro carbón, gris grafito y amarillo/naranja RMC (tomado del logo y el afiche).
- Tipografía condensada de alto impacto para títulos, sans legible para texto.
- Logo subido usado en barra superior, pie de página y favicon.

## Páginas

1. `/` Inicio: hero con logo, titular "Repuestos y maquinaria pesada", botón "Cotizar por WhatsApp", marcas disponibles (CAT, John Deere, Komatsu, JCB, Volvo, SANY, Bobcat, XCMG), destacados (calidad garantizada, precios competitivos, enfocados en tu productividad), equipos destacados, franja final de CTA.
2. `/maquinaria`: fichas de equipos con botón de WhatsApp por equipo.
3. `/maquinaria/$slug`: página individual del equipo con especificaciones y CTA de WhatsApp con el nombre del equipo insertado.
4. `/repuestos`: catálogo por marca/categoría + CTA con el mensaje de repuestos.
5. `/servicios`: renta y construcción, con CTA de construcción.
6. `/contacto`: tarjeta "Hablemos de tu proyecto", datos de WhatsApp y Facebook, formulario de cotización.

Cada página con su propio título y descripción para buscadores.

## WhatsApp

- Botón flotante fijo abajo a la derecha en todas las páginas: verde WhatsApp, ícono, texto "Cotizar por WhatsApp" en escritorio, solo ícono en móvil, animación suave de entrada y hover, `aria-label="Cotizar por WhatsApp con Grupo RMC"`, `target="_blank"` y `rel="noopener noreferrer"`. Con margen inferior seguro en móvil para no tapar formularios ni controles.
- Botones adicionales en: encabezado, hero, fichas de maquinaria, página de equipo, repuestos, servicios, contacto, franja final y pie de página.
- Mensajes por contexto: general, equipo (nombre dinámico), repuestos, construcción; todos codificados con `encodeURIComponent` sobre el número 50372219349.

## Facebook

Enlace oficial `https://www.facebook.com/profile.php?id=61587354333415` en barra superior, menú móvil, contacto, pie de página, sección de redes y bloque opcional "Síguenos en Facebook". Siempre nueva pestaña, `rel="noopener noreferrer"`, ícono reconocible y `aria-label="Visitar Facebook de Grupo RMC"`. Sin publicaciones, seguidores, calificaciones, horarios ni dirección.

## Contacto y pie de página

- Tarjeta "Hablemos de tu proyecto" con el texto indicado, WhatsApp +503 7221-9349, Facebook Grupo RMC y botones "Escribir por WhatsApp", "Visitar Facebook" y "Solicitar cotización".
- Sin correo, dirección ni horario inventados: esos campos quedan configurables y ocultos hasta confirmarse.
- Pie de página con sección "Contacto" (WhatsApp, enlace de cotización, Facebook) y la línea "Renta | Repuestos | Maquinaria | Construcción".

## Formulario de cotización

Campos: nombre, tipo de solicitud (renta / repuesto / construcción), equipo o repuesto, ubicación del proyecto, fecha estimada, duración del alquiler (cuando aplica) y comentario. Validación en el navegador y en el servidor. Al enviar: se guarda la solicitud en la base de datos y se abre WhatsApp con el resumen del pedido, sin datos sensibles innecesarios.

## Backend (Lovable Cloud)

- Se activa Lovable Cloud.
- Tablas: `equipment` (maquinaria), `spare_parts` (repuestos) y `quote_requests` (solicitudes).
- Maquinaria y repuestos se crean con datos de muestra basados en las marcas del afiche, visibles públicamente y editables después.
- Panel de administración protegido por inicio de sesión (correo y contraseña + Google) con roles en tabla aparte, para agregar y editar equipos y repuestos desde el sitio.
- Las solicitudes del formulario solo son legibles por administradores.

## Detalles técnicos

- Rutas TanStack Start; utilidades centralizadas en `src/lib/contact.ts` con el número, el enlace de Facebook y los constructores de mensajes.
- Componentes reutilizables: `WhatsAppButton`, `WhatsAppFloatingButton`, `FacebookLink`, `Header`, `Footer`.
- Eventos de analítica preparados (`click_whatsapp_header`, `click_whatsapp_hero`, `click_whatsapp_equipment`, `click_whatsapp_spare_parts`, `click_whatsapp_floating`, `click_facebook_header`, `click_facebook_footer`, `submit_quote_form`) mediante un `trackEvent` inactivo hasta conectar una herramienta de analítica.
- Lecturas públicas por función de servidor con clave publicable y políticas de solo lectura; escrituras de administración autenticadas con RLS.
- Revisión final en navegador: enlaces correctos, nueva pestaña, etiquetas accesibles y botón flotante sin tapar controles en móvil y escritorio.
