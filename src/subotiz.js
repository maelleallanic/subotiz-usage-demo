// ============================================================
// subotiz.js — API layer
// Mock mode: everything runs client-side with fake delays
// Real mode: swap each function to call your backend endpoints
//   which in turn call the Subotiz API with your sk_... key
// ============================================================

const IS_MOCK = true; // flip to false when you have real credentials

// --- MOCK IMPLEMENTATIONS ---

const mock = {
  createCheckoutSession: async (priceId, tokens) => {
    await delay(1200);
    return {
      session_id: "cs_mock_" + randomId(),
      checkout_url: "#mock-checkout",
      tokens_granted: tokens,
    };
  },

  processPayment: async (sessionId) => {
    await delay(800);
    return {
      event_type: "v2.invoice.paid",
      status: "success",
      session_id: sessionId,
    };
  },
};

// --- REAL IMPLEMENTATIONS ---
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
  if (IS_MOCK) {
    return mock.createCheckoutSession(priceId, tokens);
  }
  return real.createCheckoutSession(priceId, tokens);
}

export async function processPayment(sessionId) {
  if (IS_MOCK) {
    return mock.processPayment(sessionId);
  }
  return real.processPayment(sessionId);
}

// --- HELPERS ---

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

// --- TOKEN PACKS ---
// Each pack maps to a price_id in your Subotiz dashboard.
// Create these under Products → Pricing in the Subotiz dashboard.

export const TOKEN_PACKS = [
  { tokens: 1,  price: 0.01, priceId: "price_meow_1",  label: "" },
  { tokens: 10,  price: 0.10, priceId: "price_meow_10",  label: "" },
  { tokens: 50,  price: 0.50, priceId: "price_meow_50",  label: "popular" },
  { tokens: 100, price: 1.00, priceId: "price_meow_100", label: "best value" },
  { tokens: 500, price: 5.00, priceId: "price_meow_500", label: "" },
];
