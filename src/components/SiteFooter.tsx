import { Link } from "@tanstack/react-router";

import logo from "@/assets/rmc-logo.jpg.asset.json";
import { FacebookLink } from "@/components/FacebookLink";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import {
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

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logo.url}
              alt="Logo de Grupo RMC"
              className="h-12 w-12 rounded-sm object-cover"
              width={48}
              height={48}
              loading="lazy"
            />
            <span className="font-display text-xl tracking-widest text-foreground">
              GRUPO <span className="text-primary">RMC</span>
            </span>
          </div>
          <p className="mt-4 text-sm tracking-[0.15em] text-muted-foreground uppercase">
            Renta | Repuestos | Maquinaria | Construcción
          </p>
        </div>

        <nav aria-label="Enlaces del sitio">
          <h2 className="font-display text-sm tracking-[0.25em] text-primary uppercase">
            Sitio
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Inicio</Link></li>
            <li><Link to="/maquinaria" className="hover:text-primary">Renta</Link></li>
            <li><Link to="/repuestos" className="hover:text-primary">Repuestos</Link></li>
            <li><Link to="/servicios" className="hover:text-primary">Servicios</Link></li>
            <li><Link to="/contacto" className="hover:text-primary">Contacto</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm tracking-[0.25em] text-primary uppercase">
            Contacto
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <a href={PHONE_LINK} className="font-semibold text-foreground hover:text-primary">
                {PHONE_DISPLAY}
              </a>
              <span className="block text-xs uppercase tracking-widest">Mobile</span>
            </li>
            <li>
              <a
                href={WA_GENERAL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary"
              >
                {WHATSAPP_DISPLAY}
              </a>
              <span className="block text-xs uppercase tracking-widest">WhatsApp</span>
            </li>
            <li>
              <a href={CONTACT_EMAIL_LINK} className="font-semibold text-foreground hover:text-primary">
                {CONTACT_EMAIL}
              </a>
              <span className="block text-xs uppercase tracking-widest">Email</span>
            </li>
            <li>
              <FacebookLink event="click_facebook_footer">
                {FACEBOOK_NAME} en Facebook
              </FacebookLink>
            </li>
            {CONTACT_ADDRESS ? <li>Dirección: {CONTACT_ADDRESS}</li> : null}
            {CONTACT_HOURS ? <li>Horario: {CONTACT_HOURS}</li> : null}
          </ul>
          <WhatsAppButton
            href={WA_GENERAL_LINK}
            event="click_whatsapp_header"
            size="sm"
            className="mt-5"
          />
        </div>
      </div>

      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Grupo RMC. Todos los derechos reservados.
      </div>
    </footer>
  );
}
