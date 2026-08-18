# Arreglar las fotos rotas del catálogo

## Por qué se ven rotas

Las fotos que están cargadas en la base de datos usan enlaces de Google Drive del tipo
`https://drive.google.com/file/d/.../view?usp=sharing`. Esa URL es una **página web** de Drive
(con visor, botones, login), no el archivo de imagen. Cuando el sitio la pone dentro de una
etiqueta de imagen, el navegador recibe HTML en vez de una foto y muestra el ícono de enlace roto.
Además, si el archivo no es público, Drive redirige a la pantalla de inicio de sesión.

La única foto que sí se ve (Excavadora CAT 320 en su ficha) funciona porque ya fue descargada y
guardada como archivo del proyecto en un caso anterior.

## Solución propuesta

1. Descargar, desde Drive, cada imagen referenciada en la base de datos (equipos y repuestos).
2. Subirlas al almacenamiento de imágenes del proyecto (CDN de Lovable), que entrega URLs
   directas y estables.
3. Actualizar `image_url` en las tablas `equipment` y `spare_parts` con esas URLs directas.
4. Dejar el comportamiento actual: si un registro no tiene foto, se sigue mostrando el ícono
   amarillo dentro del recuadro redondo.
5. Verificar en el sitio que las imágenes cargan en el catálogo de Renta, en la ficha técnica y
   en Repuestos.

## Para futuras cargas

Para que no vuelva a pasar, hay dos caminos (elige el que prefieras más adelante):
- Seguir enviándome los enlaces de Drive y yo los convierto y subo al proyecto, o
- Activar Almacenamiento del backend con un panel simple para subir fotos directamente,
  sin pasar por Drive.

## Detalle técnico

- Descarga vía el conector de Google Drive (`files/{id}?alt=media`), no `fetch` del enlace `/view`.
- Subida con `lovable-assets create`, guardando los punteros `.asset.json` en `src/assets/`.
- Migración SQL de actualización de `image_url` por `slug` / `id`; sin cambios de esquema.
- Sin cambios de diseño, colores, tipografía ni navegación.
