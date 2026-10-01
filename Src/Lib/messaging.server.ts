import process from "node:process";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

export type Channel = "sms" | "whatsapp";

export async function sendTwilioMessage(opts: { to: string; body: string; channel: Channel }) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const twilioKey = process.env["TWILIO_API_KEY"];
  if (!lovableKey || !twilioKey) throw new Error("Twilio n'est pas connecté.");

  const from =
    opts.channel === "whatsapp"
      ? process.env["TWILIO_WHATSAPP_FROM"]
      : process.env["TWILIO_FROM_NUMBER"];
  if (!from) {
    throw new Error(
      opts.channel === "whatsapp"
        ? "Aucun numéro WhatsApp Business n'est configuré."
        : "Aucun numéro d'envoi SMS n'est configuré.",
    );
  }

  const prefix = opts.channel === "whatsapp" ? "whatsapp:" : "";
  const res = await fetch(`${GATEWAY_URL}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": twilioKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: prefix + opts.to, From: prefix + from, Body: opts.body }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`Twilio request failed [${res.status}]: ${text}`);
    let message = text;
    try {
      message = (JSON.parse(text) as { message?: string }).message ?? text;
    } catch {
      /* keep raw */
    }
    throw new Error(`Envoi refusé par Twilio (${res.status}) : ${message}`);
  }
  return JSON.parse(text) as { sid: string; status: string };
}
