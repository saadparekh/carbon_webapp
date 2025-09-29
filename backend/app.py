from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"


# ----------------- Chatbot -----------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message", "")

    # Default mode = short
    max_tokens = 80
    instruction = "Answer briefly in 3-4 sentences."

    # Agar user ne 'long', 'detail', 'explain more', 'write more' bola
    if any(word in user_input.lower() for word in ["long", "detail", "explain more", "write more"]):
        max_tokens = 500
        instruction = "Give a detailed explanation."

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": instruction},
            {"role": "user", "content": user_input}
        ],
        "max_tokens": max_tokens
    }

    try:
        response = requests.post(BASE_URL, headers=headers, json=payload)
        result = response.json()

        # Debug ke liye (Render logs me check karo)
        print("🔎 OpenRouter API Response:", result)

        if "choices" in result:
            reply = result["choices"][0]["message"]["content"]
            return jsonify({"reply": reply})
        else:
            return jsonify({"error": "API response invalid", "details": result}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------- Action Plan -----------------
@app.route("/action_plan", methods=["POST"])
def action_plan():
    data = request.json
    travel = float(data.get("travel", 0))
    electricity = float(data.get("electricity", 0))
    diet = data.get("diet", "mixed")
    plastic = float(data.get("plastic", 0))

    # --- Simple emission factors (example only) ---
    travel_emission = travel * 0.0002 * 52  # per year
    electricity_emission = electricity * 0.0007 * 12
    diet_emission = 2.5 if diet == "meat" else (1.5 if diet == "mixed" else 1.0)
    plastic_emission = plastic * 0.001 * 52

    total = travel_emission + electricity_emission + diet_emission + plastic_emission

    # --- Static Recommendations ---
    recommendations = []
    if travel_emission > 1:
        recommendations.append("🚴 Use public transport or bike at least 2 days a week → save ~0.7 tons CO₂")
    if electricity_emission > 1:
        recommendations.append("💡 Switch to LED bulbs or solar power → save ~0.2 tons CO₂")
    if diet == "meat":
        recommendations.append("🥗 Reduce beef/meat meals by 50% → save ~1.1 tons CO₂")
    if plastic > 5:
        recommendations.append("🛍 Reduce single-use plastic by switching to reusable bags → save ~0.3 tons CO₂")

    if not recommendations:
        recommendations.append("✅ Your habits are already eco-friendly. Keep it up!")

    # --- AI Personalized Tips ---
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are an eco-expert. Give practical and concise eco-friendly advice."},
            {"role": "user", "content": f"My yearly carbon footprint is {total:.1f} tons CO₂. "
                                        f"My travel habits = {travel} km/week, electricity = {electricity} kWh/month, "
                                        f"diet = {diet}, plastic use = {plastic} items/week. "
                                        "Suggest 3-4 personalized tips to reduce my footprint."}
        ],
        "max_tokens": 150
    }

    ai_tips = "⚠️ AI tips could not be generated."
    try:
        response = requests.post(BASE_URL, headers=headers, json=payload)
        result = response.json()
        if "choices" in result:
            ai_tips = result["choices"][0]["message"]["content"]
    except Exception as e:
        ai_tips = f"Error: {str(e)}"

    return jsonify({
        "footprint": total,
        "recommendations": recommendations,
        "ai_tips": ai_tips
    })


# ----------------- Health Check -----------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend running ✅"})


if __name__ == "__main__":
    # Render pe debug=False rakhna
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
