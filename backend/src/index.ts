import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Placeholder inventory endpoint
app.get("/api/inventory", (_req, res) => {
  // In a real implementation this would query PostgreSQL
  const sample = [
    { vin: "1HGCM82633A004352", make: "Honda", model: "Accord", year: 2022, status: "available" },
    { vin: "1FAFP404X1F123456", make: "Ford", model: "Mustang", year: 2021, status: "sold" },
  ];
  res.json(sample);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
