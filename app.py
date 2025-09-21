from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv   # Load .env for local testing

# ✅ Load environment variables
load_dotenv()

app = Flask(__name__, template_folder="templates")
CORS(app)

# ✅ Environment variable for API key
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
        "model": "openai/gpt-3.5-turbo",  # ✅ valid model
        "messages": [
            {"role": "system", "content": instruction},
            {"role": "user", "content": user_input}
        ],
        "max_tokens": max_tokens
    }

    try:
        response = requests.post(BASE_URL, headers=headers, json=payload, timeout=30)
        result = response.json()
        print("🔎 API Response:", result)

        if "choices" in result and len(result["choices"]) > 0:
            reply = result["choices"][0]["message"]["content"]

            # ✅ Action plan suggestions
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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
