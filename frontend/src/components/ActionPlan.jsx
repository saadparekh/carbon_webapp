import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // <-- backend URL

export default function ActionPlan() {
  const [formData, setFormData] = useState({
    transport: "car",
    electricity: "",
    diet: "meat",
    plastic: ""
  });
  const [result, setResult] = useState(null);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      travel: formData.transport === "car" ? 200 : formData.transport === "bus" ? 100 : 20,
      electricity: parseInt(formData.electricity) || 0,
      diet: formData.diet,
      plastic: parseInt(formData.plastic) || 0
    };

    try {
      const res = await fetch(`${BACKEND_URL}/action_plan`, {   // <-- backend URL
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
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-green-700 mb-2">🌍 Your Personalized Action Plan</h2>
        <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
          Fill in your lifestyle details and get eco-friendly recommendations to reduce your carbon footprint.
        </p>
      </div>

      <form className="flex flex-col gap-4 max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md" onSubmit={handleSubmit}>
        {/* ...form inputs unchanged... */}
      </form>

      {result && !result.error && (
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
        </div>
      )}

      {result && result.error && <p className="text-red-500 mt-4">{result.error}</p>}
    </div>
  );
}
