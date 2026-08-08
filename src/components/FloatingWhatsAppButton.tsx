import { MessageCircle } from "lucide-react";

import { WA_GENERAL_LINK } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";

export function FloatingWhatsAppButton() {
  return (
    <a
      href={WA_GENERAL_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Cotizar por WhatsApp con Grupo RMC"
      onClick={() => trackEvent("click_whatsapp_floating")}
      className="animate-float-in fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-4 font-semibold text-whatsapp-foreground shadow-lg shadow-black/40 transition-transform duration-200 hover:-translate-y-1 hover:bg-whatsapp/90 focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none sm:right-6 sm:bottom-6 sm:px-6"
    >
      <MessageCircle className="size-6 shrink-0" aria-hidden="true" />
      <span className="hidden text-sm uppercase sm:inline">
        Cotizar por WhatsApp
      </span>
    </a>
  );
}
