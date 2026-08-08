import type { ReactNode } from "react";
import { Facebook } from "lucide-react";

import { FACEBOOK_URL } from "@/lib/contact";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type FacebookLinkProps = {
  event: AnalyticsEvent;
  children?: ReactNode;
  className?: string;
  iconOnly?: boolean;
};

export function FacebookLink({
  event,
  children = "Síguenos en Facebook",
  className,
  iconOnly = false,
}: FacebookLinkProps) {
  return (
    <a
      href={FACEBOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visitar Facebook de Grupo RMC"
      onClick={() => trackEvent(event)}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
        className,
      )}
    >
      <Facebook className="size-5 shrink-0" aria-hidden="true" />
      {iconOnly ? <span className="sr-only">{children}</span> : <span>{children}</span>}
    </a>
  );
}
