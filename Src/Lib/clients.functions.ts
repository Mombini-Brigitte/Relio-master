import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const e164 = z.string().regex(/^\+[1-9]\d{7,14}$/, "Numéro au format E.164 attendu");
const channel = z.enum(["sms", "whatsapp"]);

export const addClientAndSend = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        firstName: z.string().trim().min(1).max(60),
        phone: e164,
        autopilot: z.boolean(),
        channel,
        commerce: z.string().trim().max(80).default("votre commerce"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendTwilioMessage } = await import("./messaging.server");

    const { data: client, error } = await supabaseAdmin
      .from("clients")
      .insert({ first_name: data.firstName, phone_e164: data.phone, autopilot: data.autopilot })
      .select("id")
      .single();
    if (error) throw new Error("Impossible d'enregistrer le client.");

    if (!data.autopilot) return { clientId: client.id, sent: false as const, error: null };

    const body = `Bonjour ${data.firstName}, merci de votre visite chez ${data.commerce} ! À très bientôt.`;
    try {
      const res = await sendTwilioMessage({ to: data.phone, body, channel: data.channel });
      await supabaseAdmin.from("messages").insert({
        client_id: client.id, channel: data.channel, body, status: "sent", provider_sid: res.sid,
      });
      return { clientId: client.id, sent: true as const, error: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur d'envoi";
      await supabaseAdmin.from("messages").insert({
        client_id: client.id, channel: data.channel, body, status: "failed", error: msg,
      });
      return { clientId: client.id, sent: false as const, error: msg };
    }
  });

export const listClients = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("clients")
    .select("id, first_name, phone_e164, created_at, messages(count)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error("Impossible de charger les clients.");
  return data.map((c) => ({
    id: c.id,
    firstName: c.first_name,
    phone: c.phone_e164,
    createdAt: c.created_at,
    messageCount: (c.messages as unknown as { count: number }[])[0]?.count ?? 0,
  }));
});

export const deleteClient = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // messages are removed by ON DELETE CASCADE
    const { error } = await supabaseAdmin.from("clients").delete().eq("id", data.id);
    if (error) throw new Error("Suppression impossible.");
    return { ok: true };
  });
