import { useState } from "react";
import Navbar from "./components/Navbar";
import ActionPlan from "./components/ActionPlan";
import ChatBot from "./components/ChatBot";


export default function App() {
  const [activeTab, setActiveTab] = useState("plan");

  return (
    <div className="container mx-auto my-5 p-5 bg-white rounded-2xl shadow-lg flex flex-col">
      <header className="bg-green-600 text-white p-6 text-center rounded-t-2xl">
        <h1 className="text-4xl font-bold">EarthMate</h1>
        <p className="text-lg opacity-90">Your partner for the planet</p>
      </header>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="content mt-5">
        {activeTab === "plan" && <ActionPlan />}
        {activeTab === "chat" && <ChatBot />}
      </div>

      <footer className="text-center text-gray-500 mt-5 border-t pt-4">
        © 2025 EarthMate - Making the planet greener one step at a time
      </footer>
    </div>
  );
}
