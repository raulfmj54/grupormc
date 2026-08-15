import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { listEquipment } from "@/lib/catalog.functions";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WA_GENERAL_LINK } from "@/lib/contact";

const equipmentQuery = queryOptions({
  queryKey: ["equipment"],
  queryFn: () => listEquipment(),
});

export const Route = createFileRoute("/maquinaria/")({
  head: () => ({
    meta: [
      { title: "Renta de maquinaria pesada | Grupo RMC El Salvador" },
      {
        name: "description",
        content:
          "Excavadoras, retroexcavadoras, minicargadores y más maquinaria pesada en renta. Cotiza por WhatsApp con Grupo RMC.",
      },
      { property: "og:title", content: "Maquinaria pesada en renta | Grupo RMC" },
      {
        property: "og:description",
        content:
          "Renta de excavadoras, retroexcavadoras, cargadores y compactadoras con respaldo de Grupo RMC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(equipmentQuery),
  component: MaquinariaPage,
});

function MaquinariaPage() {
  const { data: equipment } = useSuspenseQuery(equipmentQuery);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.25em] text-primary uppercase">
          Renta de equipo
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-wide text-foreground uppercase sm:text-5xl">
          Equipos en renta disponibles
        </h1>
        <p className="mt-4 text-muted-foreground">
          Equipo listo para tu proyecto, con opciones por día, semana o mes.
          Consulta disponibilidad y precio directamente por WhatsApp.
        </p>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {equipment.map((item) => (
          <article
            key={item.id}
            className="flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/60"
          >
            <span className="text-xs font-semibold tracking-widest text-primary uppercase">
              {item.brand} · {item.category}
            </span>
            <h2 className="mt-2 font-display text-xl tracking-wide text-card-foreground uppercase">
              {item.name}
            </h2>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">
              {item.short_description}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/maquinaria/$slug"
                params={{ slug: item.slug }}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary uppercase hover:underline"
              >
                Ver ficha <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-14 rounded-lg border border-primary/40 bg-card p-8 text-center">
        <h2 className="font-display text-2xl tracking-wide text-card-foreground uppercase">
          ¿No encuentras el equipo que necesitas?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Contamos con red de proveedores para conseguir la maquinaria adecuada
          para tu proyecto.
        </p>
        <WhatsAppButton
          href={WA_GENERAL_LINK}
          event="click_whatsapp_equipment"
          className="mt-6"
        />
      </section>
    </div>
  );
}
