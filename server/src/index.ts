// server/src/index.ts

import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS : on autorise le front (4173) + tout en dev
app.use(
  cors({
    origin: true, // accepte toutes les origines en dev (dont http://localhost:4173)
    credentials: true,
  })
);

// Pour lire le JSON du body
app.use(express.json());

// Route de healthcheck (debug API)
app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// Toutes tes routes applicatives
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`🚀 Server ready on ${PORT}`);
});
