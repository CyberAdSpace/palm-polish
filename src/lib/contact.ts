// Sends a message to Contact@PalmPolish.com through the shared CyberAdSpace contact endpoint.
const ENDPOINT = "https://cyberadspace.com/api/contact";

export type ContactPayload = {
  name: string;
  email: string;
  topic: string;
  message: string;
  phone?: string;
  details?: Record<string, string>;
  website?: string; // honeypot
};

export async function sendToPalmPolish(payload: ContactPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({ ok: false }));
    return data && data.ok ? { ok: true } : { ok: false, error: data?.error || "We couldn't send that. Please email Contact@PalmPolish.com." };
  } catch {
    return { ok: false, error: "Couldn't connect. Please email Contact@PalmPolish.com." };
  }
}
