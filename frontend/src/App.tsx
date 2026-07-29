import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Sample placeholder data
const data = [
  { name: "Vehicle A", age: 5 },
  { name: "Vehicle B", age: 2 },
  { name: "Vehicle C", age: 8 },
];

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">DealerDesk Inventory Dashboard</h1>
      <div className="w-full max-w-2xl h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
