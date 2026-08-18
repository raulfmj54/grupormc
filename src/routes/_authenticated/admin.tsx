import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";

import { listCatalogForAdmin, uploadCatalogImage } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel de fotos del catálogo | Grupo RMC" },
      {
        name: "description",
        content:
          "Panel interno de Grupo RMC para subir y reemplazar las fotos de maquinaria en renta y repuestos.",
      },
      { property: "og:title", content: "Panel de fotos del catálogo | Grupo RMC" },
      {
        property: "og:description",
        content: "Administración de imágenes del catálogo de Grupo RMC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const ALLOWED = ["image/jpeg", "image/png", "image/webp"] as const;
type AllowedType = (typeof ALLOWED)[number];

type Row = {
  id: string;
  name: string;
  brand: string;
  image_url: string | null;
};

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchCatalog = useServerFn(listCatalogForAdmin);
  const upload = useServerFn(uploadCatalogImage);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-catalog"],
    queryFn: () => fetchCatalog(),
  });

  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleFile(kind: "equipment" | "spare_parts", row: Row, file: File) {
    if (!ALLOWED.includes(file.type as AllowedType)) {
      toast.error("Solo se permiten imágenes JPG, PNG o WEBP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar 5 MB");
      return;
    }
    setBusyId(row.id);
    try {
      const buffer = await file.arrayBuffer();
      let binary = "";
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.length; i += 8192) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      }
      const base64 = btoa(binary);

      await upload({
        data: {
          kind,
          id: row.id,
          fileName: file.name,
          contentType: file.type as AllowedType,
          base64,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["admin-catalog"] });
      toast.success(`Foto actualizada: ${row.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo subir la imagen");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-foreground uppercase">
            Fotos del catálogo
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sube o reemplaza la foto de cada equipo en renta y de cada repuesto.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold uppercase hover:bg-muted"
        >
          Cerrar sesión
        </button>
      </div>

      {isLoading ? <p className="mt-10 text-muted-foreground">Cargando…</p> : null}
      {error ? (
        <p className="mt-10 text-destructive">
          No tienes permisos de administrador o no se pudo cargar el catálogo.
        </p>
      ) : null}

      {data ? (
        <>
          <Section
            title="Equipos en renta"
            rows={data.equipment}
            busyId={busyId}
            onFile={(row, file) => handleFile("equipment", row, file)}
          />
          <Section
            title="Repuestos"
            rows={data.spareParts}
            busyId={busyId}
            onFile={(row, file) => handleFile("spare_parts", row, file)}
          />
        </>
      ) : null}
    </div>
  );
}

function Section({
  title,
  rows,
  busyId,
  onFile,
}: {
  title: string;
  rows: Row[];
  busyId: string | null;
  onFile: (row: Row, file: File) => void;
}) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-sm tracking-[0.25em] text-primary uppercase">
        {title}
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <AdminRow key={row.id} row={row} busy={busyId === row.id} onFile={onFile} />
        ))}
      </ul>
    </section>
  );
}

function AdminRow({
  row,
  busy,
  onFile,
}: {
  row: Row;
  busy: boolean;
  onFile: (row: Row, file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <li className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
      <div className="size-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
        {row.image_url ? (
          <img src={row.image_url} alt={row.name} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImagePlus className="size-6 text-primary" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base uppercase">{row.name}</p>
        <p className="text-xs text-muted-foreground uppercase">{row.brand}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(row, file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="rounded-md bg-primary px-4 py-2 text-xs font-semibold tracking-wide text-primary-foreground uppercase disabled:opacity-60"
      >
        {busy ? "Subiendo…" : row.image_url ? "Cambiar" : "Subir"}
      </button>
    </li>
  );
}
