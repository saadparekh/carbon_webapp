from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv   # Load .env file for local dev

# ✅ Load environment variables
load_dotenv()

app = Flask(__name__, template_folder="templates")
CORS(app)

# ✅ Get API key from environment
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

if not OPENROUTER_API_KEY:
    print("⚠️ WARNING: OPENROUTER_API_KEY is not set. Check your .env or Render settings.")

@app.route("/")
def home():
    return render_template("index.html")

# ----------------- Chatbot + Action Plan -----------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message", "")

    max_tokens = 80
    instruction = "Answer briefly in 3-4 sentences."
    if any(word in user_input.lower() for word in ["long", "detail", "explain more", "write more"]):
        max_tokens = 500
        instruction = "Give a detailed explanation."

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "openai/gpt-3.5-turbo",   # ✅ valid OpenRouter model
        "messages": [
            {"role": "system", "content": instruction},
            {"role": "user", "content": user_input}
        ],
        "max_tokens": max_tokens
    }

    try:
        response = requests.post(BASE_URL, headers=headers, json=payload, timeout=30)
        result = response.json()
        print("🔎 API Response:", result)  # Debugging

        if "choices" in result and len(result["choices"]) > 0:
            reply = result["choices"][0]["message"]["content"]

            # ✅ Simple carbon action plan trigger
            action_plan = []
            if any(word in user_input.lower() for word in ["carbon", "reduce", "footprint", "climate"]):
                action_plan = [
                    "🚴 Use public transport or bike instead of driving 2 days a week.",
                    "💡 Switch to LED bulbs or renewable energy sources.",
                    "🥗 Eat more plant-based meals to cut food emissions.",
                    "♻️ Reduce single-use plastics with reusable bags & bottles.",
                    "🌳 Plant trees or support reforestation projects."
                ]

            return jsonify({"reply": reply, "action_plan": action_plan})

        else:
            error_message = result.get("error", {}).get("message", "Unknown API error")
            return jsonify({"reply": f"❌ API Error: {error_message}", "action_plan": []}), 500

    except Exception as e:
        return jsonify({"reply": f"⚠️ Server Error: {str(e)}", "action_plan": []}), 500


# ----------------- Action Plan Calculator -----------------
@app.route("/action_plan", methods=["POST"])
def action_plan():
    data = request.json
    travel = float(data.get("travel", 0))
    electricity = float(data.get("electricity", 0))
    diet = data.get("diet", "mixed")
    plastic = float(data.get("plastic", 0))

    travel_emission = travel * 0.0002 * 52
    electricity_emission = electricity * 0.0007 * 12
    diet_emission = 2.5 if diet == "meat" else (1.5 if diet == "mixed" else 1.0)
    plastic_emission = plastic * 0.001 * 52

    total = travel_emission + electricity_emission + diet_emission + plastic_emission

    recommendations = []
    if travel_emission > 1:
        recommendations.append("🚶 Walk or use public transport at least 2 days/week → save ~0.7 tons CO₂.")
    if electricity_emission > 1:
        recommendations.append("💡 Switch to LED bulbs or solar energy → save ~0.2 tons CO₂.")
    if diet == "meat":
        recommendations.append("🥗 Reduce beef/meat meals by 50% → save ~1.1 tons CO₂.")
    if plastic > 5:
        recommendations.append("♻️ Reduce single-use plastic → save ~0.3 tons CO₂.")

    if not recommendations:
        recommendations.append("✅ Your habits are already eco-friendly. Great job!")

    return jsonify({
        "footprint": round(total, 2),
        "recommendations": recommendations
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))   # ✅ Render uses dynamic PORT
    app.run(host="0.0.0.0", port=port, debug=True)
