import { useState, useEffect, useRef } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState(() => {
    // LocalStorage se previous messages load kar lo
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Messages save in localStorage on every update
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    // Scroll to bottom automatically
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input) return;
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setInput("");
    setMessages((prev) => [
      ...prev,
      { type: "typing", text: "EarthMate is typing..." },
    ]);

    try {
      const res = await fetch("https://carbon-webapp-s97l.onrender.com/chat", {
        // <-- backend URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => prev.filter((m) => m.type !== "typing"));
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: data.reply || "No response" },
      ]);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.type !== "typing"));
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Error connecting to server" },
      ]);
    }
  };

  return (
    <div className="flex flex-col max-w-xl mx-auto gap-3">
      <div className="chat-box flex flex-col h-96 border rounded p-3 overflow-y-auto bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-3/4 ${
              msg.type === "user"
                ? "bg-green-600 text-white self-end"
                : msg.type === "bot"
                ? "bg-white text-gray-800 self-start border"
                : "italic text-gray-500"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {/* Scroll anchor */}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about carbon footprint..."
          className="flex-1 p-3 border rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
