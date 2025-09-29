import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Backend URL

export default function ActionPlan() {
  const [formData, setFormData] = useState({
    transport: "car",
    electricity: "",
    diet: "meat",
    plastic: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); // ✅ request start hote hi loading true
    setResult(null);

    const payload = {
      travel:
        formData.transport === "car"
          ? 200
          : formData.transport === "bus"
          ? 100
          : formData.transport === "bike"
          ? 50
          : 20,
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
    } finally {
      setLoading(false); // ✅ request khatam hone par loading false
    }
  };

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-green-700 mb-2">
          🌍 Your Personalized Action Plan
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
          Fill in your lifestyle details and get eco-friendly recommendations to
          reduce your carbon footprint.
        </p>
      </div>

      <form
        className="flex flex-col gap-4 max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="font-semibold text-gray-700">
            How do you usually travel?
          </label>
          <select
            name="transport"
            value={formData.transport}
            onChange={handleChange}
            className="p-3 rounded border w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="car">Mostly Car</option>
            <option value="bike">Bike</option>
            <option value="bus">Bus/Metro</option>
            <option value="walk">Walking</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700">
            Electricity usage per month (kWh approx):
          </label>
          <input
            type="number"
            name="electricity"
            value={formData.electricity}
            onChange={handleChange}
            placeholder="e.g. 300"
            className="p-3 rounded border w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">
            Your diet preference:
          </label>
          <select
            name="diet"
            value={formData.diet}
            onChange={handleChange}
            className="p-3 rounded border w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="meat">Mostly Meat</option>
            <option value="mixed">Mixed</option>
            <option value="plant">Plant-based</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700">
            Plastic usage (per week items):
          </label>
          <input
            type="number"
            name="plastic"
            value={formData.plastic}
            onChange={handleChange}
            placeholder="e.g. 10"
            className="p-3 rounded border w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="mt-4 p-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
        >
          Generate Plan
        </button>
      </form>

      {/* ✅ Loading message */}
      {loading && (
        <p className="text-center text-green-600 font-semibold mt-6">
          ⏳ Generating your personalized action plan...
        </p>
      )}

      {result && !result.error && !loading && (
        <div className="mt-6 p-6 bg-green-50 rounded-xl shadow-md max-w-xl mx-auto">
          <h3 className="text-green-700 font-bold text-xl mb-4">
            Your Yearly Carbon Footprint: {result.footprint.toFixed(1)} tons CO₂
          </h3>
          <ul className="list-disc pl-5 text-gray-700">
            <AnimatePresence>
              {result.recommendations.map((r, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="mb-2"
                >
                  {r}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* AI personalized tips */}
          <div className="mt-6 p-4 bg-white border-l-4 border-green-600 rounded">
            <h4 className="font-semibold text-green-700 mb-2">
              🤖 AI Personalized Tips:
            </h4>
            <p className="text-gray-700 whitespace-pre-line">
              {result.ai_tips}
            </p>
          </div>
        </div>
      )}

      {result && result.error && !loading && (
        <p className="text-red-500 mt-4">{result.error}</p>
      )}
    </div>
  );
}
