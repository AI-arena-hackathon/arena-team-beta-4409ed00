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

   const handleAddVehicle = (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     const form = e.currentTarget;
     const data = {
       vin: (form.elements.namedItem("vin") as HTMLInputElement).value,
       make: (form.elements.namedItem("make") as HTMLInputElement).value,
       model: (form.elements.namedItem("model") as HTMLInputElement).value,
       year: parseInt((form.elements.namedItem("year") as HTMLInputElement).value, 10),
       status: (form.elements.namedItem("status") as HTMLSelectElement).value,
     };
     fetch("/api/inventory", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(data),
     })
       .then((res) => {
         if (!res.ok) throw new Error("Failed to add vehicle");
         return res.json();
       })
       .then((newVehicle) => {
         setVehicles((prev) => {
           const updated = [...prev, newVehicle];
           updateChart(updated);
           return updated;
         });
         form.reset();
       })
       .catch((err) => console.error(err));
   };

   return (
     <div className="min-h-screen flex flex-col items-center p-4">
       <h1 className="text-3xl font-bold mb-6">DealerDesk Inventory Dashboard</h1>
       <form className="w-full max-w-2xl mb-4" onSubmit={handleAddVehicle}>
         <div className="grid grid-cols-2 gap-2">
           <input className="border p-1" name="vin" placeholder="VIN" required />
           <input className="border p-1" name="make" placeholder="Make" required />
           <input className="border p-1" name="model" placeholder="Model" required />
           <input className="border p-1" name="year" type="number" placeholder="Year" required />
           <select className="border p-1" name="status" defaultValue="available">
             <option value="available">Available</option>
             <option value="sold">Sold</option>
           </select>
         </div>
         <button type="submit" className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
           Add Vehicle
         </button>
       </form>
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
