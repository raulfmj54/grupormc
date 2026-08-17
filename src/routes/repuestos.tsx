import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";

import { listSpareParts } from "@/lib/catalog.functions";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WA_SPARE_PARTS_LINK } from "@/lib/contact";

const BRANDS = [
  "CAT",
  "John Deere",
  "Komatsu",
  "JCB",
  "Volvo",
  "SANY",
  "Bobcat",
  "XCMG",
];

const sparePartsQuery = queryOptions({
  queryKey: ["spare-parts"],
  queryFn: () => listSpareParts(),
});

export const Route = createFileRoute("/repuestos")({
  head: () => ({
    meta: [
      { title: "Repuestos de equipo pesado | Grupo RMC El Salvador" },
      {
        name: "description",
        content:
          "Filtros, tren de rodaje, hidráulica y sistema eléctrico para CAT, Komatsu, JCB, Volvo, SANY, Bobcat y XCMG. Cotiza por WhatsApp.",
      },
      { property: "og:title", content: "Repuestos de equipo pesado | Grupo RMC" },
      {
        property: "og:description",
        content:
          "Repuestos para maquinaria pesada de las principales marcas, con precios competitivos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(sparePartsQuery),
  component: RepuestosPage,
});

function RepuestosPage() {
  const { data: parts } = useSuspenseQuery(sparePartsQuery);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.25em] text-primary uppercase">
          Cotiza hoy
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-wide text-foreground uppercase sm:text-5xl">
          Repuestos de equipo pesado
        </h1>
        <p className="mt-4 text-muted-foreground">
          Comparte la marca, el modelo, el número de parte y fotografías: te
          preparamos una cotización rápida por WhatsApp.
        </p>
        <WhatsAppButton
          href={WA_SPARE_PARTS_LINK}
          event="click_whatsapp_spare_parts"
          className="mt-6"
          size="lg"
        >
          Cotizar repuesto por WhatsApp
        </WhatsAppButton>
      </header>

      <section className="mt-12" aria-labelledby="marcas">
        <h2
          id="marcas"
          className="font-display text-sm tracking-[0.25em] text-primary uppercase"
        >
          Marcas disponibles
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {BRANDS.map((brand) => (
            <li
              key={brand}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold tracking-wide text-card-foreground uppercase"
            >
              {brand}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="lineas">
        <h2
          id="lineas"
          className="font-display text-2xl tracking-wide text-foreground uppercase"
        >
          Líneas que manejamos
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {parts.map((part) => (
            <article
              key={part.id}
              className="flex flex-col rounded-lg border border-border bg-card p-6"
            >
              <span className="text-xs font-semibold tracking-widest text-primary uppercase">
                {part.brand} · {part.category}
              </span>
              <h3 className="mt-2 font-display text-lg tracking-wide text-card-foreground uppercase">
                {part.name}
              </h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">
                {part.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
