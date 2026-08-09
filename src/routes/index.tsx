import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, Wrench, Building2, ShieldCheck } from "lucide-react";

import logo from "@/assets/rmc-logo.jpg.asset.json";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FacebookLink } from "@/components/FacebookLink";
import { WA_GENERAL_LINK, WA_SPARE_PARTS_LINK, WHATSAPP_DISPLAY } from "@/lib/contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grupo RMC | Renta de maquinaria y repuestos en El Salvador" },
      {
        name: "description",
        content:
          "Renta de maquinaria pesada, repuestos para CAT, Komatsu, JCB, Volvo y más, y soluciones de construcción. Cotiza al +503 7221-9349.",
      },
      { property: "og:title", content: "Grupo RMC | Renta, repuestos y maquinaria" },
      {
        property: "og:description",
        content:
          "Excavadoras, retroexcavadoras y repuestos de equipo pesado con atención inmediata por WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const BRANDS = ["CAT", "John Deere", "Komatsu", "Volvo", "JCB", "SANY", "Bobcat", "XCMG"];

const pillars = [
  {
    icon: Truck,
    title: "Renta de maquinaria",
    text: "Equipos listos para trabajar por día, semana o mes.",
    to: "/maquinaria" as const,
  },
  {
    icon: Wrench,
    title: "Repuestos",
    text: "Filtros, hidráulica, tren de rodaje y más para las principales marcas.",
    to: "/repuestos" as const,
  },
  {
    icon: Building2,
    title: "Construcción",
    text: "Apoyo en terracería, obra civil y movimiento de tierra.",
    to: "/servicios" as const,
  },
  {
    icon: ShieldCheck,
    title: "Asesoría técnica",
    text: "Te ayudamos a elegir el equipo o la parte correcta.",
    to: "/contacto" as const,
  },
];

function Index() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60 bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] text-primary uppercase">
              Renta | Repuestos | Maquinaria | Construcción
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-wide text-foreground uppercase sm:text-6xl">
              Maquinaria y repuestos que mantienen tu obra en movimiento
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              En Grupo RMC rentamos equipo pesado y suministramos repuestos para
              las marcas líderes del mercado. Atención directa por WhatsApp al{" "}
              <span className="font-semibold text-foreground">{WHATSAPP_DISPLAY}</span>.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <WhatsAppButton href={WA_GENERAL_LINK} event="click_whatsapp_hero" size="lg" />
              <Link
                to="/maquinaria"
                className="rounded-md border-2 border-primary px-6 py-3.5 text-sm font-semibold tracking-wide text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Ver maquinaria
              </Link>
              <FacebookLink event="click_facebook_header" />
            </div>
          </div>
          <img
            src={logo.url}
            alt="Logo de Grupo RMC con excavadora amarilla"
            className="mx-auto w-full max-w-sm rounded-lg border border-border object-cover"
            width={480}
            height={480}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14" aria-labelledby="marcas-home">
        <h2
          id="marcas-home"
          className="font-display text-sm tracking-[0.3em] text-primary uppercase"
        >
          Marcas que atendemos
        </h2>
        <ul className="mt-5 flex flex-wrap gap-3">
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

      <section className="mx-auto max-w-7xl px-4 pb-16" aria-labelledby="servicios-home">
        <h2
          id="servicios-home"
          className="font-display text-3xl tracking-wide text-foreground uppercase"
        >
          Lo que hacemos
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <Link
              key={pillar.title}
              to={pillar.to}
              className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary"
            >
              <pillar.icon className="size-8 text-icon" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg tracking-wide text-card-foreground uppercase">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{pillar.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl tracking-wide text-foreground uppercase">
              ¿Necesitas un repuesto hoy?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Envíanos marca, modelo, número de parte y fotografías para cotizar.
            </p>
          </div>
          <WhatsAppButton
            href={WA_SPARE_PARTS_LINK}
            event="click_whatsapp_spare_parts"
            size="lg"
          >
            Cotizar repuesto
          </WhatsAppButton>
        </div>
      </section>
    </div>
  );
}
