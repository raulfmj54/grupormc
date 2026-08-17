import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { getEquipmentBySlug } from "@/lib/catalog.functions";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { waEquipmentLink } from "@/lib/contact";

const equipmentQuery = (slug: string) =>
  queryOptions({
    queryKey: ["equipment", slug],
    queryFn: () => getEquipmentBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/maquinaria/$slug")({
  loader: async ({ context, params }) => {
    const item = await context.queryClient.ensureQueryData(
      equipmentQuery(params.slug),
    );
    if (!item) throw notFound();
    return { name: item.name, description: item.short_description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Equipo no disponible | Grupo RMC" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.name} en renta | Grupo RMC`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: EquipmentDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl uppercase">Equipo no encontrado</h1>
      <Link to="/maquinaria" className="mt-6 inline-block text-primary underline">
        Ver todos los equipos en renta
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl uppercase">No se pudo cargar el equipo</h1>
      <Link to="/maquinaria" className="mt-6 inline-block text-primary underline">
        Ver todos los equipos en renta
      </Link>
    </div>
  ),
});

type Spec = { label: string; value: string };

function EquipmentDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(equipmentQuery(slug));
  if (!data) return null;

  const specs = Array.isArray(data.specs) ? (data.specs as unknown as Spec[]) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <Link
        to="/maquinaria"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary uppercase hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Renta
      </Link>

      <p className="mt-8 text-sm font-semibold tracking-[0.25em] text-primary uppercase">
        {data.brand} · {data.category}
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-wide text-foreground uppercase">
        {data.name}
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{data.description}</p>

      {data.image_url ? (
        <img
          src={data.image_url}
          alt={`${data.name} en renta con Grupo RMC`}
          loading="lazy"
          className="mt-8 aspect-[4/3] w-full rounded-lg border border-border object-cover"
        />
      ) : null}

      {specs.length > 0 ? (
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {specs.map((spec) => (
            <div key={spec.label} className="rounded-lg border border-border bg-card p-5">
              <dt className="text-xs tracking-widest text-muted-foreground uppercase">
                {spec.label}
              </dt>
              <dd className="mt-1 font-display text-lg text-card-foreground">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="mt-10 rounded-lg border border-primary/40 bg-card p-8">
        <h2 className="font-display text-2xl tracking-wide uppercase">
          Consulta disponibilidad y precio
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Te respondemos por WhatsApp con la disponibilidad y la tarifa de renta.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            to="/contacto"
            search={{ item: data.name, machineId: data.slug }}
            hash="cotizacion"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold tracking-wide text-primary-foreground uppercase transition-colors hover:bg-primary/90"
          >
            Cotizar
          </Link>
          <WhatsAppButton
            href={waEquipmentLink(data.name)}
            event="click_whatsapp_equipment"
            ariaLabel={`Cotizar ${data.name} por WhatsApp con Grupo RMC`}
          />
        </div>
      </div>
    </div>
  );
}
