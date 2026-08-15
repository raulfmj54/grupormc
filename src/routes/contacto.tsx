import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FacebookLink } from "@/components/FacebookLink";
import { submitQuoteRequest, quoteSchema } from "@/lib/quotes.functions";
import { trackEvent } from "@/lib/analytics";
import {
  buildQuoteLink,
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_EMAIL_LINK,
  CONTACT_HOURS,
  FACEBOOK_NAME,
  PHONE_DISPLAY,
  PHONE_LINK,
  WA_GENERAL_LINK,
  WHATSAPP_DISPLAY,
} from "@/lib/contact";

type ContactoSearch = { item?: string; machineId?: string };

export const Route = createFileRoute("/contacto")({
  validateSearch: (search: Record<string, unknown>): ContactoSearch => ({
    ...(typeof search["item"] === "string" ? { item: search["item"].slice(0, 200) } : {}),
    ...(typeof search["machineId"] === "string"
      ? { machineId: search["machineId"].slice(0, 120) }
      : {}),
  }),
  head: () => ({
    meta: [
      { title: "Contacto y cotizaciones | Grupo RMC" },
      {
        name: "description",
        content:
          "Escríbenos por WhatsApp al +503 7221-9349 o llena el formulario para recibir una cotización personalizada de Grupo RMC.",
      },
      { property: "og:title", content: "Contacto y cotizaciones | Grupo RMC" },
      {
        property: "og:description",
        content:
          "Cuéntanos qué maquinaria, repuesto o solución necesitas y preparamos tu cotización.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactoPage,
});

const requestTypes = ["Renta de maquinaria", "Repuestos", "Construcción"] as const;

const fieldClass =
  "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none";

function ContactoPage() {
  const search = Route.useSearch();
  const submit = useServerFn(submitQuoteRequest);
  const [sending, setSending] = useState(false);
  const [requestType, setRequestType] =
    useState<(typeof requestTypes)[number]>("Renta de maquinaria");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const raw = {
      fullName: String(form.get("fullName") ?? ""),
      requestType,
      item: String(form.get("item") ?? ""),
      location: String(form.get("location") ?? ""),
      startDate: String(form.get("startDate") ?? ""),
      rentalDuration: String(form.get("rentalDuration") ?? ""),
      comments: String(form.get("comments") ?? ""),
      machineId: String(form.get("machineId") ?? ""),
    };

    const parsed = quoteSchema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Revisa los datos del formulario.");
      return;
    }

    setSending(true);
    try {
      await submit({ data: parsed.data });
      trackEvent("submit_quote_form");
      toast.success("Solicitud registrada. Abrimos WhatsApp para enviarla.");
      window.open(buildQuoteLink(parsed.data), "_blank", "noopener,noreferrer");
      event.currentTarget.reset();
    } catch {
      toast.error("No se pudo registrar la solicitud. Escríbenos por WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <h1 className="font-display text-4xl tracking-wide text-foreground uppercase sm:text-5xl">
        Contacto
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section className="rounded-lg border border-primary/40 bg-card p-8">
          <h2 className="font-display text-2xl tracking-wide text-card-foreground uppercase">
            Hablemos de tu proyecto
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Cuéntanos qué maquinaria, repuesto o solución necesitas. Nuestro
            equipo atenderá tu solicitud y preparará una cotización
            personalizada.
          </p>

          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="sr-only">Mobile</dt>
              <dd>
                <a href={PHONE_LINK} className="font-semibold text-foreground hover:text-primary">
                  {PHONE_DISPLAY}
                </a>
                <span className="block text-xs tracking-widest text-muted-foreground uppercase">
                  Mobile
                </span>
              </dd>
            </div>
            <div>
              <dt className="sr-only">WhatsApp</dt>
              <dd>
                <a
                  href={WA_GENERAL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-foreground hover:text-primary"
                >
                  {WHATSAPP_DISPLAY}
                </a>
                <span className="block text-xs tracking-widest text-muted-foreground uppercase">
                  WhatsApp
                </span>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Email</dt>
              <dd>
                <a
                  href={CONTACT_EMAIL_LINK}
                  className="font-semibold text-foreground hover:text-primary"
                >
                  {CONTACT_EMAIL}
                </a>
                <span className="block text-xs tracking-widest text-muted-foreground uppercase">
                  Email
                </span>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Facebook:</dt>
              <dd className="font-semibold text-foreground">{FACEBOOK_NAME}</dd>
            </div>
            {CONTACT_ADDRESS ? (
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Dirección:</dt>
                <dd className="text-foreground">{CONTACT_ADDRESS}</dd>
              </div>
            ) : null}
            {CONTACT_HOURS ? (
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Horario:</dt>
                <dd className="text-foreground">{CONTACT_HOURS}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <WhatsAppButton href={WA_GENERAL_LINK} event="click_whatsapp_header">
              Escribir por WhatsApp
            </WhatsAppButton>
            <FacebookLink
              event="click_facebook_footer"
              className="rounded-md border border-border px-4 py-3 text-foreground"
            >
              Visitar Facebook
            </FacebookLink>
            <a
              href="#cotizacion"
              className="rounded-md border-2 border-primary px-4 py-3 text-sm font-semibold text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Solicitar cotización
            </a>
          </div>
        </section>

        <section id="cotizacion" className="rounded-lg border border-border bg-card p-8">
          <h2 className="font-display text-2xl tracking-wide text-card-foreground uppercase">
            Formulario de cotización
          </h2>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="fullName" className="text-sm text-muted-foreground">
                Nombre *
              </label>
              <input id="fullName" name="fullName" required maxLength={100} className={fieldClass} />
            </div>

            <div>
              <label htmlFor="requestType" className="text-sm text-muted-foreground">
                Tipo de solicitud *
              </label>
              <select
                id="requestType"
                name="requestType"
                value={requestType}
                onChange={(e) =>
                  setRequestType(e.target.value as (typeof requestTypes)[number])
                }
                className={fieldClass}
              >
                {requestTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="item" className="text-sm text-muted-foreground">
                Equipo o repuesto solicitado
              </label>
              <input
                id="item"
                name="item"
                maxLength={200}
                defaultValue={search.item ?? ""}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="machineId" className="text-sm text-muted-foreground">
                Número de parte, placa, VIN o identificación de la máquina *
              </label>
              <input
                id="machineId"
                name="machineId"
                required
                maxLength={120}
                defaultValue={search.machineId ?? ""}
                placeholder="Ingresa el número de parte, placa, VIN o identificación"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="location" className="text-sm text-muted-foreground">
                Ubicación del proyecto
              </label>
              <input id="location" name="location" maxLength={200} className={fieldClass} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="text-sm text-muted-foreground">
                  Fecha estimada
                </label>
                <input id="startDate" name="startDate" type="date" className={fieldClass} />
              </div>
              {requestType === "Renta de maquinaria" ? (
                <div>
                  <label htmlFor="rentalDuration" className="text-sm text-muted-foreground">
                    Duración del alquiler
                  </label>
                  <input
                    id="rentalDuration"
                    name="rentalDuration"
                    maxLength={100}
                    placeholder="Ej. 2 semanas"
                    className={fieldClass}
                  />
                </div>
              ) : null}
            </div>

            <div>
              <label htmlFor="comments" className="text-sm text-muted-foreground">
                Comentario
              </label>
              <textarea id="comments" name="comments" rows={4} maxLength={1000} className={fieldClass} />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-md bg-primary px-5 py-3 text-sm font-semibold tracking-wide text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {sending ? "Enviando..." : "Enviar y abrir WhatsApp"}
            </button>
            <p className="text-xs text-muted-foreground">
              Al enviar, se abrirá WhatsApp con el resumen de tu solicitud.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
