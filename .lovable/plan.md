# Cambiar el sitio a fondo claro (blanco / off-white)

Actualmente la paleta es oscura (negro/grafito con amarillo). El objetivo es invertirla a un fondo claro manteniendo la identidad industrial y los acentos amarillos.

## Qué cambia visualmente

- Fondo principal blanco puro y superficies (tarjetas, header, footer) en un blanco roto muy suave para dar separación.
- Texto principal en gris casi negro, texto secundario en gris medio: contraste AA garantizado sobre fondo claro.
- Bordes y separadores en gris claro en lugar de grafito.
- El amarillo maquinaria se mantiene como color primario para iconos, títulos de sección y detalles. Al usarse sobre blanco, el amarillo se oscurece ligeramente solo donde hace de texto o botón (para que sea legible), pero los iconos siguen en el amarillo actual.
- Botones de WhatsApp (verde) y CTAs se mantienen igual; solo se ajusta el color del texto sobre ellos donde haga falta.
- El botón flotante de WhatsApp mantiene su sombra, ajustada para verse bien sobre fondo claro.

## Alcance técnico

- Editar únicamente `src/styles.css`: reasignar los tokens de `:root` (`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--muted`, `--muted-foreground`, `--secondary`, `--border`, `--input`, `--sidebar*`) a valores claros en oklch.
- Mantener `--primary` amarillo y añadir/ajustar `--primary-foreground` a un tono oscuro para legibilidad en botones amarillos.
- Revisar los componentes por si algún estilo asume fondo oscuro (sombras `shadow-black/40`, `bg-background/95` del header) y ajustar solo esas clases de presentación.
- No se toca contenido, rutas, datos ni lógica.

## Verificación

Revisar inicio, maquinaria, repuestos, servicios y contacto en el preview para confirmar legibilidad y que los iconos sigan amarillos.
