// ============================================================
// subotiz.js — API layer
// ============================================================

// Your backend sits between the frontend and Subotiz.
// The backend holds SUBOTIZ_SK in an env var (never expose it here).

const real = {
  createCheckoutSession: async (priceId, tokens) => {
    const response = await fetch("/api/buy-tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price_id: priceId, tokens }),
    });
    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }
    const data = await response.json();
    // data = { session_id, checkout_url, tokens_granted }
    // In production: redirect user to data.checkout_url (Subotiz hosted page)
    // For this demo: we skip the redirect and simulate success
    return data;
  },

  processPayment: async (sessionId) => {
    // In production this is handled by Subotiz webhooks, not a client call.
    // Your backend receives POST /webhook/subotiz with event v2.invoice.paid
    // and grants tokens there. This function is a no-op in real mode.
    return { event_type: "v2.invoice.paid", status: "pending_webhook" };
  },
};

// --- PUBLIC API ---

export async function createCheckoutSession(priceId, tokens) {
  return real.createCheckoutSession(priceId, tokens);
}

export async function processPayment(sessionId) {
  return real.processPayment(sessionId);
}

// --- TOKEN PACKS ---
// Each pack maps to a price_id in your Subotiz dashboard.
// Create these under Products → Pricing in the Subotiz dashboard.

export const TOKEN_PACKS = [
  { tokens: 1, price: 0.01, priceId: "647228098747578616", label: "" },
];
