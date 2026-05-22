import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// serve react frontend
app.use(express.static(path.join(__dirname, "dist")));
app.post("/webhook/subotiz", (req, res) => {
  res.status(200).send("OK");
  handleWebhookEvent(req.body);
});

app.listen(PORT, () => console.log(`running on port ${PORT}`));