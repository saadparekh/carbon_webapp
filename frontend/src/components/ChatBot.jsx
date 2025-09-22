import { useState, useEffect, useRef } from "react";

// ✅ Use environment variable, fallback to Render backend URL
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://carbon-webapp-s97l.onrender.com";

export default function ChatBot() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false); // Track sending state
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    setSending(true); // Disable sending until response
    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const messageToSend = input; // save before clearing input
    setInput("");

    setMessages((prev) => [
      ...prev,
      { type: "typing", text: "EarthMate is typing..." },
    ]);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }), // use saved value
      });

      const data = await res.json();

      setMessages((prev) => prev.filter((m) => m.type !== "typing"));

      if (data.reply) {
        setMessages((prev) => [...prev, { type: "bot", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: data.error || "⚠️ No response from server" },
        ]);
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.type !== "typing"));
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "⚠️ Error connecting to server" },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col max-w-xl mx-auto gap-3 h-full">
      <div className="chat-box flex flex-col flex-1 border rounded p-3 overflow-y-auto bg-gray-50 max-h-[80vh]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-3/4 whitespace-pre-line break-words ${
              msg.type === "user"
                ? "bg-green-600 text-white self-end"
                : msg.type === "bot"
                ? "bg-white text-gray-800 self-start border"
                : "italic text-gray-500 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 mt-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about carbon footprint..."
          className="flex-1 p-3 border rounded resize-none h-12 focus:outline-green-500"
          disabled={sending} // Disable typing while sending
        />
        <button
          onClick={sendMessage}
          disabled={sending} // Disable button while sending
          className={`px-4 rounded text-white ${
            sending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
