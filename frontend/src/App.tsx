import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Types for vehicle data
interface Vehicle {
  vin: string;
  make: string;
  model: string;
  year: number;
  status: string;
}

interface ChartData {
  name: string;
  age: number;
}

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Helper to transform vehicles into chart data (age = current year - vehicle.year)
  const updateChart = (list: Vehicle[]) => {
    const currentYear = new Date().getFullYear();
    const data = list.map((v) => ({ name: `${v.make} ${v.model}`, age: currentYear - v.year }));
    setChartData(data);
  };

  // Initial fetch of inventory
  useEffect(() => {
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data: Vehicle[]) => {
        setVehicles(data);
        updateChart(data);
      })
      .catch((err) => console.error("Failed to load inventory", err));
  }, []);

  // WebSocket for real‑time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${protocol}://${window.location.host}`);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "new_vehicle") {
        const newVehicle: Vehicle = msg.payload;
        setVehicles((prev) => {
          const updated = [...prev, newVehicle];
          updateChart(updated);
          return updated;
        });
      }
    };
    ws.onerror = (e) => console.error("WebSocket error", e);
    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">DealerDesk Inventory Dashboard</h1>
      <div className="w-full max-w-2xl h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="age" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
