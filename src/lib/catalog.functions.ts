import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
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
}

export const listEquipment = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("equipment")
    .select(
      "id, slug, name, brand, category, short_description, image_url, featured, sort_order",
    )
    .eq("available", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getEquipmentBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(120) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient()
      .from("equipment")
      .select(
        "id, slug, name, brand, category, short_description, description, specs, image_url",
      )
      .eq("slug", data.slug)
      .eq("available", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const listSpareParts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("spare_parts")
    .select("id, name, brand, category, description, image_url, sort_order")
    .eq("available", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});
