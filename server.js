import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

let tokens = 0;
const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

app.post("/api/webhook/subotiz", (req, res) => {
  console.log("========== WEBHOOK RECEIVED ==========");
  console.log(JSON.stringify(req.body, null, 2));

  if (req.body.type === "v2.trades.succeeded") {
    tokens += 1;
    console.log("tokens:", tokens);
  }

  res.sendStatus(200);
});

app.get("/api/tokens", (req, res) => {
  res.json({ tokens });
});

app.post("/api/use-token", (req, res) => {
  if (tokens < 1) {
    return res.status(400).json({ error: "not enough tokens", tokens });
  }

  tokens -= 1;
  res.json({ tokens });
});

app.post("/api/buy-tokens", async (req, res) => {
  console.log("buy-tokens called", req.body);
  const url = "https://api.sandbox.subotiz.com/api/v1/session";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SUBOTIZ_SK}`,
      "Content-Type": "application/json",
      "Request-Id": crypto.randomUUID(),
    },
    body: JSON.stringify({
      access_no: process.env.SUBOTIZ_ACCESS_NO,
      sub_merchant_id: process.env.SUBOTIZ_MERCHANT_ID,
      order_id: "order_" + Date.now(),
      email: "customer@example.com",
      line_items: [{ price_id: req.body.price_id, quantity: "1" }],
      return_url: `${BASE_URL}/success`,
      cancel_url: `${BASE_URL}/cancel`,
    }),
  });
  const text = await response.text();
  console.log("status:", response.status, "body:", text);
  try { res.json(JSON.parse(text)); } catch { res.status(500).json({ error: text }); }
});

app.use(express.static(path.join(__dirname, "dist")));
app.get("*splat", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));

app.listen(process.env.PORT || 3001, () => console.log("running"));