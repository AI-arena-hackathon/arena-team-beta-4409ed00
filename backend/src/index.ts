import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// In‑memory inventory store (placeholder for PostgreSQL)
const inventory = [
  { vin: "1HGCM82633A004352", make: "Honda", model: "Accord", year: 2022, status: "available" },
  { vin: "1FAFP404X1F123456", make: "Ford", model: "Mustang", year: 2021, status: "sold" },
];

// GET inventory
app.get("/api/inventory", (_req, res) => {
  res.json(inventory);
});

// POST new vehicle to inventory and broadcast via WebSocket
app.post("/api/inventory", (req, res) => {
  const vehicle = req.body;
  if (!vehicle || !vehicle.vin) {
    return res.status(400).json({ error: "Vehicle must include VIN" });
  }
  inventory.push(vehicle);
  // Broadcast to all WS clients if WS server is available
  if (wss && wss.clients) {
    const message = JSON.stringify({ type: "new_vehicle", payload: vehicle });
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(message);
      }
    });
  }
  res.status(201).json(vehicle);
});

const PORT = process.env.PORT || 4000;
// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

// Set up WebSocket server for real‑time updates

const wss = new WebSocketServer({ server });
console.log("WebSocket server initialized");
