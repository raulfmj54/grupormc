import { createFileRoute } from "@tanstack/react-router";
import { HardHat, Truck, Wrench, Building2 } from "lucide-react";

import { WhatsAppButton } from "@/components/WhatsAppButton";
import {
  WA_CONSTRUCTION_LINK,
  WA_GENERAL_LINK,
  WA_SPARE_PARTS_LINK,
} from "@/lib/contact";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios: renta, repuestos y construcción | Grupo RMC" },
      {
        name: "description",
        content:
          "Renta de maquinaria, venta de repuestos y servicios para proyectos de construcción en El Salvador. Cotiza por WhatsApp con Grupo RMC.",
      },
      { property: "og:title", content: "Servicios de Grupo RMC" },
      {
        property: "og:description",
        content:
          "Renta de maquinaria, repuestos de equipo pesado y apoyo en proyectos de construcción.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServiciosPage,
});

const services = [
  {
    icon: Truck,
    title: "Renta de maquinaria",
    text: "Excavadoras, retroexcavadoras, minicargadores, cargadores y compactadoras por día, semana o mes.",
    link: WA_GENERAL_LINK,
    cta: "Cotizar renta por WhatsApp",
    event: "click_whatsapp_equipment" as const,
  },
  {
    icon: Wrench,
    title: "Repuestos de equipo pesado",
    text: "Filtros, tren de rodaje, hidráulica, sistema eléctrico y elementos de desgaste de las principales marcas.",
    link: WA_SPARE_PARTS_LINK,
    cta: "Cotizar repuesto por WhatsApp",
    event: "click_whatsapp_spare_parts" as const,
  },
  {
    icon: Building2,
    title: "Construcción",
    text: "Apoyo en terracería, movimiento de tierra, obra civil y proyectos de infraestructura con equipo y personal.",
    link: WA_CONSTRUCTION_LINK,
    cta: "Hablar de mi proyecto",
    event: "click_whatsapp_hero" as const,
  },
  {
    icon: HardHat,
    title: "Asesoría técnica",
    text: "Te ayudamos a elegir el equipo o la parte correcta según el trabajo, el terreno y el plazo de la obra.",
    link: WA_GENERAL_LINK,
    cta: "Consultar por WhatsApp",
    event: "click_whatsapp_hero" as const,
  },
];

function ServiciosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.25em] text-primary uppercase">
          Servicios
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-wide text-foreground uppercase sm:text-5xl">
          Renta · Repuestos · Maquinaria · Construcción
        </h1>
        <p className="mt-4 text-muted-foreground">
          Soluciones integrales para mantener tu proyecto en movimiento, con
          enfoque en tu productividad.
        </p>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {services.map((service) => (
          <article
            key={service.title}
            className="flex flex-col rounded-lg border border-border bg-card p-7"
          >
            <service.icon className="size-8 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl tracking-wide text-card-foreground uppercase">
              {service.title}
            </h2>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{service.text}</p>
            <WhatsAppButton
              href={service.link}
              event={service.event}
              size="sm"
              className="mt-6 self-start"
            >
              {service.cta}
            </WhatsAppButton>
          </article>
        ))}
      </div>
    </div>
  );
}
