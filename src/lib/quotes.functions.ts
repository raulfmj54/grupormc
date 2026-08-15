import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

export const quoteSchema = z.object({
  fullName: z.string().trim().min(2, "Ingresa tu nombre").max(100),
  requestType: z.enum(["Renta de maquinaria", "Repuestos", "Construcción"]),
  item: z.string().trim().max(200).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  startDate: z.string().trim().max(30).optional().or(z.literal("")),
  rentalDuration: z.string().trim().max(100).optional().or(z.literal("")),
  comments: z.string().trim().max(1000).optional().or(z.literal("")),
  machineId: z
    .string()
    .trim()
    .min(1, "Este campo es obligatorio")
    .max(120, "Este campo es obligatorio"),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => quoteSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const url = process.env["SUPABASE_URL"]!;
    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { error } = await supabase.from("quote_requests").insert({
      full_name: data.fullName,
      request_type: data.requestType,
      item: data.item || null,
      location: data.location || null,
      start_date: data.startDate || null,
      rental_duration: data.rentalDuration || null,
      comments: data.comments || null,
      machine_identifier: data.machineId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
