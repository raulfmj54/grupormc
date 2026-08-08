import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";

import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type WhatsAppButtonProps = {
  href: string;
  event: AnalyticsEvent;
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline";
  ariaLabel?: string;
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

export function WhatsAppButton({
  href,
  event,
  children = "Cotizar por WhatsApp",
  className,
  size = "md",
  variant = "solid",
  ariaLabel = "Cotizar por WhatsApp con Grupo RMC",
}: WhatsAppButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={() => trackEvent(event)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-wide transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "solid"
          ? "bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 focus-visible:ring-whatsapp"
          : "border-2 border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-whatsapp-foreground focus-visible:ring-whatsapp",
        sizes[size],
        className,
      )}
    >
      <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </a>
  );
}
