import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = "https://carbon-webapp-s97l.onrender.com"; // Backend URL

export default function ActionPlan() {
  const [formData, setFormData] = useState({
    transport: "car",
    electricity: "",
    diet: "meat",
    plastic: ""
  });
  const [result, setResult] = useState(null);

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      travel: formData.transport === "car" ? 200 : formData.transport === "bus" ? 100 : 20,
      electricity: parseInt(formData.electricity) || 0,
      diet: formData.diet,
      plastic: parseInt(formData.plastic) || 0
    };

    try {
      const res = await fetch(`${BACKEND_URL}/action_plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Error fetching plan" });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-green-700 mb-4">🌍 Your Action Plan</h2>

      <form className="flex flex-col gap-4 max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md" onSubmit={handleSubmit}>
        <label>How do you usually travel?</label>
        <select name="transport" value={formData.transport} onChange={handleChange}>
          <option value="car">Mostly Car</option>
          <option value="bike">Bike</option>
          <option value="bus">Bus/Metro</option>
          <option value="walk">Walking</option>
        </select>

        <label>Electricity usage per month (kWh approx):</label>
        <input type="number" name="electricity" value={formData.electricity} onChange={handleChange} placeholder="e.g. 300" />

        <label>Your diet preference:</label>
        <select name="diet" value={formData.diet} onChange={handleChange}>
          <option value="meat">Mostly Meat</option>
          <option value="mixed">Mixed</option>
          <option value="plant">Plant-based</option>
        </select>

        <label>Plastic usage (per week items):</label>
        <input type="number" name="plastic" value={formData.plastic} onChange={handleChange} placeholder="e.g. 10" />

        <button type="submit">Generate Plan</button>
      </form>

      {result && !result.error && (
        <div className="mt-6">
          <h3>Your Yearly Carbon Footprint: {result.footprint.toFixed(1)} tons CO₂</h3>
          <ul>
            <AnimatePresence>
              {result.recommendations.map((r, i) => (
                <motion.li key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{r}</motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}

      {result && result.error && <p className="text-red-500">{result.error}</p>}
    </div>
  );
}
