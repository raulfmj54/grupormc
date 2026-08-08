/**
 * Datos de contacto oficiales de Grupo RMC.
 * Editar aquí actualiza todo el sitio.
 */

export const WHATSAPP_NUMBER = "50372219349";
export const WHATSAPP_DISPLAY = "+503 7221-9349";
export const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61587354333415";
export const FACEBOOK_NAME = "Grupo RMC";

/**
 * Datos aún no confirmados. Se mantienen ocultos hasta contar con
 * información verificada: basta con llenar el valor para mostrarlos.
 */
export const CONTACT_EMAIL: string | null = null;
export const CONTACT_ADDRESS: string | null = null;
export const CONTACT_HOURS: string | null = null;

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WA_MESSAGES = {
  general:
    "Hola, Grupo RMC. Visité su sitio web y deseo solicitar una cotización.",
  spareParts:
    "Hola, Grupo RMC. Deseo cotizar un repuesto para maquinaria pesada. Puedo compartir la marca, modelo, número de parte y fotografías.",
  construction:
    "Hola, Grupo RMC. Deseo solicitar información sobre servicios para un proyecto de construcción.",
  equipment: (name: string) =>
    `Hola, Grupo RMC. Deseo consultar la disponibilidad y el precio de alquiler de ${name}.`,
} as const;

export const WA_GENERAL_LINK = waLink(WA_MESSAGES.general);
export const WA_SPARE_PARTS_LINK = waLink(WA_MESSAGES.spareParts);
export const WA_CONSTRUCTION_LINK = waLink(WA_MESSAGES.construction);
export const waEquipmentLink = (name: string) =>
  waLink(WA_MESSAGES.equipment(name));

export type QuoteMessageInput = {
  fullName: string;
  requestType: string;
  item?: string | null | undefined;
  location?: string | null | undefined;
  startDate?: string | null | undefined;
  rentalDuration?: string | null | undefined;
  comments?: string | null | undefined;
};

export function buildQuoteMessage(input: QuoteMessageInput): string {
  const lines = [
    "Hola, Grupo RMC. Deseo solicitar una cotización.",
    "",
    `Nombre: ${input.fullName}`,
    `Tipo de solicitud: ${input.requestType}`,
  ];
  if (input.item) lines.push(`Equipo o repuesto: ${input.item}`);
  if (input.location) lines.push(`Ubicación del proyecto: ${input.location}`);
  if (input.startDate) lines.push(`Fecha estimada: ${input.startDate}`);
  if (input.rentalDuration)
    lines.push(`Duración del alquiler: ${input.rentalDuration}`);
  if (input.comments) lines.push(`Comentario: ${input.comments}`);
  return lines.join("\n");
}

export function buildQuoteLink(input: QuoteMessageInput): string {
  return waLink(buildQuoteMessage(input));
}
