# Fotos rotas del catálogo: migración + panel para subir imágenes

## Por qué se ven rotas

Las fotos guardadas en la base de datos usan enlaces de Google Drive tipo
`https://drive.google.com/file/d/.../view`. Esa dirección es una **página web** de Drive (visor,
botones, login), no el archivo de imagen. El navegador recibe HTML en lugar de una foto y muestra
el ícono de enlace roto. La CAT 320 sí se ve en su ficha porque esa imagen ya fue descargada y
guardada dentro del proyecto.

## Parte 1 — Migrar las imágenes actuales (equipos y repuestos)

1. Descargar desde Drive cada imagen referenciada hoy en `equipment` y `spare_parts`.
2. Subirlas al almacenamiento del backend, que entrega una URL directa y estable.
3. Actualizar `image_url` de cada registro con esa URL directa.
4. Si un registro sigue sin foto, se mantiene el ícono amarillo en el recuadro redondo (sin cambios
   de diseño).
5. Verificar catálogo de Renta, ficha técnica y Repuestos.

Nota: si algún archivo de Drive no es público, no se puede descargar; en ese caso te aviso cuáles
faltan y los subes desde el panel nuevo.

## Parte 2 — Panel de administración para subir fotos

- Nueva página de acceso (`/auth`) con inicio de sesión por correo y Google.
- Nueva sección privada `/admin`, visible solo para usuarios con rol de administrador
  (la tabla de roles ya existe; te asigno el rol de admin a tu cuenta).
- Dentro del panel: lista de equipos en renta y de repuestos, con opción de
  **subir o reemplazar la foto** de cada uno arrastrando el archivo o eligiéndolo.
  Vista previa inmediata y guardado directo en el registro.
- Validaciones: solo imágenes (JPG, PNG, WEBP), tamaño máximo razonable, y mensaje de error claro.
- El sitio público no cambia de aspecto: sigue leyendo `image_url` como hoy.

## Detalle técnico

- Bucket de Storage público `catalog` con políticas de escritura solo para rol `admin`
  y lectura pública; `image_url` guarda la URL pública del objeto.
- Descarga de Drive vía el conector de Google Drive (`files/{id}?alt=media`), no `fetch` al `/view`.
- Rutas nuevas: `src/routes/auth.tsx` y `src/routes/_authenticated/admin.*` con guardia de sesión;
  las mutaciones (subir/actualizar `image_url`) van en server functions con `requireSupabaseAuth`
  y verificación de rol admin.
- Sin cambios de esquema en `equipment` / `spare_parts`; solo actualización de datos.
- Se conservan diseño, colores, tipografía, componentes y navegación actuales.
