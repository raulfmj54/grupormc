import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

import logo from "@/assets/rmc-logo.jpg.asset.json";
import { WA_GENERAL_LINK, WHATSAPP_DISPLAY } from "@/lib/contact";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FacebookLink } from "@/components/FacebookLink";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/maquinaria", label: "Maquinaria" },
  { to: "/repuestos", label: "Repuestos" },
  { to: "/servicios", label: "Servicios" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3" aria-label="Grupo RMC, inicio">
          <img
            src={logo.url}
            alt="Logo de Grupo RMC"
            className="h-11 w-11 rounded-sm object-cover"
            width={44}
            height={44}
          />
          <span className="leading-none">
            <span className="block font-display text-xl tracking-widest text-foreground">
              GRUPO <span className="text-primary">RMC</span>
            </span>
            <span className="hidden text-[10px] tracking-[0.2em] text-muted-foreground sm:block">
              RENTA · REPUESTOS · MAQUINARIA · CONSTRUCCIÓN
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegación principal">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="text-sm font-semibold tracking-wide text-foreground uppercase transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <FacebookLink event="click_facebook_header" className="text-muted-foreground">
            Facebook
          </FacebookLink>
          <WhatsAppButton href={WA_GENERAL_LINK} event="click_whatsapp_header" size="sm">
            {WHATSAPP_DISPLAY}
          </WhatsAppButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="inline-flex items-center justify-center rounded-md border border-border p-2 text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border/60 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4" aria-label="Navegación móvil">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary" }}
                className="rounded-md px-2 py-2 text-sm font-semibold tracking-wide text-foreground uppercase"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-3 border-t border-border/60 pt-4">
              <FacebookLink event="click_facebook_header" className="px-2 text-muted-foreground">
                Síguenos en Facebook
              </FacebookLink>
              <WhatsAppButton href={WA_GENERAL_LINK} event="click_whatsapp_header" size="sm" />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
