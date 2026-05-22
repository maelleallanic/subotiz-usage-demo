import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

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
      return_url: "http://localhost:3001",
      cancel_url: "http://localhost:3001",
    }),
  });
  const text = await response.text();
  console.log("status:", response.status, "body:", text);
  try { res.json(JSON.parse(text)); } catch { res.status(500).json({ error: text }); }
});

app.use(express.static(path.join(__dirname, "dist")));
app.get("*splat", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));

app.listen(process.env.PORT || 3001, () => console.log("running"));