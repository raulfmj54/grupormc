/**
 * Eventos de conversión preparados para analítica.
 * Permanecen inactivos hasta conectar una herramienta de analítica:
 * basta con implementar el envío dentro de `trackEvent`.
 */

export type AnalyticsEvent =
  | "click_whatsapp_header"
  | "click_whatsapp_hero"
  | "click_whatsapp_equipment"
  | "click_whatsapp_spare_parts"
  | "click_whatsapp_floating"
  | "click_facebook_header"
  | "click_facebook_footer"
  | "submit_quote_form";

/** Cambiar a `true` cuando exista una herramienta de analítica configurada. */
export const ANALYTICS_ENABLED = false;

export function trackEvent(
  event: AnalyticsEvent,
  params?: Record<string, string | number | boolean>,
): void {
  if (!ANALYTICS_ENABLED) return;
  // Aquí se conectará la herramienta de analítica (por ejemplo dataLayer).
  void event;
  void params;
}
