import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const uploadSchema = z.object({
  kind: z.enum(["equipment", "spare_parts"]),
  id: z.string().uuid(),
  fileName: z.string().min(1).max(160),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  // base64 (sin prefijo data:), máx ~6MB codificado
  base64: z.string().min(16).max(8_000_000),
});

// El primer usuario que entra al panel queda como administrador.
async function ensureAdmin(supabase: SupabaseClient<Database>, userId: string) {
  const { data: isAdmin } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (isAdmin) return true;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw new Error(error.message);
  if ((count ?? 0) > 0) return false;

  const { error: insertError } = await supabaseAdmin
    .from("user_roles")
    .insert({ user_id: userId, role: "admin" });
  if (insertError) throw new Error(insertError.message);
  return true;
}

export const listCatalogForAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const isAdmin = await ensureAdmin(context.supabase, context.userId);
    if (!isAdmin) throw new Error("Forbidden");


    const [equipment, spareParts] = await Promise.all([
      context.supabase
        .from("equipment")
        .select("id, name, brand, image_url, sort_order")
        .order("sort_order", { ascending: true }),
      context.supabase
        .from("spare_parts")
        .select("id, name, brand, image_url, sort_order")
        .order("sort_order", { ascending: true }),
    ]);

    if (equipment.error) throw new Error(equipment.error.message);
    if (spareParts.error) throw new Error(spareParts.error.message);

    return { equipment: equipment.data ?? [], spareParts: spareParts.data ?? [] };
  });

export const uploadCatalogImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => uploadSchema.parse(input))
  .handler(async ({ data, context }) => {
    const isAdmin = await ensureAdmin(context.supabase, context.userId);
    if (!isAdmin) throw new Error("Forbidden");


    const bytes = Buffer.from(data.base64, "base64");
    if (bytes.byteLength > 5 * 1024 * 1024) {
      throw new Error("La imagen no debe superar 5 MB");
    }

    const ext =
      data.contentType === "image/png"
        ? "png"
        : data.contentType === "image/webp"
          ? "webp"
          : "jpg";
    const path = `${data.kind}/${data.id}-${Date.now()}.${ext}`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: uploadError } = await supabaseAdmin.storage
      .from("catalog")
      .upload(path, bytes, { contentType: data.contentType, upsert: true });
    if (uploadError) throw new Error(uploadError.message);

    const publicPath = `/api/public/catalog/${path}`;
    const { error: updateError } = await context.supabase
      .from(data.kind)
      .update({ image_url: publicPath })
      .eq("id", data.id);
    if (updateError) throw new Error(updateError.message);

    return { imageUrl: publicPath };
  });
