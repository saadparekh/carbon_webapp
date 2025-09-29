# EarthMate 🌍 — AI-powered Sustainability Web App

EarthMate is a full-stack web application that helps users **reduce carbon emissions** and **adopt eco-friendly habits**.  
It combines a **personalized Action Plan generator** with an **AI chatbot** that answers environment-related queries.  

🚀 **Future update:** A full **Carbon Footprint Tracker** with detailed breakdown and visual dashboard.

🔗 **Live demo:**

---

## ✨ Features
- 🧠 **AI Chatbot** — Ask eco-questions, get smart answers  
- 📋 **Personalized Action Plan** — Based on transport, diet, electricity, and plastic usage  
- 📱 **Modern UI** — Responsive design with chat experience (WhatsApp-style)  
- 💾 **Backend API** (Flask) — Handles chat + plan generation  
- 🔮 **Roadmap:** Carbon Footprint Tracker, dashboards, gamification  

---

## 📂 Project Structure
carbon_webapp/
├── app.py # Flask backend
├── templates/
│ └── index.html # Frontend (HTML, CSS, JS)
├── requirements.txt # Dependencies
├── .env.example # Example environment variables
├── .gitignore
└── README.md


---

## ⚡ Setup & Run (Local)

1. Clone repo:
```bash
git clone https://github.com/<your-username>/carbon_webapp.git
cd carbon_webapp

2.Create environment:
python -m venv venv
venv\Scripts\activate   # Windows
# or
source venv/bin/activate  # Mac/Linux

3.Install dependencies:
pip install -r requirements.txt

4.Setup .env (copy from example):
cp .env.example .env
5.Run the server:
python app.py
