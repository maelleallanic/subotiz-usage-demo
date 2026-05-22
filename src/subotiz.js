// ============================================================
// subotiz.js — API layer
// ============================================================

// Your backend sits between the frontend and Subotiz.
// The backend holds SUBOTIZ_SK in an env var (never expose it here).

export async function createCheckoutSession(priceId, tokens) {
  const response = await fetch("/api/buy-tokens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price_id: priceId, tokens }),
  });
  if (!response.ok) throw new Error("Failed to create checkout session");
  return response.json();
}

export async function processPayment(sessionId) {
  return { event_type: "v2.invoice.paid", status: "pending_webhook" };
}

// --- TOKEN PACKS ---
// Each pack maps to a price_id in your Subotiz dashboard.
// Create these under Products → Pricing in the Subotiz dashboard.

export const TOKEN_PACKS = [
  { tokens: 1, price: 0.01, priceId: "647245997826652408", label: "" },
];
